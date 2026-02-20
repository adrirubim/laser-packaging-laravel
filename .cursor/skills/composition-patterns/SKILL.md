---
name: composition-patterns
description: >-
  React composition patterns that scale. Activates when refactoring components
  with many boolean props, building reusable libraries, or designing flexible
  component APIs. Includes React 19 changes.
---

# React Composition Patterns

Patterns for flexible and maintainable components. Avoid boolean prop proliferation by using compound components, lifting state, and composition. React 19 included.

## When to apply

- Refactoring components with many boolean props.
- Building reusable component libraries.
- Designing flexible component APIs.
- Reviewing component architecture (compound components, context providers).

## Priority categories

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Component Architecture | HIGH | `architecture-` |
| 2 | State Management | MEDIUM | `state-` |
| 3 | Implementation Patterns | MEDIUM | `patterns-` |
| 4 | React 19 APIs | MEDIUM | `react19-` |

## Quick reference

### Architecture
- **Avoid boolean props** to customize behavior; use composition (children, subcomponents).
- **Compound components:** structure complex components with shared context instead of many props.

### State
- **Decouple implementation:** the Provider is the only place that knows how state is managed.
- **Context interface:** define a generic interface (state, actions, meta) for dependency injection.
- **Lift state:** move state into the provider component so siblings can access it.

### Implementation patterns
- **Explicit variants:** create explicit variant components instead of boolean modes.
- **Children over render props:** prefer composition with children over renderX props.

### React 19
- Do not use `forwardRef`; use ref as a normal prop instead. `use()` instead of `useContext()` where applicable.

Goal: code that is easier to maintain and extend for humans and agents; especially useful for refactoring large pages (e.g. Planning/Index) into composable blocks.
