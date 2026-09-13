# Project context

Reviewed 2026-09-13 against commit `d6cba739edd4239acc08361fe18adc1a231a7b54` and the accessible chats inventoried in [CHAT_SYNTHESIS.md](CHAT_SYNTHESIS.md). This is a dated snapshot, not an assertion about future repository state.

**Evidence labels:** Confirmed means observed in the checkout or this review's execution. Historical intention means stated by the owner in a chat. Proposed means suggested but not established as a final choice. Unresolved means available evidence does not settle it.

## Purpose, audience, and learning objectives

**Historical intention:** Build a more capable and visually polished version of the Wisconsin DNR PFAS viewer, with filtering, searching, highlighting, and potentially hydrography context. The owner has environmental science, geology, GIS, and environmental consulting experience and wants to grow as a full-stack GIS developer.

The immediate audience is the owner and people reviewing the learning work. An eventual audience of people exploring Wisconsin environmental data is implied by the concept; specific public/professional user personas have not been agreed.

Learning objectives recovered from the chats:

- Clean environmental sampling data reproducibly with Python and understand how it should be modeled.
- Connect a spatial database, backend API, and interactive frontend.
- Explore React and TypeScript without taking on too much complexity at once.
- Learn coordinated maps, tables, charts, filters, and detail views.
- Practice Git, portable environments, documentation, secret handling, and earlier deployment preparation.
- Write the application code personally, using assistants for explanation, steps, syntax, and debugging unless direct edits are requested.

The separate **Project Location Map** was a predecessor learning exercise. Its PostgreSQL/Django/JavaScript application and reported Render deployment are background experience, not capabilities of this repository.

## Current capabilities and architecture

**Confirmed:** The repository contains an exploratory data-cleaning workflow, not a running dashboard. There is no frontend, backend, API, database schema, map renderer, authentication, deployment configuration, or automated test suite.

Existing layout, with the documentation added by this review:

```text
README.md
AGENTS.md
.gitignore
docs/
  PROJECT_CONTEXT.md
  DECISIONS.md
  CHAT_SYNTHESIS.md
notebooks/
  Surface Water and Fish Tissue.ipynb
data/raw/                 # ignored; local source CSV exists on this machine
z/                        # ignored; local GIS/Excel files and scratch notebook
001.code-workspace        # ignored; opens this folder, no custom settings
```

Before this documentation task, Git tracked only README, .gitignore, and the notebook. The initial worktree was clean on `main`; local `HEAD` and `origin/main` pointed to `d6cba73`. No fetch was performed, so this does not verify the current server state. Six commits were visible, from initial cleanup work on 2026-07-29 through cleanup changes on 2026-08-04.

The notebook imports `pathlib.Path` and pandas. Its six populated code cells:

1. Locate the repository root from the working directory and read the raw CSV.
2. Unpivot `PFOS_MEASURE` and `PFOA_MEASURE`, retaining `OBJECTID`, `COMMENTS`, and `DATE_YEAR`.
3. Split slash-separated measurement text into columns and preserve the complete source measure in `original`.
4. Unpivot split columns `0, 1, 2, 3` into rows and drop null parts.
5. Apply three text corrections, split dates/results at a colon, derive `result_num` and a text `flag`.
6. Combine year and month/day into `date` and display one selected source object's rows.

The final in-memory columns are `OBJECTID`, `COMMENTS`, `DATE_YEAR`, `analyte`, `original`, `month-day`, `result_num`, `flag`, and `date`. There is no cleaned file export or database load. Four trailing cells are empty. One saved display output remains.

**Proposed architecture:** Cleaned data -> PostgreSQL/PostGIS -> Django/REST API -> JavaScript frontend with coordinated map, table, and charts. Historical suggestions included Django REST Framework, React, TypeScript, Vite, Leaflet or MapLibre GL JS, TanStack Table, and Recharts/ECharts/Chart.js. None is installed or configured in this checkout. Suggested `SamplingLocation`, `SampleEvent`, and `AnalyticalResult` models are conceptual only.

## Data, services, and CRS

**Confirmed local input:** `data/raw/PFAS Sample Sites - Surface Water and Fish Tissue.csv`. README describes exporting the DNR layer through QGIS. The file is ignored, so another clone needs a separately obtained copy.

Observed input columns:

```text
OBJECTID, wkt_geom_EPSG_3071, PRIMARY_STATION_NAME, TYPE_SPECIFIC_CODE,
DATE_YEAR, SURFACE_WATER_FLAG, FISH_FLAG, PFOS_MEASURE, PFOA_MEASURE,
COMMENTS, PDF_PRIMARY_LINK, PDF_SECONDARY_LINK
```

