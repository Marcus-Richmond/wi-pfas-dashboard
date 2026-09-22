# Project context

Updated 2026-09-20 against local `HEAD` `95cbd8a` and the backend/deployment conversation. The working tree was clean before this documentation update; `main` matched the locally recorded `origin/main` without a fetch. Earlier database and notebook evidence is retained from the September 18 review. See [CHAT_SYNTHESIS.md](CHAT_SYNTHESIS.md) for coverage limits.

Frontend orientation on 2026-09-20 checked `a473324` before frontend implementation. The September 21 milestone review checked a clean checkout at `41c6866`: React/TypeScript/Vite and a first page are now tracked. The owner confirmed successful Render Static Site deployment and a working public URL. The URL itself has not been supplied or independently visited. `.vscode` is ignored and untracked, superseding the earlier configuration-tracking concern.

**Evidence labels:** Confirmed means observed in repository files or directly checked during the stated review. Owner-reported means the owner described successful work in chat; it is not a fresh database verification. Historical means evidence from an earlier review. Proposed means suggested but not accepted or implemented. Unresolved means the available evidence does not settle it. This review did not execute either notebook, run SQL, or connect to Aiven.

## Purpose and learning objectives

Build a more capable and visually polished Wisconsin DNR PFAS explorer, with filtering, searching, highlighting, coordinated maps/tables/charts, and potentially hydrography context. The owner brings environmental science, geology, GIS, and consulting experience and wants to develop full-stack GIS programming skills.

The immediate audience is the owner and people reviewing the learning work; eventual public/professional user personas and release scope remain open. Learning objectives include reproducible environmental data cleaning, spatial database design, a backend API and interactive frontend, and professional Git, documentation, environment, and deployment practices.

The owner writes application code with manageable steps, explanations, syntax help, and debugging guidance unless direct implementation is requested. Prefer mamba for package installation when available; explain any pip exception. Every command instruction must identify the terminal, active environment, and working directory. File edits should explicitly name VS Code. In Database Discussion, the owner considered the first layer sufficiently cleaned to move on to database work. Remaining data-quality questions below do not reverse that chosen milestone.

The separate **Project Location Map** remains a predecessor project. Its deployed application is background experience, not evidence of a running PFAS dashboard.

### Frontend learning direction

The owner knows basic JavaScript and has studied React/TypeScript through Code with Mosh. Teach new concepts through web GIS tasks, using Python dictionaries/lists/functions and existing JavaScript patterns as bridges. Prefer guided exercises, syntax explanations, and small steps that the owner writes and verifies. Introduce types through station properties, component inputs, filter values, and selected location IDs; do not imply that TypeScript validates incoming API data at runtime.

The reviewed predecessor's `frontend_basic2/components/buttons/buttons2.js` uses nested objects, `Object.entries()`, asynchronous API calls, dynamic buttons, and shared filters to update counts and MapLibre styling/data. These are useful foundations. React lessons should distinguish application data/state from DOM element references, and replacement of state objects/arrays from the predecessor's `push`/`splice` mutations.

**Owner direction:** Continue with MapLibre; prefer React and TypeScript; manually create frontend source/configuration files where practical. npm dependency installation is compatible with that preference. Review Material UI and alternatives later, focusing on coordinated map/UI data, styling, accessibility, and relevant component licensing.

**Early hosting milestone:** The owner confirmed deploying the first page to Render Static Sites and checking the public page. Setup instructions used `frontend` as root, `npm ci && npm run build`, `dist` as publish directory, `NODE_VERSION=24.21.0`, and `SKIP_INSTALL_DEPS=true`; dashboard settings were not independently inspected. Next, add the map, connect the public API, and check browser access between the two origins. Current Django settings have no CORS configuration. Free hosting has usage allowances; a static frontend does not prevent the existing free backend from spinning down. See D16 and its provider references.

**Next teaching steps, not implemented:** Add a MapLibre component centered on Wisconsin, then fetch the existing location GeoJSON and coordinate map/list/search through shared state. Keep the MapLibre instance stable and teach setup/cleanup explicitly. Use shared style constants for UI and map colors. Direct MapLibre integration is proposed; the basemap provider and UI library remain open choices. Start with location fields actually exposed by the API; measurement filters require later data work.

## Current implementation and repository layout

**Confirmed:** The repository contains measurement-cleaning and location-import notebooks, SQL definitions, a Django/GeoDjango read-only location API with Docker deployment files, and a minimal React/TypeScript/Vite frontend. **Owner-reported:** The backend is running on Render and reads Aiven; the frontend is deployed separately on Render Static Sites. No map renderer, frontend API connection, or analytical-measurement API is implemented.

