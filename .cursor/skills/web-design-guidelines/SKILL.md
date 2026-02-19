---
name: web-design-guidelines
description: >-
  Review UI code against web interface guidelines: accessibility, performance,
  UX. Activates when asked to "review my UI", "check accessibility", "audit
  design", "review UX", or "check the site against best practices".
---

# Web Interface Guidelines

Review files for compliance with web interface guidelines (accessibility, performance, UX).

## How to use

1. Fetch the latest guidelines from the reference URL (see below).
2. Read the specified files (or ask the user for files/pattern).
3. Check against the guidelines' rules.
4. Return findings in a concise format (e.g. `file:line`).

## Guidelines source

Fetch the latest version before each review:

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

Use the fetch tool to retrieve the rules. The content includes the rules and the output format.

## Usage

When the user specifies a file or pattern:
1. Fetch the guidelines from the URL above.
2. Read the specified files.
3. Apply the guidelines' rules.
4. Return results in the format specified in the guidelines.

If no files are specified, ask the user which files to review.
