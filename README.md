# Maverick

Backend Service [FAST API]
========

### Repo ###

Clone the repo: https://github.com/juhomi/maverick

```commandline
git clone https://<<GIT_ACCESS_TOKEN>>@github.com/juhomi/maverick.git
```

### Local machine setup ###
Usage of code in local machine:

* Create virtual environment (Supported python version: 3.10)
    * `python3.10 -m venv vir_env`
    
* Activate virtual environment
    * `source vir_env/bin/activate`
    
* Go the root directory of project, and run following command to install dependencies:
    * `pip install -r backend/requirements.txt`


### Database used ###

Postgresql DB used - Install and setup postgresql and pgadmin

### Environment Variable setup ###

Now, before running the backend server, you need to set certain environment variables. 
Add the following values to .env file in root folder.

```bash
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_NAME=
DB_PORT=
SECRET_KEY=
SERVER_HOST=
EMAIL_TEMPLATES_DIR=
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_PORT=
MAIL_SERVER=
```

### Alembic Setup ###

Move into backend folder

`cd backend
`

Running migration

`alembic upgrade head
`

For creating a new migration file

`alembic revision -m "<<name of the change>>"
`

### Running local server ###

Once these environment variables are set, you can run FAST API server using following command:

```bash
# Run Server
 uvicorn backend.main:app --reload
```

### Swagger Access ###
Once the server is up, you can access the swagger docs at <BASE_URE>/docs or <BASE_URL>/redoc
