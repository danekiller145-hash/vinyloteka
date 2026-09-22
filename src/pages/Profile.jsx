import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import './Profile.css';

function Profile({ user, setUser, favorites, toggleFavorite, orders }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [openSection, setOpenSection] = useState('personal');

  const [personalData, setPersonalData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [addressData, setAddressData] = useState({
    address: '',
    apartment: '',
    index: '',
    city: ''
  });

  // Обновляем личные данные, когда user загружается
  useEffect(() => {
    if (user) {
      setPersonalData({
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ')[1] || '',
        email: user.email || '',
        phone: ''
      });
    }
  }, [user]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (pwd) => pwd.length >= 8 && /\d/.test(pwd) && /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) newErrors.email = 'Email обязателен';
    else if (!validateEmail(email)) newErrors.email = 'Введите корректный email';

    if (!password) newErrors.password = 'Пароль обязателен';
    else if (!validatePassword(password)) {
      newErrors.password = 'Пароль: минимум 8 символов, цифра и спецсимвол';
    }

    if (!isLogin) {
      if (!name) newErrors.name = 'Имя обязательно';
      if (password !== confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают';
      if (!agree) newErrors.agree = 'Подтвердите согласие';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      if (isLogin) {
        // ВХОД
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        setUser({
          id: data.user.id,
          name: data.user.user_metadata?.name || 'Пользователь',
          email: data.user.email
        });

        alert('Вход выполнен!');
      } else {
        // РЕГИСТРАЦИЯ
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name }
          }
        });

        if (error) throw error;

        setUser({
          id: data.user?.id,
          name: name,
          email: email
        });

        alert('Регистрация прошла успешно!');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert(`Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsLogin(true);
    alert('Вы вышли из аккаунта');
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handlePersonalChange = (e) => {
    setPersonalData({ ...personalData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  const savePersonalData = () => alert('Личная информация сохранена!');
  const saveAddressData = () => alert('Адрес доставки сохранён!');

  // ФОРМА ВХОДА/РЕГИСТРАЦИИ
  if (!user) {
    return (
      <div className="auth-form">
        <h2 className="auth-title">{isLogin ? 'ВХОД' : 'РЕГИСТРАЦИЯ'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password"
            >
              {showPassword ? 'скрыть' : 'показать'}
            </span>
          </div>
          {errors.password && <p className="error-text">{errors.password}</p>}

          {!isLogin && (
            <>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Подтвердите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
              />
              {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
              <label className="checkbox-label">
                <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} />
                Я соглашаюсь на обработку персональных данных
              </label>
              {errors.agree && <p className="error-text">{errors.agree}</p>}
            </>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Загрузка...' : (isLogin ? 'ВОЙТИ' : 'ЗАРЕГИСТРИРОВАТЬСЯ')}
          </button>

          <p className="switch-mode">
            {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
            <span onClick={() => { setIsLogin(!isLogin); setErrors({}); }}>
              {isLogin ? 'Зарегистрироваться' : 'Войти'}
            </span>
          </p>
        </form>
      </div>
    );
  }

  // ЛИЧНЫЙ КАБИНЕТ
  return (
    <div className="profile">
      <div className="profile-main">
        <div className="profile-greeting">
          <h1>Здравствуйте, {personalData.firstName || user.name}!</h1>
        </div>

        <div className="profile-data">
          <h2>Ваши данные</h2>

          {/* ЛИЧНАЯ ИНФОРМАЦИЯ */}
          <div className="profile-section">
            <div className="section-header" onClick={() => toggleSection('personal')}>
              <span>Личная информация</span>
              <span>{openSection === 'personal' ? '▲' : '▼'}</span>
            </div>

            {openSection === 'personal' && (
              <div className="section-content">
                <div className="form-row">
                  <div>
                    <label className="field-label">Имя</label>
                    <input
                      type="text"
                      name="firstName"
                      value={personalData.firstName}
                      onChange={handlePersonalChange}
                      className="field-input"
                    />
                  </div>
                  <div>
                    <label className="field-label">Фамилия</label>
                    <input
                      type="text"
                      name="lastName"
                      value={personalData.lastName}
                      onChange={handlePersonalChange}
                      className="field-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label className="field-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={personalData.email}
                      onChange={handlePersonalChange}
                      className="field-input"
                    />
                  </div>
                  <div>
                    <label className="field-label">Телефон</label>
                    <input
                      type="tel"
                      name="phone"
                      value={personalData.phone}
                      onChange={handlePersonalChange}
                      placeholder="+7 (___) ___-__-__"
                      className="field-input"
                    />
                  </div>
                </div>

                <div className="section-buttons">
                  <button onClick={savePersonalData} className="btn-white">Сохранить</button>
                  <button className="btn-white-outline">Сменить пароль</button>
                </div>
              </div>
            )}
          </div>

          {/* АДРЕС ДОСТАВКИ */}
          <div className="profile-section">
            <div className="section-header" onClick={() => toggleSection('address')}>
              <span>Адрес доставки</span>
              <span>{openSection === 'address' ? '▲' : '▼'}</span>
            </div>

            {openSection === 'address' && (
              <div className="section-content">
                <div className="form-row">
                  <div>
                    <label className="field-label">Адрес</label>
                    <input
                      type="text"
                      name="address"
                      value={addressData.address}
                      onChange={handleAddressChange}
                      className="field-input"
                    />
                  </div>
                  <div>
                    <label className="field-label">Квартира/офис</label>
                    <input
                      type="text"
                      name="apartment"
                      value={addressData.apartment}
                      onChange={handleAddressChange}
                      className="field-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label className="field-label">Индекс</label>
                    <input
                      type="text"
                      name="index"
                      value={addressData.index}
                      onChange={handleAddressChange}
                      className="field-input"
                    />
                  </div>
                  <div>
                    <label className="field-label">Город</label>
                    <input
                      type="text"
                      name="city"
                      value={addressData.city}
                      onChange={handleAddressChange}
                      className="field-input"
                    />
                  </div>
                </div>

                <button onClick={saveAddressData} className="btn-white">Сохранить</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ТАБЫ */}
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Ваши заказы
        </button>
        <button
          className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          Избранное ({favorites.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'help' ? 'active' : ''}`}
          onClick={() => setActiveTab('help')}
        >
          Помощь
        </button>
        <button className="tab-btn logout" onClick={handleLogout}>Выйти</button>
      </div>

      {/* ЗАКАЗЫ */}
      {activeTab === 'orders' && (
        <div className="tab-content">
          <h2>Ваши заказы</h2>
          {orders.length === 0 ? (
            <p>У вас пока нет заказов.</p>
          ) : (
            <div>
              {orders.map((order) => (
                <div key={order.id} className="order-item">
                  <p className="order-title">Заказ №{order.id} от {order.date}</p>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>{item.title} — {item.artist} — {item.price} ₽</li>
                    ))}
                  </ul>
                  <p className="order-total">Итого: {order.total} ₽</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ПОМОЩЬ */}
      {activeTab === 'help' && (
        <div className="tab-content">
          <h2>Помощь</h2>
          <p>По всем вопросам пишите на vinyloteka@mail.ru</p>
        </div>
      )}

      {/* ПОЛНЫЙ СПИСОК ИЗБРАННОГО */}
      {activeTab === 'favorites' && (
        <div className="tab-content">
          <h2>Все избранные пластинки</h2>
          {favorites.length === 0 ? (
            <p>Избранное пусто.</p>
          ) : (
            <div className="favorites-grid">
              {favorites.map((vinyl) => (
                <FavoriteCard key={vinyl.id} vinyl={vinyl} toggleFavorite={toggleFavorite} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* БЛОК ИЗБРАННОГО ВНИЗУ */}
      {activeTab === 'profile' && (
        <div className="tab-content">
          <h2>Избранное</h2>

          {favorites.length === 0 ? (
            <p>Вы ещё не добавили ни одной пластинки в избранное.</p>
          ) : (
            <>
              <div className="favorites-grid">
                {favorites.slice(0, 4).map((vinyl) => (
                  <FavoriteCard key={vinyl.id} vinyl={vinyl} toggleFavorite={toggleFavorite} />
                ))}
              </div>

              <div className="show-all-wrapper">
                <button className="btn-show-all" onClick={() => setActiveTab('favorites')}>
                  Показать все
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// КАРТОЧКА ИЗБРАННОГО
function FavoriteCard({ vinyl, toggleFavorite }) {
  return (
    <div className="favorite-card">
      <div>
        <img src={vinyl.image} alt={vinyl.title} />
        <h4>{vinyl.title}</h4>
        <p className="fav-artist">{vinyl.artist}</p>
        <p className="fav-price">{vinyl.price} ₽</p>
      </div>

      <button className="btn-remove-fav" onClick={() => toggleFavorite(vinyl)}>
        Удалить
      </button>
    </div>
  );
}

export default Profile;
