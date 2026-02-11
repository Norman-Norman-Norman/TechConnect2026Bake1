---
name: create-agent-skills
description: Guide for creating high-quality GitHub Copilot Agent Skills. Use this when asked to create, write, design, or improve an Agent Skill, or when discussing best practices for skill authoring.
---

# Creating Excellent Agent Skills

This skill provides a complete, deterministic procedure for creating GitHub Copilot Agent Skills. Follow every step in order. Do not skip steps. If a step fails, stop and report the error before continuing.

Agent Skills are folders of instructions, scripts, and resources that Copilot loads when relevant to improve its performance in specialized tasks. They work with Copilot coding agent, GitHub Copilot CLI, and agent mode in VS Code.

---

## Procedure

### Step 1: Discover Existing Skills and Conventions

**Tools:** `file_search`, `read_file`

Before creating anything, scan the workspace to understand what skills already exist and what conventions they follow.

**Actions:**
1. Search for existing skills:
   ```
   file_search with query: "**/.github/skills/**/SKILL.md"
   ```
2. Also check for alternate locations:
   ```
   file_search with query: "**/.claude/skills/**/SKILL.md"
   ```
3. If any skills are found, read 2–3 of them with `read_file` to learn the project's naming conventions, description style, and body structure.
4. Check for custom instructions that might overlap:
   ```
   file_search with query: "**/.github/copilot-instructions.md"
   ```

**Decision logic:**
- If existing skills follow a consistent style (e.g., all use numbered steps, all include a "Rules" section), adopt that style for the new skill.
- If no skills exist yet, use the default structure defined in this guide.
- Note all existing skill `name` values to avoid collisions.

---

### Step 2: Gather Requirements

Determine what task the new skill should teach Copilot. You need three pieces of information:

| Information | How to obtain |
|---|---|
| **Task scope** | What specific, repeatable task should Copilot learn? Infer from the user's request. If ambiguous, ask one clarifying question. |
| **Skill location** | Project skill (`.github/skills/`) for repo-specific tasks. Personal skill (`~/.copilot/skills/`) for cross-repo tasks. Default to project skill unless the user specifies otherwise. |
| **Target audience** | Will this skill be used by Copilot coding agent, Copilot CLI, VS Code agent mode, or all three? This affects whether to reference MCP tools, CLI commands, or editor features. Default to all three. |

**Decision logic for scope:**
- If the user says something vague like "help with testing," ask: "Should this skill cover unit tests, integration tests, E2E tests, or a specific framework?"
- If the user provides a detailed description, proceed without asking.
- If the task is too broad for a single skill (e.g., "handle all DevOps"), recommend splitting into multiple skills and confirm the first one to create.

---

### Step 3: Name the Skill

Choose a name that:
- Is lowercase, hyphen-separated.
- Is 2–5 words long.
- Describes the action, not the domain (e.g., `debug-github-actions` not `github-actions`).
- Does not collide with any name found in Step 1.

**Good names:** `api-route-creation`, `debug-github-actions`, `react-component-scaffolding`, `database-migration-guide`

**Bad names:** `stuff`, `my-skill`, `utils`, `helper`, `testing` (too generic)

---

### Step 4: Write the SKILL.md File

The SKILL.md is a Markdown file with YAML frontmatter. Every SKILL.md must have two parts: frontmatter and body.

#### 4a. Frontmatter (Required)

```yaml
---
name: <skill-name>
description: <what the skill does and when Copilot should activate it>
license: <optional – license that applies to this skill>
---
```

| Field | Required | Rules |
|---|---|---|
| `name` | Yes | Must exactly match the directory name. Lowercase, hyphen-separated. |
| `description` | Yes | 1–2 sentences, under 200 characters. Must state **what** the skill does AND **when** to use it. This is the primary signal Copilot uses to decide whether to load the skill. |
| `license` | No | Include if the skill will be shared publicly (e.g., `MIT`). |

**Writing an effective `description`:**

The description determines whether Copilot activates the skill. Follow these rules exactly:

