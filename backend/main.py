from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
import logging

from backend.routers.user import auth_router
from backend.routers.oauth import oauth_router
from backend.routers.team import team_router

logger = logging.getLogger(__name__) 
fileHandler = logging.FileHandler("logs.txt")

stdoutFmt = logging.Formatter(
    "%(name)s: %(asctime)s | %(levelname)s | %(filename)s:%(lineno)s | %(process)d >>> %(message)s"
)

logging.basicConfig(
    level = logging.INFO,  # Set the logging level to INFO, you can change it as needed.
    format = "%(name)s: %(asctime)s | %(levelname)s | %(filename)s:%(lineno)s | %(process)d >>> %(message)s"
)
fileHandler.setFormatter(stdoutFmt)
logger.addHandler(fileHandler)

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key="!secret")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(oauth_router)
app.include_router(team_router)
logger.info("Executed main.py")