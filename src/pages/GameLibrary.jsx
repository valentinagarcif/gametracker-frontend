import React, { useState, useEffect } from 'react';
import { gameService } from '../services/api';
import GameForm from '../components/GameForm';
import GameCard from '../components/GameCard';

const GameLibrary = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

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

  const handleGameCreated = () => {
    loadGames();
    setShowForm(false);
  };

  if (loading) return <div className="loading">Cargando juegos...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="game-library">
      <h1>🎮 Mi Biblioteca de Juegos</h1>
      <p>Tienes {games.length} juegos en tu biblioteca</p>
      
      <button 
        onClick={() => setShowForm(!showForm)}
        className="toggle-form-btn"
      >
        {showForm ? '❌ Cancelar' : '➕ Agregar Juego'}
      </button>
      
      {showForm && (
        <GameForm onGameCreated={handleGameCreated} />
      )}
      
      <div className="games-grid">
        {games.map(game => (
          <GameCard 
            key={game._id} 
            game={game}
            onGameUpdated={loadGames}
            onGameDeleted={loadGames}
          />
        ))}
      </div>
    </div>
  );
};

export default GameLibrary;