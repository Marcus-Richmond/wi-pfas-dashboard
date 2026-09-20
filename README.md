# Wisconsin PFAS Dashboard

A Wisconsin PFAS web GIS learning project with a hosted spatial database and a read-only GeoJSON location API.

## Current Focus

Sampling locations from the Wisconsin DNR Surface Water and Fish Tissue layer are stored in Aiven PostgreSQL/PostGIS and exposed through Django/GeoDjango, Django REST Framework, and REST Framework GIS. The backend is deployed to Render Free using Docker, micromamba, Gunicorn, and WhiteNoise.

The owner confirmed successful hosted list/detail requests and browsable API styling in the conversation reviewed on September 20, 2026. This documentation update did not independently query the live service; its public URL has not been recorded.

- `GET /api/locations/` — GeoJSON location collection.
- `GET /api/locations/<objectid>/` — a single location by its source ID.
- Stored geometry uses EPSG:3071; API geometry is transformed to EPSG:4326.

The imported layer contains locations, not analytical measurements. Measurement-table design/loading and frontend/map implementation remain open milestones.

See [Backend setup and deployment](docs/BACKEND_SETUP.md) for local commands, environment settings, and Render configuration. The container uses [backend/environment.yml](backend/environment.yml); the older requirements file is not used by Docker.

## Data

Raw source data is not committed to this repository. To run the notebook, export the Surface Water and Fish Tissue layer from the Wisconsin DNR PFAS viewer and place the CSV at:

`data/raw/PFAS Sample Sites - Surface Water and Fish Tissue.csv`

This layer can be brought into QGIS as an ArcGIS REST Service, then exported as CSV.

## Notebooks and SQL

- `notebooks/Surface Water and Fish Tissue.ipynb` — reshapes measurements, dates, flags, and comments; exports a cleaned CSV. Its export path is still machine-specific.
- `notebooks/database import locations.ipynb` — reads location ID, WKT geometry, and station name; inserts them with Psycopg into `public.sampling_locations`.
- `sql/create/postgis.sql` — enables PostGIS.
- `sql/create/locations_table.sql` — defines the location table with source `objectid` as primary key and `geometry(Point, 3071)`.

The location notebook writes to the hosted database. Repeating a successful import will conflict with existing primary keys; inspect the table before deciding to run it again. Connection credentials and the CA certificate path are supplied at runtime. Data and local environments must be set up separately on each computer. The backend container has its own dependency manifest; a complete notebook environment recipe remains to be captured.

## Project guidance

- [Backend setup and deployment](docs/BACKEND_SETUP.md) — local commands, Render configuration, and verification.
- [Project context](docs/PROJECT_CONTEXT.md) — current implementation, laptop setup, limitations, and next milestones.
- [Decisions](docs/DECISIONS.md) — accepted choices and open architecture questions.
- [Chat synthesis](docs/CHAT_SYNTHESIS.md) — historical evidence and review coverage.
- [Assistant guidance](AGENTS.md) — learning collaboration and repository conventions.

The owner writes application code with step-by-step coaching unless implementation is explicitly requested.
