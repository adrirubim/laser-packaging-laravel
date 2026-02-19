---
name: react-best-practices
description: >-
  Performance guidelines for React/Inertia. Use when writing, reviewing, or
  refactoring React components, data fetching, bundle size, or re-renders.
---

# React Best Practices (performance)

Optimisation for React and patterns applicable to Inertia. Rules prioritised by impact.

## When to apply

- Writing or refactoring React components or Inertia pages.
- Data fetching (client or server).
- Reviewing performance, bundle size, or re-renders (e.g. Planning/Index).

## Priorities

1. **Waterfalls:** Use Promise.all() for independent operations; in Inertia load in controller or deferred props.
2. **Bundle:** Import from the module directly; avoid barrel files that pull everything; use lazy for heavy components when applicable.
3. **Re-renders:** Derive in render when possible; memo for expensive work; useState(() => expensive()) for init; startTransition for non-urgent updates.
4. **Long lists:** content-visibility or virtualisation; static JSX outside the component; ternary instead of && when the value can be 0 or ''.
5. **JS:** Map/Set for lookups; cache in loops; early return.

Full documentation: vercel-labs/agent-skills, skills/react-best-practices.
