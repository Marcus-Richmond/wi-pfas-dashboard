# Backend setup and deployment

Recorded 2026-09-20 from backend source at `95cbd8a` and the deployment conversation. The owner reported a working Render deployment and successful hosted list/detail/styling checks. This documentation review did not rebuild the image, inspect the Render dashboard, or contact the database/API. The public service URL has not been supplied.

## Architecture and dependency source

The request path is browser/client → Render Gunicorn → Django/GeoDjango/DRF → Aiven PostgreSQL/PostGIS. WhiteNoise serves the browsable API's collected static assets.

- Project: `backend/_crud`; application: `backend/api`.
- Existing table: `sampling_locations`, mapped by an unmanaged Django model. Django model migrations do not create/delete this table.
- Endpoints: `/api/locations/` and `/api/locations/<objectid>/`, read-only and ordered by source `objectid` for the collection.
- Database geometry: EPSG:3071. GeoJSON output geometry: EPSG:4326. Serialization does not update stored coordinates.
- No analytical-measurement API, frontend, custom filtering, or custom pagination is implemented.

`backend/environment.yml` is the Docker dependency source. It lists Python 3.12, Django 6.1, django-environ 0.14.0, DRF 3.18.1, REST Framework GIS 1.3.0, Psycopg 3.3.4, Gunicorn 26.2.0, WhiteNoise 6.12.0, GDAL 3.13.3, and GEOS 3.14.1 from conda-forge. Consult the file for future changes rather than maintaining a second package list here. It is not a full transitive lockfile.

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
| Branch | `main` |
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

Add a **Secret File** named `aiven-ca.pem`, containing the full Aiven CA certificate, including its BEGIN/END lines. The path above is a container configuration convention, not a local machine path.

Do not bulk-copy the Windows `.env` to Render. Leave `PSYCOPG_IMPL` unset there so Psycopg can use the installed container implementation. The Dockerfile supplies Linux library paths; Django automatically appends Render's `RENDER_EXTERNAL_HOSTNAME` to allowed hosts. Render environment values should be entered without surrounding quotes.

To generate a secret, use **Miniforge Prompt**, with `wi-pfas` active; any working directory is suitable:

```bat
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

Copy the output directly into the appropriate private configuration. Never put the real value in source, documentation, or a shared log.

`backend/.dockerignore` excludes local `.env` files, certificates with the listed extensions, SQLite files, caches, local environments, and collected assets from the build context. `.dockerignore` does not control what Git tracks; review Git changes separately. The tracked SQLite artifact is not used by current PostGIS settings.

After deployment, append `/api/locations/` to the service URL shown by Render. Verify HTTP 200/data, normal browsable styling, and a known-record detail request. The owner confirmed all three checks. A new change still needs its own relevant validation; no automated API test suite is implemented.

Do not rerun location imports or table-creation SQL as a deployment check. They affect the populated Aiven database, and the import has no duplicate-handling policy. No measurement import or frontend deployment is included in this setup.

Provider references used during setup: [Render Docker](https://render.com/docs/docker), [root-relative paths](https://render.com/docs/monorepo-support#root-relative-settings), [environment variables and secret files](https://render.com/docs/configure-environment-variables#secret-files), [Free tier](https://render.com/docs/free), and [micromamba image activation](https://micromamba-docker.readthedocs.io/en/latest/quick_start.html). Consult current provider documentation before relying on plan limits or changing deployment behavior.
