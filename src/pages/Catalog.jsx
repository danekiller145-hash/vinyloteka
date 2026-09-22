import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import './Catalog.css';

function Catalog({ addToCart, favorites, toggleFavorite }) {
  const [search, setSearch] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [genreFilter, setGenreFilter] = useState('all');
  const [vinyls, setVinyls] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загрузка пластинок из Supabase
  useEffect(() => {
    const fetchVinyls = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('vinyls').select('*');
      if (error) {
        console.error('Ошибка загрузки:', error);
      } else {
        setVinyls(data || []);
      }
      setLoading(false);
    };
    fetchVinyls();
  }, []);

  const filteredVinyls = vinyls
    .filter((vinyl) => {
      const matchesSearch = vinyl.title.toLowerCase().includes(search.toLowerCase()) ||
                            vinyl.artist.toLowerCase().includes(search.toLowerCase());
      const matchesGenre = genreFilter === 'all' || vinyl.genre === genreFilter;
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      if (priceFilter === 'low') return a.price - b.price;
      if (priceFilter === 'high') return b.price - a.price;
      return 0;
    });

  const genres = [
    { value: 'all', label: 'Все' },
    { value: 'rock', label: 'Рок' },
    { value: 'pop', label: 'Поп' },
    { value: 'emo', label: 'Эмо' },
    { value: 'metal', label: 'Металл' },
    { value: 'indie', label: 'Инди' }
  ];

  if (loading) {
    return (
      <div className="catalog">
        <h1 className="catalog-title">КАТАЛОГ ВИНИЛА</h1>
        <p className="no-results">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="catalog">
      <h1 className="catalog-title">КАТАЛОГ ВИНИЛА</h1>

      {/* Жанровые фильтры */}
      <div className="genre-filters">
        {genres.map((genre) => (
          <button
            key={genre.value}
            onClick={() => setGenreFilter(genre.value)}
            className={`genre-btn ${genreFilter === genre.value ? 'active' : ''}`}
          >
            {genre.label}
          </button>
        ))}
      </div>

      {/* Поиск и сортировка */}
      <div className="catalog-controls">
        <input
          type="text"
          placeholder="Поиск по названию или исполнителю..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="catalog-search"
        />

        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="catalog-select"
        >
          <option value="all">Все цены</option>
          <option value="low">Сначала дешёвые</option>
          <option value="high">Сначала дорогие</option>
        </select>

        <button
          onClick={() => { setSearch(''); setPriceFilter('all'); setGenreFilter('all'); }}
          className="catalog-clear"
        >
          Очистить фильтры
        </button>
      </div>

      {/* Список пластинок */}
      {filteredVinyls.length === 0 ? (
        <p className="no-results">Ничего не найдено</p>
      ) : (
        <div className="vinyl-grid">
          {filteredVinyls.map((vinyl) => (
            <div key={vinyl.vinyl_id} className="vinyl-card">
              <img src={vinyl.image_path} alt={vinyl.title} />
              <h3>{vinyl.title}</h3>
              <p className="artist">{vinyl.artist}</p>
              <p className="price">{vinyl.price} ₽</p>

              <div className="actions">
                <button
                  onClick={() => addToCart({
                    id: vinyl.vinyl_id,
                    title: vinyl.title,
                    artist: vinyl.artist,
                    price: vinyl.price,
                    image: vinyl.image_path,
                    genre: vinyl.genre
                  })}
                  className="btn-add-cart"
                >
                  В корзину
                </button>

                <button
                  onClick={() => toggleFavorite({
                    id: vinyl.vinyl_id,
                    title: vinyl.title,
                    artist: vinyl.artist,
                    price: vinyl.price,
                    image: vinyl.image_path,
                    genre: vinyl.genre
                  })}
                  className="btn-favorite"
                >
                  {favorites && favorites.some((fav) => fav.id === vinyl.vinyl_id) ? '♥' : '♡'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Catalog;
