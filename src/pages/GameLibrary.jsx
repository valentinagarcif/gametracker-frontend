import React, { useState, useEffect } from 'react';
import { gameService } from '../services/api';

const GameLibrary = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setLoading(true);
      const response = await gameService.getGames();
      setGames(response.data.data);
    } catch (err) {
      setError('Error al cargar los juegos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando juegos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="game-library">
      <h1>🎮 Mi Biblioteca de Juegos</h1>
      <p>Tienes {games.length} juegos en tu biblioteca</p>
      
      <div className="games-grid">
        {games.map(game => (
          <div key={game._id} className="game-card">
            <img src={game.imageUrl} alt={game.title} />
            <h3>{game.title}</h3>
            <p>{game.platform} • {game.genre}</p>
            <p>⭐ {game.rating}/5 • {game.hoursPlayed}h jugadas</p>
            <p>Estado: {game.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameLibrary;