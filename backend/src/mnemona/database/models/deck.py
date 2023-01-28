import datetime as dt

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from ._base import Base


class Deck(Base):
    __tablename__ = "Deck"

    id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, ForeignKey("User.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)

    created_at = Column(DateTime, default=dt.datetime.utcnow)
    updated_at = Column(DateTime, default=dt.datetime.utcnow, onupdate=dt.datetime.utcnow)

    owner = relationship("User", cascade="all, delete-orphan", back_populates="decks")

    def __repr__(self) -> str:
        return f"Deck(id={self.id}, name={self.name}, description={self.description})"


class DeckContents(Base):
    __tablename__ = "DeckContents"

    deck_id = Column(Integer, ForeignKey("Deck.id"), primary_key=True)
    card_id = Column(Integer, ForeignKey("Card.id"), primary_key=True)

    def __repr__(self) -> str:
        return f"DeckContents(deck_id={self.deck_id}, card_id={self.card_id})"