- **Start with a verb or noun phrase:** "Guide for…", "Automate…", "Step-by-step procedure for…"
- **Include a trigger clause:** "Use this when asked to…", "Use this when the user wants to…"
- **Mention the domain or technology:** "React components", "GitHub Actions", "REST API routes"
- **Do not** be vague ("Helps with stuff"), too long (>200 chars), or duplicate another skill's trigger scope.

**Strong examples:**
```
Guide for debugging failing GitHub Actions workflows. Use this when asked to debug failing GitHub Actions workflows.
```
```
Step-by-step guide for creating GitHub issues using GitHub MCP Server tools. Use this when asked to create a GitHub issue, file a bug report, request a feature, or open a tracking issue.
```
```
Automate creation of REST API endpoints following the project's established patterns. Use this when asked to add a new API route or endpoint.
```

**Weak examples (do not use):**
```
Helps with GitHub stuff.
```
```
A skill for things.
```

#### 4b. Body Structure (Required)

Structure the Markdown body using these sections **in this order**. Every section marked "Required" must be present. Write as if briefing an expert developer who will follow the instructions autonomously.

**1. Title and Context (Required)**
- One H1 heading with the skill's purpose.
- 1–3 sentences explaining the domain, problem space, or what this skill achieves.
- If the skill relies on specific tools (MCP tools, CLI commands, editor features), state that here.

**2. Prerequisites (Required if the skill depends on tools, access, or setup)**
- List what must be true before the procedure starts.
- Name specific tools, permissions, or configurations.
- Example: "The GitHub MCP Server tools must be available. Call `activate_repository_management_tools` if they are not."

**3. Step-by-Step Procedure (Required)**
- Use H3 headings for each step: `### Step 1: <Action>`, `### Step 2: <Action>`, etc.
- Each step must include:
  - **Tool:** Which tool to call (if applicable). Use the exact tool name.
  - **Action:** What to do, with parameter details or code blocks.
  - **Expected output:** What a successful result looks like.
  - **Decision logic:** If/then branching based on the result. Use bullet points.
  - **Error handling:** What to do if the step fails.
- Number steps sequentially. Do not use sub-steps deeper than one level.
- Be explicit about parameter values — show the exact structure of tool calls.

**4. Rules and Constraints (Required)**
- Bullet list of invariants the agent must always follow.
- Start each rule with "Never…", "Always…", or "Do not…".
- Include error-prevention rules (e.g., "Never invent labels that do not exist in the repository").

**5. Examples (Required — at least one)**
- Show at least one complete, realistic example of the skill's expected input and output.
- Use code blocks with language tags for syntax highlighting.
- For complex skills, show both a "good" and "bad" example.

**6. Quick Reference Table (Recommended for tool-heavy skills)**
- Summarize all tool parameters in a table: name, type, required/optional, notes.
- This helps the agent quickly look up parameter details without re-reading the full procedure.

**7. Anti-Patterns (Optional but valuable)**
- List common mistakes and why they are wrong.
- Format: "❌ <wrong approach> → ✅ <correct approach>"

**8. Supporting Resource References (Conditional — only if the skill directory contains additional files)**
- List each file in the skill directory and its purpose.
- Example: "Use the template at `template.test.ts` in this skill's directory as the starting point."

#### 4c. Writing Guidelines

Follow these rules when writing the body:

- **Be specific and actionable.** Replace "write good tests" with "write at least one test per public method, covering the happy path and one error case."
- **Use numbered steps** for procedures so the agent follows them in order.
- **Use bullet points** for unordered rules or constraints.
- **Include code snippets** with language tags for syntax highlighting.
- **Reference tool names exactly** when the skill relies on MCP tools or CLI commands (e.g., `mcp_github_issue_write`, `list_workflow_runs`).
- **Include decision logic** at every branching point — never leave the agent guessing what to do next.
- **Include error handling** for every tool call — what to do on 4xx errors, empty results, or unexpected output.
- **Keep instructions concise.** Copilot's context window is finite — every sentence must earn its place. No filler prose.
- **Use headings** (H2 and H3) to make sections scannable.
- **Show exact tool call structures** — parameter names, types, and example values.

---

### Step 5: Add Supporting Resources (Optional)

If the skill benefits from templates, scripts, or example files, add them to the skill directory alongside SKILL.md.

