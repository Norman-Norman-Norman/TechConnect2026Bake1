---
name: create-github-issue
description: Step-by-step guide for creating GitHub issues using GitHub MCP Server tools. Use this when asked to create a GitHub issue, file a bug report, request a feature, or open a tracking issue in a GitHub repository.
---

# Create a GitHub Issue via MCP Tools

This skill provides a comprehensive, deterministic procedure for creating well-structured GitHub issues using the GitHub MCP Server tools. Follow every step in order. Do not skip steps. If a step fails, stop and report the error before continuing.

---

## Prerequisites

Before starting, confirm the following:

1. **GitHub MCP Server tools are available.** Verify that `mcp_github` or `mcp_github2` prefixed tools are accessible. If not, activate them by calling `activate_repository_management_tools` or `activate_repository_management_tools_2`.
2. **Repository identity is known.** You must know the `owner` (GitHub username or organization) and `repo` (repository name). If the user has not provided these, infer them from the current workspace's git remote, or ask the user.

---

## Procedure

### Step 1: Identify the Authenticated User

**Tool:** `mcp_github_get_me` or `mcp_github2_get_me`

Call this first to confirm the authenticated user's identity and permissions. This ensures you have write access to create issues.

**Action:**
```
Call get_me with no parameters.
```

**Expected output:** A JSON object with the authenticated user's login, name, and scopes. If this fails, stop — the user likely needs to authenticate or configure the MCP server.

---

### Step 2: Check for Issue Types (Organizations Only)

**Tool:** `mcp_github_list_issue_types` or `mcp_github2_list_issue_types`

If the repository is owned by an **organization** (not a personal account), check whether the organization has configured custom issue types.

**Action:**
```
Call list_issue_types with:
  owner: "<organization-name>"
```

**Decision logic:**
- If the tool returns issue types (e.g., `Bug`, `Feature`, `Task`), you **must** use the appropriate `type` field when creating the issue in Step 5.
- If the tool returns an empty list or an error, omit the `type` field entirely in Step 5.
- If the repository is owned by a personal account (not an org), skip this step.

---

### Step 3: Search for Duplicate Issues

**Tool:** `mcp_github_search_issues` or activate `activate_issue_and_commit_tools` / `activate_issue_and_commit_tools` to access `search_issues`

Before creating a new issue, **always** search for existing issues that may already cover the same topic to avoid duplicates.

**Action:**
```
Call search_issues with:
  query: "<keywords from the issue title or description> repo:<owner>/<repo> is:issue"
  perPage: 10
```

**Decision logic:**
- If a matching open issue exists, **do not create a duplicate**. Instead, inform the user and link to the existing issue. Optionally suggest adding a comment to the existing issue.
- If a matching closed issue exists, inform the user and ask if they want to reopen it or create a new one.
- If no matches are found, proceed to Step 4.

---

### Step 4: Compose the Issue Content

Before calling the creation tool, assemble all issue fields. Each field has specific formatting guidelines.

#### 4a. Title

- **Required.** One clear, concise sentence.
- Start with a category prefix when applicable: `[Bug]`, `[Feature]`, `[Chore]`, `[Docs]`, `[Refactor]`.
- Be specific: ❌ "Fix bug" → ✅ "[Bug] Login form crashes when email contains special characters"
- Maximum ~80 characters.

#### 4b. Body

- **Required.** Use Markdown. Structure the body using the appropriate template below based on issue type.

**Bug Report Template:**

```markdown
## Description
<1–3 sentences describing the problem.>

## Steps to Reproduce
1. <Step one>
2. <Step two>
3. <Step three>

## Expected Behavior
<What should happen.>

## Actual Behavior
<What actually happens. Include error messages, stack traces, or screenshots if available.>

## Environment
- **OS:** <e.g., Windows 11, macOS 14>
- **Browser/Runtime:** <e.g., Chrome 120, Node.js 20>
- **Version/Commit:** <e.g., v2.3.1 or commit SHA>

## Additional Context
<Any other relevant information, logs, or links.>
```

**Feature Request Template:**

```markdown
## Summary
<1–2 sentences describing the desired feature.>

## Motivation
<Why is this feature needed? What problem does it solve?>

## Proposed Solution
<Describe the implementation approach or desired behavior.>

## Alternatives Considered
<What other approaches were evaluated and why they were not chosen?>

## Acceptance Criteria
- [ ] <Criterion 1>
- [ ] <Criterion 2>
- [ ] <Criterion 3>

## Additional Context
<Mockups, links, or related issues.>
```

