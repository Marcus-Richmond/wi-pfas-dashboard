# Decisions

Originally compiled 2026-09-13; updated 2026-09-20 against `95cbd8a` and the backend/deployment conversation. Earlier Database Discussion evidence remains recorded in [CHAT_SYNTHESIS.md](CHAT_SYNTHESIS.md). Review dates are not automatically decision dates; assistant proposals are not treated as owner-approved architecture.

Later frontend orientation on 2026-09-20 checked `a473324`; D15 records the new owner direction and teaching preferences. Configuration-tracking status in D04 was reconciled with the current checkout and the Documentation task.

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
- **Consequences:** A planning discussion does not authorize scaffolding. Command instructions must name the terminal, environment, and working directory; distinguish VS Code edits from terminal commands and Python shell input.
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
- **Consequences:** Each computer needs local data and environment setup. `WI_PFAS_DATA_DIR` and `.env.example` are not implemented. The import requests credentials and CA path at runtime. Its `PSYCOPG_IMPL` setting selects a client implementation and is not a stored database credential. The cleanup export still uses an absolute path. `.vscode` is now ignored and untracked; the Documentation task records the completed removal from published history. Keep these settings personal. No connection values are copied into these docs.
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
- **Consequences:** Prefer mamba whenever a suitable package is available; explain pip exceptions. `backend/environment.yml` now specifies container dependencies from conda-forge, including Python 3.12 and Django 6.1. The Docker build uses micromamba with environment name `base`; local development remains `wi-pfas`. The earlier `requirements.txt` is unused by Docker. No transitive lockfile or complete notebook environment recipe exists; do not use the Linux/Gunicorn manifest as an unmodified Windows setup recipe.
- **Evidence:** Data Clean Up; laptop orientation; Database Discussion; current interpreter/package metadata and notebooks.

## D07 — Backend, frontend, and application hosting

- **Status:** Django/GeoDjango, Django REST Framework, REST Framework GIS, and Render Docker hosting are implemented; hosted operation is owner-reported. Frontend direction is now recorded in D15; implementation has not begun.
- **Decision:** Build a read-only location API over the existing Aiven PostGIS table, following the predecessor project's general REST approach. Deploy this project's backend to Render Free.
- **Observed implementation:** Tracked `_crud` and `api` code, unmanaged location model, GeoJSON serializer, list/detail routes, environment-based PostGIS configuration, and Docker deployment files.
- **Alternatives discussed:** Aiven as a possible app host; native versus Docker deployment; several frontend/map libraries. Earlier React/TypeScript/Vite and Leaflet/MapLibre proposals are historical; D15 records the owner's later frontend direction.
- **Consequences:** Aiven hosts the database; Render hosts Django. No frontend or measurement API is implemented. Do not infer a frontend selection from the backend milestone.
- **Evidence:** Current backend files and owner's reports of successful Render list/detail/styling checks; details in D13–D14.

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
- **Consequences:** `ST_GeomFromText` assigns SRID 3071 without reprojection. A location may link to multiple future measurement rows. This import does not include PFOS/PFOA results, media flags, comments, or PDF links. The primary key is appropriate to the inspected 367-row snapshot; stability across future DNR exports remains unverified. The owner reported the expected count during backend setup; independent SRID and QGIS placement verification remain unrecorded.
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

## D13 — Expose existing locations as read-only GeoJSON

- **Status:** Implemented; local and hosted requests reported successful by the owner.
- **Decision:** Map `sampling_locations` with `managed = False`, retaining `objectid` and stored EPSG:3071 geometry. Serialize geometry as EPSG:4326 using REST Framework GIS. Expose list and detail endpoints through a `ReadOnlyModelViewSet`.
- **Rationale:** Reuse the manually created and populated location table and provide web-friendly coordinates without rewriting stored geometry.
- **Consequences:** Django model migrations do not own this table. The API offers no location-write actions, measurement data, or custom filtering yet. API success is not a substitute for validating map placement or measurement semantics.
- **Evidence:** `backend/api/models.py`, `serializers.py`, `views.py`, and `urls.py`; owner-confirmed record retrieval and hosted checks.

