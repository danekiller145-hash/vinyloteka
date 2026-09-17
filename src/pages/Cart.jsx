import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Cart.css';

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
      <div className="cart-empty">
        <h1>КОРЗИНА</h1>
        <p>Корзина пуста. Добавьте пластинки из каталога!</p>
        <Link to="/catalog">
          <button className="btn-continue-outline">Продолжить покупки</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <h1 className="cart-title">КОРЗИНА</h1>

      {/* ТАБЛИЦА ТОВАРОВ */}
      <div className="cart-table">
        <div className="cart-table-header">
          <div></div>
          <div>Товар</div>
          <div style={{ textAlign: 'center' }}>Кол-во</div>
          <div style={{ textAlign: 'right' }}>Цена</div>
          <div style={{ textAlign: 'right' }}>Действия</div>
        </div>

        {cart.map((item, index) => (
          <div key={index} className="cart-row">
            <img src={item.image} alt={item.title} />
            
            <p className="title">{item.title} — {item.artist}</p>

            <div className="qty">1</div>

            <div className="price">{item.price} руб.</div>

            <div className="actions">
              <button className="btn-icon">♡</button>
              <button className="btn-icon" onClick={() => removeFromCart(index)}>✕</button>
            </div>
          </div>
        ))}
      </div>

      {/* СООБЩЕНИЕ */}
      <p className="cart-message">
        Вы можете добавить в корзину дополнительные позиции, для этого вернитесь в каталог
      </p>

      {/* КНОПКИ ПЕРЕМЕСТИТЬ / ОЧИСТИТЬ */}
      <div className="cart-small-buttons">
        <button className="btn-small">Переместить в избранное</button>
        <button className="btn-small" onClick={clearCart}>Очистить корзину</button>
      </div>

      {/* ФОРМА ОФОРМЛЕНИЯ ЗАКАЗА */}
      {showOrderForm && (
        <form onSubmit={handleOrderSubmit} className="order-form">
          <h3>Данные для доставки</h3>

          <div className="form-group">
            <label>Имя получателя:</label>
            <input
              type="text"
              name="name"
              value={deliveryInfo.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Телефон:</label>
            <input
              type="tel"
              name="phone"
              value={deliveryInfo.phone}
              onChange={handleInputChange}
              required
              placeholder="+7 (XXX) XXX-XX-XX"
            />
          </div>

          <div className="form-group">
            <label>Адрес доставки:</label>
            <textarea
              name="address"
              value={deliveryInfo.address}
              onChange={handleInputChange}
              required
              rows="3"
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-primary">Подтвердить заказ</button>
            <button type="button" className="btn-secondary" onClick={() => setShowOrderForm(false)}>
              Отмена
            </button>
          </div>
        </form>
      )}

      {/* ПРОГРЕСС ДОСТАВКИ */}
      <div className="delivery-progress">
        <p>
          {remainingForFreeDelivery > 0
            ? `Дополните корзину на ${remainingForFreeDelivery} руб. и получите бесплатную доставку`
            : 'Вы получили бесплатную доставку!'}
        </p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* НИЖНИЕ КНОПКИ */}
      <div className="cart-bottom-buttons">
        <Link to="/catalog">
          <button className="btn-continue">Продолжить покупки</button>
        </Link>

        <button className="btn-order" onClick={() => setShowOrderForm(true)}>
          Оформить заказ — {totalPrice} руб.
        </button>
      </div>
    </div>
  );
}

export default Cart;
