from fastapi import APIRouter
from . import users, catalog, products

api_router = APIRouter(prefix="/api")
api_router.include_router(users.router)
api_router.include_router(catalog.router)
api_router.include_router(products.router)
@api_router.get("/ping")
def ping():
    return "pong"