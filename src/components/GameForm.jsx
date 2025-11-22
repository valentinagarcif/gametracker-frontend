import React, { useState } from 'react';
import { gameService } from '../services/api';

const GameForm = ({ onGameCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    platform: 'PC',
    genre: 'Acción',
    releaseYear: new Date().getFullYear(),
    imageUrl: '',
    status: 'Por jugar',
    rating: 0,
    hoursPlayed: 0
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      rating: Number(formData.rating),
      hoursPlayed: Number(formData.hoursPlayed),
      releaseYear: Number(formData.releaseYear)
    };

    try {
      await gameService.createGame(dataToSend);

      setFormData({
        title: '',
        description: '',
        platform: 'PC',
        genre: 'Acción',
        releaseYear: new Date().getFullYear(),
        imageUrl: '',
        status: 'Por jugar',
        rating: 0,
        hoursPlayed: 0
      });

      if (onGameCreated) onGameCreated();
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || 'No se pudo guardar el juego'}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="game-form-container">
      <h3 className="form-title">Agregar Juego</h3>

      <div className="form-grid">
        <input
          type="text"
          name="title"
          placeholder="Título del juego"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="releaseYear"
          placeholder="Año"
          value={formData.releaseYear}
          onChange={handleChange}
          min="1970"
          max={new Date().getFullYear() + 2}
        />

        <select name="platform" value={formData.platform} onChange={handleChange}>
          <option value="PC">PC</option>
          <option value="PlayStation">PlayStation</option>
          <option value="Xbox">Xbox</option>
          <option value="Nintendo Switch">Nintendo Switch</option>
          <option value="Mobile">Mobile</option>
          <option value="Multiplataforma">Multiplataforma</option>
        </select>

        <select name="genre" value={formData.genre} onChange={handleChange}>
          <option value="Acción">Acción</option>
          <option value="Aventura">Aventura</option>
          <option value="RPG">RPG</option>
          <option value="Estrategia">Estrategia</option>
          <option value="Deportes">Deportes</option>
          <option value="Shooter">Shooter</option>
          <option value="Indie">Indie</option>
          <option value="Simulación">Simulación</option>
        </select>

        <input
          type="number"
          name="rating"
          placeholder="Rating (0-5)"
          value={formData.rating}
          onChange={handleChange}
          min="0"
          max="5"
        />

        <input
          type="number"
          name="hoursPlayed"
          placeholder="Horas jugadas"
          value={formData.hoursPlayed}
          onChange={handleChange}
          min="0"
          step="0.5"
        />

        <input
          type="url"
          name="imageUrl"
          placeholder="URL de portada"
          value={formData.imageUrl}
          onChange={handleChange}
        />

        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Por jugar">Por jugar</option>
          <option value="Jugando">Jugando</option>
          <option value="Completado">Completado</option>
          <option value="Abandonado">Abandonado</option>
        </select>
      </div>

      <textarea
        name="description"
        placeholder="Descripción del juego"
        value={formData.description}
        onChange={handleChange}
        className="description-box"
      />

      <button type="submit" className="save-btn">Guardar</button>
    </form>
  );
};

export default GameForm;
