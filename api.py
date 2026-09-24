from fastapi import FastAPI

# Create the application
app = FastAPI(title="LockIn")

# Connect URL to a function
@app.get("/api/health")
def health_check():
	return {"status": "ok"}



# Starting backend: python -m uvicorn api:app --reload --port 8001
