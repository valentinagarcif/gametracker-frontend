import React from 'react';
import { gameService } from '../services/api';

const GameCard = ({ game, onGameUpdated, onGameDeleted }) => {

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de eliminar "${game.title}"?`)) {
      try {
        await gameService.deleteGame(game._id);
        if (onGameDeleted) onGameDeleted();
      } catch (error) {
        alert('Error al eliminar el juego');
      }
    }
  };

  return (
    <div className="game-card">
      <img 
        src={game.imageUrl || 'https://via.placeholder.com/300x400?text=Sin+Imagen'} 
        alt={game.title} 
      />
      <h3>{game.title}</h3>
      <p>{game.platform} • {game.genre}</p>
      <p>⭐ {game.rating}/5 • {game.hoursPlayed}h jugadas</p>
      <p>Estado: {game.status}</p>
      <p>Año: {game.releaseYear}</p>
      <div className="card-actions">
        <button>✏️ Editar</button>
        <button onClick={handleDelete} className="delete-btn">
          🗑️ Eliminar
        </button>
      </div>
    </div>
  );
};

export default GameCard;