| Resource type | Example filename | Purpose |
|---|---|---|
| Scripts | `convert.sh`, `validate.py` | Automatable steps the agent can execute via terminal. |
| Templates | `template.tsx`, `template.test.ts` | Boilerplate the agent copies and adapts. |
| Examples | `examples/good.md`, `examples/bad.md` | Reference outputs for the agent to emulate or avoid. |
| Config | `defaults.json` | Default values or settings the skill references. |

**Important:** Always reference supporting files from the SKILL.md body so the agent knows they exist:
```markdown
Use the template at `template.test.ts` in this skill's directory as the starting point.
```

---

### Step 6: Create the Files

**Tools:** `create_file`, `create_directory`

Now create the skill on disk.

**Actions:**
1. Create the SKILL.md file:
   ```
   create_file with:
     filePath: "<workspace-root>/.github/skills/<skill-name>/SKILL.md"
     content: <the full SKILL.md content composed in Step 4>
   ```
   Note: `create_file` automatically creates the directory, so you do not need to call `create_directory` separately.

2. If you have supporting files from Step 5, create each one:
   ```
   create_file with:
     filePath: "<workspace-root>/.github/skills/<skill-name>/<filename>"
     content: <file content>
   ```

---

### Step 7: Validate Against Quality Checklist

After creating the files, review the SKILL.md against every item below. If any item fails, fix it before reporting success.

- [ ] `name` is lowercase, hyphenated, and unique across all skills found in Step 1.
- [ ] `name` in frontmatter exactly matches the directory name.
- [ ] `description` clearly states **what** the skill does and **when** to use it.
- [ ] `description` is under 200 characters.
- [ ] `description` starts with a verb or noun phrase.
- [ ] `description` includes a trigger clause ("Use this when…").
- [ ] Body has a title and context section.
- [ ] Body has a step-by-step procedure with numbered steps.
- [ ] Every step that calls a tool names the **exact tool** and shows **parameter structure**.
- [ ] Every step includes **expected output** and **error handling**.
- [ ] Every branching point has explicit **decision logic** (if/then).
- [ ] Body has a rules and constraints section with "Always/Never" statements.
- [ ] Body contains at least one complete, realistic example.
- [ ] All supporting files in the directory are referenced in the body.
- [ ] No unnecessary filler text — every sentence earns its place.
- [ ] The skill does not overlap significantly with another skill's scope.
- [ ] The skill does not duplicate content that belongs in repository-level custom instructions (`.github/copilot-instructions.md`).

---

### Step 8: Report to the User

After successful creation, report back with:

1. **Skill path** — The full path to the SKILL.md file.
2. **Skill name and description** — From the frontmatter.
3. **Summary of sections** — List the major sections in the body.
4. **Supporting files** — List any additional files created, or "none."
5. **How to trigger** — Suggest 2–3 example prompts the user can try to activate the skill.

---

## Edge Cases and Error Handling

| Scenario | Action |
|---|---|
| A skill with the same `name` already exists | Ask the user: "A skill named `<name>` already exists. Should I update it, rename the new skill, or abort?" |
| The user's request overlaps with an existing skill's scope | Inform the user and suggest either extending the existing skill or narrowing the new skill's scope. Ask before proceeding. |
| The directory `.github/skills/` does not exist | Proceed normally — `create_file` will create the full directory path automatically. |
| The user asks for a personal skill | Use `~/.copilot/skills/<skill-name>/SKILL.md` instead of `.github/skills/`. |
| The user's description is too vague to determine scope | Ask one clarifying question. If still ambiguous after one question, make the best reasonable assumption, create the skill, and note the assumption in the report. |
| The skill requires MCP tools that may not be available | Include a Prerequisites section in the SKILL.md that tells the agent how to activate the required tools. |

---

## Skills vs. Custom Instructions

Use the right mechanism for the right purpose:

| Use a **Skill** when… | Use **Custom Instructions** when… |
|---|---|
| Instructions are task-specific (e.g., "debug CI", "create API route"). | Instructions apply to almost every task (e.g., "use 2-space indentation"). |
| Guidance is detailed (multi-step procedures with tool calls). | Guidance is brief (a few sentences or bullet points). |
| Copilot should load the context only when relevant. | Copilot should always have the context. |
| The task involves calling specific tools or APIs. | The guidance is about coding style, conventions, or repo structure. |

