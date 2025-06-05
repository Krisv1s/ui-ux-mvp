from typing import List, Optional

from fastapi import APIRouter, Depends
from fastapi.params import Query
from sqlalchemy import func
from sqlalchemy.orm import Session
import models, auth
from database import get_db

from schemas import CatalogResponse, CatalogProduct, ProductTypeResponse

router = APIRouter(tags=["catalog"])

@router.get("/product_type", response_model=List[ProductTypeResponse])
def get_product_type(
        db: Session = Depends(get_db),
):
    product_types = db.query(models.ProductType).all()
    return [
        {"id": pt.id, "name": pt.name}
        for pt in product_types
    ]


@router.get("/catalog", response_model=CatalogResponse)
def get_products(
        page: int = Query(1, ge=1, description="Номер страницы"),
        product_type: Optional[str] = Query('', description="Фильтр по типу продукта (массив type_id)"),
        db: Session = Depends(get_db)
):
    query = db.query(
        models.Product.id,
        models.Product.name,
        models.Product.type,
        models.Product.src,
        func.min(models.ProductSupplier.price).label("price")
    ).join(
        models.ProductSupplier,
        models.Product.id == models.ProductSupplier.product_id
    ).group_by(
        models.Product.id
    )

    type_ids = [int(t.strip()) for t in product_type.split(",") if t.strip().isdigit()]
    if product_type:
        query = query.filter(models.Product.type.in_(type_ids))

    products = query.offset((page - 1) * 20).limit(20).all()
    count = query.offset(page * 20).count()

    return {
        "count": count,
        "data": [
            CatalogProduct(
                id=product.id,
                name=product.name,
                type=(db.query(models.ProductType).get(product.type)).name,
                img_link=product.src,
                price=product.price
            )
            for product in products
        ]
    }