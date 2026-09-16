import Home from './pages/Home';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Profile from './pages/Profile';

function Navbar({ cart, user }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '15px 40px',
      backgroundColor: '#FFFFFF',
      color: '#130F27',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 12px rgba(19, 15, 39, 0.08)',
      fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif"
    }}>
      <Link to="/" style={{ 
        color: '#130F27', 
        textDecoration: 'none',
        fontSize: '24px',
        fontWeight: '700',
        letterSpacing: '1px',
        fontFamily: "'Inter', sans-serif"
      }}>
        ВИНИЛОТЕКА
      </Link>

      <div style={{ flex: 1, maxWidth: '400px', margin: '0 40px' }}>
        <input
          type="text"
          placeholder="Поиск пластинок..."
          style={{
            width: '100%',
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid #E5E0D8',
            fontSize: '14px',
            backgroundColor: '#FFFFFF',
            color: '#130F27',
            outline: 'none',
            fontFamily: "'Inter', sans-serif"
          }}
          onFocus={(e) => e.target.style.borderColor = '#FF9451'}
          onBlur={(e) => e.target.style.borderColor = '#E5E0D8'}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <Link 
          to="/catalog" 
          style={{ 
            color: isActive('/catalog') ? '#FF9451' : '#130F27',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: isActive('/catalog') ? '700' : '500',
            transition: '0.3s',
            fontFamily: "'Inter', sans-serif"
          }}
        >
          Каталог
        </Link>
        <Link 
          to="/cart" 
          style={{ 
            color: isActive('/cart') ? '#FF9451' : '#130F27',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: isActive('/cart') ? '700' : '500',
            transition: '0.3s',
            fontFamily: "'Inter', sans-serif"
          }}
        >
          Корзина ({cart.length})
        </Link>
        <Link 
          to="/profile" 
          style={{ 
            color: isActive('/profile') ? '#FF9451' : '#130F27',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: isActive('/profile') ? '700' : '500',
            transition: '0.3s',
            fontFamily: "'Inter', sans-serif"
          }}
        >
          {user ? user.name : 'Войти'}
        </Link>
      </div>
    </nav>
  );
}

function App() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (vinyl) => setCart([...cart, vinyl]);
  const removeFromCart = (indexToRemove) => setCart(cart.filter((_, index) => index !== indexToRemove));
  const clearCart = () => setCart([]);

  const toggleFavorite = (vinyl) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === vinyl.id);
      if (exists) return prev.filter((item) => item.id !== vinyl.id);
      return [...prev, vinyl];
    });
  };

  const placeOrder = (order) => {
    if (cart.length === 0) {
      alert('Корзина пуста!');
      return;
    }
    const newOrder = order || {
      id: Date.now(),
      date: new Date().toLocaleString(),
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price, 0),
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    alert('Заказ оформлен! Спасибо за покупку!');
  };

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', backgroundColor: '#FFF1DE' }}>
        <Navbar cart={cart} user={user} />
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={
              <Catalog addToCart={addToCart} favorites={favorites} toggleFavorite={toggleFavorite} />
            } />
            <Route path="/cart" element={
              <Cart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} placeOrder={placeOrder} />
            } />
            <Route path="/profile" element={
              <Profile user={user} setUser={setUser} favorites={favorites} toggleFavorite={toggleFavorite} orders={orders} />
            } />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
