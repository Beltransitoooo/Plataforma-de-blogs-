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

@router.post("/posts/", response_model=schemas.Publicacion)
def crear_publicacion(
    publicacion: schemas.PublicacionCreate,
    usuario_id: int,
    db: Session = Depends(get_db)
):
    autor_existente = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if not autor_existente:
        raise HTTPException(status_code=400, detail="El usuario autor de este post no existe.")

    nueva_publicacion = models.Publicacion(
        titulo=publicacion.titulo,
        contenid=publicacion.contenido,
        id_propietario=usuario_id
    )
    db.add(nueva_publicacion)
    db.commit()
    db.refresh(nueva_publicacion)

    return nueva_publicacion