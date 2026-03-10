# FastAPI Setup

## Phase 1: Environment

1. create venv: `python -m venv .venv`
2. activate: `source .venv/bin/activate`
3. install deps: `pip install "fastapi[standard]"`

## Phase 2: Code

1. create `main.py`:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}
```

## Phase 3: Run

1. start server: `fastapi dev main.py`
2. access: `http://127.0.0.1:8000`
