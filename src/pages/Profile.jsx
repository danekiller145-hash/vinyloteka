import { useState } from 'react';

function Profile({ user, setUser, favorites, toggleFavorite, orders }) {
  const [isLogin, setIsLogin] = useState(!user);
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('profile');
  const [openSection, setOpenSection] = useState('personal');

  const [personalData, setPersonalData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: ''
  });

  const [addressData, setAddressData] = useState({
    address: '',
    apartment: '',
    index: '',
    city: ''
  });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (pwd) => pwd.length >= 8 && /\d/.test(pwd) && /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

  const handleSubmit = (e) => {
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
    setUser({ name: name || 'Пользователь', email });
    setIsLogin(false);
    setPersonalData(prev => ({
      ...prev,
      firstName: name?.split(' ')[0] || 'Пользователь',
      lastName: name?.split(' ')[1] || '',
      email: email
    }));
    alert(isLogin ? 'Вход выполнен!' : 'Регистрация прошла успешно!');
  };

  const handleLogout = () => {
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
      <div style={{ 
        maxWidth: '420px', 
        margin: '40px auto', 
        padding: '30px', 
        backgroundColor: '#FFFFFF', 
        borderRadius: '8px', 
        border: '1px solid #E5E0D8',
        fontFamily: "'Inter', sans-serif"
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          color: '#130F27', 
          marginBottom: '25px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontSize: '18px'
        }}>
          {isLogin ? 'ВХОД' : 'РЕГИСТРАЦИЯ'}
        </h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input 
                type="text" 
                placeholder="Имя" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                style={inputStyle} 
              />
              {errors.name && <p style={errorStyle}>{errors.name}</p>}
            </>
          )}
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={inputStyle} 
          />
          {errors.email && <p style={errorStyle}>{errors.email}</p>}
          
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Пароль" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ ...inputStyle, paddingRight: '85px' }} 
            />
            <span 
              onClick={() => setShowPassword(!showPassword)} 
              style={{ 
                position: 'absolute', 
                right: '12px', 
                top: '12px', 
                cursor: 'pointer', 
                fontSize: '12px',
                color: '#FF9451',
                fontWeight: '600',
                textTransform: 'uppercase'
              }}
            >
              {showPassword ? 'скрыть' : 'показать'}
            </span>
          </div>
          {errors.password && <p style={errorStyle}>{errors.password}</p>}
          
          {!isLogin && (
            <>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Подтвердите пароль" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                style={inputStyle} 
              />
              {errors.confirmPassword && <p style={errorStyle}>{errors.confirmPassword}</p>}
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                fontSize: '13px', 
                marginTop: '10px',
                color: '#666',
                fontFamily: "'Inter', sans-serif"
              }}>
                <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} />
                Я соглашаюсь на обработку персональных данных
              </label>
              {errors.agree && <p style={errorStyle}>{errors.agree}</p>}
            </>
          )}
          
          <button type="submit" style={buttonStyle}>
            {isLogin ? 'ВОЙТИ' : 'ЗАРЕГИСТРИРОВАТЬСЯ'}
          </button>
          
          <p style={{ 
            textAlign: 'center', 
            fontSize: '13px', 
            marginTop: '20px',
            color: '#666',
            fontFamily: "'Inter', sans-serif"
          }}>
            {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
            <span 
              onClick={() => { setIsLogin(!isLogin); setErrors({}); }} 
              style={{ 
                color: '#FF9451', 
                cursor: 'pointer', 
                fontWeight: '600',
                marginLeft: '5px'
              }}
            >
              {isLogin ? 'Зарегистрироваться' : 'Войти'}
            </span>
          </p>
        </form>
      </div>
    );
  }

  // ЛИЧНЫЙ КАБИНЕТ
  return (
    <div style={{ 
      fontFamily: "'Inter', sans-serif",
      minHeight: '80vh',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    }}>
      
      {/* ОСНОВНОЙ БЛОК — РЫЖИЙ */}
      <div style={{ 
        backgroundColor: '#FF9451',
        borderRadius: '8px',
        padding: '40px',
        display: 'flex',
        gap: '40px',
        flexWrap: 'wrap',
        color: '#FFFFFF'
      }}>
        
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700',
            color: '#FFFFFF',
            marginBottom: '20px',
            letterSpacing: '0.5px'
          }}>
            Здравствуйте, {personalData.firstName || user.name}!
          </h1>
        </div>

        <div style={{ flex: 1.5, minWidth: '300px' }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '700',
            color: '#FFFFFF',
            marginBottom: '20px',
            letterSpacing: '0.5px'
          }}>
            Ваши данные
          </h2>

          {/* ЛИЧНАЯ ИНФОРМАЦИЯ */}
          <div style={{ marginBottom: '15px' }}>
            <div 
              onClick={() => toggleSection('personal')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px 0',
                borderBottom: '1px solid rgba(255,255,255,0.4)',
                cursor: 'pointer'
              }}
            >
              <span style={{ 
                fontSize: '13px', 
                fontWeight: '700', 
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#FFFFFF'
              }}>
                Личная информация
              </span>
              <span style={{ fontSize: '14px', color: '#FFFFFF' }}>
                {openSection === 'personal' ? '▲' : '▼'}
              </span>
            </div>

            {openSection === 'personal' && (
              <div style={{ padding: '20px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={labelStyle}>Имя</label>
                    <input
                      type="text"
                      name="firstName"
                      value={personalData.firstName}
                      onChange={handlePersonalChange}
                      style={fieldStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Фамилия</label>
                    <input
                      type="text"
                      name="lastName"
                      value={personalData.lastName}
                      onChange={handlePersonalChange}
                      style={fieldStyle}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={personalData.email}
                      onChange={handlePersonalChange}
                      style={fieldStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Телефон</label>
                    <input
                      type="tel"
                      name="phone"
                      value={personalData.phone}
                      onChange={handlePersonalChange}
                      placeholder="+7 (___) ___-__-__"
                      style={fieldStyle}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  <button onClick={savePersonalData} style={smallWhiteButtonStyle}>
                    Сохранить
                  </button>
                  <button style={{
                    ...smallWhiteButtonStyle,
                    backgroundColor: 'transparent',
                    color: '#FFFFFF',
                    border: '2px solid #FFFFFF'
                  }}>
                    Сменить пароль
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* АДРЕС ДОСТАВКИ */}
          <div style={{ marginBottom: '15px' }}>
            <div 
              onClick={() => toggleSection('address')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px 0',
                borderBottom: '1px solid rgba(255,255,255,0.4)',
                cursor: 'pointer'
              }}
            >
              <span style={{ 
                fontSize: '13px', 
                fontWeight: '700', 
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#FFFFFF'
              }}>
                Адрес доставки
              </span>
              <span style={{ fontSize: '14px', color: '#FFFFFF' }}>
                {openSection === 'address' ? '▲' : '▼'}
              </span>
            </div>

            {openSection === 'address' && (
              <div style={{ padding: '20px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={labelStyle}>Адрес</label>
                    <input
                      type="text"
                      name="address"
                      value={addressData.address}
                      onChange={handleAddressChange}
                      style={fieldStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Квартира/офис</label>
                    <input
                      type="text"
                      name="apartment"
                      value={addressData.apartment}
                      onChange={handleAddressChange}
                      style={fieldStyle}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                  <div>
                    <label style={labelStyle}>Индекс (автоматически)</label>
                    <input
                      type="text"
                      name="index"
                      value={addressData.index}
                      onChange={handleAddressChange}
                      style={fieldStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Город</label>
                    <input
                      type="text"
                      name="city"
                      value={addressData.city}
                      onChange={handleAddressChange}
                      style={fieldStyle}
                    />
                  </div>
                </div>

                <button onClick={saveAddressData} style={smallWhiteButtonStyle}>
                  Сохранить
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ТАБЫ */}
      <div style={{ 
        marginTop: '20px',
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={() => setActiveTab('orders')}
          style={{
            backgroundColor: activeTab === 'orders' ? '#FF9451' : '#FFFFFF',
            color: activeTab === 'orders' ? '#FFFFFF' : '#FF9451',
            border: '2px solid #FF9451',
            padding: '10px 24px',
            borderRadius: '30px',
            fontSize: '12px',
            cursor: 'pointer',
            fontWeight: '700',
            fontFamily: "'Inter', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '1px',
            transition: '0.3s'
          }}
        >
          Ваши заказы
        </button>
        <button 
          onClick={() => setActiveTab('favorites')}
          style={{
            backgroundColor: activeTab === 'favorites' ? '#FF9451' : '#FFFFFF',
            color: activeTab === 'favorites' ? '#FFFFFF' : '#FF9451',
            border: '2px solid #FF9451',
            padding: '10px 24px',
            borderRadius: '30px',
            fontSize: '12px',
            cursor: 'pointer',
            fontWeight: '700',
            fontFamily: "'Inter', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '1px',
            transition: '0.3s'
          }}
        >
          Избранное ({favorites.length})
        </button>
        <button 
          onClick={() => setActiveTab('help')}
          style={{
            backgroundColor: activeTab === 'help' ? '#FF9451' : '#FFFFFF',
            color: activeTab === 'help' ? '#FFFFFF' : '#FF9451',
            border: '2px solid #FF9451',
            padding: '10px 24px',
            borderRadius: '30px',
            fontSize: '12px',
            cursor: 'pointer',
            fontWeight: '700',
            fontFamily: "'Inter', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '1px',
            transition: '0.3s'
          }}
        >
          Помощь
        </button>
        <button 
          onClick={handleLogout}
          style={{
            backgroundColor: '#FFFFFF',
            color: '#FF9451',
            border: '2px solid #FF9451',
            padding: '10px 24px',
            borderRadius: '30px',
            fontSize: '12px',
            cursor: 'pointer',
            fontWeight: '700',
            fontFamily: "'Inter', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '1px',
            transition: '0.3s',
            marginLeft: 'auto'
          }}
        >
          Выйти
        </button>
      </div>

      {/* ЗАКАЗЫ */}
      {activeTab === 'orders' && (
        <div style={{ 
          marginTop: '20px',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          padding: '30px',
          border: '1px solid #E5E0D8'
        }}>
          <h2 style={{ color: '#000000', fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>
            Ваши заказы
          </h2>
          {orders.length === 0 ? (
            <p style={{ color: '#888', fontSize: '15px' }}>У вас пока нет заказов.</p>
          ) : (
            <div>
              {orders.map((order) => (
                <div key={order.id} style={{ 
                  borderBottom: '1px solid #E5E0D8', 
                  paddingBottom: '20px', 
                  marginBottom: '20px' 
                }}>
                  <p style={{ color: '#130F27', fontWeight: '600', marginBottom: '10px' }}>
                    Заказ №{order.id} от {order.date}
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {order.items.map((item, index) => (
                      <li key={index} style={{ color: '#666', fontSize: '14px', padding: '5px 0' }}>
                        {item.title} — {item.artist} — {item.price} ₽
                      </li>
                    ))}
                  </ul>
                  <p style={{ color: '#FF9451', fontWeight: '700', marginTop: '10px', fontSize: '16px' }}>
                    Итого: {order.total} ₽
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ПОМОЩЬ */}
      {activeTab === 'help' && (
        <div style={{ 
          marginTop: '20px',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          padding: '30px',
          border: '1px solid #E5E0D8'
        }}>
          <h2 style={{ color: '#000000', fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>
            Помощь
          </h2>
          <p style={{ color: '#666', fontSize: '15px' }}>
            По всем вопросам пишите на vinyloteka@mail.ru
          </p>
        </div>
      )}

      {/* ПОЛНЫЙ СПИСОК ИЗБРАННОГО */}
      {activeTab === 'favorites' && (
        <div style={{ 
          marginTop: '20px',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          padding: '30px',
          border: '1px solid #E5E0D8'
        }}>
          <h2 style={{ color: '#000000', fontSize: '22px', fontWeight: '700', marginBottom: '25px' }}>
            Все избранные пластинки
          </h2>
          {favorites.length === 0 ? (
            <p style={{ color: '#888', fontSize: '15px' }}>Избранное пусто.</p>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              {favorites.map((vinyl) => (
                <FavoriteCard key={vinyl.id} vinyl={vinyl} toggleFavorite={toggleFavorite} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* БЛОК ИЗБРАННОГО ВНИЗУ */}
      {activeTab === 'profile' && (
        <div style={{ 
          marginTop: '30px',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          padding: '30px',
          border: '1px solid #E5E0D8'
        }}>
          <h2 style={{ color: '#000000', fontSize: '22px', fontWeight: '700', marginBottom: '25px' }}>
            Избранное
          </h2>

          {favorites.length === 0 ? (
            <p style={{ color: '#888', fontSize: '15px' }}>
              Вы ещё не добавили ни одной пластинки в избранное.
            </p>
          ) : (
            <>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '25px'
              }}>
                {favorites.slice(0, 4).map((vinyl) => (
                  <FavoriteCard key={vinyl.id} vinyl={vinyl} toggleFavorite={toggleFavorite} />
                ))}
              </div>

              <div style={{ textAlign: 'center' }}>
                <button 
                  onClick={() => setActiveTab('favorites')}
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#FF9451',
                    border: '2px solid #FF9451',
                    padding: '12px 40px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontFamily: "'Inter', sans-serif",
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    transition: '0.3s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F0F0F0'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                >
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

// КАРТОЧКА ИЗБРАННОГО — вынесена отдельно, чтобы не дублировать
function FavoriteCard({ vinyl, toggleFavorite }) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      border: '1px solid #E5E0D8',
      padding: '15px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '340px'
    }}>
      <div>
        <img 
          src={vinyl.image} 
          alt={vinyl.title} 
          style={{ 
            width: '100%', 
            height: '150px',
            objectFit: 'contain',
            marginBottom: '10px'
          }} 
        />
        <h4 style={{ 
          margin: '5px 0', 
          color: '#130F27', 
          fontSize: '14px', 
          fontWeight: '600',
          minHeight: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Inter', sans-serif"
        }}>
          {vinyl.title}
        </h4>
        <p style={{ 
          fontSize: '12px', 
          color: '#666', 
          margin: '3px 0',
          minHeight: '18px',
          fontFamily: "'Inter', sans-serif"
        }}>
          {vinyl.artist}
        </p>
        <p style={{ 
          fontSize: '15px', 
          color: '#FF9451', 
          fontWeight: '700', 
          margin: '8px 0',
          fontFamily: "'Inter', sans-serif"
        }}>
          {vinyl.price} ₽
        </p>
      </div>

      <button
        onClick={() => toggleFavorite(vinyl)}
        style={{
          backgroundColor: 'transparent',
          border: '2px solid #FF9451',
          borderRadius: '6px',
          color: '#FF9451',
          fontSize: '14px',
          cursor: 'pointer',
          padding: '5px 12px',
          fontWeight: '600',
          fontFamily: "'Inter', sans-serif",
          transition: '0.3s',
          width: '100%'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F0F0F0'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        Удалить
      </button>
    </div>
  );
}

// СТИЛИ
const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '6px',
  border: '2px solid #E5E0D8',
  fontSize: '15px',
  marginBottom: '8px',
  boxSizing: 'border-box',
  fontFamily: "'Inter', sans-serif",
  color: '#130F27',
  outline: 'none'
};

const errorStyle = {
  color: '#e63946',
  fontSize: '12px',
  margin: '-4px 0 8px 0'
};

const buttonStyle = {
  width: '100%',
  padding: '14px',
  backgroundColor: '#FFFFFF',
  color: '#FF9451',
  border: '2px solid #FF9451',
  borderRadius: '6px',
  fontSize: '14px',
  cursor: 'pointer',
  marginTop: '15px',
  fontWeight: '700',
  fontFamily: "'Inter', sans-serif",
  textTransform: 'uppercase',
  letterSpacing: '1px'
};

const fieldStyle = {
  width: '100%',
  padding: '8px 0',
  backgroundColor: 'transparent',
  border: 'none',
  borderBottom: '1px solid rgba(255,255,255,0.6)',
  color: '#FFFFFF',
  fontSize: '15px',
  fontFamily: "'Inter', sans-serif",
  outline: 'none',
  boxSizing: 'border-box'
};

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  color: '#FFFFFF',
  marginBottom: '5px',
  fontFamily: "'Inter', sans-serif"
};

const smallWhiteButtonStyle = {
  backgroundColor: '#FFFFFF',
  color: '#FF9451',
  border: '2px solid #FFFFFF',
  padding: '10px 24px',
  borderRadius: '30px',
  fontSize: '12px',
  cursor: 'pointer',
  fontWeight: '700',
  fontFamily: "'Inter', sans-serif",
  textTransform: 'uppercase',
  letterSpacing: '1px',
  transition: '0.3s'
};

export default Profile;