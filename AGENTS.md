# Working on the Wisconsin PFAS Dashboard

This is a personal web GIS learning project: build a Wisconsin PFAS data explorer with a map, tables, charts, and better filtering/search. The owner wants to develop GIS programming and professional development skills by understanding and writing the code.

Before planning substantial work, read [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md) and [docs/DECISIONS.md](docs/DECISIONS.md). Use [docs/CHAT_SYNTHESIS.md](docs/CHAT_SYNTHESIS.md) for historical evidence and coverage limits. Check the repository before treating documented status as current.

## Collaboration and development

- Prefer small exercises and syntax/function hints before giving complete code. On October 10 the owner explicitly asked to attempt each change personally, a few lines at a time. An explicit request to implement or edit authorizes that work.
- Teach through web GIS examples and familiar Python dictionaries, lists, and functions. The active learning path is plain JavaScript, HTML, and CSS. React/TypeScript work is preserved on other branches; returning to it remains undecided. If resumed, explain state updates, refs, and effects through map examples.
- As of October 11, work is on `javascript`; `main` and `react` preserve the React/TypeScript/Vite version. Branches cover the whole repository, including backend differences. Inspect the branch before giving setup instructions. The JavaScript frontend uses MapLibre from a CDN and a Node copy/config build, with no package.json or Vite setup on this branch.
- Use the owner's CSS Grid and shared CSS variables, split into theme/base/layout/components/typography files. shadcn/ui, mapcn, and glasscn are visual references, not installed libraries. Tailwind is deferred; Bootstrap, Tabulator, and Chart.js were discussed but are not implemented or final selections.
- Early hosting is implemented: both frontend versions reached Render Static Sites. Keep incremental deployment in the learning workflow. See [docs/FRONTEND_SETUP.md](docs/FRONTEND_SETUP.md) for current JavaScript configuration and the separate React history.
- Prefer mamba for package installation when available; explain exceptions before suggesting pip. Container deployment uses micromamba and `backend/environment.yml`.
- Always identify the terminal, active environment, and working directory for commands. Distinguish VS Code file edits, Miniforge Prompt commands, PowerShell commands, and Python/Django shell input. Default local Python instructions to Miniforge Prompt with `wi-pfas` active.
- Keep scope focused on the requested learning milestone. Do not scaffold a proposed web stack merely because it appears in historical plans.
- Inspect Git status first; preserve unrelated edits and ignored local work. Do not commit or push without an explicit request.
- Keep reusable code outside `z/`; the three tracked notebooks in `notebooks/` are canonical for measurement cleaning, sampling-location import, and PFAS-sites retrieval/import. Treat raw exports as immutable inputs. The PFAS-sites notebook queries DNR directly and has saved public-data outputs; review outputs before publishing.
- Use repository-relative paths. The two CSV workflows locate inputs from the repository root or `notebooks/`; the cleanup export still has an absolute path that needs a later portability fix. The PFAS-sites notebook has no CSV prerequisite.
- Keep secrets and machine-specific configuration out of source and documentation. Preserve existing ignore rules for raw/intermediate/processed data, scratch files, environments, and real `.env` files. Review notebook outputs before publishing.
- Preserve original measurement text and provenance. Confirm units, sample media, qualifier meanings, dates, and CRS before interpreting or mapping results; do not equate missing or non-detect results with zero.
- Update context and decision records when scope or architecture changes. Distinguish verified implementation, user intentions, assistant proposals, and unresolved questions.
- Database-writing cells affect the hosted Aiven database. Do not run imports or table-creation SQL merely to inspect documentation or verify setup. The sampling-location import conflicts with existing primary keys on repeat load. The PFAS-sites import instead upserts geometry/name by `objectid`; it does not delete rows absent from later downloads or automatically add database columns.

## Stack and commands

The current workflow uses Python notebooks, SQL table definitions, and Psycopg to load two point layers into Aiven PostgreSQL/PostGIS. `sampling_locations` stores source `objectid`, `geometry(Point, 3071)`, and station name. The new `pfas_sites` table stores `objectid`, `geometry(Point, 4326)`, and `sitename`. Its notebook queries DNR MapServer layer 1 with Requests, creates a GeoPandas GeoDataFrame, registers Psycopg's Shapely adapter on the connection, and upserts selected fields. Saved October outputs show 81 sites; this is not a current source count. `ST_SetSRID` labels the already requested EPSG:4326 coordinates, not a reprojection. No measurement table or relationship between the two point layers is implemented.

