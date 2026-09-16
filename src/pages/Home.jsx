import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

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
    <div style={{ 
      fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif", 
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      backgroundColor: '#FFF1DE'
    }}>
      
      {/* HERO БЛОК */}
      <div style={{ 
        backgroundColor: '#FFFFFF',
        color: '#130F27', 
        padding: '60px 20px', 
        borderRadius: '8px', 
        textAlign: 'center',
        marginBottom: '50px',
        border: '1px solid #E5E0D8'
      }}>
        <h1 style={{ 
          fontSize: 'clamp(32px, 6vw, 64px)', 
          marginBottom: '10px',
          fontWeight: '700',
          letterSpacing: '2px',
          color: '#130F27'
        }}>
          ВИНИЛОТЕКА
        </h1>
        <p style={{ 
          fontSize: 'clamp(14px, 2vw, 18px)', 
          color: '#666',
          marginBottom: '30px'
        }}>
          интернет-магазин виниловых пластинок и компакт-дисков
        </p>

        {/* СЛАЙДЕР  */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '700px', 
          margin: '30px auto', 
          overflow: 'hidden', 
          borderRadius: '8px',
          border: '2px solid #FF9451'
        }}>
          <div style={{ 
            display: 'flex', 
            transition: 'transform 0.5s ease', 
            transform: `translateX(-${currentSlide * 100}%)` 
          }}>
            {vinyls.map((vinyl) => (
              <div key={vinyl.id} style={{ 
                minWidth: '100%', 
                height: '400px', 
                position: 'relative', 
                backgroundColor: '#FF9451',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src={vinyl.image}
                  alt={vinyl.title}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
                <div style={{ 
                  position: 'absolute', 
                  bottom: '20px', 
                  left: '20px', 
                  right: '20px',
                  color: '#FFFFFF', 
                  backgroundColor: 'rgba(19, 15, 39, 0.85)', 
                  padding: '15px 25px', 
                  borderRadius: '6px' 
                }}>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>{vinyl.title}</h3>
                  <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '14px' }}>{vinyl.artist}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Стрелки */}
          <button onClick={prevSlide} style={{ 
            position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', 
            backgroundColor: '#FFFFFF', color: '#130F27', border: '2px solid #FF9451', 
            padding: '10px 14px', fontSize: '18px', cursor: 'pointer', zIndex: 2, 
            borderRadius: '6px', fontWeight: '700'
          }}>◀</button>
          <button onClick={nextSlide} style={{ 
            position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', 
            backgroundColor: '#FFFFFF', color: '#130F27', border: '2px solid #FF9451', 
            padding: '10px 14px', fontSize: '18px', cursor: 'pointer', zIndex: 2, 
            borderRadius: '6px', fontWeight: '700'
          }}>▶</button>

          {/* Точки */}
          <div style={{ 
            position: 'absolute', bottom: '10px', left: '50%', 
            transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 2 
          }}>
            {vinyls.map((_, index) => (
              <div key={index} onClick={() => setCurrentSlide(index)} style={{
                width: '10px', height: '10px', borderRadius: '50%',
                backgroundColor: index === currentSlide ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer', transition: '0.3s',
                border: index === currentSlide ? '2px solid #130F27' : 'none'
              }} />
            ))}
          </div>
        </div>
        
        <div style={{ marginTop: '30px' }}>
          <Link to="/catalog">
            <button style={{ 
              backgroundColor: '#FFFFFF',
              color: '#130F27',
              border: '2px solid #FF9451',
              padding: '14px 40px', 
              borderRadius: '6px',
              fontSize: '16px', 
              cursor: 'pointer',
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
              В каталог →
            </button>
          </Link>
        </div>
      </div>

      {/* ХИТЫ ПРОДАЖ */}
<h2 style={{ 
  fontSize: '28px', 
  textAlign: 'center', 
  marginBottom: '30px',
  color: '#130F27',
  fontWeight: '700'
}}>
  Хиты продаж
</h2>

<div style={{ 
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
  gap: '20px',
  marginBottom: '50px'
}}>
  {[
    { name: 'Земфира', desc: 'Российская рок-певица, автор песен.', image: 'https://impult.ru/preview/r/1200x-/upload/iblock/5b2/5b2ac97f540ea04a75796729cd1f4df8.jpg' },
    { name: 'ABBA', desc: 'Шведская поп-группа, 1972–1982.', image: 'https://avatars.mds.yandex.net/get-mpic/13671170/2a000001991895f9f58c7ffc26a943a8efe1/orig' },
    { name: 'Queen', desc: 'Британская рок-группа, одна из величайших.', image: 'https://www.gamepark.ru/upload/resize_cache/iblock/34d/1000_1000_1/471505_1.jpg' }
  ].map((item, i) => (
    <div key={i} style={{ 
      backgroundColor: '#FFFFFF', 
      borderRadius: '8px', 
      padding: '20px', 
      textAlign: 'center',
      border: '1px solid #E5E0D8',
      transition: '0.3s',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '420px'
    }}>
      {/* ВЕРХНЯЯ ЧАСТЬ — КАРТИНКА + ТЕКСТ */}
      <div>
        <img 
          src={item.image} 
          alt={item.name} 
          style={{ 
            width: '100%', 
            height: '220px', 
            objectFit: 'cover',
            borderRadius: '6px',
            marginBottom: '15px'
          }} 
        />
        <h3 style={{ 
          color: '#130F27', 
          fontWeight: '700',
          marginBottom: '8px',
          fontFamily: "'Inter', sans-serif"
        }}>
          {item.name}
        </h3>
        <p style={{ 
          fontSize: '14px', 
          color: '#666',
          fontFamily: "'Inter', sans-serif",
          marginBottom: '15px'
        }}>
          {item.desc}
        </p>
      </div>

      {/* КНОПКА — ВСЕГДА ВНИЗУ */}
      <Link to="/catalog">
        <button style={{ 
          backgroundColor: '#FFFFFF',
          color: '#000000',
          border: '2px solid #FF9451',
          padding: '10px 25px', 
          borderRadius: '6px', 
          cursor: 'pointer', 
          fontWeight: '600',
          fontFamily: "'Inter', sans-serif",
          transition: '0.3s',
          width: '100%'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#F0F0F0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#FFFFFF';
        }}
        >
          В каталог →
        </button>
      </Link>
    </div>
  ))}
</div>

      {/* ЦИТАТА */}
      <div style={{ 
        backgroundColor: '#FFFFFF', 
        padding: '40px 20px', 
        borderRadius: '8px', 
        textAlign: 'center',
        marginBottom: '50px',
        border: '1px solid #E5E0D8'
      }}>
        <h2 style={{ 
          fontSize: 'clamp(24px, 4vw, 36px)',
          color: '#130F27',
          fontWeight: '600'
        }}>
          Погрузись в атмосферу своих любимых песен с пластинками от ВИНИЛОТЕКИ
        </h2>
      </div>

      {/* О НАС */}
      <div style={{ 
        backgroundColor: '#FFFFFF', 
        padding: '40px 20px', 
        borderRadius: '8px', 
        marginBottom: '50px',
        border: '1px solid #E5E0D8'
      }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', color: '#130F27', fontWeight: '700' }}>О нас</h2>
        <p style={{ 
          fontSize: '16px', 
          lineHeight: '1.6', 
          color: '#444', 
          maxWidth: '800px', 
          margin: '0 auto',
          textAlign: 'center'
        }}>
          Винилотека — это интернет-магазин виниловых пластинок и CD-дисков, который делает процесс поиска музыки простым и приятным.
          Мы гарантируем качественный сервис и готовы предложить дополнительные услуги, например, предзаказ на любой альбом.
        </p>
      </div>

      {/* РАССЫЛКА — РЫЖИЙ ФОН */}
      <div style={{ 
        backgroundColor: '#FF9451', 
        color: '#FFFFFF', 
        padding: '50px 20px', 
        borderRadius: '8px', 
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h3 style={{ fontSize: '24px', marginBottom: '10px', fontWeight: '700' }}>Подпишитесь на нашу рассылку</h3>
        <p style={{ opacity: 0.95, marginBottom: '25px' }}>Будьте в курсе новинок и акций!</p>
        
        {/* ЗАГЛУШКА-ПЛАСТИНКА */}
        <div style={{ 
          width: '120px', 
          height: '120px', 
          margin: '0 auto 25px',
          borderRadius: '50%',
          backgroundColor: '#130F27',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '8px solid #FFFFFF',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: '#FF9451',
            border: '4px solid #FFFFFF'
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <input 
            type="email" 
            placeholder="Ваш email" 
            style={{ 
              padding: '12px 20px', 
              borderRadius: '6px', 
              border: '2px solid #FFFFFF', 
              width: '280px',
              fontSize: '15px',
              outline: 'none',
              fontFamily: "'Inter', sans-serif",
              backgroundColor: '#FFFFFF',
              color: '#130F27'
            }} 
          />
          <button style={{ 
            backgroundColor: '#FFFFFF', 
            color: '#130F27', 
            border: '2px solid #130F27', 
            padding: '12px 30px', 
            borderRadius: '6px', 
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '15px',
            fontFamily: "'Inter', sans-serif",
            transition: '0.3s'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#130F27';
            e.target.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#FFFFFF';
            e.target.style.color = '#130F27';
          }}
          >
            Подписаться
          </button>
        </div>
      </div>

      {/* ПОДВАЛ */}
      <footer style={{ 
        backgroundColor: '#FFFFFF', 
        color: '#130F27', 
        padding: '40px 30px', 
        borderRadius: '8px', 
        borderTop: '3px solid #FF9451'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '30px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {/* ЛЕВАЯ ЧАСТЬ */}
          <div style={{ flex: 1, minWidth: '250px' }}>
            <h4 style={{ marginBottom: '15px', color: '#130F27', fontWeight: '700' }}>Информация</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
              <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Публичная оферта</a>
              <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Реквизиты</a>
              <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Информация о компании</a>
              <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Уведомление об использовании Cookie</a>
              <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Пользовательское соглашение</a>
              <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Политика конфиденциальности</a>
            </div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ — СОЦСЕТИ */}
          <div style={{ minWidth: '200px' }}>
            <h4 style={{ marginBottom: '15px', color: '#130F27', fontWeight: '700' }}>Мы в соцсетях</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
              <a href="#" style={{ color: '#666', textDecoration: 'none' }}>ВКонтакте</a>
              <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Telegram</a>
              <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Instagram</a>
            </div>
            <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
              vinyloteka@mail.ru
            </p>
          </div>
        </div>

        <div style={{ 
          borderTop: '1px solid #E5E0D8', 
          marginTop: '30px', 
          paddingTop: '20px', 
          textAlign: 'center',
          fontSize: '13px',
          color: '#999'
        }}>
          © 2026 Винилотека. Все права защищены.
        </div>
      </footer>

    </div>
  );
}

export default Home;