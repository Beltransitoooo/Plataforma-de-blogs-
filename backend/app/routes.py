from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import SessionLocal
from . import models, schemas

router = APIRouter(
    prefix="/usuarios",
    tags=["Usuarios"]
)

def get_db():
    db = SessionLocal
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.Usuario)
def crear_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):

    correo_existente = db.query(models.Usuario).filter(models.Usuario.correo == usuario.correo).first()
    if correo_existente:
        raise HTTPException(status_code=400, detail="Este correo ya esta regsitrado en sistema.")

    nuevo_usuario = models.Usuario(
        nombre_usuario=usuario.nombre_usuario,
        correo=usuario.correo,
        contraseña_hash=usuario.contraseña + "_cifrada"
    )

    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    return nuevo_usuario