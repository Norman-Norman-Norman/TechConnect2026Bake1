---
name: commit-and-push
description: Run all tests, create a verbose conventional commit message tied to related issues, and push changes. Use this when asked to commit, commit and push, save changes, or finalize work.
---

# Commit, Link Issues, and Push

This skill provides a deterministic procedure for safely committing code changes. It runs all tests first, composes a verbose Conventional Commit message tied to related GitHub issues, and pushes the changes to the remote. Follow every step in order. Do not skip steps. If a step fails, stop and report the error.

---

## Prerequisites

1. **Git is initialized.** The workspace must be inside a git repository.
2. **A remote is configured.** There must be at least one git remote (typically `origin`) to push to.
3. **There are staged or unstaged changes.** If there are no changes, inform the user and stop.

---

## Procedure

### Step 1: Verify There Are Changes to Commit

**Tool:** `get_changed_files`

Check that the workspace has uncommitted changes.

**Action:**
```
Call get_changed_files with no parameters (uses the active git repository).
```

**Decision logic:**
- If the result contains staged or unstaged files, proceed to Step 2.
- If no changes are found, inform the user: "No changes detected. Nothing to commit." and stop.
- If there are merge conflicts, inform the user: "Merge conflicts detected. Resolve conflicts before committing." and stop.

**Record the list of changed files** — you will need them in Step 4 to compose the commit message.

---

### Step 2: Run All Tests

**Tools:** `run_in_terminal`

Run the full test suite for all workspaces before committing. No code should be committed with failing tests.

**Action:**
```
run_in_terminal with:
  command: "npm test"
  explanation: "Running all workspace tests before committing."
  goal: "Verify all tests pass"
  isBackground: false
  timeout: 120000
```

**⛔ HARD STOP GATE — This step is a blocking gate. The entire procedure MUST abort if tests fail. Do NOT proceed to any subsequent step.**

**Decision logic:**
- If all tests pass (exit code 0), record `TESTS_PASSED = true` and proceed to Step 3.
- If ANY test fails (exit code ≠ 0), you MUST:
  1. Record `TESTS_PASSED = false`.
  2. Report the exact failing test names and error output to the user.
  3. Say: "❌ Tests failed. Commit and push aborted. Fix the failing tests and try again."
  4. **STOP. Do NOT execute Steps 3–9. Do NOT stage, commit, or push. End your turn immediately.**
- If the test command itself errors (e.g., missing dependencies, command not found), you MUST:
  1. Report the error to the user.
  2. Suggest running `npm install` first.
  3. **STOP. Do NOT proceed. End your turn immediately.**

**Critical rules for this step:**
- Never skip this step under any circumstances.
- Never commit with failing tests.
- Never use `--no-verify`, `--force`, or any flag that bypasses test validation.
- Never proceed to Step 3 or beyond unless exit code is exactly 0.
- If the user asks you to skip tests, refuse and explain that the commit-and-push skill requires all tests to pass.

---

### Step 3: Run Lint Checks (If Available)

**Tool:** `run_in_terminal`

If the project has a lint script, run it to catch style issues.

**Action:**
```
run_in_terminal with:
  command: "npm run lint"
  explanation: "Running lint checks before committing."
  goal: "Verify code passes lint rules"
  isBackground: false
  timeout: 60000
```

**Decision logic:**
- If lint passes or no lint script exists (exit code 0 or "missing script" error), proceed to Step 4.
- If lint fails with auto-fixable errors, run `npm run lint -- --fix`, then re-check. If still failing, report to the user and stop.
- If lint fails with non-fixable errors, report to the user and stop.

---

### Step 4: Stage All Changes

**Tool:** `run_in_terminal`

Stage the changes for commit. By default, stage all changes. If the user specified specific files, stage only those.

**Action (all changes):**
```
run_in_terminal with:
  command: "git add -A"
  explanation: "Staging all changes for commit."
  goal: "Stage changes"
  isBackground: false
  timeout: 10000
```

**Action (specific files):**
```
run_in_terminal with:
  command: "git add <file1> <file2> ..."
  explanation: "Staging specified files for commit."
  goal: "Stage changes"
  isBackground: false
  timeout: 10000
```

**Decision logic:**
- If the user asked to commit specific files, stage only those files.
- If the user did not specify, stage everything (`git add -A`).
- If staging fails, report the error and stop.

---

### Step 5: Identify Related Issues

**Tools:** `run_in_terminal`, `grep_search`, optionally activate GitHub issue tools

Determine which GitHub issues this commit relates to. Use multiple signals:

