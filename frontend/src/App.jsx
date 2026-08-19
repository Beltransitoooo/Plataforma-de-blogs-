import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import './App.css';

import {
  apiObtenerPosts,
  apiObtenerUsuarios,
  apiRegistrarUsuario,
  apiLoginUsuario,
  apiCrearPost,
  apiActualizarPost,
  apiEliminarPost
} from './services/api';

import Navbar from './components/Navbar';
import AuthView from './views/AuthView';
import FeedView from './views/FeedView';
import DetailView from './views/DetailView';
import FormView from './views/FormView';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estados de Autenticación
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Vistas: 'feed', 'crear', 'detalle', 'editar'
  const [vistaActual, setVistaActual] = useState('feed');
  const [postSeleccionado, setPostSeleccionado] = useState(null);

  // Datos
  const [posts, setPosts] = useState([]);
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [usuarioFiltrado, setUsuarioFiltrado] = useState(null);

  // Formulario
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');

  const cargarPosts = async () => {
    try {
      const data = await apiObtenerPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const data = await apiObtenerUsuarios();
      setListaUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    try {
      const sesionGuardada = localStorage.getItem('usuario_logueado');
      if (sesionGuardada && sesionGuardada !== 'undefined' && sesionGuardada !== 'null') {
        const user = JSON.parse(sesionGuardada);
        if (user && user.id) {
          setCurrentUser(user);
          setIsLoggedIn(true);
        }
      }
    } catch (e) {
      localStorage.removeItem('usuario_logueado');
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      cargarPosts();
      cargarUsuarios();
    }
  }, [isLoggedIn]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    if (isRegistering) {
      if (!authName.trim() || !authEmail.trim() || !authPassword.trim()) {
        toast.error('Por favor, completa todos los campos');
        return;
      }

      setIsLoading(true);
      try {
        const res = await apiRegistrarUsuario(authName.trim(), authEmail.trim(), authPassword.trim());
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (res.ok) {
          toast.success('¡Registro exitoso! Ya puedes iniciar sesión.');
          setIsRegistering(false);
          setAuthPassword('');
          setAuthName('');
          cargarUsuarios();
        } else {
          const data = await res.json();
          toast.error(data.detail || 'Error al registrar usuario');
        }
      } catch (error) {
        toast.error('No se pudo conectar con el servidor');
      } finally {
        setIsLoading(false);
      }

    } else {
      if (!authEmail.trim() || !authPassword.trim()) {
        toast.error('Ingresa tu correo y contraseña');
        return;
      }

      setIsLoading(true);
      try {
        const res = await apiLoginUsuario(authEmail.trim(), authPassword.trim());
        const data = await res.json();
        await new Promise(resolve => setTimeout(resolve, 1200));

        if (res.ok && data && data.usuario) {
          localStorage.setItem('usuario_logueado', JSON.stringify(data.usuario));
          setCurrentUser(data.usuario);
          setIsLoggedIn(true);
          toast.success(`¡Bienvenido ${data.usuario.nombre_usuario}!`);
        } else {
          toast.error(data.detail || 'Correo o contraseña incorrectos');
        }
      } catch (error) {
        toast.error('Error de conexión con FastAPI');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCerrarSesion = (e) => {
    e.preventDefault();
    localStorage.removeItem('usuario_logueado');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUsuarioFiltrado(null);
    setPostSeleccionado(null);
    toast('Sesión cerrada correctamente');
  };

  const handleGuardarPost = async (e) => {
    e.preventDefault();
    
    if (!titulo.trim() || !contenido.trim()) {
      toast.error('Completa el título y contenido');
      return;
    }

    if (vistaActual === 'editar' && postSeleccionado) {
      try {
        const res = await apiActualizarPost(postSeleccionado.id, titulo.trim(), contenido.trim());
        const postActualizado = await res.json();

        if (res.ok) {
          setPosts(prev => prev.map(p => p.id === postActualizado.id ? postActualizado : p));
          setPostSeleccionado(postActualizado);
          setTitulo('');
          setContenido('');
          setVistaActual('detalle');
          toast.success('¡Publicación actualizada!');
        } else {
          toast.error(postActualizado.detail || 'Error al actualizar post');
        }
      } catch (error) {
        toast.error('Error de conexión');
      }
    } else {
      try {
        const userId = currentUser ? currentUser.id : 1;
        const res = await apiCrearPost(userId, titulo.trim(), contenido.trim());
        const nuevoPost = await res.json();

        if (res.ok) {
          setPosts(prev => [nuevoPost, ...prev]);
          setTitulo('');
          setContenido('');
          setVistaActual('feed');
          toast.success('¡Publicación creada en PostgreSQL!');
        } else {
          toast.error('Error al guardar la publicación');
        }
      } catch (error) {
        toast.error('Error de conexión con el servidor');
      }
    }
  };

  const handleEliminarPost = async (id) => {
    try {
      const res = await apiEliminarPost(id);
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== id));
        setPostSeleccionado(null);
        setVistaActual('feed');
        toast.error('Publicación eliminada');
      } else {
        toast.error('No se pudo eliminar el post');
      }
    } catch (error) {
      toast.error('Error de conexión');
    }
  };

  const postsMostrados = usuarioFiltrado 
    ? posts.filter(p => p.id_propietario === usuarioFiltrado.id)
    : posts;

  return (
    <div className="app-wrapper">
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#151d2a',
            color: '#f8fafc',
            border: '1px solid #263346',
            fontSize: '0.9rem',
          },
        }}
      />

      {!isLoggedIn ? (
        <AuthView 
          isRegistering={isRegistering}
          setIsRegistering={setIsRegistering}
          isLoading={isLoading}
          authName={authName}
          setAuthName={setAuthName}
          authEmail={authEmail}
          setAuthEmail={setAuthEmail}
          authPassword={authPassword}
          setAuthPassword={setAuthPassword}
          handleAuthSubmit={handleAuthSubmit}
        />
      ) : (
        <>
          <Navbar 
            currentUser={currentUser}
            listaUsuarios={listaUsuarios}
            onIrAHome={() => { setUsuarioFiltrado(null); setPostSeleccionado(null); setVistaActual('feed'); }}
            onVerTodos={() => { setUsuarioFiltrado(null); setPostSeleccionado(null); setVistaActual('feed'); }}
            onSeleccionarCreador={(usr) => { setUsuarioFiltrado(usr); setPostSeleccionado(null); setVistaActual('feed'); toast(`Mostrando posts de ${usr.nombre_usuario}`); }}
            onIrACrear={() => { setTitulo(''); setContenido(''); setVistaActual('crear'); }}
            onCerrarSesion={handleCerrarSesion}
          />

          {vistaActual === 'feed' && (
            <FeedView 
              usuarioFiltrado={usuarioFiltrado}
              setUsuarioFiltrado={setUsuarioFiltrado}
              postsMostrados={postsMostrados}
              listaUsuarios={listaUsuarios}
              onSelectPost={(post) => { setPostSeleccionado(post); setVistaActual('detalle'); }}
            />
          )}

          {vistaActual === 'detalle' && postSeleccionado && (
            <DetailView 
              post={postSeleccionado}
              listaUsuarios={listaUsuarios}
              currentUser={currentUser}
              onVolver={() => setVistaActual('feed')}
              onAbrirEdicion={() => { setTitulo(postSeleccionado.titulo); setContenido(postSeleccionado.contenido); setVistaActual('editar'); }}
              onEliminar={handleEliminarPost}
            />
          )}

          {(vistaActual === 'crear' || vistaActual === 'editar') && (
            <FormView 
              modo={vistaActual}
              titulo={titulo}
              setTitulo={setTitulo}
              contenido={contenido}
              setContenido={setContenido}
              onSubmit={handleGuardarPost}
              onCancelar={() => setVistaActual(vistaActual === 'editar' ? 'detalle' : 'feed')}
            />
          )}
        </>
      )}
    </div>
  );
}