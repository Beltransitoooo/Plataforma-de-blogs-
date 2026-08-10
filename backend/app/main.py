from fastapi import FastAPI
from .database import engine
from . import models
from .routes import router as api_router 

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    titulo="API de mi plataforma de Blogs",
        version="1.0.0"
)

app.include_router(api_router)

@app.get("/")
async def root():
    return "Bienvenido a la API de mi Blog funcional al 100"

