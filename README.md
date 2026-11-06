# Wisconsin PFAS Dashboard

A Wisconsin PFAS web GIS learning project with a hosted spatial database, read-only GeoJSON APIs, and an interactive map of sampling locations and PFAS sites.

## Current Focus

Sampling locations from the Wisconsin DNR Surface Water and Fish Tissue layer and sites from PFAS Sites (Open/Under Investigation) are loaded into Aiven PostgreSQL/PostGIS and exposed through Django/GeoDjango, Django REST Framework, and REST Framework GIS. The recorded backend deployment uses Render Free, Docker, micromamba, Gunicorn, and WhiteNoise.

Reviewed November 6, 2026 at `1f0794f` on `javascript`, comparing changes since the October 14 documentation commit `d65dbdb`. The plain JavaScript/HTML/CSS frontend now has Dark, Light, and Warm themes, coordinated MapTiler basemaps and overlay colors, and a sidebar with visibility checkboxes and symbol previews for both layers. The data panel still contains only a heading. React/TypeScript/Vite work remains preserved on `main` and `react` at locally recorded `4810393`.

- [JavaScript frontend](https://wi-pfas-dashboard.onrender.com/) — owner reported hosted locations loading on October 6.
- [Location API](https://wi-pfas-api.onrender.com/api/locations/) — backend list/detail/styling and later frontend access were reported working.
- [Earlier React frontend](https://wi-pfas-frontend.onrender.com/) — deployed during the September React lessons.

These are recorded public addresses, not a fresh uptime or Render-dashboard audit.

- `GET /api/locations/` — GeoJSON location collection.
- `GET /api/locations/<objectid>/` — a single location by its source ID.
- `GET /api/PFASsites/` and `/api/PFASsites/<objectid>/` — PFAS-site GeoJSON; capitalization matters.
- Sampling locations are stored in EPSG:3071 and transformed at query time; PFAS sites are stored directly in EPSG:4326. Both APIs output EPSG:4326.

These layers contain point IDs, names, and geometry, not analytical measurements. The owner deferred search to develop themes and the layer list. Search/filtering, feature selection, tables/charts, layout presets/mobile rearrangement, and measurement loading remain unfinished. The latest exercise is symbol previews: both are present, but their suggested outlines remain absent. Warm currently inherits the dark PFAS-site colors.

See [Backend setup and deployment](docs/BACKEND_SETUP.md) for local commands, environment settings, and Render configuration. The container uses [backend/environment.yml](backend/environment.yml); the older requirements file is not used by Docker.

See [Frontend setup and deployment](docs/FRONTEND_SETUP.md) for the JavaScript workflow. It requires ignored local `frontend/config.js`; Render generates its own configuration with `node build.mjs`. Do not use the React branch's npm/Vite commands on this branch. On October 11, `javascript` adopted query-time PostGIS transformation, also used on `main`/`react`; the serializer reads the calculated EPSG:4326 geometry. The backend now also supports bounded database connection reuse and caches collection responses for 60 seconds. The owner reported local post-expiry timing of 2.4 seconds followed by 6 and 5 millisecond repeat requests, with browser caching disabled. Render deployments were reported updated; hosted cache timings are still pending. See the [performance measurements](docs/BACKEND_SETUP.md#performance-measurements-and-next-experiment) for settings, evidence, and the hosted verification steps. Branch-specific CORS settings still differ.

## Data

Raw source files are ignored. The PFAS-sites notebook does retain downloaded public records in saved outputs. To run the older CSV-based workflows, export the Surface Water and Fish Tissue layer from the Wisconsin DNR PFAS viewer and place the CSV at:

`data/raw/PFAS Sample Sites - Surface Water and Fish Tissue.csv`

This layer can be brought into QGIS as an ArcGIS REST Service, then exported as CSV.

The PFAS-sites workflow instead queries DNR MapServer layer 1 directly with Requests and GeoPandas. Saved October outputs contain 81 sites and a database count of 81; they are historical snapshots, not current completeness or uptime guarantees. It has no pagination or durable raw-response archive.

## Notebooks and SQL

- `notebooks/Surface Water and Fish Tissue.ipynb` — reshapes measurements, dates, flags, and comments; exports a cleaned CSV. Its export path is still machine-specific.
- `notebooks/database import locations.ipynb` — reads location ID, WKT geometry, and station name; inserts them with Psycopg into `public.sampling_locations`.
- `notebooks/database import pfas sites open.ipynb` — retrieves DNR sites, adapts Shapely points through Psycopg, and inserts/updates `public.pfas_sites` by source ID.
- `sql/create/postgis.sql` — enables PostGIS.
- `sql/create/locations_table.sql` — defines the location table with source `objectid` as primary key and `geometry(Point, 3071)`.
- `sql/create/pfas_sites.sql` — defines PFAS-site geometry in EPSG:4326, source `objectid`, and `sitename`.

Both import notebooks write to the hosted database. Sampling-location inserts conflict on repeat IDs; PFAS-site uploads update matching geometry/name and insert new IDs, retaining rows absent from later downloads. Adding fields still requires a table/schema change and matching tuple/SQL edits. Connection credentials and the CA path are supplied at runtime. Local data/environments need separate setup; the container manifest is not a complete notebook recipe.

## Project guidance

- [Frontend setup and deployment](docs/FRONTEND_SETUP.md) — active JavaScript workflow, configuration, hosting, and branch differences.
- [Backend setup and deployment](docs/BACKEND_SETUP.md) — local commands, Render configuration, and verification.
- [Project context](docs/PROJECT_CONTEXT.md) — current implementation, laptop setup, limitations, and next milestones.
- [Decisions](docs/DECISIONS.md) — accepted choices and open architecture questions.
- [Chat synthesis](docs/CHAT_SYNTHESIS.md) — historical evidence and review coverage.
- [Assistant guidance](AGENTS.md) — learning collaboration and repository conventions.

The owner writes application code with small exercises and syntax hints before complete solutions, unless implementation is explicitly requested.
