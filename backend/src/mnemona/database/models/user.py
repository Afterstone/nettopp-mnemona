import datetime as dt

from sqlalchemy import Column, DateTime, Integer, String

from ._base import Base


class User(Base):
    __tablename__ = "User"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True, nullable=False)
    username = Column(String, unique=True, nullable=False)

    registered_at = Column(DateTime, default=dt.datetime.utcnow)
    updated_at = Column(DateTime, default=dt.datetime.utcnow, onupdate=dt.datetime.utcnow)

    def __repr__(self) -> str:
        return f"User(id={self.id}, email={self.email}, username={self.username})"