### First frontend page

Tracked `frontend/` contains `index.html`, `src/main.tsx`, `src/App.tsx`, `vite.config.ts`, `tsconfig.json`, `package.json`, and `package-lock.json`. The HTML loads `main.tsx`, which checks for the root element and renders `App`. The component returns a heading and paragraph. React/React DOM 19.3, TypeScript 7.0.2, Vite 8.3, and the React Vite plugin 6.1.1 are declared; the lockfile records resolved dependencies. Node 24.21.0 was observed in the active Miniforge environment. `node_modules` and `dist` are ignored.

The local production command `npm run build` passed TypeScript checking and Vite bundling during this conversation. An initial sandbox child-process restriction required an approved rerun; it was not an application defect. A `Main.tsx`/`main.tsx` casing mismatch was identified before deployment and the current tracked filename is lowercase. The owner reports both development and public-page checks working. No map or API behavior was tested because neither exists yet.

For frontend commands, use Miniforge Prompt with `wi-pfas` active and `frontend` as working directory: `npm run dev` serves development, `npm run build` checks types and generates `dist`, and `npm run preview` previews that output locally. mamba supplies Node/npm; npm manages JavaScript dependencies. The immediate next exercise is installing MapLibre and adding its map component.

```text
AGENTS.md
README.md
.gitignore
docs/
  PROJECT_CONTEXT.md
  DECISIONS.md
  CHAT_SYNTHESIS.md
notebooks/
  Surface Water and Fish Tissue.ipynb
  database import locations.ipynb
sql/
  create/postgis.sql
  create/locations_table.sql
  test.sql
WI-PFAS Aiven.session.sql
backend/                         # tracked Django API and Docker deployment
  _crud/                         # settings and project URLs
  api/                           # location model, serializer, viewset, router
  environment.yml                # container dependency specification
  Dockerfile
  .dockerignore
  requirements.txt               # earlier pip list; Docker does not use it
data/raw/                        # ignored local CSV input
data/processed/                  # ignored local CSV outputs
```

The laptop does not have the desktop's previously documented `z/` scratch directory or `001.code-workspace`. Those were local desktop artifacts, not clone prerequisites.

Recent commits establish the progression: `7dc5a22` updated cleanup code, `0f4d1bd` added project documentation, `077adbe` added database setup, `fe7bb3a` began database upload work, and `f878cff` recorded the location upload workflow. The earlier documentation's `d6cba73` baseline is historical. The current backend/deployment inspection uses `95cbd8a`.

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

### Working backend and deployment

**Confirmed in code:** Django project `_crud` registers GeoDjango, Django REST Framework, REST Framework GIS, and `api`. `SamplingLocation` maps the existing `sampling_locations` table with `managed = False`, source `objectid` as primary key, `geom` as `PointField(srid=3071)`, and station name. Django does not manage creation or deletion of this table through model migrations.

`SamplingLocationViewSet` is read-only and orders records by `objectid`. The router exposes `/api/locations/` and `/api/locations/<objectid>/`. `GeoFeatureModelSerializer` returns GeoJSON, transforming geometry to EPSG:4326 for output while the stored geometry remains EPSG:3071. No custom filtering, pagination, measurement endpoint, or frontend integration is configured.

Settings read local `.env` values through django-environ and use the PostGIS backend. Database options are `sslmode=verify-ca`, a configured CA file, `connect_timeout=10`, and `gssencmode=disable`. `DEBUG` defaults to false; allowed hosts include Render's supplied hostname. WhiteNoise follows SecurityMiddleware and serves collected assets using compressed manifest storage. `backend/db.sqlite3` remains tracked but is not the configured application database.

**Confirmed deployment configuration:** The Dockerfile uses `mambaorg/micromamba:2.9.0` and the conda-forge packages in `backend/environment.yml`, installing into the container's `base` environment. It specifies Linux GDAL/GEOS library paths. Startup runs `collectstatic`, then Gunicorn with one worker and two threads on `$PORT` (fallback 10000). It does not run migrations or import data. The earlier `requirements.txt` is tracked but unused by this build. The YAML pins direct packages, not the entire transitive environment; no lockfile exists.

**Owner-reported verification:** Local Django checks, spatial-library loading, expected location count, ORM retrieval, and the API worked. WhiteNoise was tested locally with `DEBUG=False`. After pushing deployment files, the owner reported the Render service running and confirmed HTTP 200/data from the hosted location list, expected browsable API styling, and retrieval of a known individual location.

Render Free is the selected backend hosting tier; Aiven remains the database host. The Render dashboard configuration and public service URL were not independently inspected during this documentation update. The exact public URL has not been supplied in this conversation. See [BACKEND_SETUP.md](BACKEND_SETUP.md) for configuration, commands, and repeatable smoke checks.

