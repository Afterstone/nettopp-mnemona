import typing as t

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.session import Session

from nfb.config import MNEMONA_DB_CONNECTION_STRING, VERBOSE

ENGINE = create_engine(MNEMONA_DB_CONNECTION_STRING, echo=VERBOSE)

SessionMaker = sessionmaker(bind=ENGINE)


def get_db() -> t.Generator[Session, None, None]:
    session = SessionMaker()
    try:
        yield session
    finally:
        session.close()
