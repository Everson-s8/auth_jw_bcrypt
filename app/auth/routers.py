from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
import bcrypt
from app.auth.utils_auth import create_access_token
from app.db.db_models import UserRegister
from app.db.utils_db import find_user_by_username, create_user

router = APIRouter()

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await find_user_by_username(form_data.username)
    if not user or not bcrypt.checkpw(form_data.password.encode("utf-8"), user["password"].encode("utf-8")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuário ou senha incorretos")

    access_token = create_access_token(data={"sub": user["username"], "user_id": str(user["_id"])})
    return {"access_token": access_token, "token_type": "bearer", "user_id": str(user["_id"])}

@router.post("/registrar")
async def register_user(user: UserRegister):
    if await find_user_by_username(user.username):
        raise HTTPException(status_code=400, detail="Usuário já existe")
    
    hashed_password = bcrypt.hashpw(user.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    await create_user(user.username, hashed_password, user.role)
    return {"msg": "Usuário registrado com sucesso"}

