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

  // Calcular progreso de horas
  const progressWidth = Math.min((game.hoursPlayed / 100) * 100, 100);

  // Generar estrellas
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className="star">
        {index < rating ? '★' : '☆'}
      </span>
    ));
  };

  // Iconos simples
  const getPlatformIcon = (platform) => {
    const icons = {
      'PC': '',
      'PlayStation': '', 
      'Xbox': '',
      'Nintendo Switch': '',
      'Mobile': '',
      'Multiplataforma': ''
    };
    return icons[platform] || '';
  };

  return (
    <div className="game-card">
      <img 
        src={game.imageUrl || 'https://via.placeholder.com/300x400?text=Portada+del+Juego'} 
        alt={game.title} 
      />
      <div className="game-card-content">
        <h3>{game.title}</h3>
        
        <div className="game-platform">
          <span>{getPlatformIcon(game.platform)}</span>
          <span>{game.platform}</span>
          <span>•</span>
          <span>{game.genre}</span>
        </div>

        {/* RATING */}
        <div className="rating-display">
          <div className="stars">
            {renderStars(game.rating)}
          </div>
          <span className="rating-value">{game.rating}/5</span>
        </div>

        {/* ESTADO */}
        <div className="game-status">
          {game.status}
        </div>

        {/* HORAS JUGADAS */}
        <div className="hours-played">
          <div className="hours-label">
            <span>Horas jugadas</span>
            <span>{game.hoursPlayed}h</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressWidth}%` }}
            ></div>
          </div>
        </div>

        {/* AÑO */}
        <div className="release-year">
          Lanzamiento: {game.releaseYear}
        </div>

        {/* ACCIONES */}
        <div className="card-actions">
          <button onClick={() => alert(`Editar ${game.title} - Próximamente`)}>
            Editar
          </button>
          <button onClick={handleDelete} className="delete-btn">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;