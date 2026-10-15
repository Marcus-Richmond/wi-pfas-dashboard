# Backend setup and deployment

Recorded 2026-09-20; updated 2026-10-14 from `javascript` at `d1f3106` and the backend performance conversation. Earlier October 11 reviews used `4a6527e` and `05b645d`, with `main`/`react` recorded at `4810393`. The owner reported working hosted API checks and later JavaScript location display. Public API: [location collection](https://wi-pfas-api.onrender.com/api/locations/). This update did not rebuild the image, inspect Render, or contact the database/API.

## Architecture and dependency source

The request path is browser/client → Render Gunicorn → Django/GeoDjango/DRF → Aiven PostgreSQL/PostGIS. WhiteNoise serves the browsable API's collected static assets.

- Project: `backend/_crud`; application: `backend/api`.
- Existing table: `sampling_locations`, mapped by an unmanaged Django model. Django model migrations do not create/delete this table.
- Endpoints: `/api/locations/` and `/api/locations/<objectid>/`, read-only and ordered by source `objectid` for the collection.
- Database geometry: EPSG:3071. GeoJSON output geometry: EPSG:4326. Serialization does not update stored coordinates.
- Both frontend versions load the location API. No analytical-measurement API, custom filtering, or custom pagination is implemented.

On `javascript` at `4a6527e`, the viewset annotates `geom_4326=Transform("geom", 4326)` and the serializer uses `GeometryField(source="geom_4326", read_only=True)`. This supersedes the October 6 deferral and matches the approach previously preserved on `main`/`react`. The calculated geometry exists on returned objects, not as a stored second column. Shell tests or other callers of this serializer must use the annotated query. The response geometry field remains `geometry` in GeoJSON; the annotation is an internal implementation detail.

`backend/environment.yml` is the Docker dependency source. It specifies the Python/Django/DRF, spatial, PostgreSQL, and serving packages from conda-forge, now including django-cors-headers 4.9.0 on `javascript`. Consult that file for versions; it is not a full transitive lockfile.

## Performance measurements and next experiment

The following results from the October 11–14 performance conversation were reported by the owner, not independently rerun. They describe 367 point features and different measurement conditions; do not combine them into a precise end-to-end speedup ratio.

| Test | First run | Second run | Scope |
|---|---:|---:|---|
| Original shell database fetch | 3.350 s | 0.381 s | Fetch all locations; first run can include connection/setup costs |
| Original shell serialization | 12.893 s | 12.689 s | Includes Python-side transformation and GeoJSON structure construction |
| Shell fetch plus PostGIS transformation | 2.281 s | 0.488 s | Annotated query; performed after resetting a closed connection |
| Local browser after code change | 2.5 s | 2.0 s | Reported request durations for the browsable endpoint |
| Local `?format=json` after code change | 10 ms | 19 ms | Selected request, HTTP status/body, and cache behavior not independently inspected |
| Hosted after Render rebuild | About 2 s | Not separately recorded | Browser caching disabled; service had become available |

Later measurements, kept separate from the earlier transformation tests:

| Stage | Owner-reported timings | Interpretation and limits |
|---|---|---|
| Local connection establishment only, before reuse | 2.510 s; 1.421 s | Effective local `CONN_MAX_AGE` was 0; includes connection setup, not fetching locations |
| Hosted after the connection-reuse exercise | 1.71, 1.57, 0.87, 0.90, 1.24 s | Browser caching disabled; about 1.26 s average, not an isolated proof of the benefit |
| Local with collection caching | 6, 5, 2 ms | All requests may already have hit a populated cache |
| Local after waiting beyond the 60-second cache lifetime | 2.4 s, then 6 and 5 ms | Consistent with an expired entry being rebuilt, then reused |
| Hosted after collection caching deployed | Not yet reported | Owner reports commit/push and updated Render deployments on October 14 |

Current implementation includes query-time PostGIS transformation, configurable connection reuse with health checks, and a 60-second collection response cache. No second geometry column was added. Source confirms the implementation, while timing results and deployment completion are owner-reported. Private/deployed settings, the exact live commit, and original browser traces were not independently inspected. The earlier 10/19 ms local JSON results do not prove that HTML rendering alone accounted for their difference from browsable requests. Near-instant hosted cache hits remain to be measured.

### Implemented connection reuse

The settings now contain these assignments after the existing database options update:

```python
DATABASES["default"]["CONN_MAX_AGE"] = env.int("DB_CONN_MAX_AGE", default=0)
DATABASES["default"]["CONN_HEALTH_CHECKS"] = True
```

Both settings belong inside the default database configuration, alongside `OPTIONS`. Placing `CONN_MAX_AGE` in the outer `DATABASES` dictionary caused the owner's `'int' object has no attribute 'setdefault'` error: Django interpreted it as a database alias whose configuration was an integer. The owner corrected the nesting and reported `manage.py check` passing.

The Render exercise uses `DB_CONN_MAX_AGE=60`; leaving it unset retains local default 0. This controls connection age, not how long data is cached. The first request on a new connection and later replacements still incur setup costs. Health checks help detect closed connections before reuse. Each worker thread has its own connection; current Gunicorn configuration is one worker with two threads. Ordinary threaded `runserver` creates new request threads and is not a reliable test of persistent-connection gains. [Django persistent connections](https://docs.djangoproject.com/en/6.1/ref/databases/#persistent-connections)

### Implemented collection-response cache

`backend/api/views.py` imports `method_decorator`, `cache_page`, and `vary_on_headers`. The list action wraps its inherited implementation in this order:

```python
@method_decorator(cache_page(60))
@method_decorator(vary_on_headers("Accept", "Cookie", "Authorization", "Origin"))
def list(self, request, *args, **kwargs):
    return super().list(request, *args, **kwargs)
```

The outer cache wrapper stores successful GET/HEAD collection responses. The inner wrapper varies them by requested format, cookie/authentication context, and origin; URLs/query strings also distinguish cache entries. Keep this decorator order. Only `list()` is decorated: `/api/locations/<objectid>/` is not covered by this response cache. The viewset still supplies the transformed geometry annotation. [DRF caching guidance](https://www.django-rest-framework.org/api-guide/caching/)

No custom `CACHES` setting or external cache service was added. Django therefore uses its default local-memory cache, which is shared by threads within one process but not between processes. It is cleared on process restart/redeployment and does not survive Render shutdown. A cache miss still performs the underlying query/serialization work. Expiry is 60 seconds from population, not a rolling lifetime extended by each hit. No explicit invalidation on data changes exists, so a populated variant can show older data until it expires. This is an intentional bounded freshness tradeoff, not a second authoritative copy of the dataset. [Django caching](https://docs.djangoproject.com/en/6.1/topics/cache/)

Disabling the browser cache does not disable this server cache. A different header variant or query string can miss even within the lifetime, so compare the same JSON URL and request context. A direct backend tab and the frontend can use different `Origin`/`Accept` variants. The two settings that currently use 60 seconds—connection lifetime and response expiry—are independent.

### Next validation: hosted cache cycle

The owner reports the changes committed/pushed and Render deployments updated. Hosted cache timings have not been supplied. In the **Render browser dashboard**, confirm the backend deployment is Live and contains the cache change. Then use **Firefox**:

1. Open `https://wi-pfas-api.onrender.com/api/locations/?format=json` with Developer Tools → Network open and browser caching disabled.
2. Let Render finish waking up and the first data response complete. Keep startup time separate from the following requests.
3. Select the actual locations request and verify HTTP 200, a complete FeatureCollection with 367 features, and longitude/latitude coordinates. Check loading from the frontend too, because its origin can create a separate cache variant.
4. Reload the same JSON URL three times within 60 seconds, allowing each request to finish; record waiting time and total duration.
5. Wait at least 65 seconds without another request to the endpoint, then reload once and immediately twice more. Record the expiry/repeat pattern separately from the within-lifetime results.

Expected behavior is a slower miss after expiry followed by faster matching hits. Network travel time remains even on a hit; local 5–6 ms responses are not a hosted guarantee. Neither response caching nor connection reuse removes Render Free's wake-up delay. Keep the lifetime at 60 seconds for this comparison. Any longer lifetime, shared cache service, static GeoJSON snapshot, or always-running hosting remains a future choice.

### Optional diagnostic reference (read-only)

The connection-opening portion was completed by the owner with the results above. These commands remain useful if profiling uncached work again; no new post-change serializer-only timing has been reported. A direct shell serializer call bypasses the list response cache.

Use **Miniforge Prompt (Windows cmd.exe)** with the existing `wi-pfas` environment and repository root as the starting directory. Open a new Django shell to load the edited code:

```bat
mamba activate wi-pfas
cd backend
python manage.py shell
```

Inside the **Django Python shell**, import:

```python
from time import perf_counter
from django.db import connection
from api.views import SamplingLocationViewSet
from api.serializers import SamplingLocationSerializer
```

Optionally inspect only the connection lifetime, without displaying credentials:

```python
print("Connection lifetime:", connection.settings_dict.get("CONN_MAX_AGE", 0))
```

In this fresh diagnostic shell, close any existing connection before timing a new one:

```python
connection.close()
```

Paste each following timing command as one line and press Enter. Do not type the timed statements individually: human typing time would be included.

```python
start = perf_counter(); connection.ensure_connection(); print("Connection:", round(perf_counter() - start, 3), "seconds")
```

```python
start = perf_counter(); locations = list(SamplingLocationViewSet.queryset.all()); print("Fetch and transform:", round(perf_counter() - start, 3), "seconds")
```

```python
start = perf_counter(); data = SamplingLocationSerializer(locations, many=True).data; print("Serialization:", round(perf_counter() - start, 3), "seconds")
```

The viewset supplies the required annotation; `.all()` creates a fresh queryset for each timing. These are reads from Aiven and in-memory serialization, not imports or migrations. Serialization timing excludes final JSON encoding, HTML rendering, and HTTP transfer. Repeat the entire sequence (including `connection.close()`) to compare connection establishment twice; repeat just the last two commands to compare an existing connection. If a connection has closed while idle, reset it before repeating the sequence.

This local exercise can identify a candidate cost but does not measure the Render-to-Aiven network path. Verify hosted improvements through repeated successful JSON responses after the service is awake, with a known deployed commit. In browser developer tools, select the actual `/api/locations/?format=json` request, check HTTP 200, a complete FeatureCollection with 367 features, plausible longitude/latitude coordinates, and record waiting time separately from total duration. Do not time an asset request or Render's wake-up page by mistake.

### Remaining performance scope

Connection reuse and response caching are now implemented. The immediate gap is hosted cache verification, not adding either feature again. If near-instant first-visit display after idle becomes a requirement, evaluate always-running hosting or a deliberately refreshed static GeoJSON snapshot separately; neither is selected. [Render idle behavior](https://render.com/docs/free#spinning-down-on-idle)

Change one thing at a time, validate the response data, and record before/after timings under matching conditions. Keep the original geometry and existing table intact unless measured evidence justifies a schema change.

## Browser access (CORS)

Current settings register `corsheaders` and put CorsMiddleware after SecurityMiddleware and before WhiteNoise. The `javascript` allowlist contains `http://localhost:5173`, `http://localhost:4173`, `http://127.0.0.1:5500`, `https://wi-pfas-frontend.onrender.com`, and `https://wi-pfas-dashboard.onrender.com`. Use exact origins, without paths/trailing slashes. The preserved `main`/`react` list lacks the JavaScript site and port 5500.

A direct API tab can succeed while a frontend request is blocked. Verify the branch deployed by the backend has the intended origin and dependency, then test from the frontend browser. Frontend hosting/build setup is documented separately in [FRONTEND_SETUP.md](FRONTEND_SETUP.md).

The earlier `backend/requirements.txt` remains tracked but is not read by Docker. Prefer mamba for local packages when available; explain any pip exception. The Linux container uses micromamba's `base` environment; local Windows development uses `wi-pfas`. Do not apply the container manifest unmodified to Windows: Gunicorn runs in the Linux container. The YAML also does not capture all notebook dependencies.

## Local Windows configuration

Edit files in **VS Code**. Django reads `backend/.env`; keep it and the real CA certificate out of Git. Use `KEY=value` syntax, without spaces around the equals sign. Configure these keys with personal values, not credentials copied into documentation:

| Key | Local purpose |
|---|---|
| `DJANGO_SECRET_KEY` | A locally generated secret |
| `DEBUG` | `True` for local development; `False` for the static-file smoke check |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1` |
| `DATABASE_URL` | The working Aiven PostgreSQL connection URL |
| `DATABASE_SSLROOTCERT` | Absolute local path to the downloaded Aiven CA certificate |
| `GDAL_LIBRARY_PATH` | Absolute path to `Library/bin/gdal.dll` in the active Miniforge environment when discovery fails |
| `GEOS_LIBRARY_PATH` | Optional explicit GEOS library path if automatic discovery fails |
| `PSYCOPG_IMPL` | The existing local workaround uses `binary`, requiring that implementation to be installed; this is not a Render requirement |
| `DB_CONN_MAX_AGE` | Optional connection lifetime in seconds; defaults to `0` for local development |

Database settings use `django.contrib.gis.db.backends.postgis`. Connection options belong inside `DATABASES["default"]["OPTIONS"]`; current code adds them after parsing the URL. They set `sslmode=verify-ca`, the CA path, a 10-second connection timeout, and `gssencmode=disable`. Certificate verification is retained, but `verify-ca` does not check hostname matching. This is the recorded working workaround, not evidence that the original client issue was resolved.

## Local commands and smoke checks

These instructions assume the existing local environment and `.env` are configured. Use **Miniforge Prompt (Windows cmd.exe)**. From the repository root, activate `wi-pfas` and enter the backend directory:

```bat
mamba activate wi-pfas
cd backend
python manage.py check
python manage.py runserver
```

Open `http://127.0.0.1:8000/api/locations/` in your **web browser**. Check HTTP 200 and the GeoJSON collection, then use an actual returned `objectid` at `/api/locations/<objectid>/`. Press **Ctrl+C in Miniforge Prompt** to stop the server. These requests read the hosted Aiven database.

To check spatial-library loading, use the same **Miniforge Prompt**, `wi-pfas` environment, and `backend` working directory:

```bat
python manage.py shell -c "from django.contrib.gis.gdal import GDAL_VERSION; from django.contrib.gis.geos import geos_version; print(GDAL_VERSION); print(geos_version())"
```

Using `manage.py shell` loads Django settings, including configured library paths; a bare Python import does not necessarily do so.

To test WhiteNoise locally, stop the server first. In the same **Miniforge Prompt**, with `wi-pfas` active and `backend` as the working directory:

```bat
python manage.py collectstatic --noinput
set "DEBUG=False"
python manage.py runserver --nostatic
```

Hard-refresh the API page in your browser and verify normal styling and data. Stop the server with **Ctrl+C**, then clear the temporary override in that same prompt:

```bat
set "DEBUG="
```

The `set` syntax is for Miniforge Prompt/cmd.exe, not PowerShell. Clearing the override allows the local `.env` value to apply again. Collected files are written to ignored `backend/staticfiles/`.

## Render configuration

The deployment instructions used the following settings in the **Render web dashboard**. Owner-reported success confirms operation; these exact dashboard fields were not independently audited.

| Setting | Value |
|---|---|
| Repository | `Marcus-Richmond/wi-pfas-dashboard` |
| Branch | Originally `main`; October 6 owner requested `javascript`, then reported frontend success |
| Service type | Web Service |
| Runtime | Docker |
| Root Directory | `backend` |
| Dockerfile Path | `./Dockerfile` |
| Docker Build Context | `.` relative to the root directory |
| Instance Type | Free |
| Docker Command | Blank, using the Dockerfile's `CMD` |

The Dockerfile uses `mambaorg/micromamba:2.9.0`, preserves the image's environment-activating entrypoint, and copies the backend into a directory owned by the image's application user. It sets GDAL and GEOS paths under `/opt/conda/lib/`. At startup it runs `collectstatic --noinput`, then Gunicorn for `_crud.wsgi:application` with one worker and two threads, listening on `0.0.0.0:$PORT` (10000 fallback). Startup does not run migrations or imports.

In **Render → Environment**, configure:

| Variable | Value |
|---|---|
| `DEBUG` | `False` |
| `DJANGO_SECRET_KEY` | A new deployment secret, distinct from local development |
| `DATABASE_URL` | The working Aiven connection URL |
| `DATABASE_SSLROOTCERT` | `/etc/secrets/aiven-ca.pem` |
| `DB_CONN_MAX_AGE` | `60` for the connection-reuse experiment |

Add a **Secret File** named `aiven-ca.pem`, containing the full Aiven CA certificate, including its BEGIN/END lines. The path above is a container configuration convention, not a local machine path.

Do not bulk-copy the Windows `.env` to Render. Leave `PSYCOPG_IMPL` unset there so Psycopg can use the installed container implementation. The Dockerfile supplies Linux library paths; Django automatically appends Render's `RENDER_EXTERNAL_HOSTNAME` to allowed hosts. Render environment values should be entered without surrounding quotes.

To generate a secret, use **Miniforge Prompt**, with `wi-pfas` active; any working directory is suitable:

```bat
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

Copy the output directly into the appropriate private configuration. Never put the real value in source, documentation, or a shared log.

`backend/.dockerignore` excludes local `.env` files, certificates with the listed extensions, SQLite files, caches, local environments, and collected assets from the build context. `.dockerignore` does not control what Git tracks; review Git changes separately. The tracked SQLite artifact is not used by current PostGIS settings.

After deployment, append `/api/locations/` to the service URL shown by Render. Verify HTTP 200/data, normal browsable styling, and a known-record detail request. The owner confirmed all three checks. A new change still needs its own relevant validation; no automated API test suite is implemented.

Do not rerun location imports or table-creation SQL as a deployment check. They affect the populated Aiven database, and the import has no duplicate-handling policy. No measurement import is implemented. The separately deployed frontend uses the same API; current dashboard branch/commit and auto-deploy settings still require checking when diagnosing a new deployment.

Provider references used during setup: [Render Docker](https://render.com/docs/docker), [root-relative paths](https://render.com/docs/monorepo-support#root-relative-settings), [environment variables and secret files](https://render.com/docs/configure-environment-variables#secret-files), [Free tier](https://render.com/docs/free), and [micromamba image activation](https://micromamba-docker.readthedocs.io/en/latest/quick_start.html). Consult current provider documentation before relying on plan limits or changing deployment behavior.
