# Chat synthesis and review coverage

Original review: 2026-09-13 for the project then labeled **001**. Updated 2026-09-18 with **Database Discussion**, the earlier laptop orientation in **Project Documentation**, and the current checkout at `f878cff` plus its pre-existing untracked `backend/`. Updated again 2026-09-20 against `95cbd8a` and the backend/deployment conversation available in this task. Chat content is historical evidence; current code and explicit owner statements take precedence over old assistant suggestions.

## October 14 follow-up: connection reuse and response caching

Coverage: the continuation of this Backend conversation through the owner's report of committed/pushed changes and updated Render deployments. Reconciled against clean local `javascript` at `d1f3106`, matching its local remote-tracking ref without a fetch. Commit `96ac09d` adds connection settings; `d1f3106` adds list-response caching. No new inventory/review of other tasks or fresh runtime, API, database, or Render dashboard checks were performed for this documentation update.

- The owner measured local connection establishment alone at 2.510 and 1.421 seconds and reported effective `CONN_MAX_AGE=0`.
- The owner added environment-controlled connection lifetime and health checks. Initially the settings were placed at the outer `DATABASES` level, then duplicated there after the correct assignments were added, causing an integer `setdefault` error. Removing the misplaced entries resolved it; the owner reported Django checks passing. Source now contains the two settings inside `DATABASES["default"]`.
- Instructions set `DB_CONN_MAX_AGE=60` on Render while keeping default 0 locally. The owner subsequently reported hosted timings of 1.71, 1.57, 0.87, 0.90, and 1.24 seconds. This small sample suggests improvement, but is not an isolated measurement of connection reuse or an independent audit of the deployed variable.
- The owner overrode the viewset's `list()` method to delegate to the inherited method, then applied `cache_page(60)` and `vary_on_headers("Accept", "Cookie", "Authorization", "Origin")` through `method_decorator`. That code is confirmed in the cache commit. No detail-action cache, custom `CACHES` configuration, or external cache dependency was added.
- Local requests with browser caching disabled were reported at 6, 5, and 2 ms. After the instructed wait beyond expiry, the owner reported 2.4 s, then 6 and 5 ms. These are consistent with cache expiry/rebuild followed by hits; the actual browser traces, feature counts, and status/body were not independently inspected in this update.
- On October 14 the owner reported committing/pushing the changes and updating Render deployments, then requested documentation. No hosted cache-hit/expiry timings have yet been supplied. The earlier hosted connection-reuse figures and local cache results must not be presented as a hosted post-cache benchmark.

