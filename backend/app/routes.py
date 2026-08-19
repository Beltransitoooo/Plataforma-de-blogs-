from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import SessionLocal
from . import models, schemas

router = APIRouter(
    prefix="/usuarios",
    tags=["Usuarios"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/login")
def login_usuario(credenciales: schemas.UsuarioLogin, db: Session = Depends(get_db)):
    # 1. Buscamos al usuario en la BD por su correo
    usuario = db.query(models.Usuario).filter(models.Usuario.correo == credenciales.correo).first()

    if not usuario:
        raise HTTPException(status_code=400, detail="Correo o contraseña incorrectos")

    if usuario.contraseña_hash != credenciales.contraseña + "_cifrada":
        raise HTTPException(status_code=400, detail="Correo o contraseña incorrectos")

    return {
        "mensaje": "Inicio de sesión exitoso",
        "usuario": {
            "id": usuario.id,
            "nombre_usuario": usuario.nombre_usuario,
            "correo": usuario.correo
        }
    }

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
def crear_publicacion(publicacion: schemas.PublicacionCreate, usuario_id: int, db: Session = Depends(get_db)):
    autor_existente = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()

    if not autor_existente:
        raise HTTPException(status_code=400, detail="El usuario autor de este post no existe.")

    nueva_publicacion = models.Publicacion(
        titulo=publicacion.titulo,
        contenido=publicacion.contenido,
        id_propietario=usuario_id
    )

    db.add(nueva_publicacion)
    db.commit()
    db.refresh(nueva_publicacion)

    return nueva_publicacion

@router.get("/posts", response_model=list[schemas.Publicacion])
def obtener_publicaciones(db: Session = Depends(get_db)):
    publicaciones = db.query(models.Publicacion).all()

    return publicaciones

@router.get("/posts/{id}")
def obtener_publicacion_id(id: int, db: Session = Depends(get_db)):
    publicacion_id = db.query(models.Publicacion).filter(models.Publicacion.id == id).first()

    if not publicacion_id:
        raise HTTPException(status_code=404, detail="La publicacion no existe")
    
    return publicacion_id

@router.get("/todos", response_model=list[schemas.UsuarioSimple])
def obtener_usuarios(db: Session = Depends(get_db)):
    usuarios = db.query(models.Usuario).all()

    return usuarios

@router.put("/posts/{id}")
def actualizar_post(id: int, publicacion: schemas.PublicacionCreate, db: Session = Depends(get_db)):
      post_actualizado = db.query(models.Publicacion).filter(models.Publicacion.id == id).first()

      if not post_actualizado:
          raise HTTPException(status_code=404, detail="El post que intenta actualizar no existe")

      post_actualizado.titulo = publicacion.titulo
      post_actualizado.contenido = publicacion.contenido

      db.commit()
      db.refresh(post_actualizado)

      return post_actualizado

@router.delete("/posts/{id}")
def eliminar_post(id: int, db: Session = Depends(get_db)):
    post_eliminado = db.query(models.Publicacion).filter(models.Publicacion.id == id).first()

    if not post_eliminado:
        raise HTTPException(status_code=404, detail="El post que intenta eliminar no existe")

    db.delete(post_eliminado)
    db.commit()

    return post_eliminado

@router.delete("/delete/{id}")
def eliminar_usuario(id: int, db: Session = Depends(get_db)):
    usuario_eliminado = db.query(models.Usuario).filter(models.Usuario.id == id).first()

    if not usuario_eliminado:
        raise HTTPException(status_code=404, detail="El ususario que intenta eliminar no existe")

    db.delete(usuario_eliminado)
    db.commit()