**5a. Check the current branch name for issue references:**
```
run_in_terminal with:
  command: "git branch --show-current"
  explanation: "Getting current branch name to check for issue references."
  goal: "Identify branch"
  isBackground: false
  timeout: 5000
```
Look for patterns like `feature/123-add-login`, `fix/456`, `issue-789`, `gh-42`. Extract the issue number.

**5b. Search changed files for issue references:**
```
grep_search with:
  query: "#[0-9]+"
  isRegexp: true
  includePattern: "<changed files from Step 1>"
```
Look for `#123`, `GH-456`, or similar patterns in the code changes, comments, or TODOs.

**5c. Check recent commit messages on the current branch:**
```
run_in_terminal with:
  command: "git log --oneline -10"
  explanation: "Checking recent commits for issue references."
  goal: "Find related issues"
  isBackground: false
  timeout: 5000
```

**Decision logic:**
- Collect all unique issue numbers found from 5a, 5b, and 5c.
- If no issues are found anywhere, ask the user: "I couldn't detect a related issue. Is there a GitHub issue number this commit relates to? (Enter a number, or 'none' to skip)"
- If issues are found, include them in the commit footer (Step 6).

---

### Step 6: Compose the Commit Message

Compose a verbose commit message following the **Conventional Commits** specification. Use the template at `commit-template.txt` in this skill's directory as the structural guide.

#### Commit Message Format

```
<type>(<scope>): <short summary>

<body>

<footer>
```

#### Part 1: Header — `<type>(<scope>): <short summary>`

**Type** — Choose exactly one based on the nature of the changes:

| Type | When to use |
|---|---|
| `feat` | A new feature or user-facing functionality. |
| `fix` | A bug fix. |
| `docs` | Documentation-only changes. |
| `style` | Code style changes (formatting, whitespace) — no logic change. |
| `refactor` | Code restructuring — no feature or fix. |
| `test` | Adding or updating tests — no production code change. |
| `chore` | Build scripts, CI config, tooling, dependencies — no production code. |
| `perf` | Performance improvement. |
| `ci` | CI/CD pipeline changes. |
| `build` | Build system or dependency changes. |
| `revert` | Reverts a previous commit. |

**Scope** — The area of the codebase affected. Infer from the changed files:

| Changed files in… | Scope |
|---|---|
| `api/src/routes/` | `api-routes` |
| `api/src/models/` | `api-models` |
| `api/src/**` (general) | `api` |
| `frontend/src/components/` | `ui` |
| `frontend/src/api/` | `frontend-api` |
| `frontend/src/**` (general) | `frontend` |
| `infra/` | `infra` |
| `docs/` | `docs` |
| `.github/` | `ci` or `skills` depending on content |
| Root config files | `config` |
| Multiple areas | Use the primary area, or omit scope |

**Short summary:**
- Imperative mood ("add", not "added" or "adds").
- Lowercase first letter.
- No period at the end.
- Maximum 72 characters.
- Specific: ❌ "fix stuff" → ✅ "fix login crash when email contains special characters"

#### Part 2: Body

Write 2–5 sentences explaining:
1. **What** changed — summarize the modifications across all changed files.
2. **Why** it changed — the motivation or problem being solved.
3. **How** it was implemented — brief technical summary of the approach.

Rules:
- Wrap lines at 72 characters.
- Separate from the header with one blank line.
- Use bullet points for multiple distinct changes.
- Reference specific files or functions when useful.
- Do NOT just repeat the summary — add meaningful detail.

#### Part 3: Footer

Include all of the following that apply, each on its own line:

| Footer | Format | When to include |
|---|---|---|
| Issue reference (closes) | `Closes #<number>` | When this commit fully resolves an issue. |
| Issue reference (relates) | Refs #<number>` | When this commit partially addresses an issue. |
| Multiple issues | `Closes #123, closes #456` | When multiple issues are resolved. |
| Breaking change | `BREAKING CHANGE: <description>` | When the change breaks backward compatibility. |
| Co-author | `Co-authored-by: Name <email>` | When someone else contributed. |

**Decision logic for issue linking:**
- If the commit fully resolves an issue, use `Closes #<number>`.
- If the commit is partial progress, use `Refs #<number>`.
- If no issues are related (confirmed in Step 5), omit issue footers entirely.
- Never fabricate issue numbers.

#### Complete Example

```
feat(api-routes): add supplier search endpoint with filtering

Add a new GET /suppliers/search endpoint that supports filtering by
name, region, and product category. The endpoint uses query parameters
and returns paginated results with a default page size of 20.

- Created new search route handler in api/src/routes/supplier.ts
- Added input validation for query parameters using express-validator
- Added unit tests covering happy path and edge cases (empty results,
  invalid parameters, pagination boundaries)
- Updated Swagger documentation with the new endpoint schema

Closes #142
Refs #98
```

