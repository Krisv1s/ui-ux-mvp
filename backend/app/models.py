from sqlalchemy import Column, Integer, String, ForeignKey, Enum, DateTime, Float, ForeignKeyConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum as PyEnum
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    hashed_password = Column(String)

class SupplierType(str, PyEnum):
    LOCAL = "local"
    IMPORT = "import"

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    type = Column(Enum(SupplierType), nullable=False)

    products = relationship("ProductSupplier", back_populates="supplier")

class ProductType(Base):
    __tablename__ = "product_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    src = Column(String(255))
    type = Column(Integer, ForeignKey("product_types.id"))

    suppliers = relationship("ProductSupplier", back_populates="product")

class ProductSupplier(Base):
    __tablename__ = "product_suppliers"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    price = Column(Float, nullable=False)

    product = relationship("Product", back_populates="suppliers")
    supplier = relationship("Supplier", back_populates="products")
    orders = relationship("Order", back_populates="product_supplier")

class OrderStatus(str, PyEnum):
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    product_supplier_id = Column(Integer, ForeignKey("product_suppliers.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    address = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)

    product_supplier = relationship("ProductSupplier", back_populates="orders")
    user = relationship("User")