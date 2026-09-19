# Working on the Wisconsin PFAS Dashboard

This is a personal web GIS learning project: build a Wisconsin PFAS data explorer with a map, tables, charts, and better filtering/search. The owner wants to develop GIS programming and professional development skills by understanding and writing the code.

Before planning substantial work, read [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md) and [docs/DECISIONS.md](docs/DECISIONS.md). Use [docs/CHAT_SYNTHESIS.md](docs/CHAT_SYNTHESIS.md) for historical evidence and coverage limits. Check the repository before treating documented status as current.

## Collaboration and development

- Prefer manageable steps, explanations, syntax help, and debugging guidance during learning discussions. The historical preference is for the owner to write application code; an explicit request to implement or edit authorizes that work.
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

As of 2026-09-18, an untracked `backend/` contains a Django starter (`_crud` project and `api` app), with default SQLite settings and no implemented PFAS models or endpoints. Preserve this local work; its presence does not establish a working backend or an Aiven integration. No frontend, environment manifest, build script, or implemented automated test suite is present. See PROJECT_CONTEXT for current evidence and setup gaps.

From the repository root, in the selected Python environment:

```powershell
python --version
python -c "import pandas as pd; print(pd.__version__)"
git status --short --branch
git diff --check
```

For cleaning work, use `notebooks/Surface Water and Fish Tissue.ipynb` and the `wi-pfas` kernel; review the export destination before execution. `notebooks/database import locations.ipynb` is a separate database-writing workflow, not a routine smoke test. It requests the connection URI through `getpass()` and the CA certificate path at runtime. Never copy those values into documentation. Tracked SQLTools settings currently contain machine/service-specific metadata; treat that as a portability issue to resolve, not a reusable configuration template.
