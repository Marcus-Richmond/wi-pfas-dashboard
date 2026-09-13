# Decisions

Compiled 2026-09-13. That is the review date, not the date each choice was made. Original decision dates are not asserted. Evidence is the current repository and chats identified in [CHAT_SYNTHESIS.md](CHAT_SYNTHESIS.md). Assistant recommendations are not treated as owner-approved architecture.

## D01 — Wisconsin PFAS as the project domain

- **Status:** Owner-stated direction; README and notebook confirm work in this domain.
- **Decision:** Develop a more capable Wisconsin PFAS viewer/dashboard.
- **Rationale:** Practice a more complex GIS application using environmental data relevant to the owner's experience; improve visual design and data exploration.
- **Alternatives discussed:** Lead or other contaminants, groundwater/soil/air data, and nationwide scope.
- **Consequences:** Wisconsin PFAS sources guide initial work. An early groundwater-only idea broadened to the viewer concept; detailed release scope remains open.
- **Evidence:** Plan GIS dashboard project; README.

## D02 — Learn by writing the code

- **Status:** Explicit historical owner preference, reiterated in later discussion.
- **Decision:** Use explanations, manageable steps, and debugging help as the default learning interaction; direct implementation remains possible when requested.
- **Rationale:** The owner says learning works better when personally writing the code.
- **Alternatives discussed:** Extensive assistant implementation occurred during the predecessor project's deployment; no formal comparison was recorded.
- **Consequences:** Do not infer permission to build the proposed app from a planning discussion. The current documentation request explicitly authorizes these documentation edits.
- **Evidence:** Plan GIS dashboard project; Data Clean Up; current documentation request.

## D03 — Start with notebook-based cleanup

- **Status:** Owner-selected current phase; implemented.
- **Decision:** Focus first on the Surface Water and Fish Tissue layer, with the canonical notebook in `notebooks/`.
- **Rationale:** The owner wanted Python cleaning practice and explicitly deferred thinking about frontend/backend setup because it added too much complexity at that point.
- **Alternatives discussed:** Manual cleanup, Excel unpivoting, a Python script, and immediate full application scaffolding.
- **Consequences:** `z/` remains scratch space. A reusable script and application directories are later possibilities, not missing components that should be created automatically.
- **Evidence:** Data Clean Up; tracked notebook.

## D04 — Track reusable work and keep local data separate

- **Status:** Owner-selected and implemented through layout and .gitignore.
- **Decision:** Use the repository root for shareable code/docs; ignore `z/`, raw/intermediate/processed data, environments, real `.env` files, and workspace files. Use a repository-relative CSV path.
- **Rationale:** Share progress without publishing local working files, machine paths, or secrets; avoid a late deployment cleanup.
- **Alternatives discussed:** Commit the small public CSV; keep data in scratch storage selected by `WI_PFAS_DATA_DIR`; include the VS Code workspace.
- **Consequences:** Each computer needs its own data and environment setup. `WI_PFAS_DATA_DIR` is not implemented. `.env.example` is allowed by ignore rules but does not exist. No environment variables are currently required by the notebook.
- **Evidence:** Data Clean Up; .gitignore; notebook cell 1.

## D05 — Reshape measurements into analytical-result rows

- **Status:** Owner-selected approach, partially implemented.
- **Decision:** Unpivot PFOS/PFOA, separate slash-delimited events, extract dates/results/flags, and retain original text.
- **Rationale:** Combined analyte/date/result/note strings prevent useful quantitative work.
- **Alternatives discussed:** Manual or Excel transformations versus Python processing.
- **Consequences:** Repeated source IDs are expected. Final keys, sample/media relationships, units, qualifier meanings, and output schema are unfinished. The conceptual location/event/result database model is not adopted or implemented.
- **Evidence:** Data Clean Up; notebook cells 2–6.

## D06 — Python environment

- **Status:** Local implementation verified; portable policy unresolved.
- **Observed choice:** Existing `wi-pfas` Miniforge environment runs Python 3.12.13 and pandas 3.0.3.
- **Rationale known:** The owner preferred Miniforge/mamba based on prior experience and sought compatibility with pandas and eventual Django work. No rationale was recorded for these exact installed patch versions.
- **Alternatives discussed:** Named mamba environment versus a repository-local environment; Python 3.11/3.12; a later laptop recipe used pip and `.venv`.
- **Consequences:** No manifest pins the setup. Historical example name `wi-pfas-dashboard` differs from observed `wi-pfas`. Do not treat the shell's default Python as the project interpreter.
- **Evidence:** Data Clean Up; Set up GitHub repo on laptop; notebook metadata and review execution.

## D07 — Web stack and hosting

- **Status:** Open; user preferences and assistant proposals only.
- **Direction:** The owner prefers familiarity with PostgreSQL, Django, and JavaScript while being open to React/TypeScript.
- **Rationale known:** Build on prior learning while exploring greater application complexity.
- **Alternatives discussed:** Leaflet versus MapLibre; vanilla JavaScript versus React/TypeScript; several chart/table libraries. Assistant recommendations included PostGIS, Django REST Framework, and Vite.
- **Consequences:** No final mapping library, framework versions, package manager, database SRID, or hosting provider can be inferred. Render use belonged to the predecessor project.
- **Evidence:** Plan GIS dashboard project; absence of web configuration in the current repository.

## D08 — Durable context in the repository

- **Status:** Explicit owner choice; implemented by this documentation task.
- **Decision:** Keep concise assistant guidance, project context, decisions, and chat synthesis in repository Markdown for use on both computers and by different assistants.
- **Rationale:** Make relevant context portable without relying on one conversation.
- **Alternatives discussed:** A central reference chat and Codex Remote/handoff; the owner chose documentation and deferred remote access.
- **Consequences:** Update the docs when work changes. Sharing them through Git requires a later owner-authorized commit/push and retrieval on the other computer. Raw data and environments remain local.
- **Evidence:** Sync Codex project context; current documentation request.
