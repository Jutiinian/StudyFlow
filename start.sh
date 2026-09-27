#!/bin/bash
# (cd backend && uv run uvicorn main:app --reload --port 8000) &
python3 -m uvicorn api:app --reload --port 8001 &
(cd frontend && npm run dev) &
wait
