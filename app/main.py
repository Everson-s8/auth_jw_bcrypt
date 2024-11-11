from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.config import CORS_ORIGINS, JOKES_API_KEY
from app.auth.routers import router as auth_router
from app.auth.dependencies import get_current_user
from app.db.utils_db import insert_joke, log_request
import httpx

app = FastAPI()

# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Permitir requisições do front-end
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos os métodos (POST, GET, etc.)
    allow_headers=["*"],  # Permitir todos os cabeçalhos
)

# Registro de rotas
app.include_router(auth_router)

@app.get("/piada")
async def get_random_joke(current_user: dict = Depends(get_current_user)):
    url = "https://api.api-ninjas.com/v1/jokes"
    headers = {"X-Api-Key": JOKES_API_KEY}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()

        joke_data = response.json()
        joke_text = joke_data[0]["joke"]
        await insert_joke(joke_text, current_user["_id"])

        # Salvar log da requisição no banco com o username
        response_data = {"piada": joke_text}
        await log_request(current_user["_id"], current_user["username"], "/piada", response_data)

        return response_data

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="Erro ao buscar piada")

    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro interno no servidor")
