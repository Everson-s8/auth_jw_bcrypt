import motor.motor_asyncio
from app.config import MONGO_DB_URI

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DB_URI)
db = client["JWTteste"]
