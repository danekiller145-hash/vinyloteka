import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Home.css';

function Home() {
  const vinyls = [
    { id: 1, title: 'Abbey Road', artist: 'The Beatles', image: 'https://spl.ru/upload/iblock/9dc/lty9ncv5zhjmjk2cl74ztbc0f2u9agi2/lp_the_beatles_abbey_road_0602577915123_01.jpg' },
    { id: 2, title: 'Nevermind', artist: 'Nirvana', image: 'https://img.audiomania.ru/pics/goods/original/n/nirvana__nevermind_lp_7-1.jpg' },
    { id: 3, title: 'Back in Black', artist: 'AC/DC', image: 'https://doctorhead.ru/upload/dev2fun.imagecompress/webp/iblock/cfe/swk02rookylagkr0xwn161pp4ln3cgs0/ac_dc_bl_1.webp' },
    { id: 4, title: 'AM', artist: 'Arctic Monkeys', image: 'https://appmistore.ru/upload/iblock/2b4/atsn5687hucs7fsl3ckg7tudj8z236t3/vinilovaya-plastinka-arctic-monkeys-am.webp' },
    { id: 5, title: 'Three Cheers for Sweet Revenge', artist: 'My Chemical Romance', image: 'https://n.cdn.cdek.shopping/images/shopping/8BRBBMzYxO9ThMDs.jpg?v=1' }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % vinyls.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [vinyls.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % vinyls.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + vinyls.length) % vinyls.length);

  return (
    <div className="home">
      
      {/* HERO БЛОК */}
      <div className="hero">
        <h1>ВИНИЛОТЕКА</h1>
        <p className="hero-subtitle">интернет-магазин виниловых пластинок и компакт-дисков</p>

        {/* СЛАЙДЕР */}
        <div className="slider">
          <div 
            className="slider-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {vinyls.map((vinyl) => (
              <div key={vinyl.id} className="slide">
                <img src={vinyl.image} alt={vinyl.title} />
                <div className="slide-caption">
                  <h3>{vinyl.title}</h3>
                  <p>{vinyl.artist}</p>
                </div>
              </div>
            ))}
          </div>

          <button onClick={prevSlide} className="slider-arrow prev">◀</button>
          <button onClick={nextSlide} className="slider-arrow next">▶</button>

          <div className="slider-dots">
            {vinyls.map((_, index) => (
              <div 
                key={index} 
                onClick={() => setCurrentSlide(index)} 
                className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
        
        <div style={{ marginTop: '30px' }}>
          <Link to="/catalog">
            <button className="btn-outline">В каталог →</button>
          </Link>
        </div>
      </div>

      {/* ХИТЫ ПРОДАЖ */}
      <h2 className="section-title">Хиты продаж</h2>

      <div className="hits-grid">
        {[
          { name: 'Земфира', desc: 'Российская рок-певица, автор песен.', image: 'https://impult.ru/preview/r/1200x-/upload/iblock/5b2/5b2ac97f540ea04a75796729cd1f4df8.jpg' },
          { name: 'ABBA', desc: 'Шведская поп-группа, 1972–1982.', image: 'https://avatars.mds.yandex.net/get-mpic/13671170/2a000001991895f9f58c7ffc26a943a8efe1/orig' },
          { name: 'Queen', desc: 'Британская рок-группа, одна из величайших.', image: 'https://www.gamepark.ru/upload/resize_cache/iblock/34d/1000_1000_1/471505_1.jpg' }
        ].map((item, i) => (
          <div key={i} className="hit-card">
            <div>
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
            </div>
            <Link to="/catalog">
              <button 
                className="btn-outline" 
                style={{ width: '100%', padding: '10px 25px', fontSize: '14px' }}
              >
                В каталог →
              </button>
            </Link>
          </div>
        ))}
      </div>

      {/* ЦИТАТА */}
      <div className="info-block">
        <h2>Погрузись в атмосферу своих любимых песен с пластинками от ВИНИЛОТЕКИ</h2>
      </div>

      {/* О НАС */}
      <div className="info-block">
        <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>О нас</h2>
        <p>
          Винилотека — это интернет-магазин виниловых пластинок и CD-дисков, который делает процесс поиска музыки простым и приятным.
          Мы гарантируем качественный сервис и готовы предложить дополнительные услуги, например, предзаказ на любой альбом.
        </p>
      </div>

      {/* РАССЫЛКА */}
      <div className="newsletter">
        <h3>Подпишитесь на нашу рассылку</h3>
        <p>Будьте в курсе новинок и акций!</p>
        
        <div className="vinyl-record">
          <div className="vinyl-center" />
        </div>

        <div className="newsletter-form">
          <input type="email" placeholder="Ваш email" />
          <button>Подписаться</button>
        </div>
      </div>

      {/* ПОДВАЛ */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-col">
            <h4>Информация</h4>
            <a href="#">Публичная оферта</a>
            <a href="#">Реквизиты</a>
            <a href="#">Информация о компании</a>
            <a href="#">Уведомление об использовании Cookie</a>
            <a href="#">Пользовательское соглашение</a>
            <a href="#">Политика конфиденциальности</a>
          </div>

          <div className="footer-col">
            <h4>Мы в соцсетях</h4>
            <a href="#">ВКонтакте</a>
            <a href="#">Telegram</a>
            <a href="#">Instagram</a>
            <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
              vinyloteka@mail.ru
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 Винилотека. Все права защищены.
        </div>
      </footer>

    </div>
  );
}

export default Home;
