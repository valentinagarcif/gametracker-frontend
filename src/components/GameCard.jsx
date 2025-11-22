import React, { useState } from 'react';
import { gameService } from '../services/api';

const GameCard = ({ game, onGameUpdated, onGameDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: game.title,
    platform: game.platform,
    genre: game.genre,
    rating: game.rating,
    hoursPlayed: game.hoursPlayed,
    status: game.status,
    releaseYear: game.releaseYear,
    imageUrl: game.imageUrl,
    description: game.description
  });

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

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...editForm,
        rating: Number(editForm.rating),
        hoursPlayed: Number(editForm.hoursPlayed),
        releaseYear: Number(editForm.releaseYear)
      };

      await gameService.updateGame(game._id, dataToSend);
      setIsEditing(false);
      if (onGameUpdated) onGameUpdated();
      alert('Juego actualizado exitosamente');
    } catch (error) {
      alert('Error al actualizar el juego: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      title: game.title,
      platform: game.platform,
      genre: game.genre,
      rating: game.rating,
      hoursPlayed: game.hoursPlayed,
      status: game.status,
      releaseYear: game.releaseYear,
      imageUrl: game.imageUrl,
      description: game.description
    });
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
      'PC': '💻',
      'PlayStation': '🎮', 
      'Xbox': '⚔️',
      'Nintendo Switch': '🎯',
      'Mobile': '📱',
      'Multiplataforma': '🔀'
    };
    return icons[platform] || '🎮';
  };

  // Si está en modo edición, mostrar formulario
  if (isEditing) {
    return (
      <div className="game-card" style={{border: '2px solid #4fc3f7'}}>
        <form onSubmit={handleEdit} className="edit-form">
          <h3>Editar Juego</h3>
          
          <input
            type="text"
            name="title"
            placeholder="Título"
            value={editForm.title}
            onChange={handleChange}
            required
          />
          
          <select name="platform" value={editForm.platform} onChange={handleChange}>
            <option value="PC">PC</option>
            <option value="PlayStation">PlayStation</option>
            <option value="Xbox">Xbox</option>
            <option value="Nintendo Switch">Nintendo Switch</option>
            <option value="Mobile">Mobile</option>
            <option value="Multiplataforma">Multiplataforma</option>
          </select>
          
          <select name="genre" value={editForm.genre} onChange={handleChange}>
            <option value="Acción">Acción</option>
            <option value="Aventura">Aventura</option>
            <option value="RPG">RPG</option>
            <option value="Estrategia">Estrategia</option>
            <option value="Deportes">Deportes</option>
            <option value="Shooter">Shooter</option>
            <option value="Indie">Indie</option>
            <option value="Simulación">Simulación</option>
          </select>

          <select name="status" value={editForm.status} onChange={handleChange}>
            <option value="Por jugar">Por jugar</option>
            <option value="Jugando">Jugando</option>
            <option value="Completado">Completado</option>
            <option value="Abandonado">Abandonado</option>
          </select>

          <input
            type="number"
            name="rating"
            placeholder="Rating (0-5)"
            value={editForm.rating}
            onChange={handleChange}
            min="0"
            max="5"
          />

          <input
            type="number"
            name="hoursPlayed"
            placeholder="Horas jugadas"
            value={editForm.hoursPlayed}
            onChange={handleChange}
            min="0"
            step="0.5"
          />

          <input
            type="number"
            name="releaseYear"
            placeholder="Año de lanzamiento"
            value={editForm.releaseYear}
            onChange={handleChange}
            min="1970"
            max={new Date().getFullYear() + 2}
          />

          <input
            type="url"
            name="imageUrl"
            placeholder="URL de la imagen"
            value={editForm.imageUrl}
            onChange={handleChange}
          />

          <div className="edit-actions">
            <button type="submit">Guardar</button>
            <button type="button" onClick={cancelEdit}>Cancelar</button>
          </div>
        </form>
      </div>
    );
  }

  // Modo visualización normal
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
          <button onClick={() => setIsEditing(true)}>
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