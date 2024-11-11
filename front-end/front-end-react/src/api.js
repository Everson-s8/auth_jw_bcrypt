import axios from 'axios';

// Base URL da API
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

// Variável para rastrear se o token está sendo renovado
let isRefreshing = false;
let subscribers = [];

// Função para adicionar assinantes que aguardam o novo token
const subscribeTokenRefresh = (callback) => {
  subscribers.push(callback);
};

// Função para notificar todos os assinantes com o novo token
const onRefreshed = (token) => {
  subscribers.map((callback) => callback(token));
  subscribers = [];
};

// Interceptor de resposta para lidar com erros 401 (não autorizado)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response ? error.response.status : null;

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Se já está renovando, aguarda a renovação e repete a requisição
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            resolve(api(originalRequest));
          });
        });
      }

      // Marca a requisição original para evitar loops
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await renewAccessToken(); // Tenta renovar o token
        const newAccessToken = localStorage.getItem('access_token');
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
        onRefreshed(newAccessToken);
        return api(originalRequest); // Repete a requisição original com o novo token
      } catch (err) {
        // Se a renovação falhar, redireciona para login
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        window.location.href = '/';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Função para renovar o token de acesso usando as credenciais armazenadas
const renewAccessToken = async () => {
  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');

  if (!username || !password) {
    throw new Error('Credenciais não encontradas');
  }

  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  const response = await axios.post('http://127.0.0.1:8000/login', formData);
  const newAccessToken = response.data.access_token;
  localStorage.setItem('access_token', newAccessToken);
  api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
};

// Adiciona o token atual no cabeçalho de autorização em cada requisição
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
