import React, { useState, useEffect } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';

function JokePage() {
  const [joke, setJoke] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const navigate = useNavigate();

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

  // Função para calcular o tempo restante do token
  const calculateTimeRemaining = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setTimeRemaining(0);
      return;
    }

    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = decodedToken.exp * 1000;
    const currentTime = Date.now();
    const remainingTime = expiryTime - currentTime;

    setTimeRemaining(Math.max(Math.floor(remainingTime / 1000), 0));
  };

  useEffect(() => {
    // Atualiza o tempo restante a cada segundo
    const interval = setInterval(() => {
      calculateTimeRemaining();
    }, 1000);

    // Atualiza o tempo restante imediatamente ao montar o componente
    calculateTimeRemaining();

    return () => clearInterval(interval);
  }, []);

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
        {timeRemaining > 0 && (
          <div className="mt-4 text-center">
            <h5>Tempo até expiração do token: {timeRemaining} segundos</h5>
          </div>
        )}
      </div>
    </div>
  );
}

export default JokePage;
