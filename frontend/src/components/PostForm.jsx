export function PostForm({ titulo, setTitulo, contenido, setContenido, onSubmit, onCancel, isEditing }) {
  return (
    <div className="form-card">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="main-title">{isEditing ? 'Editar Publicación' : 'Nueva Publicación'}</h1>
          <p className="section-description">Completa los campos del formulario.</p>
        </div>
        <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
      </div>

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label className="form-label">Título</label>
          <input 
            type="text" 
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Contenido</label>
          <textarea 
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            className="form-textarea"
            required
          />
        </div>

        <button type="submit" className="btn">
          {isEditing ? 'Actualizar cambios' : 'Publicar'}
        </button>
      </form>
    </div>
  );
}