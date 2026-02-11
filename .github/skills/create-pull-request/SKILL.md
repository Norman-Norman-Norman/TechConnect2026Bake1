---
name: create-pull-request
description: Step-by-step guide for creating beautiful, comprehensive pull requests using GitHub MCP Server tools. Use this when asked to create a PR, open a pull request, submit changes for review, or request a code review.
---

# Create the Prettiest Pull Request in the World

This skill produces meticulously formatted, information-rich pull requests that reviewers love. Every PR created with this skill has a structured description with visual hierarchy, contextual summaries, testing evidence, and linked issues — making code review fast, pleasant, and thorough. Follow every step in order. Do not skip steps.

---

## Prerequisites

1. **GitHub MCP Server tools are available.** Verify that `mcp_github` or `mcp_github2` prefixed tools are accessible. If not, call `activate_repository_management_tools` or `activate_repository_management_tools_2`.
2. **Changes are committed and pushed.** The branch must have at least one commit pushed to the remote. If not, run the `commit-and-push` skill first.
3. **Repository identity is known.** You need `owner` and `repo`. Infer from the git remote, or ask the user.

---

## Procedure

### Step 1: Identify the Authenticated User

**Tool:** `mcp_github_get_me` or `mcp_github2_get_me`

**Action:**
```
Call get_me with no parameters.
```

**Expected output:** The authenticated user's `login`, `name`, and avatar URL.

**Record:** Save the `login` — you may need it to self-assign as a reviewer or for co-author attribution.

---

### Step 2: Gather Branch and Commit Context

**Tool:** `run_in_terminal`

Collect all the information needed to compose the PR description.

**2a. Get the current branch name:**
```
run_in_terminal with:
  command: "git branch --show-current"
  explanation: "Getting current branch name for the PR head."
  goal: "Identify head branch"
  isBackground: false
  timeout: 5000
```

**2b. Identify the base branch:**
- Default to `main`. If the repo uses `master`, `develop`, or another default, detect with:
```
run_in_terminal with:
  command: "git remote show origin | Select-String 'HEAD branch'"
  explanation: "Detecting the default branch of the remote."
  goal: "Identify base branch"
  isBackground: false
  timeout: 10000
```

**2c. Get the list of commits on this branch vs. base:**
```
run_in_terminal with:
  command: "git log origin/<base>..HEAD --oneline"
  explanation: "Listing commits unique to this branch."
  goal: "Gather commit history"
  isBackground: false
  timeout: 5000
```

**2d. Get the diff stat summary:**
```
run_in_terminal with:
  command: "git diff origin/<base>..HEAD --stat"
  explanation: "Getting file change statistics."
  goal: "Summarize changes"
  isBackground: false
  timeout: 10000
```

**2e. Get the full list of changed files with status:**
```
run_in_terminal with:
  command: "git diff origin/<base>..HEAD --name-status"
  explanation: "Getting file-level change details (added, modified, deleted)."
  goal: "Detailed file list"
  isBackground: false
  timeout: 10000
```

**Record all outputs** — you need them for the PR title and description.

---

### Step 3: Check for a PR Template

**Tool:** `file_search`

Search for a pull request template in the repository.

**Action:**
```
file_search with query: "**/pull_request_template*"
file_search with query: "**/.github/PULL_REQUEST_TEMPLATE/**"
```

**Decision logic:**
- If a template is found, read it with `read_file` and use its structure as the base for the PR body. Fill in every section from the template.
- If no template is found, use the Beautiful PR Template defined in Step 5 below.

---

### Step 4: Identify Related Issues

**Tool:** `run_in_terminal`, `grep_search`

Find GitHub issues this PR addresses using multiple signals:

**4a. Branch name patterns:**
Look for issue numbers in the branch name (e.g., `feat/142-add-search`, `fix/GH-56`).

**4b. Commit message footers:**
```
run_in_terminal with:
  command: "git log origin/<base>..HEAD --format='%B' | Select-String '#[0-9]+'"
  explanation: "Scanning commit messages for issue references."
  goal: "Find linked issues"
  isBackground: false
  timeout: 5000
```

**4c. Code comments and TODOs:**
```
grep_search with:
  query: "#[0-9]+"
  isRegexp: true
```

**Decision logic:**
- Collect all unique issue numbers.
- For each issue found, determine whether this PR **closes** it (fully resolves) or **relates to** it (partial progress).
- If no issues are found, ask the user: "I couldn't detect a related issue. Does this PR relate to a GitHub issue? (Enter a number, or 'none' to skip)"

---

### Step 5: Compose the PR Title

The title is the first thing reviewers see. Make it count.

**Format:**
```
<type>(<scope>): <concise description of the change>
```

**Rules:**
- Follow Conventional Commits types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`.
- Scope matches the primary area of the codebase affected.
- Use imperative mood: "add", not "added" or "adds".
- Maximum 72 characters.
- Be specific: ❌ "Update stuff" → ✅ "feat(api): add supplier search endpoint with filtering"

If the branch has a single commit, derive the title from that commit message. If multiple commits, synthesize an overarching title.

---

### Step 6: Compose the PR Description (The Beautiful Part)

This is the heart of the prettiest PR. Use the template below, filling in every section from the context gathered in Steps 2–4. Every section marked **(Required)** must be present.

#### 🎨 The Beautiful PR Template

```markdown
## 📋 Summary

> <2–4 sentences explaining what this PR does and why. Answer: What problem does it solve? What value does it deliver? Write for a reviewer who has no prior context. Use a blockquote to make the summary stand out visually.>

---

## 🔗 Related Issues

<List each related issue with its link and relationship. Use task-list syntax so reviewers see the linkage at a glance:>

- Closes #<number> — <one-line description of the issue>
- Refs #<number> — <one-line description>

<If no issues, use a GitHub alert:>

> [!NOTE]
> No related issues for this PR.

---

## 🔄 What Changed

<Organized list of all changes, grouped by area. Use sub-headings for multi-area PRs.>

### `<area-1>` — <Area Name> (e.g., API, Frontend, Infrastructure)
- <Change description with specific file references>
- <Another change>

### `<area-2>` — <Area Name>
- <Change description>

---

## 📁 Files Changed

<details>
<summary><strong>📂 <N> files changed</strong> — click to expand</summary>
<br>

| &nbsp; | File | What changed |
|:------:|------|-------------|
| 🆕 | `path/to/new-file.ts` | <What this file does> |
| ✏️ | `path/to/changed-file.ts` | <What changed and why> |
| 🗑️ | `path/to/removed-file.ts` | <Why it was removed> |
| 🔀 | `old-name.ts` → `new-name.ts` | <Why it was renamed> |

</details>

---

## 🧪 Testing

| Check | Status |
|-------|--------|
| All existing tests pass | ✅ <N> tests, <N> files |
| New tests added | ✅ / ➖ N/A |
| Manual testing performed | ✅ <describe what was verified> |

<details>
<summary>📊 Test output</summary>

```
Test Files  <N> passed (<N>)
     Tests  <N> passed (<N>)
```

</details>

---

## 📸 Screenshots

<If the PR includes UI changes, use a before/after table:>

| Before | After |
|--------|-------|
| <screenshot> | <screenshot> |

<If the PR is API-only or config-only:>

> [!NOTE]
> No visual changes — this PR is backend / config only.

---

## 🔍 Review Notes

> [!IMPORTANT]
> <Highlight the most critical item for the reviewer — the single most important thing to look at.>

- <Area or file that needs careful review and why>
- <Any trade-offs or design decisions that were made>
- <Known limitations or follow-up work needed>

---

## ✅ Checklist

- [ ] Code follows project conventions and patterns
- [ ] All tests pass
- [ ] No unnecessary files committed (`node_modules`, `dist`, etc.)
- [ ] Commit messages follow Conventional Commits format
- [ ] Related issues are linked
```

#### Filling Guidelines

- **Summary:** Do NOT just repeat the title. Write it as a blockquote (`> ...`) so it stands out visually. Add context about the problem, motivation, and approach. 2–4 complete sentences minimum.
- **Section separators:** Place a `---` horizontal rule between every major section for clean visual breaks on GitHub.
- **Changes:** Group by area of the codebase using inline code for area names (e.g., `### \`api\` — API`). Reference specific files. Use action verbs: "Add", "Update", "Remove", "Refactor", "Fix".
- **Files Changed table:** Wrap the table in `<details><summary>` so it's collapsible. Include EVERY file from the diff stat (Step 2d/2e). Use centered status emojis: 🆕 Added, ✏️ Modified, 🗑️ Deleted, 🔀 Renamed. Add a `<br>` after the summary tag for spacing.
- **Testing:** Use a summary table instead of checkboxes for a cleaner look. Put full test output inside a collapsible `<details>` block.
- **Screenshots:** Use a Before/After table for UI changes. Use a `> [!NOTE]` GitHub alert for non-visual PRs.
- **Review Notes:** Lead with a `> [!IMPORTANT]` GitHub alert for the single most critical review item, then bullet the rest.
- **Checklist:** Check off items that are true. Leave unchecked items that don't apply, with a note explaining why.
- **GitHub Alerts:** Use `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]` for callouts — these render as colored boxes on GitHub.com.

---

### Step 7: Search for Reviewers (If Not Specified)

**Tool:** `run_in_terminal`

If the user hasn't specified reviewers, suggest appropriate ones.

**Action:**
```
run_in_terminal with:
  command: "git log --all --format='%an <%ae>' | Sort-Object -Unique"
  explanation: "Finding contributors who might review this PR."
  goal: "Identify potential reviewers"
  isBackground: false
  timeout: 5000
```

**Decision logic:**
- If the user specified a reviewer, use that person.
- If not, suggest 1–2 contributors from the git log who have worked on the affected files. Ask the user to confirm.
- If CODEOWNERS file exists, check it for auto-assigned reviewers.

---

### Step 8: Create the Pull Request

**Tool:** `mcp_github_create_pull_request`

**Action:**
```
Call create_pull_request with:
  owner: "<owner>"
  repo: "<repo>"
  title: "<composed title from Step 5>"
  body: "<composed description from Step 6>"
  head: "<current branch from Step 2a>"
  base: "<base branch from Step 2b>"
  draft: false
```

**Expected output:** A JSON object with the PR `number`, `html_url`, `title`, and `state`.

**Error handling:**
- **422 Validation Error:** Usually means the head branch doesn't exist on the remote (push first), or a PR already exists for this branch. If a PR already exists, offer to update it instead.
- **403 Forbidden:** The user lacks write access. Inform them.
- **404 Not Found:** The owner/repo is incorrect. Verify and retry.

---

### Step 9: Assign Reviewers

**Tool:** `mcp_github_update_pull_request`

After the PR is created, assign reviewers.

**Action:**
```
Call update_pull_request with:
  owner: "<owner>"
  repo: "<repo>"
  pullNumber: <PR number from Step 8>
  reviewers: ["<username1>", "<username2>"]
```

**Error handling:**
- If a reviewer username is invalid or not a collaborator, the API will reject it. Remove the invalid reviewer and retry with the remaining ones. Inform the user which reviewer could not be assigned.

---

### Step 10: Request Copilot Review (Optional)

**Tool:** `mcp_github_request_copilot_review`

If the repository has Copilot code review enabled, request an automated review for early feedback.

**Action:**
```
Call request_copilot_review with:
  owner: "<owner>"
  repo: "<repo>"
  pullNumber: <PR number from Step 8>
```

**Decision logic:**
- If the tool succeeds, inform the user that Copilot review was requested.
- If it fails (feature not enabled), skip silently — this is optional.

---

### Step 11: Confirm and Report

After successful creation, report back with a visually formatted summary:

**Format:**
```
🎉 Pull request created!

  PR:       #<number> — <title>
  URL:      <html_url>
  Branch:   <head> → <base>
  Files:    <N> changed (<additions> additions, <deletions> deletions)
  Issues:   Closes #<number>, Refs #<number> (or "none")
  Reviewers: <reviewer usernames>
  Status:   Ready for review
```

---

## Rules and Constraints

- **Always include a Summary section** in the PR body. One-line PR descriptions are not acceptable.
- **Always include a Files Changed table** listing every affected file with status emojis and descriptions.
- **Always include a Testing section** with specific evidence of test results.
- **Always link related issues** in both the body (with descriptions) and use `Closes`/`Refs` keywords so GitHub auto-links them.
- **Always search for a PR template first** (Step 3). If one exists, honor its structure and fill in every section.
- **Never create a duplicate PR** for the same branch. If one exists, offer to update it instead.
- **Never assign reviewers who are not collaborators** of the repository.
- **Never leave template placeholder text** in the PR body (e.g., `<description here>`). Every placeholder must be replaced with real content.
- **Never commit the description with unchecked required items** in the checklist without an explanation.
- **Always use emojis for section headers** (📋, 🔗, 🔄, 📁, 🧪, 📸, 🔍, ✅) to create visual hierarchy and make the PR scannable.
- **Always use `---` horizontal rules** between major sections for clean visual separation on GitHub.com.
- **Always wrap the Files Changed table** in a collapsible `<details><summary>` block so long file lists don't dominate the PR.
- **Always use GitHub Alerts** (`> [!NOTE]`, `> [!IMPORTANT]`, `> [!WARNING]`) for callouts instead of plain text — they render as styled, colored boxes on github.com.
- **Always put test output** inside a collapsible `<details>` block to keep the PR body scannable.

