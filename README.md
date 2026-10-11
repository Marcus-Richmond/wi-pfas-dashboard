# Wisconsin PFAS Dashboard

A Wisconsin PFAS web GIS learning project with a hosted spatial database, read-only GeoJSON API, and an interactive sampling-location map.

## Current Focus

Sampling locations from the Wisconsin DNR Surface Water and Fish Tissue layer are stored in Aiven PostgreSQL/PostGIS and exposed through Django/GeoDjango, Django REST Framework, and REST Framework GIS. The backend is deployed to Render Free using Docker, micromamba, Gunicorn, and WhiteNoise.

Frontend reviewed October 11, 2026 at `05b645d`; backend performance notes updated at `4a6527e` on `javascript`. The active frontend uses plain JavaScript, HTML/CSS, MapLibre, and a MapTiler basemap. A desktop grid contains header, sidebar, map, and data panels; the sidebar and data panel currently contain headings only. React/TypeScript/Vite work is preserved on `main` and `react` at the locally recorded `4810393`.

- [JavaScript frontend](https://wi-pfas-dashboard.onrender.com/) — owner reported hosted locations loading on October 6.
- [Location API](https://wi-pfas-api.onrender.com/api/locations/) — backend list/detail/styling and later frontend access were reported working.
- [Earlier React frontend](https://wi-pfas-frontend.onrender.com/) — deployed during the September React lessons.

These are recorded public addresses, not a fresh uptime or Render-dashboard audit.

- `GET /api/locations/` — GeoJSON location collection.
- `GET /api/locations/<objectid>/` — a single location by its source ID.
- Stored geometry uses EPSG:3071; API geometry is transformed to EPSG:4326.

The imported layer contains locations, not analytical measurements. Search/filtering, selection, tables/charts, a mobile layout, and measurement-table design/loading remain unfinished. The next proposed learning exercise is a labeled sidebar search field, then styling and behavior in separate steps.

See [Backend setup and deployment](docs/BACKEND_SETUP.md) for local commands, environment settings, and Render configuration. The container uses [backend/environment.yml](backend/environment.yml); the older requirements file is not used by Docker.

See [Frontend setup and deployment](docs/FRONTEND_SETUP.md) for the JavaScript workflow. It requires ignored local `frontend/config.js`; Render generates its own configuration with `node build.mjs`. Do not use the React branch's npm/Vite commands on this branch. On October 11, `javascript` adopted query-time PostGIS transformation, also used on `main`/`react`; the serializer reads the calculated EPSG:4326 geometry. The owner reports hosted location loads of about two seconds with browser caching disabled after rebuilding. See the [performance measurements](docs/BACKEND_SETUP.md#performance-measurements-and-next-experiment) for evidence and the next diagnostic step. Branch-specific CORS settings still differ.

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

- [Frontend setup and deployment](docs/FRONTEND_SETUP.md) — active JavaScript workflow, configuration, hosting, and branch differences.
- [Backend setup and deployment](docs/BACKEND_SETUP.md) — local commands, Render configuration, and verification.
- [Project context](docs/PROJECT_CONTEXT.md) — current implementation, laptop setup, limitations, and next milestones.
- [Decisions](docs/DECISIONS.md) — accepted choices and open architecture questions.
- [Chat synthesis](docs/CHAT_SYNTHESIS.md) — historical evidence and review coverage.
- [Assistant guidance](AGENTS.md) — learning collaboration and repository conventions.

The owner writes application code with small exercises and syntax hints before complete solutions, unless implementation is explicitly requested.
