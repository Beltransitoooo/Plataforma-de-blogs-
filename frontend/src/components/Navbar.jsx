import React, { useState } from 'react';

export default function Navbar({ 
  currentUser, 
  listaUsuarios, 
  onIrAHome, 
  onVerTodos, 
  onSeleccionarCreador, 
  onIrACrear, 
  onCerrarSesion 
}) {
  const [isCreadoresOpen, setIsCreadoresOpen] = useState(false);
  const [isPerfilOpen, setIsPerfilOpen] = useState(false);

  return (
    <nav className="top-nav">
      <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={() => { setIsCreadoresOpen(false); setIsPerfilOpen(false); onIrAHome(); }}>
        📝 StackDiario
      </div>
      
      <div className="nav-actions">
        {/* 1. VER TODOS */}
        <button className="btn btn-secondary" onClick={() => { setIsCreadoresOpen(false); setIsPerfilOpen(false); onVerTodos(); }}>
          Ver Todos
        </button>
        
        {/* 2. CREADORES */}
        <div className="user-dropdown">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => { setIsCreadoresOpen(!isCreadoresOpen); setIsPerfilOpen(false); }}
          >
            Creadores ▾
          </button>

          {isCreadoresOpen && (
            <div className="dropdown-content" style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 100 }}>
              <div className="dropdown-header">Creadores Registrados</div>
              
              {listaUsuarios.length === 0 ? (
                <div style={{ padding: '10px 16px', fontSize: '0.85rem', color: '#64748b' }}>
                  Cargando creadores...
                </div>
              ) : (
                listaUsuarios.map((usr) => (
                  <a 
                    key={usr.id} 
                    href="#filtrar" 
                    className="dropdown-item"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsCreadoresOpen(false);
                      onSeleccionarCreador(usr);
                    }}
                  >
                    <span className="dropdown-icon">👤</span>
                    <span>{usr.nombre_usuario} {currentUser?.id === usr.id ? '(Tú)' : ''}</span>
                  </a>
                ))
              )}
            </div>
          )}
        </div>

        {/* 3. + CREAR */}
        <button className="btn btn-primary-create" onClick={() => { setIsCreadoresOpen(false); setIsPerfilOpen(false); onIrACrear(); }}>
          + Crear
        </button>

        {/* 4. PERFIL */}
        <div className="user-dropdown">
          <button 
            type="button" 
            className="btn btn-secondary"
            style={{ padding: '8px 14px', fontSize: '1rem' }}
            onClick={() => { setIsPerfilOpen(!isPerfilOpen); setIsCreadoresOpen(false); }}
          >
            👤
          </button>

          {isPerfilOpen && (
            <div className="dropdown-content" style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 100, minWidth: '170px' }}>
              <a href="#salir" className="dropdown-item logout-item" onClick={onCerrarSesion}>
                <span className="dropdown-icon">🚪</span>
                <span>Cerrar Sesión</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}