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
- Keep reusable code outside `z/`; the tracked notebooks in `notebooks/` are canonical for cleaning and location import. Treat raw exports as immutable inputs.
- Use repository-relative paths. Both notebooks locate inputs from the repository root or `notebooks/`; the cleanup export still has an absolute path that needs a later portability fix.
- Keep secrets and machine-specific configuration out of source and documentation. Preserve existing ignore rules for raw/intermediate/processed data, scratch files, environments, and real `.env` files. Review notebook outputs before publishing.
- Preserve original measurement text and provenance. Confirm units, sample media, qualifier meanings, dates, and CRS before interpreting or mapping results; do not equate missing or non-detect results with zero.
- Update context and decision records when scope or architecture changes. Distinguish verified implementation, user intentions, assistant proposals, and unresolved questions.
- Database-writing cells affect the hosted Aiven database. Do not run the import or table-creation SQL merely to inspect documentation or verify setup. The current import has no duplicate-handling policy and will conflict with existing primary keys on a repeat load.

## Stack and commands

The current workflow uses Python/pandas/NumPy notebooks, SQL table definitions, and Psycopg to load sampling locations into Aiven PostgreSQL/PostGIS. The owner reported successful loading and a working QGIS connection. `sql/create/locations_table.sql` defines `sampling_locations` with the source `objectid` primary key, `geometry(Point, 3071)`, and station name. The measurement table and location/result relationship are still to be designed.

As of the 2026-09-20 review at `95cbd8a`, tracked `backend/` contains a working Django/GeoDjango/DRF location API (`_crud` project, `api` app). The unmanaged `SamplingLocation` model maps the existing PostGIS table; read-only list/detail endpoints output EPSG:4326 GeoJSON from stored EPSG:3071 geometry. The owner reports successful deployment on Render Free, including list/detail and styling checks. Do not describe this as an empty starter.

Docker uses micromamba with `backend/environment.yml`, then runs `collectstatic` and Gunicorn. WhiteNoise serves static assets; django-cors-headers allows the configured frontend origins. The earlier tracked `requirements.txt` is unused by Docker. The container manifest includes Linux Gunicorn and is not a complete Windows/notebook recipe. No measurement API or implemented automated test suite exists. See [docs/BACKEND_SETUP.md](docs/BACKEND_SETUP.md) for settings and smoke checks. Do not run database migrations/imports as deployment verification; startup does neither.

At `05b645d` on `javascript`, the frontend has a MapTiler basemap, location circles, and a desktop grid with header/sidebar/map/data panels. Search, selection, tables, charts, loading/error UI, and a mobile breakpoint remain unimplemented. The last proposed exercise is a labeled sidebar search input, before wiring filtering. The October 6 coordinate-performance deferral was superseded on October 11: `javascript` at `4a6527e` now annotates `geom_4326=Transform("geom", 4326)` and the serializer reads that annotation, matching the approach preserved on `main`/`react`. The owner reports about two-second hosted loads after rebuilding with browser caching disabled. No second geometry column was added. As of October 14 at `d1f3106`, connection reuse and collection-response caching are implemented. `DB_CONN_MAX_AGE` controls database connection lifetime (default 0; Render exercise value 60), with health checks enabled. The `list()` method uses a 60-second response cache varying on Accept, Cookie, Authorization, and Origin; detail requests are not decorated. Django uses its default per-process memory cache. The owner reported local expiry/repeat timings of 2.4 seconds then 6 and 5 milliseconds, and reported updated Render deployments; hosted cache timings remain unreported. The next backend check is the hosted cache-hit/expiry cycle. Do not describe these optimizations as proposals, equate their two 60-second lifetimes, or claim local millisecond results for Render. Keep Render wake-up time separate from warm-request processing, and verify the actual JSON request/status/body when timing.

Keep `frontend/config.js` local and ignored. Render runs `node build.mjs` from `frontend` to generate ignored `dist/config.js` using `API_BASE_URL` and `MAPTILER_KEY`. These exports are public browser configuration, never database credentials. Do not print real key values or private environment contents.

For the following inspection commands, use Miniforge Prompt with `wi-pfas` active and the repository root as the working directory:

```bat
python --version
python -c "import pandas as pd; print(pd.__version__)"
git status --short --branch
git diff --check
```

For cleaning work, use `notebooks/Surface Water and Fish Tissue.ipynb` and the `wi-pfas` kernel; review the export destination before execution. `notebooks/database import locations.ipynb` is a separate database-writing workflow, not a routine smoke test. It requests the connection URI through `getpass()` and the CA certificate path at runtime. Never copy those values into documentation. VS Code/SQLTools settings are now ignored and untracked; keep those personal settings local. The Documentation task records the completed published-history cleanup.