Current behavior is query-time transformation plus bounded connection reuse and a 60-second collection-response cache. Cached responses can remain stale until expiry; process restart clears the default local-memory cache. These changes do not eliminate Render wake-up. The remaining backend validation is the hosted JSON cache cycle, with the service awake and the actual data response checked. Full configuration and measurement notes are in [BACKEND_SETUP.md](BACKEND_SETUP.md#performance-measurements-and-next-experiment).

The current request authorizes documentation edits, not a commit, push, or deployment by the assistant. Earlier dated sections below retain their historical coverage; their statements that caching/reuse were only proposals are superseded by this follow-up.

## October 11 follow-up: backend performance at `4a6527e`

Coverage: the subsequent performance exchange in this Backend task and current tracked viewset/serializer/settings. The working tree was clean before these documentation edits, on `javascript` matching its local remote-tracking ref. No fresh inventory of other tasks, database/API request, or Render dashboard inspection was performed. Earlier same-day branch findings below are historical where this follow-up supersedes them.

- The owner explicitly reopened the deferred coordinate-performance work. Render was waking up, but local requests also took over 14 seconds, establishing a separate local delay.
- Owner-run shell timings: fetch 3.350 s then 0.381 s; old serialization 12.893 s then 12.689 s. Serialization includes coordinate conversion and GeoJSON construction, so those measurements did not isolate transformation alone.
- An idle shell query encountered a closed connection. After resetting it, owner-run annotated PostGIS fetch/transform timings were 2.281 s and 0.488 s. First-versus-repeat timing is consistent with connection/setup overhead, not a controlled measurement of that overhead.
- The owner changed `views.py` to annotate `geom_4326` with PostGIS `Transform` and changed `serializers.py` to read the annotation. The query result is calculated, not a second stored geometry column. These changes are confirmed at `4a6527e`.
- Local browser requests then took 2.5 s and 2.0 s. Requests tested with `?format=json` were reported at 10 ms and 19 ms; original traces, HTTP status/body, and cache behavior were not inspected. These figures do not prove that HTML rendering alone accounted for the difference or establish hosted performance.
- After rebuilding Render, the owner reported hosted locations loading in about two seconds with browser caching disabled. Cold startup, local timing, and hosted request duration remain distinct conditions. Browser cache disabling would not disable an application cache if one were added later.
- The owner requested documentation updates, then continued coaching toward near-instant loading. The next proposed exercise separates database connection establishment, the current annotated query, and serialization. Connection reuse and response caching are not yet implemented. No schema change was made.

The earlier October 6 deferral is superseded. Current source and owner-reported improvement support keeping query-time transformation; remaining latency is unisolated. See [BACKEND_SETUP.md](BACKEND_SETUP.md#performance-measurements-and-next-experiment) for the timing record and diagnostic commands. This documentation work does not commit, push, deploy, or modify application code.

## October 11 update: JavaScript frontend, branches, and deployment

Reconciled available related chats with clean `javascript` at `05b645d` and local `main`/`react` at `4810393`. Each matched its locally recorded remote-tracking ref; no fetch was performed. Reviewed tracked frontend files, backend settings/dependencies/serializers/viewsets, ignore rules, branch differences, Git history, and existing documentation. Notebooks and SQL have no changes since `caf8414`; their earlier findings remain historical.

| Current chat title | Task ID | Coverage this update |
|---|---|---|
| Frontend - js | `01a0d62d-86cc-7582-8a86-3ad31594e3e9` | Retrieved all 41 turns over 5 pages, reaching the end; detailed review of recent styling/build/deployment turns and targeted excerpts of earlier layout/setup discussion. |
| Frontend - react | `01a0c0e1-b077-7bc3-8be1-1b4d7b7ba8bb` | Retrieved all 41 turns over 5 pages, reaching the end; reviewed owner reports and relevant response text/excerpts for manual setup, hosting, MapLibre, CORS, and coordinate-performance work. |
| Branching | `01a0d11f-67d5-7372-bf63-76dbafef8f27` | All 3 returned turns, including the explicit older baseline choice and confirmation. |
| Backend | `01a0b763-b036-7513-a9b0-77417eb61d69` | Retrieved all 32 turns over 4 pages; latest deployment/documentation turns reviewed in detail and older setup excerpts checked against the existing synthesis. |

This is a targeted documentation review, not a complete replay of every assistant lesson, historical tool result, screenshot, or attachment. Some long response excerpts were bounded. The available chat inventory reported no unavailable sources; other computers' unlisted/deleted chats were not audited. Database and Data had no newer activity in that inventory and were not reread; their established history remains below. No unrelated personal chats were reviewed.

### Recovered progression and owner choices

- **React implementation:** The owner installed Node/npm through the mamba learning workflow and manually assembled React/TypeScript/Vite files. Local build/preview and hosted map success were reported. The public site was `https://wi-pfas-frontend.onrender.com/`; MapView adds location GeoJSON and removes the MapLibre instance during effect cleanup. This supersedes September's “Vite proposed/no frontend” status.
- **CORS and API:** django-cors-headers was added to Django and its deployment manifest. The owner reported browser HTTP 200, 367 features, and a longitude/latitude coordinate pair. These are reported checks, not comprehensive spatial validation. The public API address was supplied as `https://wi-pfas-api.onrender.com/api/`.
- **Performance:** The React chat recorded slow collection responses, including an owner-reported 48.48-second waiting time. The owner chose query-time PostGIS transformation; that code exists on `main`/`react`. No subsequent measurement establishes the performance improvement or conclusively isolates the original cause.
- **Branching:** The owner found React/TypeScript too much at once and explicitly chose plain JavaScript from `caf8414`, before React setup, while preserving the React work. Returning to React remains undecided. Because branches cover all files, this also omitted the later backend CORS/transformation changes initially.
- **JavaScript implementation:** The owner created a separate Render Static Site at `https://wi-pfas-dashboard.onrender.com/`, added a CSS Grid desktop layout, MapLibre map, MapTiler basemap, and a separate locations module. Current source uses one matching MapLibre CDN JS/CSS version, 5.14.0.
- **October 6 deployment:** Local CORS was restored and the JavaScript hosted origin added. The owner wrote `build.mjs` to copy files and generate configuration from hosting variables. A failure running `build.mjs` alone was corrected to `node build.mjs`. The owner then requested switching the backend service to `javascript` and reported the hosted location layer working. Actual dashboard settings/deployed commits were not independently checked in this update.
- **Historical October 6 deferral:** After hosted success, the owner asked to leave coordinate handling aside and continue frontend work. At the earlier `05b645d` review, JavaScript still used serializer transformation. The later October 11 backend follow-up above supersedes that state with an owner-authored optimization.
- **Visual direction:** The owner wants styling inspired by shadcn/ui, mapcn, and glasscn while learning plain CSS. Tailwind was set aside; Bootstrap considered; Tabulator/Chart.js acceptable candidates if customizable. No UI/table/chart framework was selected and installed.
- **October 10 coaching and CSS:** The owner requested fewer changes at once, separate CSS files, and hints before complete code. Current source has theme/base/layout/components/typography files, reusable panels, shared spacing/headings, shrinkable grid tracks, and panel overflow. The latest proposed exercise is a labeled sidebar search field. It is not yet in HTML; filtering, table/chart content, loading/error UI, and narrow-screen rearrangement are also absent.

### Reconciliation and limits

The current branch has a functioning map foundation, not an unstarted frontend. Conversely, a `Data` panel heading is not an implemented table, and desktop flexing is not a mobile breakpoint. At that earlier `05b645d` review, React/Vite source and query-time transformation were on the preserved branches. The later backend follow-up adds query-time transformation to JavaScript; React/Vite remain branch-specific. Earlier claims that the public API URL was unknown, Render Static Sites were only proposed, and CORS absent are superseded by this update; dated sections below remain historical records.

No application files, private configuration, credentials, or key values were changed or copied into documentation. No runtime/environment recheck, build, notebook execution, SQL, migration, live service request, deployment, or Git history mutation was performed. Published `.vscode` history cleanup remains the previously recorded completed work; it was not re-audited. Provider pricing/limits, account restrictions, current uptime, and auto-deploy behavior were not freshly verified. Local data and environment versions below remain dated observations.

## September 20 update: frontend orientation

The current frontend request was reconciled with the clean checkout at `a473324`, current backend models/serialization/routes, README, context/decision/setup records, and ignore rules. No API/database calls, imports, migrations, or application changes were made. The following available task messages were reviewed; this was a targeted review, not a full replay of all historical tool outputs or attachments:

| Current task title | Task ID | Coverage |
|---|---|---|
| Backend | `01a0b763-b036-7513-a9b0-77417eb61d69` | Latest 8 turns: deployment preparation, owner-reported success, documentation update, and suggested next milestone. Older history remains represented by the earlier synthesis. |
| Documentation | `01a09cb8-41f2-7fc3-9e2f-b7e5e72cffa2` | Latest 6 turns: database documentation and subsequent VS Code settings/history cleanup. |
| Database | `01a09cbd-c941-7b51-84f9-d7b4c1d557b6` | Latest 6 turns: connection workaround, insert workflow, owner-reported upload and QGIS connection success. |
| Data | `01a0975c-8d05-7b41-88f9-310bc00aa9bc` | The one returned turn, including the owner's explicit preference for guided programming help. |

The public [WebGIS_ProjectLocationMap repository](https://github.com/Marcus-Richmond/WebGIS_ProjectLocationMap) was read through GitHub's API and raw files. Reviewed `frontend_basic2/index.html`, `package.json`, `components/map.js`, both button scripts, three layer scripts, and CSS. Its active HTML loads `buttons2.js`; that script constructs attribute filters from nested objects and `Object.entries()`, fetches filtered data/counts, and updates DOM buttons and MapLibre source/paint properties. This is evidence of prior coding patterns, not a fresh execution or backend audit of the predecessor.

New owner direction: work on the frontend, keep MapLibre, prefer React/TypeScript, and connect lessons to web GIS and existing JavaScript/Python knowledge. The owner prefers to create files manually where useful and wants to compare Material UI and alternatives later. A minimal manual Vite setup and a station map/list/search milestone are assistant proposals; no frontend dependencies or source files were created. See D15 in [DECISIONS.md](DECISIONS.md).

In a follow-up, the owner requested free frontend hosting early so progress is live and deployment is addressed during setup. Render Static Sites was recommended based on the existing backend host and current provider/Vite documentation. The first small page should be deployed before completing map and API integration. Provider selection and configuration remain pending; see D16.

One earlier status was stale: `.vscode` is currently ignored/untracked, and the Documentation task reports completing the published-history cleanup. The current checkout was checked; remote history was not re-audited in this orientation. Earlier entries below about tracked settings are historical.

## September 20 update: backend and deployment

Coverage: the backend/deployment conversation available in this task, including the owner's setup reports and the Render configuration instructions, reconciled with tracked backend source at `95cbd8a`. This is not a new inventory or full replay of other tasks. The original error attachment and every historical tool result were not reread; missing troubleshooting details are not reconstructed as fact. Earlier coverage records below remain historical.

Recovered decisions and progress:

- The owner chose a Django REST approach similar to the separate WebGIS Project Location Map predecessor. This project now has its own implemented API.
- Windows GDAL discovery initially failed. Configuration of the library path was followed by successful loading through `manage.py shell`; the owner supplied GDAL `(3, 13, 3)` and GEOS `3.14.1-CAPI-1.20.5` output.
- PostGIS settings use django-environ, a database URL, and nested connection options. The owner reported successful checks, the expected location count, ORM retrieval, and API requests.
- The implemented unmanaged location model maps the existing table. The GeoJSON serializer transforms output to EPSG:4326, while storage remains EPSG:3071. Read-only list/detail routes are present.
- The owner explicitly requested terminal/environment/directory instructions and reiterated a preference for mamba over pip where possible. These are ongoing coaching preferences.
- The owner selected Render Free for the backend, retaining Aiven for PostgreSQL/PostGIS. WhiteNoise was installed and tested locally with debug disabled.
- A pip requirements list was created earlier. The deployment approach then adopted a conda-forge `environment.yml` and micromamba Docker image. The Dockerfile uses the YAML; the requirements file remains tracked but unused by that build.
- The owner reported pushing the deployment changes, bringing the Render backend online, and passing the hosted list HTTP 200/data, browsable styling, and known-record detail checks.
- The current request authorizes documentation updates only and explicitly withholds a GitHub push. No commit or push is part of this update.

Evidence limits: current source establishes implementation; hosted operation and database results are owner-reported. No Render dashboard, fresh API/database request, notebook execution, or container build was performed for this documentation update. The public service URL was not supplied. Deployment instructions are preserved in [BACKEND_SETUP.md](BACKEND_SETUP.md), with no real credentials or machine-specific certificate paths.

## September 18 update: inventory and coverage

| Chat title | Task ID | Review coverage |
|---|---|---|
| Database Discussion | `01a09cbd-c941-7b51-84f9-d7b4c1d557b6` | All 29 returned turns across 3 pages, covering September 13–17; no older page remained. User messages and assistant responses reviewed. |
| Project Documentation | `01a09cb8-41f2-7fc3-9e2f-b7e5e72cffa2` | This task's September 13 laptop orientation and September 18 documentation request/current file inspection; not an additional full-history tool audit. |

The database discussion was read through the available local task history. Original screenshots/attachments and historical tool outputs were not comprehensively replayed. Database success is attributed to owner reports, checked against saved SQL/notebook source where possible; no live database query, notebook run, or QGIS inspection was performed for this update. Package metadata was checked locally without loading data or making a database connection.

The current inventory reported no unavailable hosts/sources, but this is not a cross-computer archive audit. **Align flags with comments** was visible but not reread for this update. Earlier desktop chats below remain repository-recorded history and were not newly accessed. No unrelated personal conversations were reviewed. Connection URIs, service/account details, certificate paths, and secrets are omitted from this synthesis.

## Original September 13 inventory and coverage

The app inventory returned four non-archived Codex tasks associated with this project, including this task. All were reviewed. The archived-task listing reached its end and returned no tasks associated with this project; its two entries belonged to the separate predecessor repository.

| Chat title | Task ID | Review coverage |
|---|---|---|
| Plan GIS dashboard project | `019efc8e-2533-7001-ad9d-b24f74300ca1` | All 5 returned turns; no older page remained. |
| Data Clean Up | `019f3f16-6435-7263-8967-c9260b78c0dc` | All 14 returned turns across 2 pages; no older page remained. |
| Set up GitHub repo on laptop | `01a095ed-2d57-7be2-bed0-1a96e92bad31` | The 1 returned turn; no older page remained. |
| Sync Codex project context | `01a09c97-b8b1-7313-a45b-21f411a80a77` | Both returned turns; related projectless conversation. |
| Build Project Documentation | `01a09ca4-00ea-7682-b126-8ab59c3c417b` | Current task's request and work through this review; still active at inventory time. |

The original review's task was initially listed as **Document web GIS project context** and later read as **Build Project Documentation** under the same ID. It is distinct from the laptop's **Project Documentation** task listed above.

Review covered user messages and assistant responses, including the earlier planning discussion and both cleanup-history pages. Prior command/tool outputs and original attachments were not comprehensively replayed. Existing claims were checked against the current repository, local CSV schema/aggregate counts, notebook metadata, and an in-memory execution where possible. This is a synthesis, not a transcript archive or complete forensic audit.

**Access limits:** The inventory reported no unavailable hosts or sources, and every identified in-scope task could be read. Only the currently exposed local host was available. Chats stored only on the other computer, deleted chats, or tasks omitted from that inventory cannot be enumerated or certified absent. No specific inaccessible in-scope title was identified.

**Excluded by scope:** Tasks attached to **Project Location Map**, its archived tasks, the projectless **Locate Project Location Map context**, and unrelated personal ChatGPT conversations. The predecessor is a separate project; its implementation should not be imported into this project's facts.

## Plan GIS dashboard project

Recovered owner intentions:

- Continue learning full-stack GIS development through a more complex environmental dashboard.
- Build on prior PostgreSQL/Django/JavaScript experience, with interest in React and TypeScript.
- Personally write code with assistant coaching; practice professional Git, secret handling, and deployment preparation early.
- Narrow initial contaminant/geographic exploration to Wisconsin PFAS, then favor a redesigned DNR viewer with better visuals, filtering, search, highlighting, and possible hydrography context.

Recovered research and proposals:

- DNR PFAS, municipal sampling, private-well chemistry, Drinking Water System Portal, EPA UCMR, and Water Quality Portal were explored.
- Prior research distinguished categorical municipal summaries from detailed analyte results; the portal's complete statewide bulk-download path was not established.
- An assistant preferred the private-well study for detailed chemistry, but later owner messages focused on the broader viewer. That recommendation did not become the implemented primary dataset.
- Proposed PostGIS/Django/REST/React/TypeScript architecture, map/table/chart interactions, several map/chart library options, and a small integrated web milestone. Leaflet was recommended for an initial version but never explicitly selected by the owner.
- Historical source record counts are snapshots/research claims, not current service guarantees. Specific service links are consolidated in PROJECT_CONTEXT.

September 13 reconciliation: README confirmed Wisconsin PFAS and the surface-water/fish-tissue dataset; no web stack was present at that review. Reported deployment on Render and the working PostgreSQL/Django app referred to the predecessor. Database Discussion below records this project's later Aiven work.

## Data Clean Up

Recovered progression:

- Established continuity with the planning conversation.
- Began with the Surface Water and Fish Tissue service in QGIS, an Excel export, and Excel unpivoting.
- Identified compound PFOS/PFOA strings containing sampling dates, analytical results, asterisks, and slash-separated events.
- Chose to explore Python cleaning; discussed preserving original text, constructing full dates, and separating result qualifiers.
- Discussed Miniforge/mamba, named versus repository-local environments, and Python 3.12. The owner reported setting up an environment, without recording a reproducible manifest.
- Moved shareable notebook work out of scratch storage; chose to ignore raw data and defer frontend/backend scaffolding.
- Initialized Git, improved README, published initial work according to the chat, and asked to rename `master` to `main`.

Useful cautions from the history: malformed date strings, non-detect text, separate meanings for single/double asterisks, and possible differences in units/media. Earlier suggestions that a single asterisk might mean an estimated value were examples, not an authoritative definition.

September 13 desktop reconciliation: canonical notebook, relative input path, README, ignore rules, and local `main` were present. The suggested script, environment.yml, .env.example, application directories, and normalized schema were not implemented. A desktop scratch notebook existed but was not canonical. As of September 18, later laptop work had added a location schema/import and an untracked backend starter. September 20 supersedes that backend/environment status; a reusable import script remains unimplemented.

## Set up GitHub repo on laptop

The owner requested help using a second computer and asked for prior project context to be reviewed. The response described cloning, selecting a Python/Jupyter environment in VS Code, separately copying/recreating ignored raw data, and coordinating commits across machines.

Reconciliation at the original review: the suggested laptop pip/`.venv` setup differed from earlier mamba advice; that chat did not confirm completion or versions. The later Project Documentation laptop inspection did confirm a working Miniforge `wi-pfas` environment, as summarized below.

## Sync Codex project context

The owner wanted project knowledge available on both computers. After comparing a shared reference chat, remote access/handoff, and repository documentation, the owner chose the documentation approach and deferred remote access. The second turn provided the prompt used for this task.

This establishes the reason for durable files. General product-capability claims in that conversation were not adopted as repository facts or independently audited here.

## Build Project Documentation

That original request authorized inspection and four documentation files, required a chat coverage record and evidence-based reconciliation, prohibited unrelated application/configuration/dependency edits, and withheld authorization to commit or push. These limits describe the original documentation task, not permanent restrictions on future owner-requested implementation.

## Project Documentation

On September 13, the owner requested a read-only laptop orientation and reiterated the preference to personally write application code. All five requested documents were present. The inspection found a clean `main` at `0f4d1bd`, the required 367-row raw CSV, two 996-row processed CSVs, and a usable Miniforge `wi-pfas` environment with Python 3.12.14/pandas 3.0.5, NumPy, ipykernel, and VS Code notebook support.

That review already found documentation lag: the column-removal bug was fixed, flags/comments had been revised, and a CSV export existed. The export was then aimed outside the ignored processed directory. Current code targets the ignored `data/processed/` directory, but still uses an absolute path. The September 18 request authorizes updating project documentation from Database Discussion; it does not authorize database writes or changes to the new backend.

## Database Discussion

Recovered owner decisions and progress:

- The owner considered the first cleaned layer ready for the next learning phase and chose database work next, with PostgreSQL/PostGIS as the intended direction.
- After discussing local versus hosted development and several hosting providers, the owner reported starting an Aiven PostgreSQL database. Prior pricing/free-tier comparisons were dated research; this update does not assert current plan limits or the owner's subscription details.
- The owner installed SQLTools in VS Code and got the connection working after manually supplying the CA certificate path. The owner then enabled PostGIS and confirmed creation of the location table.
- The owner explicitly redirected the initial import from measurements to a minimal sampling-location layer: OBJECTID, WKT geometry, and station name. The owner identified the source CRS as EPSG:3071 and planned to link measurements through OBJECTID later.
- The chat's CSV review found 367 unique OBJECTIDs, no missing selected fields, and well-formed two-dimensional point WKT. The owner wrote `sampling_locations` with an integer primary key, `geometry(Point, 3071)`, and a required station name.
- A standalone Python script was suggested, but the owner created `notebooks/database import locations.ipynb`. This separate notebook reads the three raw columns, obtains runtime connection inputs, converts records to tuples, and inserts through Psycopg in a transaction.
- Python troubleshooting corrected `connection_timeout` to `connect_timeout`, disabled GSSAPI encryption negotiation for the configured SSL connection, and selected Psycopg's binary implementation. The certificate error persisted with the binary client; success followed changing `verify-full` to `verify-ca` with the CA certificate retained. The reduced hostname verification was explicitly discussed as a workaround.
- On September 17, the owner confirmed tuple conversion and successful record uploading. The owner subsequently reported fixing the QGIS connection after mistakenly entering Aiven's full Service URI in QGIS's Service field.

September 18 file reconciliation (historical; see September 20 update above):

- Tracked SQL and import source match the minimal location workflow, with parameterized inserts into `public.sampling_locations` and `ST_GeomFromText(..., 3071)`; this is an SRID assignment, not a coordinate transformation.
- The expected load is 367 locations. The saved count output is still `(0,)` before insertion; there is no saved post-load count. The owner reported success, but neither this update nor a saved result independently confirms the hosted count.
- QGIS feature count, CRS display, and basemap placement checks were recommended after connection success; the owner did not report completing them. Successful connection should not be recorded as completed spatial validation.
- No analytical-measurement table/import or location-to-measurement foreign key is implemented. Final measurement row identity and rerun behavior remain open. Repeating the existing location insert will encounter primary-key conflicts.
- The current cleanup notebook has seven populated cells and no saved outputs. Its export exists and its obsolete column-removal bug is fixed; numeric/qualifier/provenance limitations remain.
- Current local package metadata includes Psycopg/psycopg-binary 3.3.4 and Django 6.1. An untracked Django `_crud`/`api` starter exists with default SQLite settings and placeholder application files. This starter was not discussed in the reviewed database turns; its files establish scaffolding only, not a completed API or an approved integration design.
- Tracked SQLTools settings contain service/machine-specific metadata and a CA path, despite the earlier recommendation to keep connection configuration personal. The connection asks for a password and has no password property. Values are not reproduced here; this documentation update leaves the configuration unchanged.

## Contradictions, obsolete plans, and unresolved evidence

| Historical statement or proposal | Current evidence / treatment |
|---|---|
| Full-stack app and Render deployment | The original claim referred to the predecessor. This project now has a tracked PFAS location API and owner-reported Render deployment, but no frontend. |
| Groundwater-only dashboard / private-well dataset recommendation | Later owner scope broadened to the DNR viewer; current code cleans surface water/fish tissue. Final release scope needs confirmation. |
| React + TypeScript + Leaflet as the stack | Assistant recommendation, not a completed selection or implementation. |
| No Git repository / branch `master` | Obsolete setup stages. Current local branch is `main`, tracking `origin/main`. |
| Named environment example `wi-pfas-dashboard`; laptop pip/`.venv` instructions | Local development uses `wi-pfas`; the backend now has a Linux container manifest. Full notebook/cross-machine setup remains incomplete. |
| `WI_PFAS_DATA_DIR` and stored database environment variables | `WI_PFAS_DATA_DIR` remains unimplemented. The import notebook prompts for credentials/CA path; the Django backend now reads database environment variables. `PSYCOPG_IMPL` selects the client implementation, not credentials. |
| Cleanup notebook had one saved output | It had one at the earlier review; current cleanup has none. The database notebook retains one pre-insert count result. |
| 402 surface-water/fish-tissue source features | Local CSV contains 367 rows. Export scope/date and live count were not verified; cause unknown. |
| No database schema, import, or CSV export | Obsolete. Location DDL/import and a cleanup export exist. Analytical-result database loading and robust validation remain unfinished. |
| Column-removal bug and untrimmed flags | Fixed in current cleanup code. Qualifier semantics and numeric missing-result categories still need work. |
| Source CRS was known only from a column label | The owner has since explicitly confirmed EPSG:3071 and selected it for the location table. Independent map-placement validation is not recorded. |
| Switching to Psycopg binary fixed the certificate error | It did not by itself; the owner reported success after switching to `verify-ca` with the CA retained. |
| The uploaded layer contains cleaned PFAS measurements | It contains locations only. Measurement import was deferred when the owner narrowed the first load. |
| QGIS connection success proves correct placement/count | It establishes connection success only; recommended feature/SRID/basemap checks remain unreported. |

The latest inspected tracked revision is `95cbd8a`, reviewed September 20. The September 18 untracked starter description is historical and superseded by the tracked API/deployment implementation. Chat suggestions alone do not prove implementation. See [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) for current implementation, historical execution evidence, and outstanding checks, and [DECISIONS.md](DECISIONS.md) for accepted choices.

## Maintaining this record

When additional history becomes accessible, record its exact title/ID, coverage, useful owner statements, and conflicts. Add only project-relevant facts; omit credentials, private account details, raw transcripts, and unnecessary personal paths. Date new reviews and reconcile them against a named code revision. Correct current context when the owner resolves a question without erasing why earlier uncertainty existed.
