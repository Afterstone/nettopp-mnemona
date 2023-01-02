# Set up a quick FastAPI test app.
import uvicorn
from fastapi import Depends, FastAPI

from .config import HOST, PORT
from .database import Session, get_db

app = FastAPI()


@app.get("/")
async def root(db: Session = Depends(get_db)):
    return {"message": "Hello World"}


if __name__ == '__main__':
    uvicorn.run(
        app,  # type: ignore
        host=HOST,
        port=PORT
    )
