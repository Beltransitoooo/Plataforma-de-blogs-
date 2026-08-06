# Plataforma-de-blogs-

POST: Para crear datos
GET: Para leer datos
PUT: Para actualizar datos
DELETE: Para borrar datos

---database.py---
Se importan librerias de sqlalchemy para poder crear el motor de conexion con la base de datos, crear una clase base que los modelos futuros(como usuarios o publicaciones) heredan para que sqlalchemy sepa que esas clases de python representan tablas reales en la base de datos, y un fabricante de sesiones que cada vez que la API necesite hacer  una consulta, crear, acgtualziar o borrar algo en la base de datos, sessionmarker abra una sesion temporal de trabajo y luego la cierre.
La URL de la base de datos en DATABASE_URL.
El engine = create que es el motor de conexion con la base de datos.
SessionLocal es la fabria de sesiones par interactuar con la base de datos en cada peticion.
Base = declarative_base() es la clase de la cual heredaran todos nuestros modelos las tablas.
El def get_db() es la dependencia para obtener la sesion de la base de datos en los endpoints. Se utiliza yield en vez de return porque este pausa la funcion y permite trabajar con SELECT, INSERT, etc y se queda esperando que termine.