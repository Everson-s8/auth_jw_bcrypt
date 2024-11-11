from datetime import datetime, timedelta
import jwt 
from app.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_DELTA

def create_access_token(data: dict):
    """Cria um token de acesso JWT usando pyjwt."""
    to_encode = data.copy()
    expire = datetime.utcnow() + ACCESS_TOKEN_EXPIRE_DELTA
    to_encode.update({"exp": expire})
    
    # Gera o token JWT usando pyjwt
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt