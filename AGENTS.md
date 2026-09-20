# Working on the Wisconsin PFAS Dashboard

This is a personal web GIS learning project: build a Wisconsin PFAS data explorer with a map, tables, charts, and better filtering/search. The owner wants to develop GIS programming and professional development skills by understanding and writing the code.

Before planning substantial work, read [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md) and [docs/DECISIONS.md](docs/DECISIONS.md). Use [docs/CHAT_SYNTHESIS.md](docs/CHAT_SYNTHESIS.md) for historical evidence and coverage limits. Check the repository before treating documented status as current.

## Collaboration and development

- Prefer manageable steps, explanations, syntax help, and debugging guidance during learning discussions. The historical preference is for the owner to write application code; an explicit request to implement or edit authorizes that work.
- Teach React/TypeScript through web GIS examples, building on basic JavaScript and Python dictionaries, lists, and functions. The owner liked Code with Mosh's teaching but needs help applying those concepts to maps. Use the predecessor's object-driven filters as a bridge; explain React state updates rather than carrying over direct DOM mutation.
- MapLibre is the owner's frontend map choice; React and TypeScript are the preferred learning direction. Prefer manually creating a small set of source/configuration files with explanations. npm can manage dependencies without generating a template. Vite is proposed, not installed. Compare Material UI and alternatives when UI work becomes relevant; no UI library is selected.
- Deploy the first small frontend page to free hosting early, then keep it live as features are added. The owner wants deployment integrated into the learning workflow. Render Static Sites is proposed because the backend already uses Render; no frontend host has been selected or configured yet.
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

Docker uses micromamba with `backend/environment.yml`, then runs `collectstatic` and Gunicorn. WhiteNoise serves static assets. The earlier tracked `requirements.txt` is unused by Docker. The container manifest includes Linux Gunicorn and is not a complete Windows/notebook recipe. No frontend, measurement API, or implemented automated test suite exists. See [docs/BACKEND_SETUP.md](docs/BACKEND_SETUP.md) for settings and smoke checks. Do not run database migrations/imports as deployment verification; startup does neither.

For the following inspection commands, use Miniforge Prompt with `wi-pfas` active and the repository root as the working directory:

```bat
python --version
python -c "import pandas as pd; print(pd.__version__)"
git status --short --branch
git diff --check
```

For cleaning work, use `notebooks/Surface Water and Fish Tissue.ipynb` and the `wi-pfas` kernel; review the export destination before execution. `notebooks/database import locations.ipynb` is a separate database-writing workflow, not a routine smoke test. It requests the connection URI through `getpass()` and the CA certificate path at runtime. Never copy those values into documentation. VS Code/SQLTools settings are now ignored and untracked; keep those personal settings local. The Documentation task records the completed published-history cleanup.
