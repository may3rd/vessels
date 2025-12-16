# Vessels Toolkit

Utilities for sizing, evaluating, and visualizing common process vessels.  
The repository contains:

- A Python library (`vessels/`) with shape-specific subclasses that compute volumes, wetted areas, surge time, and more.
- An interactive CLI (`main.py`) that guides you through configuring a vessel and can export SVG drawings.
- A Next.js front-end (`web-app/`) that reuses the same design rules for a browser-based experience.

## Repository Layout

```
vessels/            Core Python package with vessel definitions and drawing helpers
main.py             Interactive CLI entry point
tests/              Pytest coverage for core calculations
web-app/            Next.js UI that wraps the Python logic via an API layer
```

## Python Toolkit

### Prerequisites

- Python 3.10+ (project developed and tested on 3.12)
- `pip` and `virtualenv` (recommended)

Install the dependencies:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Using the CLI

Run the helper with optional flags or interactively:

```bash
python main.py --list                      # show available vessel types
python main.py -t vertical-flat-vessel \
               -d 3.5 -l 10 \
               --high-level 8 --low-level 2 \
               --output vessel.svg
```

If any required argument is omitted, the CLI prompts for it (unless running non-interactively).  
When drawing is enabled the SVG output is saved to the provided path (default `vessel.svg`).

### Running Tests

```bash
source .venv/bin/activate
PYTHONPATH=. pytest
```

`PYTHONPATH=.` ensures the test suite imports the local `vessels` package.

## Web Application

The `web-app/` directory is a standard Next.js project.

### Setup

```bash
cd web-app
npm install
npm run dev
```

Visit `http://localhost:3000` to interact with the UI.

## Contributing

1. Make sure new Python code includes tests (`tests/`).
2. Run `PYTHONPATH=. pytest` and, when relevant, `npm test` inside `web-app/`.
3. Keep SVG outputs and README examples up-to-date when you add new vessel capabilities.

## License

Chemical Engineering Design Library license terms apply (MIT-style, see `LICENSE.txt`).
