# Set up a quick FastAPI test app.
import httpx
import uvicorn
from fastapi import Depends, FastAPI, Response
from pydantic import BaseModel

from .config import AUTH_SERVER_ENDPOINT, HOST, PORT, UVICORN_RELOAD
from .database import Session, get_db

app = FastAPI()


@app.get("/")
async def root(db: Session = Depends(get_db)):
    return {"message": "Hello World"}


class UserLoginDetails(BaseModel):
    email: str
    password: str


@app.post("/login")
async def login(user_data: UserLoginDetails):
    email = user_data.email
    password = user_data.password
    url = f"{AUTH_SERVER_ENDPOINT}/api/v1/login"

    async with httpx.AsyncClient() as client:
        response = await client.post(url, data={"email": email, "password": password})

        if not response.status_code == 200:
            return Response(status_code=response.status_code, content=response.text)

        return response.json()

if __name__ == '__main__':
    uvicorn.run(
        "mnemona.main:app",  # type: ignore
        host=HOST,
        port=PORT,
        reload=UVICORN_RELOAD
    )
