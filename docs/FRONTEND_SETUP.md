# Frontend setup and deployment

Frontend reviewed 2026-10-11 at `05b645d` on `javascript`; backend notes updated later that day at `4a6527e`. Source was inspected; no build, server, or live request was run for this documentation update. Hosted success below is owner-reported. Actual Render settings were not audited.

## Choose the correct branch workflow

| Branch at review | Frontend | Backend distinction |
|---|---|---|
| `javascript` (`4a6527e`) | Plain HTML/CSS/JavaScript modules; CDN MapLibre; Node copy/config build | PostGIS query annotation transforms to EPSG:4326; CORS includes the JavaScript site and local port 5500 |
| `main` and `react` (`4810393`) | React/TypeScript/Vite, npm package manifest and lockfile, MapView component | PostGIS query annotation transforms to EPSG:4326; older CORS origin list |

These are local branch and remote-tracking snapshots without a fetch. A branch changes the entire repository, not only `frontend`. The owner chose the older `caf8414` baseline for JavaScript in September, preserving the React work separately. Returning to React is undecided. Ignored configuration, `node_modules`, and `dist` can remain across branch switches; their presence does not establish the active stack. Preserve local work before switching.

## Current JavaScript files

- `frontend/index.html`: page regions and MapLibre JS/CSS pinned to CDN version 5.14.0.
- `frontend/components/map.js`: imports local configuration, creates the MapTiler `dataviz-v4-dark` basemap centered at `[-90, 45]`, zoom 4.5, and loads locations after the map's load event. The custom-style variable is currently unused.
- `frontend/components/layers/locations.js`: loads `${apiBaseUrl}/locations/` as GeoJSON and draws white circles with black outlines.
- `frontend/css/theme.css`, `base.css`, `layout.css`, `components.css`, `typography.css`: shared values, page defaults, grid sizing, panel appearance, and heading styles respectively. HTML loads them in that order.
- `frontend/build.mjs`: copies HTML, CSS, and components to `dist`, then generates configuration. It uses Node built-ins; this branch has no npm manifest, bundler, or TypeScript compiler.

The desktop grid uses a 240px sidebar, flexible map/data column, content-sized header, and roughly 2:1 map/data rows. Panels can shrink; sidebar/data overflow scrolls. There is no mobile breakpoint. The only sidebar/data contents are headings; search, tables, charts, selection, and loading/error messages are future work.

## Local development

In **VS Code**, provide the ignored `frontend/config.js` module with named exports `API_BASE_URL` and `MAPTILER_KEY`. Use a local API base such as `http://127.0.0.1:8000/api`, or the hosted API base `https://wi-pfas-api.onrender.com/api`. Do not append `/locations/`; the layer module does that. Supply your browser-use MapTiler key privately. This review did not inspect its value or account restrictions.

The imported file must exist: the fallback API address in `map.js` cannot recover from a missing module. Browser-delivered configuration is public, even when generated from hosting environment variables. Never place database credentials or server secrets in it.

The owner's recorded local frontend address is `http://127.0.0.1:5500/frontend/index.html`, served from the repository root. Use the existing VS Code local HTTP server if configured; do not open HTML using `file://`. An alternative using the existing Python environment is below. In **Miniforge Prompt (cmd.exe)**, from the **repository root**, with **`wi-pfas` active**:

```bat
python -m http.server 5500 --bind 127.0.0.1
```

Use one server on that port. Open the recorded local address in your browser. If configuration targets the local API, start Django separately using [BACKEND_SETUP.md](BACKEND_SETUP.md), in another Miniforge Prompt with `wi-pfas` active and `backend` as working directory. Stop servers with Ctrl+C. The frontend's exact origin must be allowed by the backend; `localhost` and `127.0.0.1` are different origins.

## Render JavaScript Static Site

The owner set up [the JavaScript frontend](https://wi-pfas-dashboard.onrender.com/) in September and confirmed its location layer working on October 6 after build and CORS fixes.

| Setting | Recorded configuration |
|---|---|
| Service type | Static Site |
| Branch | `javascript` |
| Root Directory | `frontend` |
| Build Command | `node build.mjs` |
| Publish Directory | `dist` |
| Environment variable names | `API_BASE_URL`, `MAPTILER_KEY` |

Set the API base to the hosted service's `/api` path, and provide the browser-use MapTiler key privately. The build fails if either input is missing. It reads Node's environment, not local `config.js`, and writes named exports using `JSON.stringify()` to quote values safely. Do not commit generated `dist` or personal configuration. The script copies over an existing `dist`; it does not remove stale output first.

To run the same build locally later, use **Miniforge Prompt**, **`wi-pfas` active**, working directory **`frontend`**, with the two configuration variables already supplied privately to that prompt:

```bat
node build.mjs
```

Node/npm installation through mamba was owner-confirmed during the React lessons; this update did not recheck local versions. No npm install/build command is defined on the JavaScript branch. A previous Render failure came from using `build.mjs` alone instead of invoking it with Node.

The Django service must deploy code allowing `https://wi-pfas-dashboard.onrender.com`. On October 6 the owner requested switching the backend to `javascript`, then reported that hosted locations loaded. This supports the recorded workflow but does not independently establish the current dashboard branch or deployed commit. The API address stays separate from the static site's address.

## Preserved React version and next exercise

React source, Vite configuration, package manifest/lockfile, and MapLibre integration exist on `main`/`react`. The owner confirmed development/build/preview and hosted map operation at [the earlier frontend address](https://wi-pfas-frontend.onrender.com/). That version uses npm-managed MapLibre and explicit worker setup. Its npm scripts are branch-specific; inspect the manifest before resuming it.

Current learning priority is plain JavaScript and the owner's CSS. shadcn/ui, mapcn, and glasscn are appearance references. Bootstrap was considered, Tailwind set aside, and Tabulator/Chart.js acceptable candidates; none is installed here. Material UI remains relevant only to a possible React return.

The latest proposed exercise is a visible label associated with a sidebar `type="search"` input, using `location-search` as the ID. It has not been implemented. Offer hints first; review the owner's attempt, then introduce reusable input styling/focus appearance and filtering as separate steps. The October 6 performance deferral was superseded by the October 11 backend exercise: query-time transformation is now implemented on JavaScript. Remaining latency is being investigated separately; see [BACKEND_SETUP.md](BACKEND_SETUP.md#performance-measurements-and-next-experiment). The sidebar input remains the next frontend exercise when the owner returns to it.