As of the 2026-09-20 review at `95cbd8a`, tracked `backend/` contains a working Django/GeoDjango/DRF location API (`_crud` project, `api` app). The unmanaged `SamplingLocation` model maps the existing PostGIS table; read-only list/detail endpoints output EPSG:4326 GeoJSON from stored EPSG:3071 geometry. The owner reports successful deployment on Render Free, including list/detail and styling checks. Do not describe this as an empty starter.

Docker uses micromamba with `backend/environment.yml`, then runs `collectstatic` and Gunicorn. WhiteNoise serves static assets; django-cors-headers allows the configured frontend origins. The earlier tracked `requirements.txt` is unused by Docker. The container manifest includes Linux Gunicorn and is not a complete Windows/notebook recipe. No measurement API or implemented automated test suite exists. See [docs/BACKEND_SETUP.md](docs/BACKEND_SETUP.md) for settings and smoke checks. Do not run database migrations/imports as deployment verification; startup does neither.

The October 6 coordinate-performance deferral was superseded on October 11: `javascript` at `4a6527e` now annotates `geom_4326=Transform("geom", 4326)` and the serializer reads that annotation, matching the approach preserved on `main`/`react`. The owner reports about two-second hosted loads after rebuilding with browser caching disabled. No second geometry column was added. As of October 14 at `d1f3106`, connection reuse and collection-response caching are implemented. `DB_CONN_MAX_AGE` controls database connection lifetime (default 0; Render exercise value 60), with health checks enabled. The `list()` method uses a 60-second response cache varying on Accept, Cookie, Authorization, and Origin; detail requests are not decorated. Django uses its default per-process memory cache. The owner reported local expiry/repeat timings of 2.4 seconds then 6 and 5 milliseconds, and reported updated Render deployments; hosted cache timings remain unreported. The next backend check is the hosted cache-hit/expiry cycle. Do not describe these optimizations as proposals, equate their two 60-second lifetimes, or claim local millisecond results for Render. Keep Render wake-up time separate from warm-request processing, and verify the actual JSON request/status/body when timing.

Keep `frontend/config.js` local and ignored. Render runs `node build.mjs` from `frontend` to generate ignored `dist/config.js` using `API_BASE_URL` and `MAPTILER_KEY`. These exports are public browser configuration, never database credentials. Do not print real key values or private environment contents.

As of the November 6 review at `1f0794f`, `javascript` adds `/api/PFASsites/` and detail routes with direct EPSG:4326 geometry and the same 60-second collection cache. Preserve exact route/layer capitalization. The frontend now has Dark/Light/Warm themes, coordinated basemap and overlay colors, and a two-row layer list with independent visibility toggles and symbol previews. `setStyle(..., {diff: false})` reloads the style; `map.js` restores both overlays on `style.load`, then row listeners reapply checkbox choices. Theme/visibility choices are not persisted across page reloads.

The owner deferred search to work on themes and then the layer list. Keep the current `Object.entries()` row loop unless asked to change it. The latest symbol-preview exercise is partly beyond the chat: both previews exist in source, but suggested outline borders are absent. Warm has no PFAS-specific color overrides and inherits the root/dark values. Record these discrepancies; do not silently fix them during documentation work. Layout presets were discussed but not implemented; search, selection, tables/charts, loading/error UI, and a mobile breakpoint remain unfinished.

For the following inspection commands, use Miniforge Prompt with `wi-pfas` active and the repository root as the working directory:

```bat
python --version
python -c "import pandas as pd; print(pd.__version__)"
git status --short --branch
git diff --check
```

For cleaning work, use `notebooks/Surface Water and Fish Tissue.ipynb` and the `wi-pfas` kernel; review the export destination before execution. `notebooks/database import locations.ipynb` is a separate database-writing workflow, not a routine smoke test. It requests the connection URI through `getpass()` and the CA certificate path at runtime. Never copy those values into documentation. VS Code/SQLTools settings are now ignored and untracked; keep those personal settings local. The Documentation task records the completed published-history cleanup.
