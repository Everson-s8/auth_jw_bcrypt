import os
from datetime import timedelta
from dotenv import load_dotenv

# Carregar variáveis do .env
load_dotenv()

# Configurações de CORS
CORS_ORIGINS = [
    "http://127.0.0.1:8000",
]

# Configurações JWT
SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 2))
ACCESS_TOKEN_EXPIRE_DELTA = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

# URI do MongoDB
MONGO_DB_URI = os.getenv("MONGODB_DBLOCAL_URI")

# Chave para a API de piadas
JOKES_API_KEY = os.getenv("JOKES_API_KEY")
