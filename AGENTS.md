# Working on the Wisconsin PFAS Dashboard

This is a personal web GIS learning project: build a Wisconsin PFAS data explorer with a map, tables, charts, and better filtering/search. The owner wants to develop GIS programming and professional development skills by understanding and writing the code.

Before planning substantial work, read [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md) and [docs/DECISIONS.md](docs/DECISIONS.md). Use [docs/CHAT_SYNTHESIS.md](docs/CHAT_SYNTHESIS.md) for historical evidence and coverage limits. Check the repository before treating documented status as current.

## Collaboration and development

- Prefer manageable steps, explanations, syntax help, and debugging guidance during learning discussions. The historical preference is for the owner to write application code; an explicit request to implement or edit authorizes that work.
- Keep scope focused on the requested learning milestone. Do not scaffold a proposed web stack merely because it appears in historical plans.
- Inspect Git status first; preserve unrelated edits and ignored local work. Do not commit or push without an explicit request.
- Keep reusable code outside `z/`; the tracked notebook in `notebooks/` is canonical. Treat raw exports as immutable inputs.
- Use repository-relative paths. The notebook supports a working directory at the repository root or `notebooks/`.
- Keep secrets and machine-specific configuration out of source and documentation. Preserve existing ignore rules for raw/intermediate/processed data, scratch files, environments, and real `.env` files. Review notebook outputs before publishing.
- Preserve original measurement text and provenance. Confirm units, sample media, qualifier meanings, dates, and CRS before interpreting or mapping results; do not equate missing or non-detect results with zero.
- Update context and decision records when scope or architecture changes. Distinguish verified implementation, user intentions, assistant proposals, and unresolved questions.

## Stack and commands

The implemented workflow is Python, pandas, and a Jupyter notebook. See PROJECT_CONTEXT for the verified environment and setup gaps. No package-manager manifest, application server, build script, or automated test command is defined. PostgreSQL/PostGIS, Django, and a JavaScript frontend are future directions; mapping/framework choices remain open.

From the repository root, in the selected Python environment:

```powershell
python --version
python -c "import pandas as pd; print(pd.__version__)"
git status --short --branch
git diff --check
```

Open `notebooks/Surface Water and Fish Tissue.ipynb` in VS Code, select the project kernel, then restart and run cells in order. Supply the local CSV as documented in PROJECT_CONTEXT. Inspect resulting data as well as execution success.
