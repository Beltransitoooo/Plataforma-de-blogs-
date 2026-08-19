const API_URL = 'http://127.0.0.1:8000/usuarios';

export const apiObtenerPosts = async () => {
  const response = await fetch(`${API_URL}/posts`);
  if (!response.ok) throw new Error('Error al obtener posts');
  return response.json();
};

export const apiObtenerUsuarios = async () => {
  const response = await fetch(`${API_URL}/todos`);
  if (!response.ok) throw new Error('Error al obtener creadores');
  return response.json();
};

export const apiRegistrarUsuario = async (nombre_usuario, correo, contraseña) => {
  return fetch(`${API_URL}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre_usuario, correo, contraseña })
  });
};

export const apiLoginUsuario = async (correo, contraseña) => {
  return fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, contraseña })
  });
};

export const apiCrearPost = async (userId, titulo, contenido) => {
  return fetch(`${API_URL}/posts/?usuario_id=${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo, contenido })
  });
};

export const apiActualizarPost = async (postId, titulo, contenido) => {
  return fetch(`${API_URL}/posts/${postId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo, contenido })
  });
};

export const apiEliminarPost = async (postId) => {
  return fetch(`${API_URL}/posts/${postId}`, {
    method: 'DELETE'
  });
};