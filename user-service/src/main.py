from fastapi import FastAPI
from src.api.routes import router

app = FastAPI(title="User Service")

app.include_router(router)
