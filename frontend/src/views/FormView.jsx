import React from 'react';

export default function FormView({ 
  modo, 
  titulo, 
  setTitulo, 
  contenido, 
  setContenido, 
  onSubmit, 
  onCancelar 
}) {
  const esEdicion = modo === 'editar';

  return (
    <main className="main-container">
      <div style={{ maxWidth: '650px', margin: '0 auto' }}>
        <button type="button" onClick={onCancelar} className="btn-back">
          ← Volver
        </button>

        <div className="form-card">
          <h2 className="main-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', textAlign: 'left' }}>
            {esEdicion ? 'Editar Publicación' : 'Crear Nuevo Post'}
          </h2>

          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label">Título</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Escribe un título..." 
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contenido</label>
              <textarea 
                className="form-textarea" 
                placeholder="Escribe el contenido..."
                rows="8"
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onCancelar}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary-create">
                {esEdicion ? 'Guardar Cambios' : 'Publicar Artículo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}