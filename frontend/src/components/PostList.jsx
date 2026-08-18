export function PostList({ posts, onEdit, onDelete }) {
  return (
    <div className="posts-grid">
      {posts.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No hay publicaciones disponibles.</p>
      ) : (
        posts.map(post => (
          <div key={post.id} className="post-card">
            <div>
              <div className="post-meta">Por: {post.autor}</div>
              <h2 className="post-title">{post.titulo}</h2>
              <p className="post-body">{post.contenido}</p>
            </div>
            <div className="post-actions">
              <button className="btn-icon" onClick={() => onEdit(post)}>Editar</button>
              <button className="btn-icon" onClick={() => onDelete(post.id)} style={{ color: 'var(--danger-color)' }}>Borrar</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}