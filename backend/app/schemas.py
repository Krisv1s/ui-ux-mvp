from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr

class UserRegister(BaseModel):
    email: EmailStr
    name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfile(BaseModel):
    name: str
    email: EmailStr

    class Config:
        from_attributes = True

class OrderInfo(BaseModel):
    id: int
    date: datetime
    status: str

class UserProfileWithOrders(UserProfile):
    orders: List[OrderInfo]

class Product(BaseModel):
    id: int
    name: str
    type: str
    img_link: Optional[str]

class CatalogProduct(Product):
    price: float

class CatalogResponse(BaseModel):
    count: int
    data: List[CatalogProduct]

class ProductTypeResponse(BaseModel):
    id: int
    name: str

class ProductSupplier(BaseModel):
    id: int
    name: str
    price: float
    type: str

class ProductWithSuppliers(Product):
    suppliers_list: List[ProductSupplier]

class OrderCreate(BaseModel):
    product_id: int
    supplier_id: int
    address: str
    phone: str


class OrderResponse(BaseModel):
    id: int
    user_id: int
    address: str
    phone: str
    date: datetime
    status: str