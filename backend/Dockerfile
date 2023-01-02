FROM python:3.10-slim-bullseye

WORKDIR /app

RUN \
    adduser --disabled-login nopriv \
    && chown -R nopriv /app \
    # Make flit install packages only, to cache package installation.
    && mkdir -p /app/src/nfb/

COPY src/nfb/__init__.py src/nfb/__init__.py
COPY \
    pyproject.toml \
    setup.cfg \
    README.md \
    ./
RUN pip install --no-cache-dir . && rm -rf src/

# Add the project source code to the package.
# NB: We have to delete source because Docker complains about
#   multiple versions of folders/files from the previous COPY.
COPY src/ .
RUN pip install --no-cache-dir .

ENV VERBOSE=False

# Database
ENV AUTH_SERVER_ENDPOINT="http://localhost:8001"
ENV FLASHCARD_DB_CONNECTION_STRINg="sqlite:///flashcards.db"

# Server
ENV HOST="0.0.0.0"
ENV PORT=8000

USER nopriv
CMD [ \
    "bash", "-c", \
    "python -m nfb.main" \
]
