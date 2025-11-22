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

    console.log('Datos a enviar:', formData);

    try {
      const response = await gameService.createGame(formData);
      console.log('Respuesta del servidor:', response);
      alert('¡Juego creado exitosamente!');
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
        console.error('Error completo:', error);
        console.error('Mensaje del servidor:', error.response?.data);
      alert(`Error: ${error.response?.data?.message || 'Error al crear el juego'}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="game-form">
      <h3>➕ Agregar Nuevo Juego</h3>
      
      <input
        type="text"
        name="title"
        placeholder="Título del juego"
        value={formData.title}
        onChange={handleChange}
        required
      />
      
      <textarea
        name="description"
        placeholder="Descripción"
        value={formData.description}
        onChange={handleChange}
        required
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
        name="releaseYear"
        placeholder="Año de lanzamiento"
        value={formData.releaseYear}
        onChange={handleChange}
        min="1970"
        max={new Date().getFullYear() + 2}
      />
      
      <input
        type="url"
        name="imageUrl"
        placeholder="URL de la imagen"
        value={formData.imageUrl}
        onChange={handleChange}
      />
      
      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="Por jugar">Por jugar</option>
        <option value="Jugando">Jugando</option>
        <option value="Completado">Completado</option>
        <option value="Abandonado">Abandonado</option>
      </select>
      
      <button type="submit">Agregar Juego</button>
    </form>
  );
};

export default GameForm;