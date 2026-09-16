import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Cart({ cart, removeFromCart, clearCart, placeOrder }) {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: '',
    phone: '',
    name: ''
  });
  const navigate = useNavigate();

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  const freeDeliveryThreshold = 3000;
  const remainingForFreeDelivery = freeDeliveryThreshold - totalPrice;
  const progressPercent = Math.min((totalPrice / freeDeliveryThreshold) * 100, 100);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo({ ...deliveryInfo, [name]: value });
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!deliveryInfo.name || !deliveryInfo.phone || !deliveryInfo.address) {
      alert('Пожалуйста, заполните все поля формы!');
      return;
    }
    const order = {
      id: Date.now(),
      date: new Date().toLocaleDateString('ru-RU'),
      items: [...cart],
      total: totalPrice,
      delivery: deliveryInfo,
      status: 'В обработке'
    };
    if (placeOrder) {
      placeOrder(order);
    }
    clearCart();
    setDeliveryInfo({ address: '', phone: '', name: '' });
    setShowOrderForm(false);
    alert(`Заказ №${order.id} успешно оформлен!`);
    navigate('/profile');
  };

  // ПУСТАЯ КОРЗИНА
  if (cart.length === 0) {
    return (
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '40px 20px',
        fontFamily: "'Inter', sans-serif",
        backgroundColor: '#FFF1DE',
        minHeight: '60vh',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#130F27', fontWeight: '700', marginBottom: '20px' }}>
          КОРЗИНА
        </h1>
        <p style={{ color: '#666', fontSize: '18px', marginBottom: '30px' }}>
          Корзина пуста. Добавьте пластинки из каталога!
        </p>
        <Link to="/catalog">
          <button style={{
            backgroundColor: 'transparent',
            color: '#FF9451',
            border: '2px solid #FF9451',
            padding: '14px 40px',
            borderRadius: '6px',
            fontSize: '15px',
            cursor: 'pointer',
            fontWeight: '600',
            fontFamily: "'Inter', sans-serif",
            letterSpacing: '1px',
            textTransform: 'uppercase',
            transition: '0.3s'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#FF9451';
            e.target.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#FF9451';
          }}
          >
            Продолжить покупки
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: "'Inter', sans-serif",
      backgroundColor: '#FFF1DE',
      minHeight: '100vh'
    }}>
      
      {/* ЗАГОЛОВОК */}
      <h1 style={{ 
        color: '#130F27', 
        fontWeight: '700', 
        marginBottom: '30px',
        fontSize: '28px',
        letterSpacing: '1px'
      }}>
        КОРЗИНА
      </h1>

      {/* ТАБЛИЦА ТОВАРОВ — РЫЖИЙ ФОН */}
      <div style={{
        backgroundColor: '#FF9451',
        borderRadius: '8px',
        padding: '0',
        overflow: 'hidden',
        marginBottom: '20px'
      }}>
        {/* Заголовки таблицы */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '80px 1fr 80px 120px 100px',
          gap: '15px',
          padding: '15px 20px',
          color: '#FFFFFF',
          fontSize: '13px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          borderBottom: '1px solid rgba(255,255,255,0.3)'
        }}>
          <div></div>
          <div>Товар</div>
          <div style={{ textAlign: 'center' }}>Кол-во</div>
          <div style={{ textAlign: 'right' }}>Цена</div>
          <div style={{ textAlign: 'right' }}>Действия</div>
        </div>

        {/* Товары */}
        {cart.map((item, index) => (
          <div key={index} style={{
            display: 'grid',
            gridTemplateColumns: '80px 1fr 80px 120px 100px',
            gap: '15px',
            padding: '20px',
            alignItems: 'center',
            borderBottom: index < cart.length - 1 ? '1px solid rgba(255,255,255,0.3)' : 'none',
            color: '#FFFFFF'
          }}>
            {/* Картинка */}
            <img
              src={item.image}
              alt={item.title}
              style={{ 
                width: '70px', 
                height: '70px', 
                objectFit: 'cover', 
                borderRadius: '4px',
                backgroundColor: '#FFFFFF'
              }} 
            />
            
            {/* Название */}
            <div>
              <p style={{ 
                margin: 0, 
                fontWeight: '600', 
                fontSize: '15px',
                color: '#FFFFFF'
              }}>
                {item.title} — {item.artist}
              </p>
            </div>

            {/* Количество */}
            <div style={{ 
              textAlign: 'center', 
              fontSize: '15px', 
              fontWeight: '600',
              color: '#FFFFFF'
            }}>
              1
            </div>

            {/* Цена */}
            <div style={{ 
              textAlign: 'right', 
              fontSize: '16px', 
              fontWeight: '700',
              color: '#FFFFFF'
            }}>
              {item.price} руб.
            </div>

            {/* Кнопки действий */}
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              justifyContent: 'flex-end' 
            }}>
              {/* Сердечко */}
              <button style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '2px solid #FFFFFF',
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: '0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#FFFFFF';
                e.target.style.color = '#FF9451';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#FFFFFF';
              }}
              >
                ♡
              </button>

              {/* Удалить */}
              <button 
                onClick={() => removeFromCart(index)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '2px solid #FFFFFF',
                  backgroundColor: 'transparent',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: '0.3s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#FFFFFF';
                  e.target.style.color = '#FF9451';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#FFFFFF';
                }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* СООБЩЕНИЕ О ДОПОЛНЕНИИ */}
      <p style={{ 
        color: '#FF9451', 
        fontSize: '14px', 
        marginBottom: '20px',
        fontStyle: 'italic'
      }}>
        Вы можете добавить в корзину дополнительные позиции, для этого вернитесь в каталог
      </p>

      {/* КНОПКИ ПЕРЕМЕСТИТЬ / ОЧИСТИТЬ */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '40px',
        flexWrap: 'wrap'
      }}>
        <button style={{
          backgroundColor: '#FFFFFF',
          color: '#FF9451',
          border: '2px solid #FF9451',
          padding: '7px 16px',
          borderRadius: '30px',
          fontSize: '11px',
          cursor: 'pointer',
          fontWeight: '600',
          fontFamily: "'Inter', sans-serif",
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          transition: '0.3s'
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = '#F0F0F0';
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = '#FFFFFF';
        }}
        >
          Переместить в избранное
        </button>

        <button 
          onClick={clearCart}
          style={{
            backgroundColor: '#FFFFFF',
            color: '#FF9451',
            border: '2px solid #FF9451',
            padding: '7px 16px',
            borderRadius: '30px',
            fontSize: '11px',
            cursor: 'pointer',
            fontWeight: '600',
            fontFamily: "'Inter', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            transition: '0.3s'
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = '#F0F0F0';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = '#FFFFFF';
          }}
        >
          Очистить корзину
        </button>
      </div>

      {/* ФОРМА ОФОРМЛЕНИЯ ЗАКАЗА */}
      {showOrderForm && (
        <form onSubmit={handleOrderSubmit} style={{ 
          backgroundColor: '#FFFFFF', 
          padding: '30px', 
          borderRadius: '8px',
          marginBottom: '30px',
          border: '1px solid #E5E0D8',
          maxWidth: '600px',
          margin: '0 auto 30px'
        }}>
          <h3 style={{ 
            marginTop: 0, 
            color: '#130F27', 
            fontWeight: '700',
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontSize: '16px'
          }}>
            Данные для доставки
          </h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#130F27', fontWeight: '600', fontSize: '14px' }}>
              Имя получателя:
            </label>
            <input
              type="text"
              name="name"
              value={deliveryInfo.name}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '2px solid #E5E0D8',
                fontSize: '15px',
                fontFamily: "'Inter', sans-serif",
                outline: 'none',
                boxSizing: 'border-box',
                color: '#130F27'
              }}
              onFocus={(e) => e.target.style.borderColor = '#FF9451'}
              onBlur={(e) => e.target.style.borderColor = '#E5E0D8'}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#130F27', fontWeight: '600', fontSize: '14px' }}>
              Телефон:
            </label>
            <input
              type="tel"
              name="phone"
              value={deliveryInfo.phone}
              onChange={handleInputChange}
              required
              placeholder="+7 (XXX) XXX-XX-XX"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '2px solid #E5E0D8',
                fontSize: '15px',
                fontFamily: "'Inter', sans-serif",
                outline: 'none',
                boxSizing: 'border-box',
                color: '#130F27'
              }}
              onFocus={(e) => e.target.style.borderColor = '#FF9451'}
              onBlur={(e) => e.target.style.borderColor = '#E5E0D8'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#130F27', fontWeight: '600', fontSize: '14px' }}>
              Адрес доставки:
            </label>
            <textarea
              name="address"
              value={deliveryInfo.address}
              onChange={handleInputChange}
              required
              rows="3"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '2px solid #E5E0D8',
                fontSize: '15px',
                resize: 'vertical',
                fontFamily: "'Inter', sans-serif",
                outline: 'none',
                boxSizing: 'border-box',
                color: '#130F27'
              }}
              onFocus={(e) => e.target.style.borderColor = '#FF9451'}
              onBlur={(e) => e.target.style.borderColor = '#E5E0D8'}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button 
              type="submit"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#FF9451',
                border: '2px solid #FF9451',
                padding: '12px 30px',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '600',
                fontFamily: "'Inter', sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '1px',
                transition: '0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#FF9451';
                e.target.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#FFFFFF';
                e.target.style.color = '#FF9451';
              }}
            >
              Подтвердить заказ
            </button>
            <button 
              type="button"
              onClick={() => setShowOrderForm(false)}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#130F27',
                border: '2px solid #E5E0D8',
                padding: '12px 30px',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '600',
                fontFamily: "'Inter', sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      {/* ПРОГРЕСС ДО БЕСПЛАТНОЙ ДОСТАВКИ */}
      <div style={{ 
        marginTop: '40px', 
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <p style={{ 
          color: '#FF9451', 
          fontSize: '14px', 
          marginBottom: '15px',
          fontWeight: '600'
        }}>
          {remainingForFreeDelivery > 0 
            ? `Дополните корзину на ${remainingForFreeDelivery} руб. и получите бесплатную доставку`
            : 'Вы получили бесплатную доставку!'}
        </p>
        <div style={{
          width: '100%',
          maxWidth: '600px',
          height: '6px',
          backgroundColor: '#E5E0D8',
          borderRadius: '3px',
          margin: '0 auto',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            backgroundColor: '#FF9451',
            borderRadius: '3px',
            transition: '0.5s'
          }} />
        </div>
      </div>

      {/* НИЖНИЕ КНОПКИ */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginTop: '30px'
      }}>
        {/* ПРОДОЛЖИТЬ ПОКУПКИ */}
        <Link to="/catalog" style={{ flex: 1, minWidth: '250px' }}>
          <button style={{
            width: '100%',
            backgroundColor: '#FF9451',
            color: '#FFFFFF',
            border: '2px solid #FFFFFF',
            padding: '16px 30px',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: '600',
            fontFamily: "'Inter', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '1px',
            transition: '0.3s'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#FFFFFF';
            e.target.style.color = '#FF9451';
            e.target.style.borderColor = '#FF9451';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#FF9451';
            e.target.style.color = '#FFFFFF';
            e.target.style.borderColor = '#FFFFFF';
          }}
          >
            Продолжить покупки
          </button>
        </Link>

        {/* ОФОРМИТЬ ЗАКАЗ */}
        <button 
          onClick={() => setShowOrderForm(true)}
          style={{
            flex: 1,
            minWidth: '250px',
            backgroundColor: '#FFFFFF',
            color: '#FF9451',
            border: '2px solid #FF9451',
            padding: '16px 30px',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: '700',
            fontFamily: "'Inter', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '1px',
            transition: '0.3s'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#FF9451';
            e.target.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#FFFFFF';
            e.target.style.color = '#FF9451';
          }}
        >
          Оформить заказ — {totalPrice} руб.
        </button>
      </div>

    </div>
  );
}

export default Cart;