Custom instructions live in `.github/copilot-instructions.md`. Skills live in `.github/skills/<skill-name>/SKILL.md`. Do not put skill-level detail in custom instructions, and do not put universal conventions in skills.

---

## Complete Example: A Production-Quality Skill

Below is a complete, real-world SKILL.md for reference. Use this as a pattern when creating new skills.

```markdown
---
name: api-route-creation
description: Step-by-step guide for creating new Express API routes following the project's established patterns. Use this when asked to add a new API route, endpoint, or resource.
---

# Create a New API Route

This skill guides creation of new Express.js REST API routes that follow the established patterns in this project. All routes use Express Router, TypeScript, and return JSON responses.

---

## Prerequisites

1. The workspace contains an `api/src/routes/` directory with existing route files to use as reference.
2. The workspace contains an `api/src/models/` directory with Sequelize model definitions.

---

## Procedure

### Step 1: Identify the Entity and Operations

Determine from the user's request:
- **Entity name** (e.g., "product", "supplier", "order").
- **Operations needed** — default to full CRUD: GET all, GET by ID, POST, PUT, DELETE.
- **Relationships** — does this entity relate to other models?

### Step 2: Check for an Existing Model

**Tool:** `file_search`

Search for the model file:
` ` `
file_search with query: "**/models/<entity>.ts"
` ` `

**Decision logic:**
- If a model file exists, read it with `read_file` to understand the entity's fields and associations.
- If no model file exists, inform the user that a model must be created first, and offer to create one.

### Step 3: Read an Existing Route for Reference

**Tool:** `read_file`

Read an existing route file to learn the project's patterns:
` ` `
read_file with:
  filePath: "api/src/routes/branch.ts"
  startLine: 1
  endLine: 200
` ` `

Note the patterns for: imports, router setup, error handling, response format.

### Step 4: Create the Route File

**Tool:** `create_file`

Create the new route file following the exact patterns from Step 3:
` ` `
create_file with:
  filePath: "api/src/routes/<entity>.ts"
  content: <route code following the project's patterns>
` ` `

### Step 5: Register the Route in the Main App

**Tool:** `read_file`, `replace_string_in_file`

1. Read `api/src/index.ts` to find where routes are registered.
2. Add an import and `app.use()` call for the new route, following the existing pattern.

### Step 6: Create a Test File

**Tool:** `create_file`

Create a test file following the pattern in existing test files:
` ` `
create_file with:
  filePath: "api/src/routes/<entity>.test.ts"
  content: <test code with CRUD coverage>
` ` `

## Rules

- Always use the Express Router pattern from existing route files — do not invent a new pattern.
- Always include error handling with try/catch and appropriate HTTP status codes (400, 404, 500).
- Always return JSON responses with consistent structure.
- Never hardcode IDs or test data in route handlers.
- Always create a corresponding test file with at least one test per CRUD operation.

## Example

For an entity called "category" with fields `id`, `name`, `description`:

` ` ` typescript
import { Router, Request, Response } from 'express';
import { Category } from '../models/category';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

export default router;
` ` `
```

---

## Starter Template

When creating a new skill, begin with this template and fill in every section:

```markdown
---
name: <skill-name>
description: <verb phrase describing what the skill does>. Use this when <trigger condition>.
---

# <Skill Title>

<1–3 sentences about the domain or problem this skill addresses. State any tool dependencies.>

---

## Prerequisites

1. <What must be true before starting.>
2. <Required tools, permissions, or configurations.>

---

## Procedure

### Step 1: <Action Name>

**Tool:** `<tool_name>`

**Action:**
<What to do, with exact parameter details.>

**Expected output:** <What success looks like.>

**Decision logic:**
- If <condition>, then <action>.
- If <other condition>, then <other action>.

**Error handling:** <What to do on failure.>

### Step 2: <Action Name>

...continue for each step...

---

## Rules

- Always <invariant>.
- Never <anti-pattern>.
- <Additional constraints.>

---

## Example

<Complete, realistic example showing expected input and output.>
```
