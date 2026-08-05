from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return "Hello World"

@app.get("/prueba")
async def prueba():
    return "Mensaje de prueba"

@app.get("/pruebaSanti")
async def pruebaSanti():
    return "Mensaje de prueba al Santi"