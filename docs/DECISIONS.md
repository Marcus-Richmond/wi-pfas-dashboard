# Decisions

Originally compiled 2026-09-13; updated 2026-09-18 against `f878cff`, existing untracked backend files, and all 29 turns of **Database Discussion**. Review dates are not automatically decision dates. Evidence and coverage are recorded in [CHAT_SYNTHESIS.md](CHAT_SYNTHESIS.md). Assistant suggestions are not treated as owner-approved architecture.

## D01 — Wisconsin PFAS as the project domain

- **Status:** Owner-stated direction; README, notebooks, and SQL confirm work in this domain.
- **Decision:** Develop a more capable Wisconsin PFAS viewer/dashboard.
- **Rationale:** Practice a more complex GIS application using environmental data relevant to the owner's experience; improve visual design and data exploration.
- **Alternatives discussed:** Lead or other contaminants, groundwater/soil/air data, and nationwide scope.
- **Consequences:** Wisconsin PFAS sources guide initial work. The early groundwater-only idea broadened to the viewer concept; detailed release scope remains open.
- **Evidence:** Plan GIS dashboard project; README; current workflows.

## D02 — Learn by writing the code

- **Status:** Explicit owner preference, reiterated in Project Documentation and followed in Database Discussion.
- **Decision:** Use explanations, manageable steps, syntax help, and debugging guidance by default. Implement directly only when requested.
- **Rationale:** The owner learns better by personally writing the code.
- **Alternatives discussed:** Extensive assistant implementation occurred during predecessor deployment; it is not the default for this project.
- **Consequences:** A planning discussion does not authorize scaffolding. The current request authorizes documentation edits, not database or application changes.
- **Evidence:** Plan GIS dashboard project; Data Clean Up; Project Documentation; Database Discussion.

## D03 — Begin with notebook-based cleanup, then progress to database work

- **Status:** Initial owner-selected phase implemented; the owner moved to database work in September 2026.
- **Decision:** Start with the Surface Water and Fish Tissue layer and keep canonical cleaning work in `notebooks/`.
- **Rationale:** Learn Python cleaning before adding the complexity of a full application. The owner later considered the first layer cleaned enough to proceed.
- **Alternatives discussed:** Manual/Excel cleanup, a Python script, and immediate full-stack scaffolding.
- **Consequences:** Do not keep describing database work as deferred. The cleanup remains exploratory and has documented limitations; a separate import notebook now exists, and stable logic may become scripts later. `z/` remains scratch space if present.
- **Evidence:** Data Clean Up; opening Database Discussion turns; both tracked notebooks.

## D04 — Track reusable work and keep local data separate

- **Status:** Owner-selected convention, largely implemented; configuration/path discrepancies remain.
- **Decision:** Track reusable code/docs while ignoring scratch space, raw/intermediate/processed data, environments, real `.env` files, and workspace files. Prefer repository-relative paths.
- **Rationale:** Share progress without publishing local data, machine-specific configuration, or secrets.
- **Alternatives discussed:** Commit the public CSV; select scratch data using `WI_PFAS_DATA_DIR`; include the VS Code workspace.
- **Consequences:** Each computer needs local data and environment setup. `WI_PFAS_DATA_DIR` and `.env.example` are not implemented. The import requests credentials and CA path at runtime. Its `PSYCOPG_IMPL` setting selects a client implementation and is not a stored database credential. The cleanup export still uses an absolute path. Tracked `.vscode/settings.json` contains service/machine-specific SQLTools metadata despite this convention; moving it to personal settings is unresolved. No such values are copied into these docs.
- **Evidence:** Data Clean Up; .gitignore; notebooks; sanitized SQLTools configuration inspection.

## D05 — Reshape measurements into analytical-result rows

- **Status:** Owner-selected approach implemented in an exploratory notebook; database measurement schema remains open.
- **Decision:** Unpivot PFOS/PFOA, separate slash-delimited events, derive dates/results/flags/comments, and retain original text.
- **Rationale:** Combined analyte/date/result/note strings prevent useful quantitative work.
- **Alternatives discussed:** Manual/Excel transformations versus Python processing.
- **Consequences:** Repeated source IDs are expected in measurements. `OBJECTID` alone cannot identify a measurement row. The new location table preserves that ID for a future relationship, but measurement keys, units, media, qualifier semantics, and final output schema remain unfinished. The earlier three-model location/event/result proposal is not adopted in full.
- **Evidence:** Data Clean Up; cleanup notebook; Database Discussion location-table choice.

## D06 — Python environment

- **Status:** Miniforge `wi-pfas` is in use on the laptop; reproducible cross-machine policy remains open.
- **Observed setup:** The 2026-09-18 laptop metadata check found Python 3.12.14, pandas 3.0.5, NumPy 2.5.3, ipykernel 7.3.0, Psycopg/psycopg-binary 3.3.4, and Django 6.1. The earlier desktop review found Python 3.12.13/pandas 3.0.3.
- **Rationale known:** The owner preferred Miniforge/mamba based on experience. The database troubleshooting added Psycopg's binary package; the import explicitly selects it.
- **Alternatives discussed:** Named versus repository-local environment, different Python versions, and a laptop pip/`.venv` recipe that was not established as canonical.
- **Consequences:** No environment manifest or lockfile pins these observed versions. Verify the chosen interpreter/kernel rather than relying on default shell Python. Do not infer that Django's observed version is a project-wide version policy.
- **Evidence:** Data Clean Up; laptop orientation; Database Discussion; current interpreter/package metadata and notebooks.

## D07 — Backend, frontend, and application hosting

