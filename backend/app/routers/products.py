from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, auth, schemas
from database import get_db


router = APIRouter(tags=["products"])


@router.get("/product/{id}", response_model=schemas.ProductWithSuppliers)
def get_products(
        id: int,
        db: Session = Depends(get_db)
):
    product = db.query(
        models.Product
    ).get(id)
    if not product:
        raise HTTPException(404, "Product not found")

    suppliers = (db.query(models.Supplier, models.ProductSupplier.price)
        .join(models.Supplier, models.ProductSupplier.supplier_id == models.Supplier.id)
        .filter(models.ProductSupplier.product_id == id)
        .order_by(models.ProductSupplier.price.asc())
        .all())
    return schemas.ProductWithSuppliers(
        id=product.id,
        name=product.name,
        type=(db.query(models.ProductType).get(product.type)).name,
        img_link=product.src,
        suppliers_list=[
            schemas.ProductSupplier(
                id=supplier.id,
                name=supplier.name,
                price=price,
                type=supplier.type
            )
            for supplier, price in suppliers
        ]
    )


@router.post("/order", response_model=schemas.OrderResponse)
def create_order(
        order_data: schemas.OrderCreate,
        current_user: models.User = Depends(auth.get_current_user),
        db: Session = Depends(get_db),
):
    product_supplier = db.query(models.ProductSupplier) \
        .filter(
        models.ProductSupplier.product_id == order_data.product_id,
        models.ProductSupplier.supplier_id == order_data.supplier_id
    ) \
        .first()

    if not product_supplier:
        raise HTTPException(
            status_code=400,
            detail="Указанный товар не доступен у выбранного поставщика"
        )

    new_order = models.Order(
        product_supplier_id=product_supplier.id,
        user_id=current_user.id,
        address=order_data.address,
        phone=order_data.phone,
        date=datetime.now(),
        status="pending"
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return new_order

