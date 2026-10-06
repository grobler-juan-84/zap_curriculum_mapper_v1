# Python tooling

Python supports future processing work for the General Curriculum Mapper:

- JSON / schema validation
- curriculum data processing
- batch utilities
- document processing
- curriculum analysis
- AI workflows (server-side)

This is **not** a web API layer. Prefer scripts and libraries here unless project docs later require a Python service.

## Setup

From this directory:

```bash
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
pip install -e ".[dev]"
```

macOS / Linux:

```bash
source .venv/bin/activate
pip install -e ".[dev]"
```

## Sanity check

```bash
python -m unittest discover -s tests -v
```

No curriculum processing is implemented yet.
