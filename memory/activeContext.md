# Active Context

**Current focus:** Create and standardize the Memory Bank core files and an
initial task to track this work.

**Recent changes:**

- Repository scaffold with Vite + React + TypeScript, example r3f components,
  and initial test files is present.

**Decisions:**

- Use the Memory Bank folder at `/memory` to store the core context files and
  tasks.

- Task IDs will start at TASK001 and remain unique across `memory/tasks` and
  `memory/tasks/COMPLETED`.

**Next steps:**

1. Populate `memory/` with required core files (projectbrief, productContext,
   techContext, systemPatterns, activeContext, progress).

2. Create a `memory/tasks/_index.md` and add the first task (TASK001).

3. Add a lightweight design entry in `memory/designs/` for architecture notes.

4. Iterate on the Memory Bank with additional tasks and design artifacts.