- **Status:** Database decisions are now established in D09–D10. Django has a local starter; the broader application stack remains open.
- **Direction:** Build on PostgreSQL/Django/JavaScript experience, with interest in React/TypeScript.
- **Observed implementation:** Untracked `backend/` contains Django `_crud` and `api` starter files. Settings still use SQLite, `api` is not registered, and PFAS models/views/migrations are absent. This is not a working database-backed API.
- **Alternatives discussed:** Leaflet/MapLibre, vanilla JavaScript/React/TypeScript, and several table/chart libraries. Django REST Framework and Vite remain assistant proposals.
- **Consequences:** Do not scaffold or select remaining frameworks from historical suggestions. Database hosting on Aiven does not decide backend/frontend hosting. Render application deployment remains predecessor history. The purpose and next integration step for the local starter need owner direction.
- **Evidence:** Plan GIS dashboard project; Database Discussion; current untracked backend inspection.

## D08 — Durable context in the repository

- **Status:** Explicit owner choice; documentation is tracked and being maintained.
- **Decision:** Keep assistant guidance, current context, decisions, and chat synthesis in repository Markdown for use across computers and assistants.
- **Rationale:** Preserve context without requiring access to one machine's chats.
- **Alternatives discussed:** A central reference chat and remote access/handoff; the owner chose repository documentation.
- **Consequences:** Keep current implementation separate from historical recommendations. Raw data, credentials, certificates, environments, and untracked work do not travel with a clone. Commit/push remains a separate explicitly authorized action.
- **Evidence:** Sync Codex project context; Project Documentation; current documentation update request.

## D09 — Use hosted PostgreSQL/PostGIS on Aiven

- **Status:** Owner-selected and owner-reported working, supported by current SQL/import files.
- **Decision:** Begin database work on Aiven PostgreSQL and enable PostGIS there, rather than requiring a local database first.
- **Rationale known:** The owner wanted to explore starting hosted to avoid a later database move and considered free hosting options. A single hosted database also supports work from both computers.
- **Alternatives discussed:** Local PostgreSQL, Render, Neon, and Supabase. Pricing/plan comparisons were historical research and are not a current contract or guarantee.
- **Consequences:** Notebook inserts affect a remote database. Local Python development can continue independently of later application hosting. The current Aiven plan, live service state, backup policy, and operational settings were not audited in this review.
- **Evidence:** Database Discussion: owner reports starting Aiven, enabling PostGIS, creating the table, and successfully uploading records; `sql/create/postgis.sql`; import notebook.

## D10 — Import a minimal sampling-location point layer first

- **Status:** Explicit owner-selected scope; SQL and import implemented; upload success owner-reported.
- **Decision:** Load only source OBJECTID, WKT point geometry, and station name into `public.sampling_locations`. Preserve `objectid` as the primary key and use `geometry(Point, 3071)` with a required station name.
- **Rationale:** Establish a small spatial layer and retain the source ID to link to sampling measurements later. The owner explicitly identified the WKT coordinate system as EPSG:3071.
- **Alternatives discussed:** Begin with measurement-table design or a more elaborate location/event/result model. The owner redirected the immediate milestone to locations.
- **Consequences:** `ST_GeomFromText` assigns SRID 3071 without reprojection. A location may link to multiple future measurement rows. This import does not include PFOS/PFOA results, media flags, comments, or PDF links. The primary key is appropriate to the inspected 367-row snapshot; stability across future DNR exports remains unverified. Post-load count/SRID and QGIS placement checks remain to be recorded.
- **Evidence:** Database Discussion on September 16–17; `sql/create/locations_table.sql`; `notebooks/database import locations.ipynb`.

## D11 — Define tables in SQL and load locations through a separate Python notebook

- **Status:** Implemented workflow; moving the importer to a script remains a proposal.
- **Decision:** Use saved SQL definitions through SQLTools in VS Code, and a separate Psycopg notebook to read the raw location columns and insert records.
- **Rationale:** Practice SQL schema definition and Python data loading without adding database writes to the measurement-cleaning notebook. The owner chose a new notebook after a script was suggested.
- **Alternatives discussed:** Loading from the cleaning notebook, pandas `to_sql`, a standalone Python script, PostgreSQL copy tools, and pgAdmin.
- **Consequences:** The importer uses parameterized tuple inserts, commits on success, and rolls back on failure. It does not handle repeated imports; duplicate source IDs will violate the primary key after a successful load. A standalone reusable importer, post-load checks, connection cleanup, and a rerun policy remain future work. QGIS is now a connected inspection tool by owner report, not the importer used in this workflow.
- **Evidence:** Database Discussion; tracked SQL and location-import notebook.

## D12 — Record the current connection workaround without treating it as permanent policy

- **Status:** Implemented in the import notebook and confirmed working by the owner; underlying client issue unresolved.
- **Observed choice:** Runtime URI prompt, runtime CA-path input, Psycopg binary implementation, `connect_timeout=10`, `gssencmode='disable'`, and `sslmode='verify-ca'` with the Aiven CA.
- **Rationale:** Troubleshooting addressed an invalid timeout keyword, a GSSAPI error, and a certificate-matching error. Changing to the binary client alone failed; the owner reported success after switching to `verify-ca`.
- **Alternatives discussed:** `verify-full` was the original approach. The chat explicitly recorded that `verify-ca` omits hostname matching; future restoration of stronger verification is unresolved.
- **Consequences:** Preserve the distinction between the working workaround and a repaired client. SQLTools/Python/QGIS require separate connection configuration. Keep all service/account values and certificate paths out of documentation. No live connection was tested for this update.
- **Evidence:** September 17 Database Discussion troubleshooting and current import connection cell.
