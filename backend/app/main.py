from fastapi import FastAPI

from database import engine, Base
from routers import api_router

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(api_router)
