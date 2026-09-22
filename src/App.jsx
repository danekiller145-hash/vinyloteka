import Home from './pages/Home';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import './App.css';
import { supabase } from './supabase';

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

      <div className="navbar-search">
        <input type="text" placeholder="Поиск пластинок..." />
      </div>

      <button 
        className="navbar-burger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <input 
          type="text" 
          placeholder="Поиск пластинок..." 
          className="mobile-search"
        />

        <Link to="/catalog" className={isActive('/catalog') ? 'active' : ''} onClick={handleLinkClick}>
          Каталог
        </Link>
        <Link to="/cart" className={isActive('/cart') ? 'active' : ''} onClick={handleLinkClick}>
          Корзина ({cart.length})
        </Link>
        <Link to="/profile" className={isActive('/profile') ? 'active' : ''} onClick={handleLinkClick}>
          {user ? user.name : 'Войти'}
        </Link>
      </div>
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===== ЗАГРУЗКА СЕССИИ + ДАННЫХ ИЗ БД =====
  useEffect(() => {
    const loadUserData = async () => {
      // Проверяем сессию
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const u = {
          id: session.user.id,
          name: session.user.user_metadata?.name || 'Пользователь',
          email: session.user.email
        };
        setUser(u);
        await loadFromDB(session.user.id);
      } else {
        // Гость — из LocalStorage
        const savedCart = localStorage.getItem('cart');
        const savedFav = localStorage.getItem('favorites');
        const savedOrders = localStorage.getItem('orders');
        setCart(savedCart ? JSON.parse(savedCart) : []);
        setFavorites(savedFav ? JSON.parse(savedFav) : []);
        setOrders(savedOrders ? JSON.parse(savedOrders) : []);
      }
      setLoading(false);
    };

    loadUserData();

    // Подписка на изменения авторизации
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const u = {
            id: session.user.id,
            name: session.user.user_metadata?.name || 'Пользователь',
            email: session.user.email
          };
          setUser(u);
          await loadFromDB(session.user.id);
        } else {
          setUser(null);
          setCart([]);
          setFavorites([]);
          setOrders([]);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // ===== ЗАГРУЗКА ДАННЫХ ИЗ БД =====
  const loadFromDB = async (userId) => {
    try {
      // Корзина
      const { data: cartData } = await supabase
        .from('cart_items')
        .select('*, vinyls(*)')
        .eq('user_id', userId);

      const cartFormatted = (cartData || []).map(item => ({
        id: item.vinyls.vinyl_id,
        title: item.vinyls.title,
        artist: item.vinyls.artist,
        price: item.vinyls.price,
        image: item.vinyls.image_path,
        genre: item.vinyls.genre,
        cart_id: item.cart_id
      }));
      setCart(cartFormatted);

      // Избранное
      const { data: favData } = await supabase
        .from('favorites')
        .select('*, vinyls(*)')
        .eq('user_id', userId);

      const favFormatted = (favData || []).map(item => ({
        id: item.vinyls.vinyl_id,
        title: item.vinyls.title,
        artist: item.vinyls.artist,
        price: item.vinyls.price,
        image: item.vinyls.image_path,
        genre: item.vinyls.genre,
        fav_id: item.fav_id
      }));
      setFavorites(favFormatted);

      // Заказы
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*, order_items(*, vinyls(*))')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      const ordersFormatted = (ordersData || []).map(order => ({
        id: order.order_id,
        date: order.date,
        total: order.total,
        status: order.status,
        delivery: {
          name: order.delivery_name,
          phone: order.delivery_phone,
          address: order.delivery_address
        },
        items: (order.order_items || []).map(item => ({
          id: item.vinyls?.vinyl_id,
          title: item.vinyls?.title,
          artist: item.vinyls?.artist,
          price: item.price
        }))
      }));
      setOrders(ordersFormatted);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  };

  // ===== СОХРАНЕНИЕ ДЛЯ ГОСТЯ =====
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(cart));
      localStorage.setItem('favorites', JSON.stringify(favorites));
      localStorage.setItem('orders', JSON.stringify(orders));
    }
  }, [cart, favorites, orders, user]);

  // ===== ДОБАВИТЬ В КОРЗИНУ =====
  const addToCart = async (vinyl) => {
    if (user) {
      const { error } = await supabase.from('cart_items').insert([{
        user_id: user.id,
        vinyl_id: vinyl.id,
        quantity: 1
      }]);
      if (error) {
        console.error('Ошибка добавления:', error);
        return;
      }
      await loadFromDB(user.id);
    } else {
      setCart([...cart, vinyl]);
    }
  };

  // ===== УДАЛИТЬ ИЗ КОРЗИНЫ =====
  const removeFromCart = async (indexToRemove) => {
    if (user) {
      const item = cart[indexToRemove];
      if (item.cart_id) {
        await supabase.from('cart_items').delete().eq('cart_id', item.cart_id);
        await loadFromDB(user.id);
      }
    } else {
      setCart(cart.filter((_, index) => index !== indexToRemove));
    }
  };

  // ===== ОЧИСТИТЬ КОРЗИНУ =====
  const clearCart = async () => {
    if (user) {
      await supabase.from('cart_items').delete().eq('user_id', user.id);
      setCart([]);
    } else {
      setCart([]);
    }
  };

  // ===== ИЗБРАННОЕ =====
  const toggleFavorite = async (vinyl) => {
    if (user) {
      const exists = favorites.find(f => f.id === vinyl.id);
      if (exists) {
        await supabase.from('favorites').delete().eq('fav_id', exists.fav_id);
      } else {
        await supabase.from('favorites').insert([{
          user_id: user.id,
          vinyl_id: vinyl.id
        }]);
      }
      await loadFromDB(user.id);
    } else {
      setFavorites((prev) => {
        const exists = prev.some((item) => item.id === vinyl.id);
        if (exists) return prev.filter((item) => item.id !== vinyl.id);
        return [...prev, vinyl];
      });
    }
  };

  // ===== ОФОРМИТЬ ЗАКАЗ =====
  const placeOrder = async (order) => {
    if (cart.length === 0) {
      alert('Корзина пуста!');
      return;
    }

    if (user) {
      // Создаём заказ
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          total: cart.reduce((sum, item) => sum + item.price, 0),
          delivery_name: order?.delivery?.name || '',
          delivery_phone: order?.delivery?.phone || '',
          delivery_address: order?.delivery?.address || ''
        }])
        .select()
        .single();

      if (orderError) {
        console.error('Ошибка создания заказа:', orderError);
        alert('Ошибка оформления заказа');
        return;
      }

      // Добавляем позиции заказа
      const items = cart.map(item => ({
        order_id: orderData.order_id,
        vinyl_id: item.id,
        quantity: 1,
        price: item.price
      }));

      await supabase.from('order_items').insert(items);
      await supabase.from('cart_items').delete().eq('user_id', user.id);
      await loadFromDB(user.id);
    } else {
      const newOrder = order || {
        id: Date.now(),
        date: new Date().toLocaleString(),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + item.price, 0),
      };
      setOrders([newOrder, ...orders]);
      setCart([]);
    }

    alert('Заказ оформлен! Спасибо за покупку!');
  };

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Загрузка...</div>;
  }

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
