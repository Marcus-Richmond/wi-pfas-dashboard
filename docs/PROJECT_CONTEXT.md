# Project context

Updated 2026-11-06 against clean local `HEAD` `1f0794f` on `javascript`, matching locally recorded `origin/javascript` without a fetch. Compared all changes since the last documentation commit `d65dbdb` (October 14): 14 application/notebook/SQL files changed across 10 commits. Local `main`/`react` remain at `4810393`. Earlier laptop-environment and performance findings remain dated evidence, not new execution results. See [CHAT_SYNTHESIS.md](CHAT_SYNTHESIS.md) for chat coverage and limits.

The active JavaScript version now has theme/basemap switching, two point overlays, and a sidebar with visibility controls and symbol previews. A new notebook retrieves PFAS Sites (Open/Under Investigation) directly from DNR and upserts selected fields into PostGIS; a second read-only API exposes that table. Earlier React/TypeScript/Vite work remains preserved separately. `.vscode` remains ignored/untracked; published-history cleanup was not repeated here.

**Evidence labels:** Confirmed means observed in repository files or directly checked during the stated review. Owner-reported means the owner described successful work in chat; it is not a fresh database verification. Historical means evidence from an earlier review or saved notebook output. Proposed means suggested but not accepted or implemented. Unresolved means the evidence does not settle it. This review did not execute any notebook, run SQL, contact DNR, or connect to Aiven.

## Purpose and learning objectives

Build a more capable and visually polished Wisconsin DNR PFAS explorer, with filtering, searching, highlighting, coordinated maps/tables/charts, and potentially hydrography context. The owner brings environmental science, geology, GIS, and consulting experience and wants to develop full-stack GIS programming skills.

The immediate audience is the owner and people reviewing the learning work; eventual public/professional user personas and release scope remain open. Learning objectives include reproducible environmental data cleaning, spatial database design, a backend API and interactive frontend, and professional Git, documentation, environment, and deployment practices.

The owner writes application code unless direct implementation is requested. On October 10 the owner explicitly requested small exercises and syntax/function hints before complete code, followed by review of their attempt. Prefer mamba for package installation when available; explain any pip exception. Every command instruction must identify the terminal, active environment, and working directory. File edits should explicitly name VS Code. In Database Discussion, the owner considered the first layer sufficiently cleaned to move on to database work. Remaining data-quality questions below do not reverse that chosen milestone.

The separate **Project Location Map** remains a predecessor project. Its deployed application is background experience, not evidence of a running PFAS dashboard.

### Frontend learning direction

The owner knows basic JavaScript and has studied React/TypeScript through Code with Mosh. Teach through web GIS tasks, using Python dictionaries/lists/functions and existing JavaScript patterns as bridges. React proved too much at once; the September Branching conversation explicitly chose a JavaScript restart from `caf8414`, preserving React work. A return to React is undecided.

The reviewed predecessor's `frontend_basic2/components/buttons/buttons2.js` uses nested objects, `Object.entries()`, asynchronous API calls, dynamic buttons, and shared filters to update counts and MapLibre styling/data. These are useful foundations. React lessons should distinguish application data/state from DOM element references, and replacement of state objects/arrays from the predecessor's `push`/`splice` mutations.

**Current owner direction:** Continue MapLibre with plain HTML/CSS/JavaScript and personally authored source/configuration. Use the owner's CSS for the desktop layout, split by responsibility. shadcn/ui, mapcn, and glasscn provide visual inspiration; their components are not integrated. Tailwind is set aside. Bootstrap was considered and Tabulator/Chart.js are acceptable candidates, not final selections or installed dependencies. Material UI discussion belongs to a possible React return.

