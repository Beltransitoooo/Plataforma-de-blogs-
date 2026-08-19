import React from 'react';
import BlogCardSummary from '../components/BlogCardSummary';

export default function FeedView({ 
  usuarioFiltrado, 
  setUsuarioFiltrado, 
  postsMostrados, 
  listaUsuarios, 
  onSelectPost 
}) {
  return (
    <main className="main-container">
      <section className="section-header">
        <h1 className="main-title">
          {usuarioFiltrado ? `Posts de ${usuarioFiltrado.nombre_usuario}` : 'Publicaciones'}
        </h1>
        <p className="section-description">
          {usuarioFiltrado 
            ? `Filtrando los artículos del autor ID #${usuarioFiltrado.id}` 
            : 'Explora y administra los artículos en la plataforma.'}
        </p>
      </section>

      <div className="posts-wrapper">
        <div className="posts-header-bar">
          <h3 className="posts-counter">
            Publicaciones <span className="counter-badge">{postsMostrados ? postsMostrados.length : 0}</span>
          </h3>
          {usuarioFiltrado && (
            <button className="btn-clear-filter" onClick={() => setUsuarioFiltrado(null)}>
              Limpiar filtro ✕
            </button>
          )}
        </div>
        
        {(!postsMostrados || postsMostrados.length === 0) ? (
          <div className="empty-state">
            <p>No hay publicaciones para mostrar.</p>
          </div>
        ) : (
          <div className="posts-list">
            {postsMostrados.map((post) => {
              const autorObj = listaUsuarios.find(u => u.id === post.id_propietario);
              const nombreAutor = autorObj ? autorObj.nombre_usuario : `Autor #${post.id_propietario}`;

              return (
                <BlogCardSummary 
                  key={post.id} 
                  post={post} 
                  nombreAutor={nombreAutor} 
                  onClick={() => onSelectPost(post)} 
                />
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}