## D14 — Deploy with micromamba, Gunicorn, and WhiteNoise on Render

- **Status:** Deployment files tracked; owner reports successful Render deployment and smoke checks.
- **Decision:** Use Render's Free Docker web service with `backend` as root/build context. Install conda-forge dependencies from `environment.yml` through micromamba. Run `collectstatic` and then Gunicorn; WhiteNoise serves compressed manifest assets.
- **Rationale:** Package GDAL/GEOS alongside Django while honoring the owner's mamba preference.
- **Consequences:** Keep the image entrypoint's environment activation. Supply credentials through Render environment variables and the Aiven CA through a secret file. Linux library paths belong to the image; Windows settings remain local. Startup performs no migration or data import. The earlier pip requirements list is not the deployment dependency source. Free-tier operational limits should be checked in current provider documentation when needed.
- **Evidence:** Dockerfile, environment manifest, ignore rules, Django settings, and this conversation's deployment reports. The Render dashboard and exact deployed URL were not independently audited. See [BACKEND_SETUP.md](BACKEND_SETUP.md).

## D15 — Begin frontend learning with MapLibre and the preferred React/TypeScript direction

- **Status:** Owner-selected next phase and MapLibre choice; React/TypeScript are the owner's preferred direction. No frontend implementation or dependency installation yet.
- **Direction:** Retain MapLibre from the predecessor and learn React/TypeScript through this GIS application. Build on basic JavaScript and Python experience, especially object/dictionary-driven filtering. The owner found Code with Mosh's instruction useful but needs examples tied to web GIS.
- **Workflow:** The owner prefers to create source/configuration files personally, in small explained steps. A generator is acceptable if manual setup becomes disproportionately tedious. npm can install dependencies without scaffolding source files; generated dependency folders and lockfiles should remain tool-managed.
- **Assistant proposals:** Manually configure a minimal Vite project, start with station components and selection, then integrate MapLibre and the existing location API. Direct MapLibre integration initially would preserve familiar methods while teaching React setup/cleanup. These are recommendations, not installed or accepted implementation details.
- **UI choice deferred by the owner:** Review Material UI and alternatives when UI work becomes relevant. Coordinate map, list, counts, and later charts through shared application state; use shared style values for map layers and UI. No library automatically supplies this coordination or themes MapLibre's canvas.
- **Consequences:** Teach component inputs, state, array/object replacement, refs, effects, and types through concrete GIS tasks as needed. Use explicit data fields before designing generic filter frameworks. First exercises must reflect the existing location-only API; no measurement/media filters are available yet.
- **Evidence:** Current frontend request, repository source at `a473324`, and the reviewed public predecessor files, especially [buttons2.js](https://github.com/Marcus-Richmond/WebGIS_ProjectLocationMap/blob/main/frontend_basic2/components/buttons/buttons2.js).

## D16 — Deploy the frontend early on free hosting

- **Status:** Explicit owner requirement on 2026-09-20; no frontend hosting service configured yet.
- **Decision:** Publish the first small working frontend page and keep deploying incremental progress, addressing deployment during initial setup rather than after completing the dashboard.
- **Assistant proposal:** Use a Render Static Site alongside the existing Render backend. A manually assembled React/TypeScript/Vite app can build to static files; connect the repository's future `frontend` directory and publish `dist`. Enable deployment from the intended Git branch. Render is a recommendation, not an owner-selected frontend provider.
- **Consequences:** Establish the build and public URL early; verify the deployed page before expanding features. Configure the public API URL and explicit browser cross-origin access when connecting data. The frontend never needs Aiven credentials. Static hosting is free within the provider's applicable allowances; build minutes and bandwidth count toward workspace usage. The existing free backend can still spin down independently of the static site.
- **Evidence:** Owner follow-up requesting free early hosting; current [Render Static Sites documentation](https://render.com/docs/static-sites), [Render Free documentation](https://render.com/docs/free), and [Vite deployment guide](https://vite.dev/guide/static-deploy.html#render), reviewed 2026-09-20. No account usage, billing settings, or deployment dashboard was inspected.
