from datetime import datetime
from app.db.database import db

async def find_user_by_username(username: str):
    return await db.users.find_one({"username": username})

async def create_user(username: str, hashed_password: str):
    await db.users.insert_one({"username": username, "password": hashed_password})

async def insert_joke(joke_text: str, user_id: str):
    await db.piadas.insert_one({"piada": joke_text, "user_id": user_id})

async def log_request(user_id: str, username: str, endpoint: str, response_data: dict):
    """Registra a requisição feita pelo usuário, o username, e a resposta da API"""
    log_entry = {
        "user_id": user_id,
        "username": username,
        "endpoint": endpoint,
        "response": response_data,
        "timestamp": datetime.utcnow()
    }
    await db.requests.insert_one(log_entry)
