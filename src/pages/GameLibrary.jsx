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

  // Calcular estadísticas
  const totalGames = games.length;
  const totalHours = games.reduce((sum, game) => sum + game.hoursPlayed, 0);
  const completedGames = games.filter(game => game.status === 'Completado').length;

  if (loading) return <div className="loading">Cargando tu biblioteca...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="game-library">
      {/* HEADER NATURAL */}
      <div className="library-header">
        <h1>GAMETRACKERRR!!!</h1>
        <p className="library-subtitle">
          Tienes {totalGames} juegos en la biblioteca
        </p>
        
        {/* ESTADÍSTICAS SIMPLES */}
        <div className="stats-overview">
          <div className="stat-item">
            <span className="stat-number">{totalGames}</span>
            <div className="stat-label">Juegos</div>
          </div>
          <div className="stat-item">
            <span className="stat-number">{totalHours}h</span>
            <div className="stat-label">Horas</div>
          </div>
          <div className="stat-item">
            <span className="stat-number">{completedGames}</span>
            <div className="stat-label">Completados</div>
          </div>
        </div>
      </div>
      
      {/* BOTÓN SIMPLE */}
      <button 
        onClick={() => setShowForm(!showForm)}
        className="toggle-form-btn"
      >
        {showForm ? 'Cerrar' : 'Agregar Juego'}
      </button>
      
      {/* FORMULARIO */}
      {showForm && (
        <GameForm onGameCreated={handleGameCreated} />
      )}
      
      {/* GRID QUE OCUPA TODO EL ANCHO */}
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