**Task / Chore Template:**

```markdown
## Summary
<1–2 sentences describing the task.>

## Details
<Detailed description of what needs to be done.>

## Checklist
- [ ] <Subtask 1>
- [ ] <Subtask 2>
- [ ] <Subtask 3>

## Related Issues
<Links to related issues or PRs, if any.>
```

If the user has provided free-form text, restructure it into the most appropriate template above. Do not discard any information the user provided.

#### 4c. Labels

- **Optional but recommended.** Use labels that already exist in the repository.
- Common convention: `bug`, `enhancement`, `documentation`, `good first issue`, `help wanted`, `priority:high`, `priority:low`.
- If unsure which labels exist, call `get_label` with the suspected label name to verify, or use `search_issues` output to observe labels on similar issues.
- Do **not** invent labels that do not exist — the API will reject them.

#### 4d. Assignees

- **Optional.** Array of GitHub usernames to assign.
- Only assign users who are collaborators of the repository. If unsure, omit this field.
- If the user asks to self-assign, use the login returned from Step 1.

#### 4e. Milestone

- **Optional.** Integer milestone number (not the milestone title).
- Only include if the user specifies a milestone or one can be inferred from context.

#### 4f. Issue Type (Organizations with Issue Types)

- **Conditional.** Only include if Step 2 returned valid issue types.
- Set to the exact string value returned by `list_issue_types` (e.g., `"Bug"`, `"Feature"`).

---

### Step 5: Create the Issue

**Tool:** `mcp_github_issue_write`

**Action:**
```
Call issue_write with:
  method: "create"
  owner: "<owner>"
  repo: "<repo>"
  title: "<composed title from Step 4a>"
  body: "<composed body from Step 4b>"
  labels: [<labels from Step 4c>]          # omit if none
  assignees: [<assignees from Step 4d>]    # omit if none
  milestone: <milestone from Step 4e>      # omit if none
  type: "<type from Step 4f>"             # omit if not applicable
```

**Expected output:** A JSON object containing the created issue's `number`, `html_url`, `title`, and `state`.

**Error handling:**
- **422 Validation Error:** Usually means a label does not exist, an assignee is not a collaborator, or a required field is missing. Read the error message, correct the field, and retry once.
- **403 Forbidden:** The authenticated user lacks write access. Inform the user.
- **404 Not Found:** The owner/repo combination is incorrect. Verify and retry.

---

### Step 6: Confirm and Report

After successful creation, report back to the user with:

1. **Issue number** and **URL** (from the API response).
2. **Title** as created.
3. **Summary** of labels, assignees, and milestone if any were applied.

**Format:**
```
Created issue #<number>: <title>
URL: <html_url>
Labels: <labels or "none">
Assignees: <assignees or "none">
```

---

## Rules and Constraints

- **Never create an issue without first searching for duplicates** (Step 3). This is mandatory.
- **Never invent labels** that do not exist in the repository — the API will return a 422 error.
- **Never assign users** who are not collaborators of the repository.
- **Always use the `method: "create"` parameter** when calling `issue_write` for new issues. Use `method: "update"` only for modifying existing issues.
- **Always structure the body** using one of the templates in Step 4b. Raw unformatted text is not acceptable.
- **Always check for issue types** in organization-owned repositories before creating issues.
- **If the user's request is ambiguous**, infer the most reasonable issue type (bug vs. feature vs. task) from context. If genuinely unclear, ask the user one clarifying question before proceeding.
- **Omit optional fields** rather than setting them to empty values or guessing.

---

## Quick Reference: Tool Parameter Summary

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `method` | string | Yes | Always `"create"` for new issues. |
| `owner` | string | Yes | Repository owner (user or org). |
| `repo` | string | Yes | Repository name. |
| `title` | string | Yes | Concise, prefixed issue title. |
| `body` | string | Yes | Markdown-formatted body using a template. |
| `labels` | string[] | No | Must be pre-existing labels in the repo. |
| `assignees` | string[] | No | Must be collaborators of the repo. |
| `milestone` | number | No | Milestone number (integer), not title. |
| `type` | string | No | Only for orgs with configured issue types. |
| `state` | string | No | Only used when updating (`"open"` or `"closed"`). |
| `state_reason` | string | No | Only used when closing (`"completed"`, `"not_planned"`, `"duplicate"`). |
| `duplicate_of` | number | No | Only used with `state_reason: "duplicate"`. |
