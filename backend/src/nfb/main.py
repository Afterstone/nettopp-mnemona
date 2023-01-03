# Set up a quick FastAPI test app.
import uvicorn
from fastapi import Depends, FastAPI

from .config import HOST, PORT, UVICORN_RELOAD
from .database import Session, get_db

app = FastAPI()


@app.get("/")
async def root(db: Session = Depends(get_db)):
    return {"message": "Hello World"}


if __name__ == '__main__':
    uvicorn.run(
        "nfb.main:app",  # type: ignore
        host=HOST,
        port=PORT,
        reload=UVICORN_RELOAD
    )
