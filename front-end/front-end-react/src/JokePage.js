import React, { useState, useEffect } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';

function JokePage() {
  const [joke, setJoke] = useState('');
  const navigate = useNavigate();

  // Função para decodificar o token
  const decodeToken = (token) => {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    try {
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Erro ao decodificar o token:', e);
      return null;
    }
  };

  // Obtém o papel do usuário
  const token = localStorage.getItem('access_token');
  const decodedToken = decodeToken(token);
  const userRole = decodedToken ? decodedToken.role : null;
  const isAdmin = userRole === 'admin';

  const fetchJoke = async () => {
    try {
      const response = await api.get('/piada');
      setJoke(response.data.piada);
    } catch (error) {
      console.error('Erro ao buscar a piada:', error);
      if (error.response && error.response.status === 401) {
        alert('Sessão expirada ou não autenticada. Faça login novamente.');
        navigate('/');
      } else {
        alert('Erro ao buscar a piada');
      }
    }
  };

  const handleAdminAction = async () => {
    try {
      const response = await api.get('/admin');
      alert(response.data.message);
    } catch (error) {
      console.error('Erro ao acessar a área admin:', error);
      alert('Você não tem permissão para acessar esta área.');
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Bem-vindo! Obtenha uma piada</h2>
        <button onClick={fetchJoke} className="btn btn-success w-100 mb-3">
          Obter Piada
        </button>
        {joke && (
          <div className="alert alert-info mt-3">
            {joke}
          </div>
        )}
        {isAdmin && (
          <button onClick={handleAdminAction} className="btn btn-warning w-100 mt-3">
            Acessar Área Admin
          </button>
        )}
      </div>
    </div>
  );
}

export default JokePage;