---

## Anti-Patterns

| ❌ Bad | ✅ Good |
|--------|---------|
| Title: "Updates" | Title: "feat(api): add supplier search with pagination" |
| Body: "Fixed some stuff" | Body: Full Summary + Changes + Files + Testing |
| No issue links | "Closes #142 — Add supplier search endpoint" |
| No testing evidence | "All 6 tests pass (branch.test.ts)" |
| Files listed without context | Files table with status emoji + description per file |
| Assigning random reviewers | Checking git history for relevant contributors |
| Submitting without checking for existing PR | Searching first, offering to update if exists |

---

## Quick Reference: Tool Parameter Summary

| Parameter | Tool | Type | Required | Notes |
|---|---|---|---|---|
| `owner` | `create_pull_request` | string | Yes | Repository owner (user or org). |
| `repo` | `create_pull_request` | string | Yes | Repository name. |
| `title` | `create_pull_request` | string | Yes | Conventional Commits format, max 72 chars. |
| `body` | `create_pull_request` | string | Yes | Full Markdown body using the Beautiful PR Template. |
| `head` | `create_pull_request` | string | Yes | Branch with changes (your feature branch). |
| `base` | `create_pull_request` | string | Yes | Target branch (usually `main`). |
| `draft` | `create_pull_request` | boolean | No | Set `true` for work-in-progress PRs. |
| `reviewers` | `update_pull_request` | string[] | No | GitHub usernames to request reviews from. |
| `pullNumber` | `update_pull_request` | number | Yes | PR number returned from creation. |

---

## Complete Example: A Beautiful PR

```markdown
## 📋 Summary

> Add three new GitHub Copilot Agent Skills that teach Copilot how to
> create skills, file GitHub issues, and commit code safely. These skills
> provide deterministic, step-by-step procedures with explicit tool calls,
> decision logic, and error handling so Copilot can execute them
> autonomously without guessing.

---

## 🔗 Related Issues

> [!NOTE]
> No related issues for this PR.

---

## 🔄 What Changed

### `skills` — Agent Skills
- Add `create-agent-skills` — an 8-step meta-skill for authoring
  high-quality Agent Skills with quality checklist and examples
- Add `create-github-issue` — a 6-step procedure for creating GitHub
  issues via MCP tools with duplicate detection and body templates
- Add `commit-and-push` — a 9-step procedure with HARD STOP test gate,
  Conventional Commit message composition, and auto issue linking

### `skills` — Supporting Files
- Add `commit-template.txt` — structural template for commit messages

---

## 📁 Files Changed

<details>
<summary><strong>📂 4 files changed</strong> — click to expand</summary>
<br>

| &nbsp; | File | What changed |
|:------:|------|-------------|
| 🆕 | `.github/skills/create-agent-skills/SKILL.md` | Meta-skill for creating Agent Skills |
| 🆕 | `.github/skills/create-github-issue/SKILL.md` | GitHub issue creation procedure |
| 🆕 | `.github/skills/commit-and-push/SKILL.md` | Safe commit and push workflow |
| 🆕 | `.github/skills/commit-and-push/commit-template.txt` | Commit message structure template |

</details>

---

## 🧪 Testing

| Check | Status |
|-------|--------|
| All existing tests pass | ✅ 6 tests, 1 file |
| New tests added | ➖ N/A — skills are Markdown instruction files |
| Manual testing performed | ✅ Skills were used to create this PR |

<details>
<summary>📊 Test output</summary>

```
Test Files  1 passed (1)
     Tests  6 passed (6)
```

</details>

---

## 📸 Screenshots

> [!NOTE]
> No visual changes — this PR adds Markdown skill files only.

---

## 🔍 Review Notes

> [!IMPORTANT]
> The commit-and-push skill has a HARD STOP gate — please verify the
> language is strong enough to prevent agents from bypassing tests.

- Each skill follows a consistent structure: frontmatter → context →
  prerequisites → numbered procedure → rules → examples
- The create-agent-skills skill includes a full production example
  (`api-route-creation`) — check that it matches this project's patterns

---

## ✅ Checklist

- [x] Code follows project conventions and patterns
- [x] All tests pass
- [x] No unnecessary files committed
- [x] Commit messages follow Conventional Commits format
- [x] Related issues are linked (none applicable)
```
