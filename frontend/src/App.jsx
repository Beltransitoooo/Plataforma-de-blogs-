import './App.css';
import { api } from './services/api';
import { useEffect, useState } from 'react';

function App(){
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState([true]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts/');
        setPosts(response.data);
      } catch (error) {
        console.error('Error al cargar los posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="blog-container">
      <h1 className="blog-tittle">Mi Blog Decorativo</h1>
      <p className="blog-subtitle">Conectando React con FastAPI siguiendo buenas practicas</p>

      <hr className="blog-divider" />

      {loading ? (
        <p className="loading-text"> Cargando publicaciones...</p>
      ) : posts.length === 0 ? (
        <p className="empty-text">Aun no hay publicaciones en la base de datos.</p>
      ) : (
        <ul className="posts.list">
          {posts.map((posts) => (
            <li key={posts.id} className="post-card">
              <h3 className="post-title">{post.titulo}</h3>
              <p className="post-content">{post.contenido}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