The local CSV has 367 rows and 12 columns. All 734 PFOS/PFOA measure cells are nonempty, containing 996 slash-separated parts; the maximum is four parts per measure. These are snapshot counts, not completeness guarantees or counts of unique stations.

**Historical service references:** The planning chat identified the following. Current availability, schemas, coverage, and terms must be checked before a new import; these are not configured application integrations.

| Source | Recovered purpose/status |
|---|---|
| [Wisconsin DNR PFAS viewer](https://dnrmaps.wi.gov/H5/?viewer=WI_PFAS) | Product reference selected by the owner. |
| [DNR PFAS MapServer](https://dnrmaps.wi.gov/arcgis2/rest/services/EM_PFAS/EM_PFAS_MAPLAYERS_PUBLIC_EXT/MapServer) | Chat reported layers 1/2 for open/closed sites, 10 for surface water/fish tissue, and 801/802/803 for fish advice. |
| [Surface water/fish tissue layer 10](https://dnrmaps.wi.gov/arcgis2/rest/services/EM_PFAS/EM_PFAS_MAPLAYERS_PUBLIC_EXT/MapServer/10) | Historical source of current cleanup work. This review's web fetch failed; live metadata was not confirmed. |
| [Municipal PFAS sampling](https://dnrmaps.wi.gov/arcgis2/rest/services/DG_Groundwater_Retrieval_Network/DG_Municipal_System_PFAS_Sampling_Ext/MapServer/0) | Historically described as categorical sampling summaries, not a complete analytical result table. |
| [Private Well PFAS Shallow Groundwater Study](https://services5.arcgis.com/Ul9AyFFeFTjf08DW/arcgis/rest/services/Private_Well_PFAS_Shallow_Groundwater_Study_Results/FeatureServer) | Alternative detailed chemistry source; chat identified section polygons at layer 0 and result table 3. Local scratch artifacts exist; no tracked integration. |
| [Drinking Water System Portal](https://apps.dnr.wi.gov/dwsportalpub/) | Historical exploration of query-based exports; statewide bulk extraction and complete geometry were not established. |
| [EPA UCMR occurrence data](https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule), [Water Quality Portal](https://www.waterqualitydata.us/webservices_documentation/) | Other historical candidates for detailed chemistry. No import implemented. |

USGS National Hydrography Dataset was an owner-proposed context layer. No specific hydrography service or dataset version is selected.

**CRS:** The input geometry column is labeled `wkt_geom_EPSG_3071`. That label alone does not verify the export's actual coordinates, datum transformation, or the source service CRS. The notebook treats the CSV as a plain table; it neither parses geometry nor reprojects it, and geometry is omitted from the long-format result. Confirm the QGIS export settings and source metadata before spatial work. A future RFC 7946 GeoJSON output must use WGS 84 longitude/latitude in decimal degrees, requiring an actual transformation from the verified source CRS where necessary. See [RFC 7946, sections 3.1.1 and 4](https://www.rfc-editor.org/rfc/rfc7946.html#section-4). No database SRID or web-map CRS decision has been made.

**Data interpretation remains unresolved:** Confirm measurement units, the meaning of `*` and `**`, non-detect/less-than semantics, and whether each result represents water or fish tissue using authoritative metadata/PDFs. Preserve the source's location precision if private-well data is used; do not infer exact well locations from generalized geometry.

## Development and verification workflow

**Verified environment:** A local Miniforge environment named `wi-pfas` contains Python 3.12.13, pandas 3.0.3, and ipykernel. Notebook metadata agrees on Python and display name. The ordinary shell's `python` is instead Python 3.14.2 without pandas. This is a machine-specific finding, not a portable interpreter path or a compatibility judgment.

**Package manager:** Miniforge/mamba was the owner's historical preference and a local mamba launcher exists. There is no committed `environment.yml`, requirements file, lockfile, or Python version pin. The laptop chat proposed a pip/`.venv` setup; there is no evidence it was completed. Choose and record a reproducible setup before treating either recipe as canonical.

To use the existing setup:

1. Open the clone's root in VS Code with Python and Jupyter support.
2. Obtain the raw CSV at the exact relative path above. README gives the general QGIS route; a precise export recipe is still missing.
3. Select the intended environment as the notebook kernel. In a shell initialized for mamba, `mamba activate wi-pfas` selects the verified local environment if it exists on that machine.
4. Verify the active shell interpreter with `python --version` and `python -c "import pandas as pd; print(pd.__version__)"`. Shell activation and notebook kernel selection are separate.
5. Restart the kernel and run populated cells in order with the working directory at the root or `notebooks/`. The path logic does not support arbitrary working directories.
6. Inspect parsed dates, numeric values, flags, and source-row traceability. Review outputs before sharing; keep raw data and scratch files local.

No application start/build/lint/test command is configured. Use `git status --short --branch` and `git diff --check` for change review. For an already configured second clone, check for local edits before `git pull --ff-only`; resolve divergence deliberately. Committed documentation can travel through Git when the owner chooses to commit/push; ignored data, environments, and scratch files require separate setup.

**Review validation:** All code cells passed Python syntax parsing. The six populated cells were executed in order in memory using the existing environment and local CSV, without saving the notebook or writing cleaned data. Result: 996 rows, zero missing dates, and zero date-year mismatches against `DATE_YEAR`. There were 98 missing numeric results: 93 non-detect text cases, four no-sample cases, and one less-than case. These categories were inspected through resulting flags; their scientific interpretation is not validated. This successful run is a smoke check against one local snapshot, not a comprehensive test suite.

## Completed work and current progress

**Confirmed completed:** Repository initialization; shareable notebook location and relative input path; ignore rules; README describing the initial dataset; working unpivot/split/date parsing on the current CSV. This review adds repository-based guidance, context, decisions, and a chat inventory.

**In progress, inferred from code and latest development history:** Finishing trustworthy normalization of the surface-water/fish-tissue measurements. The notebook is exploratory and not yet a reusable validated import pipeline. No uncommitted application changes were present at the start of this review. The exact next coding task has not been reconfirmed with the owner.

## Known bugs, limitations, and technical debt

- **Confirmed bug:** Cell 6 calls `df_unpivot.drop(columns=['DATE_YEAR', 'month-day'])` without assigning its return or using `inplace=True`; the columns remain.
- **Confirmed limitation:** The second unpivot hardcodes four split columns. Inputs requiring more than four parts can lose extra parts; inputs whose maximum is fewer than four can fail on missing columns. The current CSV happens to fit.
- **Confirmed limitation:** Numeric coercion makes distinct text cases missing; it does not extract a numeric detection limit from the less-than case. Flags retain inconsistent spaces/capitalization and have no normalized interpretation.
- **Confirmed limitation:** Geometry, station names, media flags, and PDF links remain in `df_raw` but are omitted from the derived table. Future exports must retain or reliably join provenance and location/media information.
- **Unvalidated assumptions:** Three hardcoded text substitutions repair specific source strings without a documented source correction log. Their intended dates need confirmation.
- **Validation gap:** Mixed-format date parsing succeeded on this snapshot but is not a guarantee for future exports. The [pandas documentation](https://pandas.pydata.org/docs/reference/api/pandas.to_datetime.html) describes per-element inference for `format='mixed'` and notes that `yearfirst` is a preference rather than strict validation.
- **Reproducibility gaps:** No environment manifest, source export date/query, exact QGIS recipe, data dictionary, cleaned-output contract, repeatable validation suite, or tracked import script.
- **Publication gaps:** One notebook output is currently saved despite an older chat reporting zero outputs. No LICENSE file was found; code licensing and data reuse/attribution terms remain unrecorded.
- **Coverage discrepancy:** An earlier chat reported 402 source features; this local CSV has 367 rows. Export filtering, source updates, or another cause are possible but unconfirmed.

## Plans and recommended milestones

**Owner intentions:** A polished Wisconsin PFAS explorer; filtering/search/highlighting; richer data exploration; possible hydrography background. Map/table/chart coordination matches the original dashboard concept.

**Historical assistant proposals, not a committed backlog:** Layer toggles, feature detail panels, summary cards, time-series plots, screening-level comparisons, administrative imports, and the proposed web stack. Units and authoritative comparison criteria must be settled before quantitative comparisons.

**Recommended sequence for owner review:**

1. Document the exact data acquisition recipe, snapshot identity, schema, CRS, units, qualifiers, and known source anomalies.
2. Finish normalization and validation in small learning steps; preserve original text, distinguish missing-result categories, and define expected output and provenance.
3. Capture the working environment and add focused parser checks covering actual irregular inputs. Move stable logic into a script when ready.
4. Choose the smallest web slice and record framework/map-library decisions. Historical suggestion: one cleaned layer through PostGIS and a Django API onto a map with a table/detail view.
5. Add coordinated filtering/charts and then additional layers/hydrography. Plan a small early deployment after a runnable slice exists.

## Questions for the owner

- Is recreating the broader PFAS viewer still the goal, with surface water/fish tissue as the first layer?
- Which Python environment approach should both computers use, and has the laptop setup actually been completed?
- What export date, filters, and QGIS settings produced the 367-row CSV?
- Where are the authoritative units, qualifier definitions, and explanations for malformed dates?
- Which suggested frontend/map libraries, deployment target, and first web features should become accepted decisions?
- Are there additional project chats on the other computer that should be added to the inventory?

Update this file as these answers become available; keep the historical evidence in CHAT_SYNTHESIS and accepted choices in [DECISIONS.md](DECISIONS.md).
