from pydantic import BaseModel, EmailStr
from datetime import datetime

class PublicacionBase(BaseModel):
    titulo: str
    contenido: str

class PublicacionCreate(PublicacionBase):
    pass

class Publicacion(PublicacionBase):
    id: int
    creado_en: datetime
    id_propietario: int

    class Config:
        from_attributes = True


class UsuarioLogin(BaseModel):
    correo: str
    contraseña: str

class UsuarioBase(BaseModel):
    nombre_usuario: str
    correo: EmailStr

class UsuarioCreate(UsuarioBase):
    contraseña: str

class Usuario(UsuarioBase):
    id: int
    nombre_usuario: str
    publicaciones: list[Publicacion] = []
    
    class Config:
        from_attributes = True

class UsuarioSimple(BaseModel):
    id: int
    nombre_usuario: str
    correo: EmailStr

    class Config:
        from_attributes = True