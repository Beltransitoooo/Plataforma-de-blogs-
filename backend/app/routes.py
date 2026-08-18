import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import './App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // ESTADOS DE AUTENTICACIÓN (Agregado authName)
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  // Control de vista: 'feed' (lista de posts) o 'crear' (formulario)
  const [vistaActual, setVistaActual] = useState('feed');

  // Lista de usuarios registrados (ahora con setter para agregar nuevos al registrarse)
  const [usuariosRegistrados, setUsuariosRegistrados] = useState([
    { id: 1, name: 'Carlos Dev' },
    { id: 2, name: 'María Designer' },
    { id: 3, name: 'Juan Fullstack' }
  ]);

  // Filtro por autor
  const [usuarioFiltrado, setUsuarioFiltrado] = useState(null);

  // Estado de publicaciones
  const [posts, setPosts] = useState([
    { id: 1, userId: 1, title: 'Introducción a React', content: 'Aprendiendo los fundamentos de componentes y estados.', category: 'Desarrollo' },
    { id: 2, userId: 2, title: 'Diseño de Borde a Borde', content: 'Configurando la interfaz para aprovechar todo el ancho de la pantalla.', category: 'UI/UX' },
    { id: 3, userId: 3, title: 'Bases de Datos Relacionales', content: 'Entendiendo cómo conectar usuarios con publicaciones mediante IDs.', category: 'Backend' }
  ]);

  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token_sesion');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleAuthSubmit = (e) => {
    e.preventDefault();

    if (isRegistering) {
      // Validamos que nombre, correo y contraseña estén completos al registrarse
      if (!authName.trim() || !authEmail.trim() || !authPassword.trim()) {
        toast.error('Por favor, completa todos los campos (nombre, correo y contraseña)');
        return;
      }

      // Creamos y agregamos el nuevo usuario dinámicamente
      const nuevoUsuario = {
        id: Date.now(),
        name: authName.trim()
      };

      setUsuariosRegistrados([...usuariosRegistrados, nuevoUsuario]);
      toast.success('¡Registro exitoso! Ya puedes iniciar sesión con tus datos.');
      
      // Limpiamos formulario de registro y regresamos a pantalla de Iniciar Sesión
      setIsRegistering(false);
      setAuthPassword('');
      setAuthName('');
    } else {
      // Proceso de Login
      if (!authEmail.trim() || !authPassword.trim()) {
        toast.error('Por favor, completa correo y contraseña');
        return;
      }

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

  const handleCrearPost = (e) => {
    e.preventDefault();
    
    if (!titulo.trim() || !contenido.trim()) {
      toast.error('Por favor, completa todos los campos del post');
      return;
    }

    const nuevoPost = {
      id: Date.now(),
      userId: 1, // Simulando usuario logueado con ID 1
      title: titulo,
      content: contenido,
      category: 'General'
    };

    setPosts([nuevoPost, ...posts]);
    setTitulo('');
    setContenido('');
    setVistaActual('feed');
    toast.success('¡Publicación creada exitosamente!');
  };

  const handleEliminarPost = (id) => {
    setPosts(posts.filter(p => p.id !== id));
    toast.error('Publicación eliminada correctamente');
  };

  // Filtrado de posts
  const postsMostrados = usuarioFiltrado 
    ? posts.filter(p => p.userId === usuarioFiltrado.id)
    : posts;

  return (
    <div className="app-wrapper">
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155',
            fontSize: '0.9rem',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#1e293b',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#1e293b',
            },
          },
        }}
      />

      {!isLoggedIn ? (
        <div className="auth-wrapper">
          <form onSubmit={handleAuthSubmit} className="form-card" style={{ maxWidth: '420px' }}>
            <h2 className="main-title" style={{ textAlign: 'center', fontSize: '1.75rem', marginBottom: '8px' }}>
              {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </h2>
            <p className="section-description" style={{ textAlign: 'center', marginBottom: '24px' }}>
              {isRegistering ? 'Regístrate para acceder al gestor de contenido' : 'Ingresa tus credenciales para continuar'}
            </p>

            {/* CAMPO DE NOMBRE DE USUARIO (SOLO VISIBLE AL REGISTRARSE) */}
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

            <button type="submit" className="btn btn-primary-create" style={{ width: '100%', marginBottom: '16px' }}>
              {isRegistering ? 'Registrarse' : 'Entrar'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <button 
                type="button" 
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setAuthName('');
                }} 
                style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '0.9rem' }}
              >
                {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {/* NAVBAR */}
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
                  <div style={{ borderTop: '1px solid #334155', margin: '4px 0' }}></div>
                  <a href="#salir" className="dropdown-item" style={{ color: '#ef4444' }} onClick={handleCerrarSesion}>
                    Cerrar Sesión
                  </a>
                </div>
              </div>

              {/* BOTÓN + CREAR */}
              <button className="btn btn-primary-create" onClick={() => setVistaActual('crear')}>
                + Crear
              </button>
            </div>
          </nav>

          {/* VISTAS */}
          {vistaActual === 'feed' ? (
            /* VISTA 1: PUBLICACIONES */
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
                    <p>No hay publicaciones disponibles para este autor.</p>
                  </div>
                ) : (
                  <div className="posts-list">
                    {postsMostrados.map((post) => {
                      const autorPost = usuariosRegistrados.find(u => u.id === post.userId);
                      return (
                        <article key={post.id} className="blog-card">
                          <div className="blog-card-header">
                            <span className="category-tag">{post.category}</span>
                            <span className="author-info">
                              Por <strong className="author-name">{autorPost ? autorPost.name : `Usuario #${post.userId}`}</strong>
                            </span>
                          </div>

                          <h2 className="blog-title">{post.title}</h2>
                          <p className="blog-excerpt">{post.content}</p>

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
            /* VISTA 2: CREAR NUEVO POST */
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
                    Escribe el título y contenido de tu artículo para publicarlo en la plataforma.
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