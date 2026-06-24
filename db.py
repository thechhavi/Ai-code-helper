from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import sessionmaker, Session, DeclarativeBase
from datetime import datetime

# SQLite database
DATABASE_URL = "sqlite:///./app.db"

# Engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # needed for SQLite + FastAPI
)

# Session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class (NEW SQLAlchemy 2.0 style - correct way)
class Base(DeclarativeBase):
    pass


# -------------------------
# Database Tables
# -------------------------

class ContactMessage(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)
    email = Column(String(100), index=True)
    message = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)


class CodeHistory(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(Text)
    response = Column(Text)
    language = Column(String(50))
    action = Column(String(20))  # explain, debug, improve
    timestamp = Column(DateTime, default=datetime.utcnow)


# -------------------------
# DB Utilities
# -------------------------

def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()