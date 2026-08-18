export function Navbar({ onGoHome, onOpenCreate, autores }) {
  return (
    <nav className="top-nav">
      <div className="nav-brand" onClick={onGoHome}>
        🚀 Plataforma de Blogs
      </div>
      
      <div className="nav-actions">
        <button className="btn" onClick={onOpenCreate}>
          + Crear publicación
        </button>

        <div className="user-dropdown">
          <button className="btn btn-secondary">
            👤 Usuarios con posts ▾
          </button>
          <div className="dropdown-content">
            {autores.map((autor, index) => (
              <span key={index} className="dropdown-item">
                ✍️ {autor}
              </span>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}