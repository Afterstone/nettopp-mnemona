import datetime as dt

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from ._base import Base


class Flashcard(Base):
    __tablename__ = "Card"

    id = Column(Integer, primary_key=True, autoincrement=True)
    question = Column(String, nullable=False)
    answer = Column(String, nullable=False)

    created_at = Column(DateTime, default=dt.datetime.utcnow)
    updated_at = Column(DateTime, default=dt.datetime.utcnow, onupdate=dt.datetime.utcnow)

    owner = relationship("User", back_populates="cards")

    def __repr__(self) -> str:
        return f"Card(id={self.id}, front={self.front}, back={self.back})"


class StudyHistory(Base):
    __tablename__ = "StudyHistory"

    id = Column(Integer, primary_key=True, autoincrement=True)
    card_id = Column(Integer, ForeignKey("Card.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("User.id"), nullable=False)
    confidence = Column(Integer, nullable=False)
    correct = Column(Boolean, nullable=False)

    created_at = Column(DateTime, default=dt.datetime.utcnow)

    user = relationship("User", back_populates="study_history")
    card = relationship("Flashcard", back_populates="study_history")

    def __repr__(self) -> str:
        return (
            f"StudyHistory("
            f"id={self.id}"
            f", card_id={self.card_id}"
            f", user_id={self.user_id}"
            f", confidence={self.confidence}"
            f", correct={self.correct}"
            f")"
        )
