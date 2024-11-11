import React, { useState } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';

function AuthPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault(); // Impede o comportamento padrão de refresh

    try {
      let response;
      if (isLogin) {
        // Login: enviar dados como FormData
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        
        response = await api.post('/login', formData);
      } else {
        // Registro: enviar dados em JSON
        response = await api.post('/registrar', { username, password });
      }

      // Armazenar o access_token e redirecionar para a página de piadas
      if (isLogin) {
        const accessToken = response.data.access_token;
        if (accessToken) {
          localStorage.setItem('access_token', accessToken);
          // Armazene as credenciais (apenas para desenvolvimento)
          localStorage.setItem('username', username);
          localStorage.setItem('password', password);
          navigate('/joke');
        } else {
          alert('Falha na autenticação. Tente novamente.');
        }
      } else {
        alert('Registro realizado com sucesso! Você pode fazer login agora.');
        setIsLogin(true);
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      alert('Erro na autenticação');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ width: '300px' }}>
        <h2 className="text-center mb-4">{isLogin ? 'Login' : 'Registrar'}</h2>
        <form onSubmit={handleAuth}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            {isLogin ? 'Login' : 'Registrar'}
          </button>
        </form>
        <div className="text-center mt-3">
          <button
            className="btn btn-link"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Registrar-se' : 'Voltar ao Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
