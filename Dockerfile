
FROM node:18-alpine as build-frontend

ARG VITE_PORT=80
ARG VITE_APP_API_URL=/api/v1
ARG VITE_APP_AUTH_JWT_PUBLIC_KEY=""

WORKDIR /app

COPY ./frontend/package*.json ./frontend/package-lock.json ./
RUN npm ci

COPY ./frontend/ ./

RUN npm run build

FROM python:3.10-slim-bullseye as target

WORKDIR /app

RUN \
    adduser --disabled-login nopriv \
    && chown -R nopriv /app \
    # Make flit install packages only, to cache package installation.
    && mkdir -p /app/src/mnemona/

COPY ./backend/src/mnemona/__init__.py src/mnemona/__init__.py
COPY \
    ./backend/pyproject.toml \
    ./backend/setup.cfg \
    ./backend/README.md \
    ./
RUN pip install --no-cache-dir . && rm -rf src/

# Add the project source code to the package.
# NB: We have to delete source because Docker complains about
#   multiple versions of folders/files from the previous COPY.
COPY ./backend/src/ .
RUN pip install --no-cache-dir .

COPY --from=build-frontend /app/dist ./dist

ENV VERBOSE=False
ENV UVICORN_RELOAD=False

# Database
ENV AUTH_SERVER_ENDPOINT="http://localhost:80"
ENV MNEMONA_DB_CONNECTION_STRING="sqlite:///mnemona.db"

# Server
ENV HOST="0.0.0.0"
ENV PORT=80
ENV CORS_ORIGINS="*"

USER nopriv
CMD [ \
    "bash", "-c", \
    "python -m mnemona.main" \
]
