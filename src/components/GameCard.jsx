import React, { useState } from 'react';
import { gameService } from '../services/api';

const GameCard = ({ game, onGameUpdated, onGameDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...game });

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...game });
  };

  const handleSave = async () => {
    try {
      await gameService.updateGame(game._id, editData);
      setIsEditing(false);
      if (onGameUpdated) onGameUpdated();
    } catch (error) {
      alert('Error al actualizar el juego');
    }
  };

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

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...game });
  };

  if (isEditing) {
    return (
      <div className="game-card editing">
        <input
          value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
        />
        <textarea
          value={editData.description}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
        />
        <select
          value={editData.status}
          onChange={(e) => setEditData({ ...editData, status: e.target.value })}
        >
          <option value="Por jugar">Por jugar</option>
          <option value="Jugando">Jugando</option>
          <option value="Completado">Completado</option>
          <option value="Abandonado">Abandonado</option>
        </select>
        <input
          type="number"
          value={editData.rating}
          onChange={(e) => setEditData({ ...editData, rating: parseInt(e.target.value) })}
          min="1"
          max="5"
        />
        <input
          type="number"
          value={editData.hoursPlayed}
          onChange={(e) => setEditData({ ...editData, hoursPlayed: parseInt(e.target.value) })}
          min="0"
        />
        <div className="card-actions">
          <button onClick={handleSave}>💾 Guardar</button>
          <button onClick={handleCancel}>❌ Cancelar</button>
        </div>
      </div>
    );
  }

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
        <button onClick={handleEdit}>✏️ Editar</button>
        <button onClick={handleDelete} className="delete-btn">🗑️ Eliminar</button>
      </div>
    </div>
  );
};

export default GameCard;