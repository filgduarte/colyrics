# Task: Create Split Button Component with Dropdown Actions

You are working on a React project that follows a component-based architecture.

## Goal

Create a reusable split button component based on `components/ui/Button` and integrate it into `components/feature/MenuFile`.

---

# Requirements

## 1. Create a new reusable component

Create a component that behaves as a **split button**:

- The left/main area behaves like a normal button.
- The right area contains a dropdown arrow icon/button.
- Clicking the main button executes a primary action.
- Clicking the arrow opens a dropdown menu.
- Clicking a dropdown option executes its respective action.

The component must:

- Reuse the existing `components/ui/Button` styling and behavior as much as possible.
- Support the same visual variants and props already used by `Button`.
- Be reusable for other menus/actions in the future.
- Follow the existing project structure and naming conventions.
- Keep accessibility in mind (`button` semantics, keyboard navigation, focus states, etc.).

Suggested API example:

```jsx
<SplitButton
  title="Save"
  onClick={handleSaveProject}
  options={[
    {
      label: "Save project",
      onClick: handleSaveProject,
    },
    {
      label: "Save song",
      onClick: handleSaveSong,
    },
  ]}
/>
````

---

# 2. Integrate into MenuFile

File:

```txt
components/feature/MenuFile
```

Replace the current `Button` with title `"Save"` by the new split button component.

---

# 3. Main button behavior

The primary/main button action must:

* Save the current project to disk as a `.colyrics` file.

Maintain all existing behavior and props currently used by the original `"Save"` button.

---

# 4. Dropdown options

The dropdown menu must contain:

## Option 1 — "Save project"

Behavior:

* Executes the exact same action as the main button.
* Saves the project as `.colyrics`.

---

## Option 2 — "Save song"

Behavior:

* Saves only the current song/music as a `.chordmd` file.

---

# 5. Technical expectations

* Use clean and maintainable React patterns.
* Avoid duplicated logic between main action and dropdown options.
* Keep component responsibilities well separated.
* Do not break existing functionality.
* Reuse existing UI primitives whenever possible.
* Preserve styling consistency with the current design system.

---

# Deliverables

* New reusable split button component.
* Updated `MenuFile` using the new component.
* Necessary styles, hooks, or utility updates.
* Implementation of both save actions.