import { useState } from 'react';

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
    { id: 7, title: 'Queen II', artist: 'Queen', price: 4999, genre: 'rock', image: 'https://avatars.yandex.net/get-music-content/28589/cd356082.a.215687-1/m1000x1000'},
    { id: 8, title: 'Arrival', artist: 'ABBA', price: 2999, genre: 'pop', image: 'https://avatars.mds.yandex.net/i?id=cc836059f6518c3bc060f955b8b26d58_l-5330362-images-thumbs&n=13' },
    { id: 9, title: 'Бордерлайн', artist: 'Земфира', price: 3999, genre: 'rock', image: 'https://avatars.yandex.net/get-music-content/19035207/8f04081d.a.21644362-2/m1000x1000'}
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

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: '#130F27',
        fontWeight: '700',
        letterSpacing: '1px',
        marginBottom: '30px'
      }}>
        КАТАЛОГ ВИНИЛА
      </h1>

      {/* Жанровые фильтры */}
<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
  {['all', 'rock', 'pop', 'emo', 'metal', 'indie'].map((genre) => (
    <button 
      key={genre}
      onClick={() => setGenreFilter(genre)} 
      style={{
        backgroundColor: genreFilter === genre ? '#FF9451' : '#FFFFFF',
        color: genreFilter === genre ? '#FFFFFF' : '#130F27',
        border: '2px solid #FF9451',
        padding: '8px 24px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600',
        fontFamily: "'Inter', sans-serif",
        fontSize: '14px',
        transition: '0.3s'
      }}
      onMouseEnter={(e) => {
        if (genreFilter !== genre) e.currentTarget.style.backgroundColor = '#F0F0F0';
      }}
      onMouseLeave={(e) => {
        if (genreFilter !== genre) e.currentTarget.style.backgroundColor = '#FFFFFF';
      }}
    >
      {genre === 'all' ? 'Все' : 
       genre === 'rock' ? 'Рок' : 
       genre === 'pop' ? 'Поп' :
       genre === 'emo' ? 'Эмо' : 
       genre === 'metal' ? 'Металл' : 'Инди'}
    </button>
  ))}
</div>

      {/* Поиск и сортировка */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Поиск по названию или исполнителю..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ 
            padding: '12px 20px', 
            borderRadius: '8px', 
            border: '1px solid #E5E0D8', 
            width: '300px', 
            fontSize: '15px',
            backgroundColor: '#FFFFFF',
            color: '#130F27',
            fontFamily: "'Inter', sans-serif",
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = '#FF9451'}
          onBlur={(e) => e.target.style.borderColor = '#E5E0D8'}
        />

        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          style={{ 
            padding: '12px 20px', 
            borderRadius: '8px', 
            border: '1px solid #E5E0D8', 
            fontSize: '15px', 
            backgroundColor: '#FFFFFF',
            color: '#130F27',
            fontFamily: "'Inter', sans-serif",
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="all">Все цены</option>
          <option value="low">Сначала дешёвые</option>
          <option value="high">Сначала дорогие</option>
        </select>

        <button 
          onClick={() => { setSearch(''); setPriceFilter('all'); setGenreFilter('all'); }} 
          style={{ 
            backgroundColor: 'transparent', 
            color: '#FF9451', 
            border: '2px solid #FF9451', 
            padding: '10px 24px', 
            borderRadius: '6px', 
            cursor: 'pointer',
            fontWeight: '600',
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            transition: '0.3s'
          }}
        >
          Очистить фильтры
        </button>
      </div>

      {/* Список пластинок */}
      {filteredVinyls.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '18px', color: '#888' }}>Ничего не найдено</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '30px 20px',
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '20px',
        }}>
          {filteredVinyls.map((vinyl) => (
            <div key={vinyl.id} style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid #E5E0D8',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '480px',
              transition: '0.3s'
            }}>
              <img 
                src={vinyl.image} 
                alt={vinyl.title} 
                style={{ 
                  width: '100%', 
                  height: '260px',
                  objectFit: 'contain',
                  marginBottom: '15px' 
                }} 
              />
              <h3 style={{ 
                fontSize: '16px', 
                textAlign: 'center', 
                margin: '5px 0',
                color: '#130F27',
                fontWeight: '600',
                fontFamily: "'Inter', sans-serif"
              }}>
                {vinyl.title}
              </h3>
              <p style={{ 
                fontSize: '14px', 
                textAlign: 'center', 
                margin: '3px 0',
                color: '#666',
                fontFamily: "'Inter', sans-serif"
              }}>
                {vinyl.artist}
              </p>
              <p style={{ 
                fontSize: '20px', 
                color: '#130F27', 
                fontWeight: '700', 
                margin: '10px 0',
                fontFamily: "'Inter', sans-serif"
              }}>
                {vinyl.price} ₽
              </p>
              
              <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                <button 
                  onClick={() => addToCart(vinyl)} 
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    color: '#130F27',
                    border: '2px solid #FF9451',
                    padding: '12px', 
                    borderRadius: '6px',
                    fontSize: '14px', 
                    cursor: 'pointer', 
                    flex: 1,
                    fontWeight: '600',
                    fontFamily: "'Inter', sans-serif",
                    transition: '0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#FF9451';
                    e.target.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#FFFFFF';
                    e.target.style.color = '#130F27';
                  }}
                >
                  В корзину
                </button>

                <button
                  onClick={() => toggleFavorite(vinyl)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #FF9451',
                    borderRadius: '6px',
                    fontSize: '18px',
                    cursor: 'pointer',
                    padding: '0 14px',
                    transition: '0.3s'
                  }}
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