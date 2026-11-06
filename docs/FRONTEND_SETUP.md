# Frontend setup and deployment

Reviewed 2026-11-06 at `1f0794f` on `javascript`, comparing changes since documentation commit `d65dbdb` (October 14). Source and related chats were inspected; no build, server, or live request was run. Hosted success below remains dated owner-reported evidence; current Render settings and deployed versions were not audited.

## Choose the correct branch workflow

| Branch at review | Frontend | Backend distinction |
|---|---|---|
| `javascript` (`1f0794f`) | Plain HTML/CSS/JavaScript modules; CDN MapLibre; Node copy/config build; themes and two-layer sidebar | Two GeoJSON APIs, sampling-location transformation, connection reuse, and 60-second caches on both lists; CORS includes the JavaScript site and local port 5500 |
| `main` and `react` (`4810393`) | React/TypeScript/Vite, npm package manifest and lockfile, MapView component | PostGIS query annotation transforms to EPSG:4326; older CORS origin list |

These are local branch and remote-tracking snapshots without a fetch. A branch changes the entire repository, not only `frontend`. The owner chose the older `caf8414` baseline for JavaScript in September, preserving the React work separately. Returning to React is undecided. Ignored configuration, `node_modules`, and `dist` can remain across branch switches; their presence does not establish the active stack. Preserve local work before switching.

## Current JavaScript files

- `frontend/index.html`: page regions, labeled theme dropdown, two labeled layer checkboxes with decorative symbol spans, and MapLibre JS/CSS pinned to CDN version 5.14.0.
- `frontend/components/map.js`: creates the initial MapTiler `dataviz-v4-dark` basemap centered at `[-90, 45]`, zoom 4.5. Its `style.load` listener adds each application source/layer when its source is missing, including after style replacement.
- `frontend/components/theme.js`: maps Dark to `dataviz-v4-dark` and Light/Warm to `dataviz-v4-light`; changes the root `data-theme` and calls `map.setStyle(styleURL, {diff: false})`.
- `frontend/components/layers/locations.js` and `PFASsites.js`: load `/locations/` and `/PFASsites/` respectively. Each reads current CSS fill/outline values inside its add function and draws radius-3 circles with 0.5-pixel strokes.
- `frontend/components/sidebar/layer-list.js`: loops over existing list rows using `Object.entries(layerList.children)`, connects each checkbox to the matching MapLibre layer, and reapplies visibility after style reloads.
- `frontend/css/theme.css`, `base.css`, `layout.css`, `components.css`, `typography.css`: shared values, page defaults, grid sizing, panel appearance, and heading styles respectively. HTML loads them in that order.
- `frontend/build.mjs`: copies HTML, CSS, and components to `dist`, then generates configuration. It uses Node built-ins; this branch has no npm manifest, bundler, or TypeScript compiler.

The desktop grid still uses a 240px sidebar, flexible map/data column, content-sized header, and roughly 2:1 map/data rows. Panels can shrink; sidebar/data overflow scrolls. There is no mobile breakpoint or selectable panel arrangement. The sidebar now contains the layer list; the data panel remains a heading. Search, tables, charts, feature selection, and loading/error messages are future work.

## Themes and layer-list behavior

Dark is the HTML default and CSS fallback. A dropdown changes `document.documentElement.dataset.theme`; shared CSS variables recolor the interface. The map does not read CSS automatically: layer-add functions read the current palette when `style.load` recreates them. Full style replacement is deliberate in this implementation; it can redraw/reload overlays. The map listener is registered before the sidebar listeners, so overlays are recreated before checkbox choices are reapplied.

The list is authored in HTML, not generated from map layers or a metadata array. Row IDs are exactly `locations` and `PFASsites`; checkbox IDs are `toggle-` plus the row ID. Labels use those exact input IDs. Each row callback checks `map.getLayer()` before setting its `visibility` to `visible` or `none`. Hiding a layer retains its source; it is not a data filter. The owner reported checkboxes working and explicitly chose to keep `Object.entries()` for now.

Both previews are 12px CSS circles marked `aria-hidden="true"`; their fills share the map's CSS variables. Current differences from the lesson/design intent:

- The suggested outline borders are absent from both previews, although map circles have outlines.
- Warm defines sampling-location colors but no `--pfassites-fill`/`--pfassites-outline` overrides, so PFAS sites use the root/dark values. Whether to keep that appearance is unresolved.
- Theme and checkbox choices survive style changes through the current callbacks, but have no persistence across page reloads. There is no system-theme detection.
- Color reads do not use `.trim()`; the owner explicitly deferred that refinement. No error was reproduced during this documentation review.

For the next owner-run browser check, exercise all themes and all four layer-visibility combinations, including changing theme while one layer is hidden. Compare preview and map colors/outlines and use Tab/Space to check the controls. This review inspected the implementation but did not execute those interactions.

## Local development

In **VS Code**, provide the ignored `frontend/config.js` module with named exports `API_BASE_URL` and `MAPTILER_KEY`. Use a local API base such as `http://127.0.0.1:8000/api`, or the hosted API base `https://wi-pfas-api.onrender.com/api`. Do not append a collection route; the layer modules append `/locations/` and `/PFASsites/`. Supply your browser-use MapTiler key privately. This review did not inspect its value or account restrictions.

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

## Preserved React version and current learning milestone

React source, Vite configuration, package manifest/lockfile, and MapLibre integration exist on `main`/`react`. The owner confirmed development/build/preview and hosted map operation at [the earlier frontend address](https://wi-pfas-frontend.onrender.com/). That version uses npm-managed MapLibre and explicit worker setup. Its npm scripts are branch-specific; inspect the manifest before resuming it.

Current learning priority is plain JavaScript and the owner's CSS. shadcn/ui, mapcn, and glasscn are appearance references. Bootstrap was considered, Tailwind set aside, and Tabulator/Chart.js acceptable candidates; none is installed here. Material UI remains relevant only to a possible React return.

On October 14 the owner explicitly deferred the location-search field in favor of themes, then on November 4 chose the layer-list component. The latest chat exercise was a Sample Locations symbol preview; source now contains previews for both layers. Review those previews and their missing outlines as the next small learning step, before choosing another feature. Offer hints first. Dynamic row generation, icons/info/zoom buttons, expandable legends, theme persistence, and selectable layouts remain proposals rather than implemented capabilities.

Backend connection reuse and response caching remain implemented; the new PFAS-sites list uses the same cache pattern. Hosted cache timings are still unreported in the reviewed chats. See [BACKEND_SETUP.md](BACKEND_SETUP.md#performance-measurements-and-next-experiment).
