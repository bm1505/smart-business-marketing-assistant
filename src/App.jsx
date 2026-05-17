import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// OWNER PAGES
import Dashboard from './pages/owner/Dashboard';
import Profile from './pages/owner/Profile';
import AIAssistant from './pages/owner/AIAssistant';
import Leads from './pages/owner/Leads';
import Messages from './pages/owner/Messages';
import Analytics from './pages/owner/Analytics';
import Products from './pages/owner/Products';

// CLIENT PAGES
import Explore from './pages/client/Explore';
import BusinessPage from './pages/client/BusinessPage';

// AUTH PAGES
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// COMPONENTS
import ProtectedRoute from './components/ProtectedRoute';

// --- SHARED UI COMPONENTS ---
const Navbar = () => {
  const [businessName, setBusinessName] = useState('Loading...');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "businesses", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setBusinessName(docSnap.data().name);
          } else {
            setBusinessName("My Business");
          }
        } catch (error) {
          console.error("Error fetching business name:", error);
          setBusinessName("My Business");
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => navigate('/login'));
  };

  return (
    <nav className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold italic">S</div>
        <span className="font-black text-slate-800 tracking-tighter text-xl uppercase">SmartBiashara</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-slate-900 leading-none">{businessName}</p>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Premium Plan</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-10 h-10 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-200 transition"
          title="Logout"
        >
          🚪
        </button>
      </div>
    </nav>
  );
};

const Sidebar = () => (
  <aside className="w-72 bg-slate-900 text-white min-h-screen p-8 hidden lg:flex flex-col sticky top-0 border-r border-white/5">
    <div className="mb-12 flex items-center gap-3">
      <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-xl shadow-indigo-500/20 italic font-black">S</div>
      <h1 className="text-xl font-black tracking-tight uppercase">SmartBiashara</h1>
    </div>
    <nav className="space-y-1.5 flex-1">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 ml-2">Enterprise Menu</p>
      {[
        { name: 'Dashboard', path: '/', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
        { name: 'Business Profile', path: '/profile', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
        { name: 'Smart Marketing', path: '/ai', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
        { name: 'Lead Finder', path: '/leads', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
        { name: 'Products', path: '/products', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
        { name: 'Messages', path: '/messages', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg> },
        { name: 'Analytics', path: '/analytics', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2v10m6 0V7a2 2 0 00-2-2h-2a2 2 0 01-2-2V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
      ].map(item => (
        <Link key={item.path} to={item.path} className="flex items-center gap-4 px-6 py-3.5 rounded-xl hover:bg-white/5 transition font-bold text-slate-400 hover:text-white text-sm">
          {item.icon} {item.name}
        </Link>
      ))}
    </nav>
    <div className="mt-auto pt-8">
      <Link to="/explore" className="w-full bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 px-6 py-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition uppercase tracking-widest">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
        Soko la Umma
      </Link>
    </div>
  </aside>
);

export default function App() {
  return (
    <Router>
      <Routes>
        {/* AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* OWNER ROUTES (Pamoja na Sidebar & Navbar) */}
        <Route path="/*" element={
          <ProtectedRoute>
            <div className="flex bg-slate-50 min-h-screen">
              <Sidebar />
              <main className="flex-1 overflow-x-hidden">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/ai" element={<AIAssistant />} />
                  <Route path="/leads" element={<Leads />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/analytics" element={<Analytics />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        } />

        {/* CLIENT ROUTES (Zenyewe pekee) */}
        <Route path="/explore" element={<Explore />} />
        <Route path="/b/:slug" element={<BusinessPage />} />
      </Routes>
    </Router>
  );
}