---

### Step 7: Execute the Commit

**Tool:** `run_in_terminal`

Commit the staged changes with the composed message.

**⛔ PRE-COMMIT GUARD: Before executing the commit, verify that `TESTS_PASSED = true` from Step 2. If tests did not pass, or if Step 2 was skipped for any reason, STOP immediately and do NOT commit. Report: "❌ Cannot commit — tests have not passed. Run tests first."**

**Action:**
```
run_in_terminal with:
  command: "git commit -m \"<header>\" -m \"<body>\" -m \"<footer>\""
  explanation: "Committing changes with verbose conventional commit message."
  goal: "Commit changes"
  isBackground: false
  timeout: 15000
```

**Alternative for multi-line messages** (preferred for long bodies):
```
run_in_terminal with:
  command: "git commit -m \"<full message with literal newlines>\""
  explanation: "Committing changes with verbose conventional commit message."
  goal: "Commit changes"
  isBackground: false
  timeout: 15000
```

**Error handling:**
- If commit fails with "nothing to commit," the staging in Step 4 failed — go back and restage.
- If commit fails with a hook error, report the hook output to the user.
- If commit succeeds, proceed to Step 8.

---

### Step 8: Push to Remote

**Tool:** `run_in_terminal`

Push the commit to the remote repository.

**Action:**
```
run_in_terminal with:
  command: "git push origin HEAD"
  explanation: "Pushing committed changes to the remote."
  goal: "Push to remote"
  isBackground: false
  timeout: 30000
```

**Decision logic:**
- If push succeeds, proceed to Step 9.
- If push fails with "no upstream branch," run:
  ```
  git push --set-upstream origin <current-branch-name>
  ```
- If push fails with "rejected (non-fast-forward)," inform the user: "The remote has changes not present locally. Pull and rebase first: `git pull --rebase origin <branch>`." Do NOT force push unless the user explicitly requests it.
- If push fails with authentication errors, inform the user to check their git credentials.

---

### Step 9: Confirm and Report

After successful push, report back to the user with:

1. **Commit hash** (short form).
2. **Commit message header**.
3. **Branch name** and remote.
4. **Files changed** — count of files modified, added, deleted.
5. **Issues linked** — list of issue numbers referenced in the footer.
6. **Test status** — "All tests passed."

**Format:**
```
Committed and pushed successfully.

  Commit: <short-hash>
  Branch: <branch> → origin/<branch>
  Message: <type>(<scope>): <summary>
  Files: <N> changed (<A> additions, <D> deletions)
  Issues: Closes #<number>, Refs #<number> (or "none")
  Tests: All passed
```

---

## Rules and Constraints

- **Never commit with failing tests.** Step 2 is a HARD STOP gate — if tests fail, the entire procedure aborts. No staging, no committing, no pushing. This is mandatory and non-negotiable.
- **Never bypass the test gate.** If the user asks to skip tests, refuse. Explain that this skill requires all tests to pass before any commit.
- **Never skip lint checks** if a lint script exists in the project.
- **Never fabricate issue numbers.** Only reference issues confirmed to exist via branch names, code comments, or user input.
- **Never force push** (`git push --force`) unless the user explicitly requests it.
- **Always use Conventional Commits format** — `<type>(<scope>): <summary>` in the header.
- **Always use imperative mood** in the summary ("add", not "added").
- **Always include a body** with 2–5 sentences of meaningful context. One-line commits are not acceptable for this skill.
- **Always check for related issues** before composing the message.
- **Always push after committing** unless the user explicitly says "commit only, don't push."
- **Never commit generated files** (node_modules, dist, build outputs) — if they appear in staged files, unstage them and add to `.gitignore`.

---

## Conventional Commit Types Quick Reference

| Type | Description | Example |
|---|---|---|
| `feat` | New feature | `feat(ui): add dark mode toggle` |
| `fix` | Bug fix | `fix(api): handle null supplier in order route` |
| `docs` | Documentation | `docs: update API endpoint documentation` |
| `style` | Formatting only | `style(frontend): fix indentation in components` |
| `refactor` | Code change (no feat/fix) | `refactor(api): extract validation middleware` |
| `test` | Tests only | `test(api-routes): add supplier CRUD tests` |
| `chore` | Tooling/config | `chore: update vitest to v3.1` |
| `perf` | Performance | `perf(api): add database query indexing` |
| `ci` | CI/CD changes | `ci: add build caching to workflow` |
| `build` | Build system | `build: upgrade TypeScript to v5.8` |
| `revert` | Revert commit | `revert: revert feat(api): add supplier search` |