**Early hosting implemented:** Both frontend versions reached Render Static Sites. Current public addresses are [JavaScript frontend](https://wi-pfas-dashboard.onrender.com/), [earlier React frontend](https://wi-pfas-frontend.onrender.com/), and [location API](https://wi-pfas-api.onrender.com/api/locations/). These are historical/owner-reported deployments, not freshly checked uptime. JavaScript uses `node build.mjs` from `frontend`, publishing `dist`; React uses its preserved Vite build. Current Django settings include explicit CORS origins. On October 6 the owner requested using `javascript` for the backend service, then confirmed hosted locations loaded; dashboard settings were not independently audited.

**Frontend stopping point:** The owner deferred search on October 14 to work on themes, then chose the layer list on November 4. Dark/Light/Warm palettes, basemap switching, two overlays, visibility controls, and two symbol previews are now implemented. The owner reported checkboxes working and chose to retain `Object.entries()`. Latest code goes beyond the last chat's single-preview exercise: both previews exist, but the suggested outline borders are absent. No search, feature selection, populated table/chart, or loading/error UI exists. Panel-layout presets were discussed but not implemented. See [FRONTEND_SETUP.md](FRONTEND_SETUP.md).

## Current implementation and repository layout

**Confirmed:** Three notebooks cover measurement cleaning, sampling-location import, and direct PFAS-sites retrieval/import. Two table definitions and read-only APIs support the frontend overlays. The two older notebooks and their SQL are unchanged since the prior documentation baseline; a new PFAS-sites notebook/DDL/API is added. No analytical-measurement API exists. Earlier hosted sampling checks remain owner-reported; the new site API's live deployment and detail/count checks were not established in the reviewed chats.

```text
AGENTS.md
README.md
.gitignore
docs/
  PROJECT_CONTEXT.md
  DECISIONS.md
  CHAT_SYNTHESIS.md
  BACKEND_SETUP.md
  FRONTEND_SETUP.md
notebooks/
  Surface Water and Fish Tissue.ipynb
  database import locations.ipynb
  database import pfas sites open.ipynb
sql/
  create/postgis.sql
  create/locations_table.sql
  create/pfas_sites.sql
  test.sql
backend/                         # tracked Django API and Docker deployment
  _crud/                         # settings and project URLs
  api/                           # location model, serializer, viewset, router
  environment.yml                # container dependency specification
  Dockerfile
  .dockerignore
  requirements.txt               # earlier pip list; Docker does not use it
frontend/                        # javascript branch; React files differ
  index.html
  build.mjs                      # Node copy/config generation
  components/map.js
  components/theme.js
  components/layers/locations.js
  components/layers/PFASsites.js
  components/sidebar/layer-list.js
  css/                           # theme/base/layout/components/typography
  config.js                      # ignored local browser configuration
  dist/                          # ignored generated deployment output
data/raw/                        # ignored local CSV input
data/processed/                  # ignored local CSV outputs
```

The earlier laptop review did not find the desktop's `z/` scratch directory or `001.code-workspace`. Those are local artifacts, not clone prerequisites. The previously listed Aiven session SQL file is not in the current tracked tree.

Current-history landmarks include `b21b864` (location import work), `b76a9b1` (location upload), `db77f11` (backend start), `95cbd8a` (backend deployment), and `caf8414` (documentation baseline used for the JavaScript branch). Later JavaScript commits add the map/CORS, October 6 deployment build, and October 10–11 CSS work. Older hashes in historical review sections may predate the published-history rewrite; do not treat them as current checkout instructions.

### Measurement cleaning

`notebooks/Surface Water and Fish Tissue.ipynb` imports Path, pandas, and NumPy. Its seven populated cells read the raw CSV, unpivot PFOS/PFOA, split slash-delimited events while preserving `original`, reshape four split columns, derive numeric results/flags, construct dates and comments, and export a CSV. One trailing cell is empty; no saved outputs remain in the current file.

Compared with the older documentation:

- The date-column removal now uses `inplace=True`; the previously reported bug is fixed.
- Flags are stripped of surrounding whitespace and blank flags become missing values.
- `valid_comment` identifies rows with a flag, and `comment` conditionally retains the source comment. Two analyte-specific comment overrides exist for source OBJECTID 1364211; these are specific corrections, not a universal qualifier dictionary.
- The final columns are `OBJECTID`, `COMMENTS`, `analyte`, `original`, `result_num`, `flag`, `date`, `valid_comment`, and `comment`.
- An export cell targets `data/processed/processed2.csv`, now inside an ignored directory, but uses an absolute machine-specific path and includes the pandas index by default.

This notebook does not load analytical measurements into PostgreSQL.

### Hosted database and location import

**Owner-reported:** The owner started an Aiven PostgreSQL database, connected through SQLTools in VS Code, enabled PostGIS, created the location table, successfully uploaded records, and resolved the QGIS connection issue. PostgreSQL/PostGIS and Aiven are now current choices, rather than hypothetical architecture.

**Confirmed in SQL:** `sql/create/postgis.sql` contains `CREATE EXTENSION postgis;`. `sql/create/locations_table.sql` defines:

| Column | Definition | Purpose |
|---|---|---|
| `objectid` | `integer PRIMARY KEY` | Preserve the source OBJECTID for later measurement joins. |
| `geom` | `geometry(Point, 3071) NOT NULL` | Store the source point as PostGIS geometry. |
| `primary_station_name` | `text NOT NULL` | Retain the station name. |

The creation SQL leaves the schema implicit; the import explicitly targets `public.sampling_locations`. No separate spatial index or measurement-table definition is present.

**Confirmed in notebook:** `notebooks/database import locations.ipynb` has eight populated code cells and four empty cells. It:

1. Reads only `OBJECTID`, `wkt_geom_EPSG_3071`, and `PRIMARY_STATION_NAME` from the raw CSV.
2. Selects Psycopg's binary implementation before importing Psycopg.
3. Requests a connection URI with `getpass()` and a local CA certificate path with `input()`.
4. Connects using `sslmode='verify-ca'`, the supplied `sslrootcert`, `connect_timeout=10`, and `gssencmode='disable'`.
5. Queries the location count, converts the three columns to ordinary tuples, and uses parameterized `executemany()` inserts with `ST_GeomFromText(..., 3071)`.
6. Commits successful inserts or rolls back on an exception.

The expected input is 367 location records. The owner confirmed successful uploading on September 17. The notebook's only saved query output is `(0,)` from the count cell before insertion; it is not a post-import count. The owner subsequently reported the expected count during backend setup. This documentation review has not independently queried the hosted row count. The import has no upsert/skip policy or explicit connection-close step; repeating it against the populated table will encounter duplicate primary keys.

**QGIS:** The owner reported the connection worked after correcting misuse of the Service field. The chat distinguished a PostgreSQL service-file name from Aiven's full URI. Checking 367 features, EPSG:3071, and placement against a basemap was suggested, but completion of those visual/count checks was not reported.

### PFAS Sites: direct retrieval and repeatable updates

`notebooks/database import pfas sites open.ipynb` reads [DNR MapServer layer 1](https://dnrmaps.wi.gov/arcgis2/rest/services/EM_PFAS/EM_PFAS_MAPLAYERS_PUBLIC_EXT/MapServer/1), identified in saved October output as **PFAS Sites (Open/Under Investigation)**. This is a distinct layer from the Surface Water and Fish Tissue sampling locations, not a measurement table or a join to it.

The notebook uses Requests with 30-second timeouts for metadata, count, and a single GeoJSON feature request (`where=1=1`, all attributes, geometry, `outSR=4326`). It calls `raise_for_status()` and inspects returned JSON, then creates a GeoPandas GeoDataFrame labeled EPSG:4326. The service request performs the coordinate conversion; assigning the GeoDataFrame CRS does not. The source `WTM_X`/`WTM_Y` attributes are not converted by this request.

Saved outputs show a 2,000-record response limit, a source count of 81, 81 returned features, 12 GeoDataFrame columns, a successful SRID-4326 point adaptation test, and a database count `(81,)`. The owner subsequently reported uploading the layer in Backend. These establish a historical snapshot, not a fresh database/source count or proof of spatial placement. The upload cell has no saved error. There is no pagination, automated count-equality assertion, ArcGIS JSON-error check, or durable raw-response archive; printed records in notebook outputs are not a reproducible ingestion/archive policy.

The owner deliberately reduced the upload to geometry, `OBJECTID`, and `SITENAME`. `sql/create/pfas_sites.sql` defines `pfas_sites` with `geom geometry(Point, 4326) NOT NULL`, integer `objectid PRIMARY KEY`, and required `sitename` (the unquoted uppercase SQL identifier folds to lowercase). The import explicitly targets `public.pfas_sites`.

The notebook prompts for URI/CA path at runtime and uses the same Psycopg binary/`verify-ca` connection workaround as the earlier importer. It fetches the PostGIS geometry type with `TypeInfo.fetch` and calls `register_shapely` on that connection before passing Shapely Points in parameterized tuples. `ST_SetSRID(..., 4326)` assigns SRID to already requested longitude/latitude coordinates; it does not reproject them.

The insert now uses `ON CONFLICT (objectid) DO UPDATE` for geometry and name, with commit/rollback handling. New IDs are inserted; matching IDs update; IDs missing from a later source download remain. Thus the table can retain formerly open sites after the source changes. No deletion/status-refresh policy or stable cross-export ID guarantee is established. Adding fields requires updating the live table schema, selected columns/tuple order, insert placeholders, and conflict assignments; editing CREATE TABLE alone does not alter the live table. The notebook has no explicit connection-close step. Its saved count cell precedes insertion in source order and was rerun after upload according to the chat, rather than being a dedicated final verification cell.

### Working backend and deployment

**Confirmed in code:** Django project `_crud` registers GeoDjango, Django REST Framework, REST Framework GIS, and `api`. `SamplingLocation` maps the existing `sampling_locations` table with `managed = False`, source `objectid` as primary key, `geom` as `PointField(srid=3071)`, and station name. Django does not manage creation or deletion of this table through model migrations.

`SamplingLocationViewSet` is read-only and orders records by `objectid`. The router exposes `/api/locations/` and `/api/locations/<objectid>/`. GeoJSON output uses EPSG:4326 while stored geometry remains EPSG:3071. The frontend loads this API; custom filtering, pagination, and a measurement endpoint remain absent.

The new unmanaged `PFASsites` model maps `pfas_sites`; its serializer reads EPSG:4326 `geom` directly and exposes `objectid`/`sitename`. `PFASsitesViewSet` orders by ID and exposes `/api/PFASsites/` plus detail routes. Its list has the same 60-second response-cache decorators as sampling locations; detail actions are not decorated. There is no transformation annotation or relationship to `SamplingLocation`. The suggested lowercase URL and explicit imports were not adopted: mixed-case `PFASsites` and wildcard imports remain in source. See [BACKEND_SETUP.md](BACKEND_SETUP.md).

**October 11 performance change:** At `4a6527e`, `javascript` now uses `annotate(geom_4326=Transform("geom", 4326))` in the viewset and `GeometryField(source="geom_4326", read_only=True)` in the serializer. The owner implemented and deployed this after timing the old serializer. This supersedes the October 6 deferral and uses the same approach previously preserved on `main`/`react`. Stored EPSG:3071 geometry is unchanged; `geom_4326` is a query result annotation, not a new database column.

**Owner-reported timing:** Before the change, repeated shell serialization took 12.893 and 12.689 seconds, versus database fetches of 3.350 and 0.381 seconds. Fetching plus transformation in PostGIS took 2.281 and 0.488 seconds. After the code change, local page requests took 2.5 and 2.0 seconds; separate JSON browser requests were reported at 10 and 19 milliseconds. After a Render rebuild, hosted loads were about two seconds with browser caching disabled. These are different test conditions, not a controlled benchmark. The very short local JSON timings have not been independently verified against the selected request, response status/body, or cache behavior. See [BACKEND_SETUP.md](BACKEND_SETUP.md#performance-measurements-and-next-experiment) for the complete record.

**Connection reuse implemented:** `DATABASES["default"]["CONN_MAX_AGE"]` reads `DB_CONN_MAX_AGE` with a default of 0; `CONN_HEALTH_CHECKS` is true. Both are database-level settings, outside `OPTIONS`. The Render exercise uses `DB_CONN_MAX_AGE=60`, while local development can retain the default. The owner measured connection opening alone at 2.510 and 1.421 seconds before the change, with an effective local lifetime of 0. Hosted timings after the connection-reuse deployment were 1.71, 1.57, 0.87, 0.90, and 1.24 seconds. Private/deployed effective settings were not independently inspected; these samples suggest improvement without proving its exact cause.

**Collection-response cache implemented:** The viewset overrides `list()` and delegates to `super().list(...)`, wrapped with `method_decorator(cache_page(60))` outside `method_decorator(vary_on_headers("Accept", "Cookie", "Authorization", "Origin"))`. It caches successful GET/HEAD collection responses for 60 seconds, keeping URL/query-string and header variants separate. Detail responses are not decorated. No custom `CACHES` setting or external cache service was added; Django's default local-memory cache is per process and clears on restart. Data updates do not explicitly invalidate the cache; an existing cached variant can serve older data until expiry. This response cache and the 60-second database connection lifetime are independent mechanisms.

**Latest owner-reported checks:** Local requests with browser caching disabled took 6, 5, and 2 milliseconds. After waiting beyond the cache lifetime, requests took 2.4 seconds, then 6 and 5 milliseconds, consistent with an expired entry being rebuilt and then reused. The owner reported committing/pushing and updating Render deployments on October 14. Hosted cache-hit/expiry timings have not yet been supplied, and the local figures are not hosted performance claims. Render wake-up remains separate from both optimizations. The next backend validation is the hosted JSON cache cycle after the service is awake.

Settings read local `.env` values through django-environ and use the PostGIS backend. Database options are `sslmode=verify-ca`, a configured CA file, `connect_timeout=10`, and `gssencmode=disable`. `DEBUG` defaults to false; allowed hosts include Render's supplied hostname. CorsMiddleware follows SecurityMiddleware and precedes WhiteNoise. The JavaScript branch allows both hosted frontend origins, local Vite ports, and `http://127.0.0.1:5500`. WhiteNoise serves collected assets using compressed manifest storage. `backend/db.sqlite3` remains tracked but is not the configured application database.

**Confirmed deployment configuration:** The Dockerfile uses `mambaorg/micromamba:2.9.0` and the conda-forge packages in `backend/environment.yml`, installing into the container's `base` environment. It specifies Linux GDAL/GEOS library paths. Startup runs `collectstatic`, then Gunicorn with one worker and two threads on `$PORT` (fallback 10000). It does not run migrations or import data. The earlier `requirements.txt` is tracked but unused by this build. The YAML pins direct packages, not the entire transitive environment; no lockfile exists.

**Owner-reported verification:** Local Django checks, spatial-library loading, expected location count, ORM retrieval, and the API worked. WhiteNoise was tested locally with `DEBUG=False`. After pushing deployment files, the owner reported the Render service running and confirmed HTTP 200/data from the hosted location list, expected browsable API styling, and retrieval of a known individual location.

Render Free is the recorded backend tier; Aiven remains the database host. The public API URL was supplied in the frontend chat and is linked above. Dashboard configuration, current service state, and billing were not inspected during this update. See [BACKEND_SETUP.md](BACKEND_SETUP.md) for configuration, commands, and repeatable smoke checks.

**Frontend implementation:** CDN MapLibre 5.14.0 starts with MapTiler's `dataviz-v4-dark`; Light and Warm use `dataviz-v4-light`. `theme.js` updates the root `data-theme` and fully replaces the map style with `diff:false`. `map.js` restores both overlays on `style.load`; their add functions read current CSS colors. The sidebar's later listeners reapply checkbox state. Rows are authored in HTML, with IDs matching map layer IDs, rather than dynamically generated from a registry. Both CSS previews share fill variables with the map but have no borders. Warm lacks PFAS-specific overrides, so those values fall back to the dark/root palette. Theme and visibility choices are not saved across reloads.

CSS Grid still provides a 240px sidebar and flexible map/data regions; there is no narrow-screen breakpoint or layout selector. The build/configuration workflow is unchanged: ignored local `config.js`, generated `dist/config.js`, no npm project on this branch. UI/table/chart choices, measurement schema/import, and feature-level interactions remain unresolved.

## Data, sources, and interpretation

The required local input is `data/raw/PFAS Sample Sites - Surface Water and Fish Tissue.csv`, exported from the DNR layer through QGIS and kept out of Git. Its columns are:

```text
OBJECTID, wkt_geom_EPSG_3071, PRIMARY_STATION_NAME, TYPE_SPECIFIC_CODE,
DATE_YEAR, SURFACE_WATER_FLAG, FISH_FLAG, PFOS_MEASURE, PFOA_MEASURE,
COMMENTS, PDF_PRIMARY_LINK, PDF_SECONDARY_LINK
```

The September 13 laptop inspection found 367 rows, 12 columns, and 996 slash-separated measurement parts, with at most four parts per measure. The September 16 database chat recorded 367 distinct OBJECTIDs, no missing values in the three location fields, and 367 well-formed two-dimensional WKT points. These describe the inspected export, not statewide completeness or permanent identifier stability. An earlier research count of 402 source features remains unexplained.

**CRS decision:** In Database Discussion, the owner explicitly identified the source WKT as EPSG:3071. The SQL and import now use SRID 3071 for this layer. `ST_GeomFromText(..., 3071)` assigns that SRID; it does not transform coordinates. The exact export settings and independent spatial validation remain undocumented. The implemented API transforms its output geometry to EPSG:4326; this does not select a frontend map library.

**Interpretation still open:** Units, water/fish media attribution for individual results, non-detect/less-than semantics, and a source-backed qualifier dictionary remain unfinished. Some specific comment meanings are encoded, but they should not be generalized without evidence. Preserve original measurement text, source IDs, and provenance; do not treat missing or non-detect values as zero. Geometry and station details now have a location table, while media flags and PDF links are still omitted from the cleaned result table and import.

Historical source references below are retained for continuity; availability, schemas, and terms were not rechecked in this update.

| Source | Role/status |
|---|---|
| [Wisconsin DNR PFAS viewer](https://dnrmaps.wi.gov/H5/?viewer=WI_PFAS) | Owner-selected product reference. |
| [DNR PFAS MapServer](https://dnrmaps.wi.gov/arcgis2/rest/services/EM_PFAS/EM_PFAS_MAPLAYERS_PUBLIC_EXT/MapServer) | Historical source inventory. |
| [Surface water/fish tissue layer 10](https://dnrmaps.wi.gov/arcgis2/rest/services/EM_PFAS/EM_PFAS_MAPLAYERS_PUBLIC_EXT/MapServer/10) | Source of the CSV workflows; no direct notebook retrieval for this layer. |
| [PFAS Sites (Open/Under Investigation), layer 1](https://dnrmaps.wi.gov/arcgis2/rest/services/EM_PFAS/EM_PFAS_MAPLAYERS_PUBLIC_EXT/MapServer/1) | Direct notebook retrieval and selected-field upsert implemented; 81 sites in saved October output. No scheduled refresh. |
| [Municipal sampling](https://dnrmaps.wi.gov/arcgis2/rest/services/DG_Groundwater_Retrieval_Network/DG_Municipal_System_PFAS_Sampling_Ext/MapServer/0) | Historically explored categorical summaries. |
| [Private-well study](https://services5.arcgis.com/Ul9AyFFeFTjf08DW/arcgis/rest/services/Private_Well_PFAS_Shallow_Groundwater_Study_Results/FeatureServer) | Historical alternative chemistry source; no tracked import. Preserve generalized location precision if used. |
| [Drinking Water System Portal](https://apps.dnr.wi.gov/dwsportalpub/), [EPA UCMR](https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule), [Water Quality Portal](https://www.waterqualitydata.us/webservices_documentation/) | Historical candidates, not implemented integrations. |

USGS hydrography remains an owner-proposed context layer; no specific dataset/version is chosen.

## Laptop environment and connection workflow

The new PFAS-sites workflow imports Requests, GeoPandas, Shapely adaptation through Psycopg, and supporting Python packages in the `wi-pfas` notebook kernel. Saved executions demonstrate their use during October work; this update did not recheck installed versions. The unchanged backend container manifest does not define this notebook environment, and no complete notebook manifest/lockfile was added.

**Checked locally on 2026-09-18:** The Miniforge environment `wi-pfas` has Python 3.12.14, pandas 3.0.5, NumPy 2.5.3, ipykernel 7.3.0, Psycopg 3.3.4, psycopg-binary 3.3.4, and Django 6.1 according to its interpreter/package metadata. Both notebooks name the `wi-pfas` kernel. These are observed versions, not a committed dependency specification.

**Later owner reports:** Node/npm were successfully installed following mamba instructions during the React lessons, and django-cors-headers was installed for browser access. Current container YAML pins django-cors-headers 4.9.0. October 11 did not recheck local package versions, ignored CSV availability, environment configuration, or private files. A fresh clone still needs its local data/configuration and appropriate runtime; it does not inherit them from Render or another computer.

The September 13 laptop review verified pandas/NumPy/ipykernel imports, VS Code Python/Jupyter extensions, and a matching kernel specification. Its ordinary shell resolved Python to a Windows app alias. The older desktop review instead observed Python 3.12.13/pandas 3.0.3 in `wi-pfas` and a separate default Python 3.14.2. Do not substitute either computer's default interpreter for the selected project environment. The backend now has `environment.yml` for its Linux container and an earlier unused `requirements.txt`. The container manifest is not a complete Windows/notebook environment recipe (it includes Gunicorn); cross-machine notebook setup and a full dependency lock remain open.

**Connection history:** SQLTools worked after the owner manually entered the Aiven CA certificate path. Previously tracked settings contained service-specific connection metadata and a local CA path. The Documentation task records their removal from published history; the frontend orientation at `a473324` confirmed `.vscode` is ignored and untracked. Personal connection settings remain local; their values are deliberately omitted here.

Python connection troubleshooting corrected `connection_timeout` to `connect_timeout`, added `gssencmode='disable'`, selected the installed Psycopg binary client, and finally changed `verify-full` to `verify-ca` while retaining the Aiven CA. The owner confirmed success after that last change. Switching to the binary client alone did not fix the certificate error. The chat records `verify-ca` as a workaround that omits hostname matching; it is not evidence that the underlying client issue was repaired. Revisit stronger verification when resolving that issue rather than treating it as permanently settled architecture.

For later work:

- Select the intended environment and notebook kernel separately. The notebook input-path logic supports the repository root or `notebooks/` as working directory.
- Keep raw data and credentials out of Git. The import notebook prompts for connection inputs; Django uses environment variables. Render receives the CA certificate as a secret file. Local `.env` settings and Windows library paths must not be copied wholesale to Render.
- Inspect an existing table before choosing to load data. Do not use Run All on the import notebook as a read-only validation step, and do not recreate a populated table to repeat an exercise.
- SQLTools, Python, and QGIS have separate connection settings. QGIS success does not automatically configure the other clients.
- Use [BACKEND_SETUP.md](BACKEND_SETUP.md) for local Django commands and Render configuration. Prefer mamba locally; micromamba supplies the container environment. An implemented automated test suite is still absent.

## Verification and remaining work

**November 6 review:** Compared `d65dbdb..1f0794f`, read the new notebook's source and selected saved outputs without executing it, and reviewed recent project chats. Documentation-only changes; no live requests, environment inspection, database operations, deployment, or application edits. Current source is stronger evidence than unfinished chat instructions; runtime/browser and newest-deployment validation remain unperformed here.

**October 14 review:** Inspected the clean working tree, recent backend commits, current viewset/serializer/connection settings, and the performance conversation. Updated documentation only; no live API/database request, environment-secret read, build, migration, deployment, or application edit was performed. Local timings and deployment completion are owner-reported.

**October 11 review:** Inspected current source and local branch differences, and reviewed the related frontend/branching/backend chat history. Updated documentation only. No environment imports, builds, notebook runs, live requests, database operations, or deployments were used as verification. See [CHAT_SYNTHESIS.md](CHAT_SYNTHESIS.md) for coverage limits. Documentation whitespace and local-link checks are the validation for this update.

**Historical execution baseline:** The September 13 desktop documentation review ran the older six-cell cleanup workflow in memory and reported 996 rows, no missing dates/year mismatches, and 98 missing numeric values (93 non-detect text cases, four no-sample cases, and one less-than case). That was a smoke check on an older revision, not scientific validation or a fresh run of current notebooks.

**September 20 review:** Inspected Git state, backend models/serializers/views/routes/settings, Dockerfile, dependency manifest, ignore rules, and existing documentation. Deployment and database success are attributed to the owner's reports in this conversation. No live API/database calls, notebook execution, migrations, or container build were performed for this documentation update. Earlier notebook and data findings remain dated evidence from the prior reviews.

Remaining limitations:

- The cleanup still hardcodes four split columns, uses three undocumented source-text substitutions, and coerces distinct nonnumeric cases to missing numeric values without extracting the less-than limit.
- Measurement row identity, foreign-key design, units/media/qualifier handling, and preservation of source links need decisions before analytical-result loading.
- The sampling-location load still has no repeat-import policy. The PFAS-sites import now upserts selected fields but retains missing-source rows, lacks pagination/raw-response archival, and has no dedicated final verification cell. Neither is a reusable command-line importer. DDL is manual SQL, not a migration system.
- The export path is still absolute. The processed CSV includes an unnamed index column; decide whether that belongs in the eventual import contract.
- Exact source export date, filters, QGIS recipe, data dictionary, a complete notebook environment manifest, and implemented automated tests remain absent.
- The tracked SQLite artifact is unused by the PostGIS settings and remains a cleanup item. Real `.env` values, personal SQLTools settings, and certificates must remain outside Git.
- Code licensing and data reuse/attribution terms remain unrecorded.

## Next milestones for owner selection

1. Finish reviewing the layer-symbol exercise: both previews exist, but outlines are absent. Check their appearance across all themes and verify hidden layers remain hidden after theme changes. Resolve Warm's PFAS palette deliberately; search remains deferred by the owner.
2. Design the analytical measurement table and its relationship to `sampling_locations.objectid`, including identity, units, qualifiers, missing-result semantics, and import rerun behavior.
3. Implement and validate measurement loading in manageable steps while preserving original text and provenance.
4. Record independent QGIS placement/SRID verification; the reported API checks do not establish spatial correctness or scientific validity.
5. Improve notebook portability, repeat-import handling, dependency locking, and meaningful automated checks as their scope becomes clear.
6. Verify PFAS-sites API count/detail/coordinates against the imported snapshot and record hosted deployment results. Check each collection's hosted cache-hit/expiry cycle separately; previous millisecond figures concern local sampling-location requests only.

Open questions include source interpretation/provenance, PFAS-site refresh/removal policy and future fields, notebook environment reproducibility, spatial validation, measurement schema, table/chart choices, search/selection, loading/error feedback, layout presets/mobile support, theme persistence, and whether/when to resume React. Query-time transformation, connection reuse, and both list caches are implemented. No live deployed commit, independent timings, or MapTiler account restrictions were verified here.
