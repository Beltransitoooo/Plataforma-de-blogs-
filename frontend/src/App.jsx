import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import './App.css';

// URL BASE DE TU API DE FASTAPI
const API_URL = 'http://127.0.0.1:8000/usuarios';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Estados para Autenticación
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  // Control de vista: 'feed' o 'crear'
  const [vistaActual, setVistaActual] = useState('feed');

  // Lista de usuarios (se cargará dinámica o simulada)
  const [usuariosRegistrados, setUsuariosRegistrados] = useState([
    { id: 1, name: 'Carlos Dev' },
    { id: 2, name: 'María Designer' },
    { id: 3, name: 'Juan Fullstack' }
  ]);

  // Estado para filtrar posts por autor
  const [usuarioFiltrado, setUsuarioFiltrado] = useState(null);

  // ESTADO DE PUBLICACIONES (Inicia vacío y se llena desde PostgreSQL)
  const [posts, setPosts] = useState([]);

  // Formulario de creación de post
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');

  // -------------------------------------------------------------
  // 1. CARGAR PUBLICACIONES DESDE FASTAPI (GET /usuarios/posts)
  // -------------------------------------------------------------
  const obtenerPostsAPI = async () => {
    try {
      const response = await fetch(`${API_URL}/posts`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        toast.error('Error al obtener publicaciones de la base de datos');
      }
    } catch (error) {
      console.error('Error al conectar con FastAPI:', error);
      toast.error('No se pudo conectar con el servidor Backend');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token_sesion');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Cargar publicaciones de la BD cuando el usuario inicie sesión
  useEffect(() => {
    if (isLoggedIn) {
      obtenerPostsAPI();
    }
  }, [isLoggedIn]);

  // -------------------------------------------------------------
  // 2. MANEJADOR DE REGISTRO / LOGIN (POST /usuarios/)
  // -------------------------------------------------------------
  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    if (isRegistering) {
      if (!authName.trim() || !authEmail.trim() || !authPassword.trim()) {
        toast.error('Por favor, completa todos los campos');
        return;
      }

      try {
        // Petición POST a tu endpoint de crear_usuario
        const response = await fetch(`${API_URL}/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre_usuario: authName.trim(),
            correo: authEmail.trim(),
            contraseña: authPassword.trim()
          })
        });

        const data = await response.json();

        if (response.ok) {
          toast.success('¡Usuario registrado exitosamente en PostgreSQL!');
          
          // Agregamos el usuario recién registrado al dropdown
          setUsuariosRegistrados([
            ...usuariosRegistrados, 
            { id: data.id, name: data.nombre_usuario }
          ]);

          setIsRegistering(false);
          setAuthPassword('');
          setAuthName('');
        } else {
          toast.error(data.detail || 'Error al registrar usuario');
        }
      } catch (error) {
        toast.error('Error al conectar con el servidor de registros');
      }
    } else {
      if (!authEmail.trim() || !authPassword.trim()) {
        toast.error('Por favor, completa correo y contraseña');
        return;
      }

      // Login simulado local por ahora
      localStorage.setItem('token_sesion', 'mock-jwt-token-12345');
      setIsLoggedIn(true);
      toast.success('¡Bienvenido de vuelta!');
    }
  };

  const handleCerrarSesion = (e) => {
    e.preventDefault();
    localStorage.removeItem('token_sesion');
    setIsLoggedIn(false);
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
    setUsuarioFiltrado(null);
    setVistaActual('feed');
    toast('Sesión cerrada correctamente');
  };

  // -------------------------------------------------------------
  // 3. CREAR UN NUEVO POST EN BASE DE DATOS (POST /usuarios/posts/?usuario_id=1)
  // -------------------------------------------------------------
  const handleCrearPost = async (e) => {
    e.preventDefault();
    
    if (!titulo.trim() || !contenido.trim()) {
      toast.error('Por favor, completa el título y contenido del post');
      return;
    }

    try {
      // Tu endpoint requiere usuario_id como Query Parameter (?usuario_id=1)
      const userIdPropietario = 1; // Asumiendo ID 1 por ahora

      const response = await fetch(`${API_URL}/posts/?usuario_id=${userIdPropietario}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: titulo.trim(),
          contenido: contenido.trim()
        })
      });

      const nuevoPostGuardado = await response.json();

      if (response.ok) {
        // Actualizamos la lista local agregando la respuesta de PostgreSQL
        setPosts([nuevoPostGuardado, ...posts]);
        setTitulo('');
        setContenido('');
        setVistaActual('feed');
        toast.success('¡Publicación guardada en PostgreSQL!');
      } else {
        toast.error(nuevoPostGuardado.detail || 'Error al guardar publicación');
      }
    } catch (error) {
      console.error(error);
      toast.error('Ocurrió un error al conectar con la API');
    }
  };

  // -------------------------------------------------------------
  // 4. ELIMINAR POST DE LA BASE DE DATOS (DELETE /usuarios/posts/{id})
  // -------------------------------------------------------------
  const handleEliminarPost = async (id) => {
    try {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setPosts(posts.filter(p => p.id !== id));
        toast.error('Publicación eliminada de PostgreSQL');
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || 'No se pudo eliminar el post');
      }
    } catch (error) {
      toast.error('Error de conexión con la API');
    }
  };

  // Filtrado local según autor
  const postsMostrados = usuarioFiltrado 
    ? posts.filter(p => p.id_propietario === usuarioFiltrado.id)
    : posts;

  return (
    <div className="app-wrapper">
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#151d2a',
            color: '#f8fafc',
            border: '1px solid #263346',
            fontSize: '0.9rem',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#151d2a',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#151d2a',
            },
          },
        }}
      />

      {!isLoggedIn ? (
        /* PANTALLA DIVIDIDA DE AUTENTICACIÓN */
        <div className="auth-split-container">
          <div className="auth-left-side">
            <div className="auth-card">
              <div className="auth-header">
                <h2 className="auth-title">
                  {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
                </h2>
                <p className="auth-subtitle">
                  {isRegistering 
                    ? 'Regístrate para acceder al gestor de contenido' 
                    : 'Ingresa tus credenciales para continuar'}
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="auth-form">
                {isRegistering && (
                  <div className="form-group">
                    <label className="form-label">Nombre de Usuario</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ej. Alex Developer"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      autoFocus
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Correo Electrónico</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="correo@ejemplo.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contraseña</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-auth-submit">
                  {isRegistering ? 'Registrarse' : 'Entrar'}
                </button>

                <div className="auth-toggle-container">
                  <button 
                    type="button" 
                    className="btn-toggle-auth"
                    onClick={() => {
                      setIsRegistering(!isRegistering);
                      setAuthName('');
                    }}
                  >
                    {isRegistering 
                      ? '¿Ya tienes cuenta? Inicia sesión' 
                      : '¿No tienes cuenta? Regístrate'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="auth-right-side">
            <div className="brand-glow-bg"></div>
            <div className="brand-hero-content">
              <div className="brand-badge">
                <span>🚀 Plataforma de Blogging</span>
              </div>
              <h1 className="brand-hero-title">
                <span className="brand-icon">📝</span> StackDiario
              </h1>
              <p className="brand-hero-tagline">
                Tu plataforma para compartir ideas, código y desarrollo en un solo lugar.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* NAVBAR BORDE A BORDE */}
          <nav className="top-nav">
            <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={() => { setUsuarioFiltrado(null); setVistaActual('feed'); }}>
              📝 StackDiario
            </div>
            
            <div className="nav-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => { setUsuarioFiltrado(null); setVistaActual('feed'); }}
              >
                Ver Todos
              </button>
              
              <div className="user-dropdown">
                <button className="btn btn-secondary">Autores ▾</button>
                <div className="dropdown-content">
                  {usuariosRegistrados.map((user) => (
                    <a 
                      key={user.id} 
                      href="#autor" 
                      className="dropdown-item" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        setUsuarioFiltrado(user);
                        setVistaActual('feed');
                        toast(`Mostrando blogs de: ${user.name}`);
                      }}
                    >
                      👤 {user.name}
                    </a>
                  ))}
                  <div style={{ borderTop: '1px solid var(--border-color)', margin: '4px 0' }}></div>
                  <a href="#salir" className="dropdown-item" style={{ color: 'var(--danger-color)' }} onClick={handleCerrarSesion}>
                    Cerrar Sesión
                  </a>
                </div>
              </div>

              <button className="btn btn-primary-create" onClick={() => setVistaActual('crear')}>
                + Crear
              </button>
            </div>
          </nav>

          {/* VISTAS */}
          {vistaActual === 'feed' ? (
            <main className="main-container">
              <section className="section-header">
                <h1 className="main-title">
                  {usuarioFiltrado ? `Blogs de: ${usuarioFiltrado.name}` : 'Publicaciones'}
                </h1>
                <p className="section-description">
                  {usuarioFiltrado 
                    ? `Filtrando publicaciones asociadas al usuario con ID #${usuarioFiltrado.id}` 
                    : 'Crea, administra y supervisa las publicaciones de todos los autores en la plataforma.'}
                </p>
              </section>

              <div className="posts-wrapper">
                <div className="posts-header-bar">
                  <h3 className="posts-counter">
                    Publicaciones <span className="counter-badge">{postsMostrados.length}</span>
                  </h3>
                  {usuarioFiltrado && (
                    <button 
                      className="btn-clear-filter"
                      onClick={() => setUsuarioFiltrado(null)}
                    >
                      Limpiar filtro ✕
                    </button>
                  )}
                </div>
                
                {postsMostrados.length === 0 ? (
                  <div className="empty-state">
                    <p>No hay publicaciones en la base de datos.</p>
                  </div>
                ) : (
                  <div className="posts-list">
                    {postsMostrados.map((post) => {
                      const autorPost = usuariosRegistrados.find(u => u.id === post.id_propietario);
                      return (
                        <article key={post.id} className="blog-card">
                          <div className="blog-card-header">
                            <span className="category-tag">General</span>
                            <span className="author-info">
                              Por <strong className="author-name">{autorPost ? autorPost.name : `Usuario #${post.id_propietario}`}</strong>
                            </span>
                          </div>

                          <h2 className="blog-title">{post.titulo}</h2>
                          <p className="blog-excerpt">{post.contenido}</p>

                          <div className="blog-card-footer">
                            <div className="action-buttons">
                              <button className="btn-card-action edit" onClick={() => toast('Modo edición en desarrollo')}>
                                ✏️ Editor
                              </button>
                              <button className="btn-card-action delete" onClick={() => handleEliminarPost(post.id)}>
                                🗑️ Eliminar
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </main>
          ) : (
            <main className="main-container">
              <div style={{ maxWidth: '650px', margin: '0 auto' }}>
                <button 
                  type="button" 
                  onClick={() => setVistaActual('feed')} 
                  className="btn-back"
                >
                  ← Volver a publicaciones
                </button>

                <div className="form-card">
                  <h2 className="main-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', textAlign: 'left' }}>
                    Crear Nuevo Post
                  </h2>
                  <p className="section-description" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                    Escribe el título y contenido de tu artículo para guardarlo en PostgreSQL.
                  </p>

                  <form onSubmit={handleCrearPost}>
                    <div className="form-group">
                      <label className="form-label">Título</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Escribe un título descriptivo..." 
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        autoFocus
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Contenido</label>
                      <textarea 
                        className="form-textarea" 
                        placeholder="Escribe todo el contenido de la publicación aquí..."
                        rows="8"
                        value={contenido}
                        onChange={(e) => setContenido(e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => setVistaActual('feed')}
                      >
                        Cancelar
                      </button>
                      <button type="submit" className="btn btn-primary-create">
                        Publicar Artículo
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </main>
          )}
        </>
      )}
    </div>
  );
}