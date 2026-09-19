# Wisconsin PFAS Dashboard

An early-stage Wisconsin PFAS web GIS learning project, progressing from data cleaning to a hosted spatial database.

## Current Focus

The first database milestone is loading sampling locations from the Wisconsin DNR Surface Water and Fish Tissue layer into Aiven PostgreSQL/PostGIS. The owner reported successful uploading and a working QGIS connection in **Database Discussion** (September 2026).

The repository contains measurement-cleaning and location-import notebooks plus SQL definitions. The imported layer contains locations, not analytical measurements; measurement-table design and loading remain next steps. An untracked local Django starter exists, but a PFAS API, frontend, and running dashboard are not implemented.

## Data

Raw source data is not committed to this repository. To run the notebook, export the Surface Water and Fish Tissue layer from the Wisconsin DNR PFAS viewer and place the CSV at:

`data/raw/PFAS Sample Sites - Surface Water and Fish Tissue.csv`

This layer can be brought into QGIS as an ArcGIS REST Service, then exported as CSV.

## Notebooks and SQL

- `notebooks/Surface Water and Fish Tissue.ipynb` — reshapes measurements, dates, flags, and comments; exports a cleaned CSV. Its export path is still machine-specific.
- `notebooks/database import locations.ipynb` — reads location ID, WKT geometry, and station name; inserts them with Psycopg into `public.sampling_locations`.
- `sql/create/postgis.sql` — enables PostGIS.
- `sql/create/locations_table.sql` — defines the location table with source `objectid` as primary key and `geometry(Point, 3071)`.

The location notebook writes to the hosted database. Repeating a successful import will conflict with existing primary keys; inspect the table before deciding to run it again. Connection credentials and the CA certificate path are supplied at runtime. Data and environments must be set up separately on each computer; no reproducible environment manifest is committed yet.

## Project guidance

- [Project context](docs/PROJECT_CONTEXT.md) — current implementation, laptop setup, limitations, and next milestones.
- [Decisions](docs/DECISIONS.md) — accepted choices and open architecture questions.
- [Chat synthesis](docs/CHAT_SYNTHESIS.md) — historical evidence and review coverage.
- [Assistant guidance](AGENTS.md) — learning collaboration and repository conventions.

The owner writes application code with step-by-step coaching unless implementation is explicitly requested.
