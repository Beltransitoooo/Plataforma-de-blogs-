import React from 'react';

export default function AuthView({
  isRegistering,
  setIsRegistering,
  isLoading,
  authName,
  setAuthName,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  handleAuthSubmit
}) {
  return (
    <div className="auth-split-container">
      <div className="auth-left-side">
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">
              {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </h2>
            <p className="auth-subtitle">
              {isRegistering 
                ? 'Regístrate para acceder a la plataforma' 
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
                  disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            <button type="submit" className="btn btn-auth-submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  <span>Verificando...</span>
                </>
              ) : (
                <span>{isRegistering ? 'Registrarse' : 'Entrar'}</span>
              )}
            </button>

            <div className="auth-toggle-container">
              <button 
                type="button" 
                className="btn-toggle-auth"
                disabled={isLoading}
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
  );
}