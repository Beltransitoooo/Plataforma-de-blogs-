from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    nombre_usuario = Column(String, unique=True, index=True, nullable=False)
    correo = Column(String, unique=True, index=True, nullable=False)
    contraseña_hash = Column(String, nullable=False)

    publicaciones = relationship("Publicacion", back_populates="propietario", cascade="all, delete-orphan")

class Publicacion(Base):
    __tablename__ = "publicaciones"
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False)
    contenido = Column(Text, nullable=False)
    creado_en = Column(DateTime, default=datetime.utcnow)
    id_propietario = Column(Integer, ForeignKey("usuarios.id"), nullable=False)

    propietario = relationship("Usuario", back_populates="publicaciones")