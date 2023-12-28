from authlib.integrations.starlette_client import OAuth
from starlette.config import Config

from annotation.backend.config import get_settings

settings = get_settings()

config = Config(
    environ={
        'GOOGLE_CLIENT_ID': settings.GOOGLE_CLIENT_ID,
        'GOOGLE_CLIENT_SECRET': settings.GOOGLE_CLIENT_SECRET
    }
)
oauth = OAuth(config)

CONF_URL = 'https://accounts.google.com/.well-known/openid-configuration'
oauth.register(
    name='google',
    server_metadata_url=CONF_URL,
    client_kwargs={
        'scope': 'openid email profile'
    }
)
