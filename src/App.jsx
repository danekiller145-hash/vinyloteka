import Home from './pages/Home';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import './App.css';

function Navbar({ cart, user }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo" onClick={handleLinkClick}>
        ВИНИЛОТЕКА
      </Link>

      {/* Поиск на десктопе */}
      <div className="navbar-search">
        <input type="text" placeholder="Поиск пластинок..." />
      </div>

      {/* Бургер для мобильных */}
      <button 
        className="navbar-burger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Меню */}
      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        {/* Поиск в мобильном меню */}
        <input 
          type="text" 
          placeholder="Поиск пластинок..." 
          className="mobile-search"
        />

        <Link 
          to="/catalog" 
          className={isActive('/catalog') ? 'active' : ''}
          onClick={handleLinkClick}
        >
          Каталог
        </Link>
        <Link 
          to="/cart" 
          className={isActive('/cart') ? 'active' : ''}
          onClick={handleLinkClick}
        >
          Корзина ({cart.length})
        </Link>
        <Link 
          to="/profile" 
          className={isActive('/profile') ? 'active' : ''}
          onClick={handleLinkClick}
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
      <div className="app-container">
        <Navbar cart={cart} user={user} />
        <div className="page-container">
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
