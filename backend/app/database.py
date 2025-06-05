from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

from initial_data import init_test_data

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////database.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    init_test_data(db)
    try:
        yield db
    finally:
        db.close()