**Remaining architecture:** React/TypeScript/Vite and the first frontend page are implemented. MapLibre is the owner's map choice but is not installed at the September 21 inspection. UI/table/chart libraries, basemap choice, and map/API integration remain open. The measurement schema/import and the earlier multi-model measurement design remain unresolved.

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
| [Surface water/fish tissue layer 10](https://dnrmaps.wi.gov/arcgis2/rest/services/EM_PFAS/EM_PFAS_MAPLAYERS_PUBLIC_EXT/MapServer/10) | Source of the current CSV workflows; no live service ingestion is implemented. |
| [Municipal sampling](https://dnrmaps.wi.gov/arcgis2/rest/services/DG_Groundwater_Retrieval_Network/DG_Municipal_System_PFAS_Sampling_Ext/MapServer/0) | Historically explored categorical summaries. |
| [Private-well study](https://services5.arcgis.com/Ul9AyFFeFTjf08DW/arcgis/rest/services/Private_Well_PFAS_Shallow_Groundwater_Study_Results/FeatureServer) | Historical alternative chemistry source; no tracked import. Preserve generalized location precision if used. |
| [Drinking Water System Portal](https://apps.dnr.wi.gov/dwsportalpub/), [EPA UCMR](https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule), [Water Quality Portal](https://www.waterqualitydata.us/webservices_documentation/) | Historical candidates, not implemented integrations. |

USGS hydrography remains an owner-proposed context layer; no specific dataset/version is chosen.

## Laptop environment and connection workflow

**Checked locally on 2026-09-18:** The Miniforge environment `wi-pfas` has Python 3.12.14, pandas 3.0.5, NumPy 2.5.3, ipykernel 7.3.0, Psycopg 3.3.4, psycopg-binary 3.3.4, and Django 6.1 according to its interpreter/package metadata. Both notebooks name the `wi-pfas` kernel. These are observed versions, not a committed dependency specification.

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

**Historical execution baseline:** The September 13 desktop documentation review ran the older six-cell cleanup workflow in memory and reported 996 rows, no missing dates/year mismatches, and 98 missing numeric values (93 non-detect text cases, four no-sample cases, and one less-than case). That was a smoke check on an older revision, not scientific validation or a fresh run of current notebooks.

**September 20 review:** Inspected Git state, backend models/serializers/views/routes/settings, Dockerfile, dependency manifest, ignore rules, and existing documentation. Deployment and database success are attributed to the owner's reports in this conversation. No live API/database calls, notebook execution, migrations, or container build were performed for this documentation update. Earlier notebook and data findings remain dated evidence from the prior reviews.

Remaining limitations:

- The cleanup still hardcodes four split columns, uses three undocumented source-text substitutions, and coerces distinct nonnumeric cases to missing numeric values without extracting the less-than limit.
- Measurement row identity, foreign-key design, units/media/qualifier handling, and preservation of source links need decisions before analytical-result loading.
- The database load has no repeat-import policy, post-import verification cell, or reusable command-line import script. DDL is manual SQL, not a migration system.
- The export path is still absolute. The processed CSV includes an unnamed index column; decide whether that belongs in the eventual import contract.
- Exact source export date, filters, QGIS recipe, data dictionary, a complete notebook environment manifest, and implemented automated tests remain absent.
- The tracked SQLite artifact is unused by the PostGIS settings and remains a cleanup item. Real `.env` values, personal SQLTools settings, and certificates must remain outside Git.
- Code licensing and data reuse/attribution terms remain unrecorded.

## Next milestones for owner selection

1. Begin the owner-selected frontend learning phase: MapLibre with the preferred React/TypeScript direction. The proposed first integrated milestone is a station map/list with search and shared selection using the existing location API; establish the minimal tooling and components in manageable steps first.
2. Design the analytical measurement table and its relationship to `sampling_locations.objectid`, including identity, units, qualifiers, missing-result semantics, and import rerun behavior.
3. Implement and validate measurement loading in manageable steps while preserving original text and provenance.
4. Record independent QGIS placement/SRID verification; the reported API checks do not establish spatial correctness or scientific validity.
5. Improve notebook portability, repeat-import handling, dependency locking, and meaningful automated checks as their scope becomes clear.

Open questions include source interpretation and export provenance, cross-machine notebook setup, QGIS spatial validation, measurement schema, and frontend tooling/UI/integration details. Django/DRF, GeoJSON output in EPSG:4326, Aiven database hosting, and Render Docker backend hosting are established. MapLibre and the React/TypeScript learning direction are recorded above without implying frontend implementation.
