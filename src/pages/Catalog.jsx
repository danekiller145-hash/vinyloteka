import { useState } from 'react';
import './Catalog.css';

function Catalog({ addToCart, favorites, toggleFavorite }) {
  const [search, setSearch] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [genreFilter, setGenreFilter] = useState('all');

  const vinyls = [
    { id: 1, title: 'Abbey Road', artist: 'The Beatles', price: 2500, genre: 'rock', image: 'https://spl.ru/upload/iblock/9dc/lty9ncv5zhjmjk2cl74ztbc0f2u9agi2/lp_the_beatles_abbey_road_0602577915123_01.jpg' },
    { id: 2, title: 'Nevermind', artist: 'Nirvana', price: 2000, genre: 'rock', image: 'https://img.audiomania.ru/pics/goods/original/n/nirvana__nevermind_lp_7-1.jpg' },
    { id: 3, title: 'Back in Black', artist: 'AC/DC', price: 2200, genre: 'rock', image: 'https://doctorhead.ru/upload/dev2fun.imagecompress/webp/iblock/cfe/swk02rookylagkr0xwn161pp4ln3cgs0/ac_dc_bl_1.webp' },
    { id: 4, title: 'Three Cheers for Sweet Revenge', artist: 'My Chemical Romance', price: 4999, genre: 'emo', image: 'https://n.cdn.cdek.shopping/images/shopping/8BRBBMzYxO9ThMDs.jpg?v=1' },
    { id: 5, title: 'From Death To Destiny', artist: 'Asking Alexandria', price: 3999, genre: 'metal', image: 'https://cdn-images.dzcdn.net/images/cover/77fde27b932d3d29781c89e24ebdfc65/1000x1000.jpg' },
    { id: 6, title: 'AM', artist: 'Arctic Monkeys', price: 3999, genre: 'indie', image: 'https://appmistore.ru/upload/iblock/2b4/atsn5687hucs7fsl3ckg7tudj8z236t3/vinilovaya-plastinka-arctic-monkeys-am.webp' },
    { id: 7, title: 'Queen II', artist: 'Queen', price: 4999, genre: 'rock', image: 'https://avatars.yandex.net/get-music-content/28589/cd356082.a.215687-1/m1000x1000' },
    { id: 8, title: 'Arrival', artist: 'ABBA', price: 2999, genre: 'pop', image: 'https://avatars.mds.yandex.net/i?id=cc836059f6518c3bc060f955b8b26d58_l-5330362-images-thumbs&n=13' },
    { id: 9, title: 'Бордерлайн', artist: 'Земфира', price: 3999, genre: 'rock', image: 'https://avatars.yandex.net/get-music-content/19035207/8f04081d.a.21644362-2/m1000x1000' }
  ];

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
            <div key={vinyl.id} className="vinyl-card">
              <img src={vinyl.image} alt={vinyl.title} />
              <h3>{vinyl.title}</h3>
              <p className="artist">{vinyl.artist}</p>
              <p className="price">{vinyl.price} ₽</p>

              <div className="actions">
                <button
                  onClick={() => addToCart(vinyl)}
                  className="btn-add-cart"
                >
                  В корзину
                </button>

                <button
                  onClick={() => toggleFavorite(vinyl)}
                  className="btn-favorite"
                >
                  {favorites && favorites.some((fav) => fav.id === vinyl.id) ? '♥' : '♡'}
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
