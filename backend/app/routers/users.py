from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import models, schemas, auth
from database import get_db
from fastapi import Response

router = APIRouter(tags=["users"])

@router.post("/register", response_model=schemas.UserProfile)
def register_user(response: Response, user: schemas.UserRegister, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter_by(email=user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, name=user.name, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    access_token_expires = timedelta(minutes=30)
    access_token = auth.create_access_token(
        data={"sub": db_user.email},
        expires_delta=access_token_expires,
    )

    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=1800,
        samesite="lax",
    )
    return db_user

@router.post("/login")
def login_for_access_token(
        response: Response,
        user: schemas.UserLogin,
        db: Session = Depends(get_db),
):
    db_user = db.query(models.User).filter_by(email=user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=30)
    access_token = auth.create_access_token(
        data={"sub": db_user.email},
        expires_delta=access_token_expires,
    )

    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=1800,
        samesite="lax",
    )

    return {"status": "ok"}
@router.get("/profile", response_model=schemas.UserProfileWithOrders)
def read_user_profile(
        current_user: models.User = Depends(auth.get_current_user),
        db: Session = Depends(get_db),
):
    user_orders = db.query(models.Order) \
        .filter_by(user_id=current_user.id) \
        .order_by(models.Order.date.desc()) \
        .all()
    return schemas.UserProfileWithOrders(
        **current_user.__dict__,
        orders=[
            schemas.OrderInfo(
                id=order.id,
                date=order.date,
                status=order.status.value
            )
            for order in user_orders
        ]
    )