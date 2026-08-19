import React from 'react';

export default function DetailView({ 
  post, 
  listaUsuarios, 
  currentUser, 
  onVolver, 
  onAbrirEdicion, 
  onEliminar 
}) {
  const autorNombre = listaUsuarios.find(u => u.id === post.id_propietario)?.nombre_usuario || `#${post.id_propietario}`;
  const esPropietario = currentUser && currentUser.id === post.id_propietario;

  return (
    <main className="main-container">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button type="button" onClick={onVolver} className="btn-back">
          ← Volver a publicaciones
        </button>

        <article className="post-detail-card">
          <div className="post-detail-header">
            <div className="post-detail-meta">
              <span className="category-tag">General</span>
              <span className="author-info">
                Autor: <strong className="author-name">{autorNombre}</strong>
              </span>
            </div>

            <h1 className="post-detail-title">{post.titulo}</h1>
          </div>

          <div className="post-detail-body">
            {post.contenido}
          </div>

          {esPropietario && (
            <div className="post-detail-footer">
              <button className="btn-card-action edit" onClick={onAbrirEdicion}>
                ✏️ Editar
              </button>
              <button className="btn-card-action delete" onClick={() => onEliminar(post.id)}>
                🗑️ Eliminar
              </button>
            </div>
          )}
        </article>
      </div>
    </main>
  );
}