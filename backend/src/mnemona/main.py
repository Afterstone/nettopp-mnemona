# Set up a quick FastAPI test app.
import json

import httpx
import uvicorn
from fastapi import Depends, FastAPI, Request, Response
from starlette.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from starlette.staticfiles import StaticFiles

from .config import (AUTH_SERVER_ENDPOINT, CORS_ORIGINS, HOST, PORT,
                     UVICORN_RELOAD)

# from .database import Session, get_db


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/login")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginDetails(BaseModel):
    email: str
    password: str


class RefreshDetails(BaseModel):
    refresh_token: str


@app.post("/api/v1/login")
async def login(request: Request):
    user_data = LoginDetails(**(await request.json()))
    email = user_data.email
    password = user_data.password
    url = f"{AUTH_SERVER_ENDPOINT}/api/v1/login"

    async with httpx.AsyncClient() as client:
        response = await client.post(
            url,
            headers={"Content-Type": "application/json"},
            content=json.dumps({"email": email, "password": password}),
        )

        if not response.status_code == 200:
            return Response(status_code=response.status_code, content=response.text)

        return response.json()


@app.post("/api/v1/refresh")
async def refresh(request: Request, token: str = Depends(oauth2_scheme)):
    url = f"{AUTH_SERVER_ENDPOINT}/api/v1/refresh"

    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers={"Authorization": f"Bearer {token}"})

        if not response.status_code == 200:
            return Response(status_code=response.status_code, content=response.text)

        return response.json()


@app.get("/api/v1/auth-warmup")
async def health():
    url = f"{AUTH_SERVER_ENDPOINT}/api/v1/health"

    async with httpx.AsyncClient() as client:
        response = await client.get(url)

        if not response.status_code == 200:
            return Response(status_code=response.status_code, content=response.text)

        return Response(content=response.text)


class SPAStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        try:
            return await super().get_response(path, scope)
        except Exception as ex:
            if isinstance(ex, HTTPException):
                if ex.status_code == 404:
                    return await super().get_response("index.html", scope)
            raise ex


app.mount("/", SPAStaticFiles(directory="dist", html=True), name="app")

if __name__ == '__main__':
    uvicorn.run(
        "mnemona.main:app",  # type: ignore
        host=HOST,
        port=PORT,
        reload=UVICORN_RELOAD
    )
