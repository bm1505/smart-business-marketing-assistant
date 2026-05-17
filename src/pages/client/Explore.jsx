import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, query, getDocs, where, onSnapshot } from 'firebase/firestore';

export default function Explore() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Zote');

  const categories = ['Zote', 'Mavazi', 'Vyakula', 'Vifaa vya Kielektroniki', 'Urembo', 'Huduma', 'Nyingine'];

  useEffect(() => {
    setLoading(true);
    const q = selectedCategory === 'Zote'
      ? query(collection(db, "products"))
      : query(collection(db, "products"), where("category", "==", selectedCategory));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const prodList = [];
      querySnapshot.forEach((doc) => {
        prodList.push({ id: doc.id, ...doc.data() });
      });
      setProducts(prodList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedCategory]);

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans">
      {/* --- STANDARD NAVIGATION BAR --- */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 px-4 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => navigate('/explore')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold italic shadow-sm">S</div>
            <h1 className="text-xl font-black tracking-tighter text-slate-900 hidden sm:block uppercase">SmartBiashara</h1>
          </div>

          {/* Integrated Search Bar */}
          <div className="flex-1 max-w-xl relative flex items-center">
            <input
              type="text"
              placeholder="Tafuta bidhaa unayohitaji..."
              className="w-full bg-slate-100 border border-transparent rounded-xl py-2.5 px-4 pl-10 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
              value={search} onChange={e => setSearch(e.target.value)}
            />
            <div className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Right Links */}
          <div className="hidden md:flex items-center gap-6 text-[11px] font-black uppercase tracking-widest text-slate-500">
             <button onClick={() => navigate('/login')} className="hover:text-indigo-600 transition">Ingia (Owner)</button>
             <button onClick={() => navigate('/signup')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">Jisajili</button>
          </div>
        </div>
      </nav>

      {/* --- CATEGORY BAR --- */}
      <div className="bg-white border-b border-slate-50 shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-4 overflow-x-auto no-scrollbar scroll-smooth">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${selectedCategory === c ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50 border border-transparent hover:border-slate-100'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Marketplace Banner */}
        <div className="bg-indigo-600 rounded-[40px] p-10 md:p-16 mb-12 relative overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">Soko la Kisasa la Biashara za Kitanzania</h2>
            <p className="text-indigo-100 text-lg font-medium mb-8">Gundua bidhaa bora na za kipekee moja kwa moja kutoka kwa wajasiriamali nchi nzima.</p>
            <div className="flex gap-4">
               <button className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-xl">Gundua Bidhaa</button>
               <button className="bg-indigo-500/30 text-white border border-indigo-400/30 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500/50 transition-colors backdrop-blur-md">Kuhusu Sisi</button>
            </div>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px] opacity-50"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] bg-indigo-400 rounded-full blur-[100px] opacity-30"></div>
        </div>

        {/* --- GRID OF PRODUCTS --- */}
        <div className="mb-8 flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Bidhaa Zilizoangaziwa</h3>
            <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">{filteredProducts.length} Matokeo</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(p => (
              <div
                key={p.id}
                onClick={() => navigate(`/b/${p.ownerId}`)}
                className="bg-white rounded-[32px] border border-slate-100 overflow-hidden hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] hover:-translate-y-2 transition-all duration-500 cursor-pointer group"
              >
                <div className="aspect-square bg-slate-50 relative overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-slate-50 to-slate-100 group-hover:scale-110 transition-transform duration-700">
                    📦
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border border-slate-100/50">
                      {p.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-black text-lg text-slate-800 group-hover:text-indigo-600 transition-colors tracking-tight truncate">{p.name}</h3>
                    <p className="text-[12px] text-slate-400 font-medium line-clamp-2 h-9 leading-relaxed">
                        {p.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Bei</span>
                      <span className="text-xl font-black text-indigo-600">
                        {new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(p.price)}
                      </span>
                    </div>
                    <button className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white hover:bg-indigo-600 transition-all duration-300 shadow-lg group-hover:rotate-12">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                       </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="py-24 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
            <div className="text-5xl mb-6 opacity-20">🔎</div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Hatujapata ulichotafuta</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto">Jaribu kutafuta kwa jina lingine au ubadilishe jamii ya bidhaa unayotafuta.</p>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-100 py-16 px-4 mt-20 text-center bg-white">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold italic">S</div>
            <span className="font-black text-slate-900 tracking-tighter text-xl uppercase">SmartBiashara</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">© 2025 Smart Biashara Limited • Dar es Salaam, Tanzania</p>
      </footer>
    </div>
  );
}
