import React, { useState, useEffect, useMemo } from 'react';
import { gameService } from '../services/api';
import GameForm from '../components/GameForm';
import GameCard from '../components/GameCard';

const GameLibrary = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [genreFilter, setGenreFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const pageSize = 12;

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
    setPage(1);
  };

  const uniqueValues = (key) => {
    const set = new Set(games.map(g => g[key]).filter(Boolean));
    return ['All', ...Array.from(set)];
  };

  const filteredGames = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = games.slice();

    if (q) {
      list = list.filter(g => (g.title || '').toLowerCase().includes(q));
    }

    if (platformFilter !== 'All') {
      list = list.filter(g => g.platform === platformFilter);
    }

    if (genreFilter !== 'All') {
      list = list.filter(g => g.genre === genreFilter);
    }

    if (statusFilter !== 'All') {
      list = list.filter(g => g.status === statusFilter);
    }

    if (sortBy === 'az') {
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (sortBy === 'za') {
      list.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    } else if (sortBy === 'hours') {
      list.sort((a, b) => (b.hoursPlayed || 0) - (a.hoursPlayed || 0));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'year') {
      list.sort((a, b) => (b.releaseYear || 0) - (a.releaseYear || 0));
    }

    return list;
  }, [games, query, platformFilter, genreFilter, statusFilter, sortBy]);

  const totalGames = filteredGames.length;
  const totalHours = games.reduce((sum, game) => sum + (game.hoursPlayed || 0), 0);
  const completedGames = games.filter(game => game.status === 'Completado').length;

  const totalPages = Math.max(1, Math.ceil(totalGames / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  const pagedGames = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredGames.slice(start, start + pageSize);
  }, [filteredGames, page]);

  if (loading) return <div className="loading">Cargando tu biblioteca...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="game-library">
      <div className="library-header">
        <h1>GAMETRACKERRR!!!</h1>
        <p className="library-subtitle">Tienes {games.length} juegos en la biblioteca</p>

        <div className="stats-overview">
          <div className="stat-item">
            <span className="stat-number">{games.length}</span>
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

      <div style={{ maxWidth: 1300, margin: '0 auto 20px', padding: '0 18px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          placeholder="Buscar juegos..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          style={{ flex: 1, minWidth: 180, padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)', color: 'white' }}
        />

        <select value={platformFilter} onChange={(e) => { setPlatformFilter(e.target.value); setPage(1); }} style={{ padding: '10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)', color: 'white' }}>
          {uniqueValues('platform').map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <select value={genreFilter} onChange={(e) => { setGenreFilter(e.target.value); setPage(1); }} style={{ padding: '10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)', color: 'white' }}>
          {uniqueValues('genre').map(g => <option key={g} value={g}>{g}</option>)}
        </select>

        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} style={{ padding: '10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)', color: 'white' }}>
          {uniqueValues('status').map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); }} style={{ padding: '10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)', color: 'white' }}>
          <option value="default">Ordenar</option>
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
          <option value="hours">Más horas</option>
          <option value="rating">Mejor calificación</option>
          <option value="year">Más nuevo</option>
        </select>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="toggle-form-btn" onClick={() => setViewMode('grid')} style={{ padding: '8px 12px', minWidth: 48 }}>🔲</button>
          <button className="toggle-form-btn" onClick={() => setViewMode('list')} style={{ padding: '8px 12px', minWidth: 48 }}>📜</button>
        </div>

        <button onClick={() => setShowForm(!showForm)} className="toggle-form-btn" style={{ marginLeft: 'auto', minWidth: 150 }}>
          {showForm ? 'Cerrar' : 'Agregar Juego'}
        </button>
      </div>

      {showForm && <div style={{ maxWidth: 920, margin: '0 auto 18px', padding: '0 18px' }}><GameForm onGameCreated={handleGameCreated} /></div>}

      {viewMode === 'grid' && (
        <div className="games-grid" style={{ padding: '0 20px' }}>
          {pagedGames.map(game => (
            <GameCard
              key={game._id}
              game={game}
              onGameUpdated={loadGames}
              onGameDeleted={loadGames}
            />
          ))}
        </div>
      )}

      {viewMode === 'list' && (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 18px' }}>
          {pagedGames.map(game => (
            <div key={game._id} style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 10, marginBottom: 12 }}>
              <img src={game.imageUrl || 'https://via.placeholder.com/120x160?text=Portada'} alt={game.title} style={{ width: 100, height: 120, objectFit: 'cover', borderRadius: 8 }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: 18 }}>{game.title}</h3>
                <div style={{ color: '#9eb4ff', marginTop: 6 }}>{game.platform} • {game.genre}</div>
                <div style={{ display: 'flex', gap: 12, marginTop: 8, alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 6 }}>{Array.from({ length: 5 }, (_, i) => <span key={i} style={{ color: i < game.rating ? '#cfd8ff' : '#2e3140' }}>{i < game.rating ? '★' : '☆'}</span>)}</div>
                  <div style={{ color: '#d2d2d2' }}>{game.hoursPlayed}h</div>
                  <div style={{ color: '#b8c2ff' }}>{game.releaseYear}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button onClick={() => loadGames()} className="toggle-form-btn" style={{ padding: '8px 10px', minWidth: 80 }}>Ver</button>
                <button onClick={() => {}} className="toggle-form-btn" style={{ padding: '8px 10px', minWidth: 80, background: 'rgba(255,80,80,0.9)' }}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: '18px auto 60px', padding: '0 18px', display: 'flex', justifyContent: 'center', gap: 10, alignItems: 'center' }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} className="toggle-form-btn" style={{ padding: '8px 12px', minWidth: 70 }}>Anterior</button>
        <div style={{ color: '#c7d1ff' }}>{page} / {totalPages}</div>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="toggle-form-btn" style={{ padding: '8px 12px', minWidth: 70 }}>Siguiente</button>
      </div>
    </div>
  );
};

export default GameLibrary;
