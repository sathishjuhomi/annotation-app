import json
#from fastapi import FastAPI
from starlette.config import Config
#from starlette.requests import Request
#from starlette.middleware.sessions import SessionMiddleware
#from starlette.responses import HTMLResponse, RedirectResponse
from authlib.integrations.starlette_client import OAuth

# app = FastAPI()
# app.add_middleware(SessionMiddleware, secret_key="!secret")

config = Config('D://maverick//backend//routers//.env')
oauth = OAuth(config)

CONF_URL = 'https://accounts.google.com/.well-known/openid-configuration'
oauth.register(
    name='google',
    server_metadata_url=CONF_URL,
    client_kwargs={
        'scope': 'openid email profile'
    }
)