import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const gameService = {
  getGames: () => api.get('/games'),
  getGameById: (id) => api.get(`/games/${id}`),
  createGame: (gameData) => {
  console.log('Enviando a API:', gameData);
  return api.post('/games', gameData);
  },
  updateGame: (id, gameData) => api.put(`/games/${id}`, gameData),
  deleteGame: (id) => api.delete(`/games/${id}`),
};

export const reviewService = {
  getReviews: () => api.get('/reviews'),
  createReview: (reviewData) => api.post('/reviews', reviewData),
};

export default api;