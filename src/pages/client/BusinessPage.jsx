import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

export default function BusinessPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessData = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "businesses", slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBusiness({ id: docSnap.id, ...docSnap.data() });

          // Fetch products for this business from the global 'products' collection
          const q = query(collection(db, "products"), where("ownerId", "==", slug));
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const prodList = [];
            querySnapshot.forEach((doc) => {
              prodList.push({ id: doc.id, ...doc.data() });
            });
            setProducts(prodList);
          });

          return () => unsubscribe();
        }
      } catch (error) {
        console.error("Error fetching business:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (!business) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
        <div className="text-6xl mb-4">🏚️</div>
        <h1 className="text-2xl font-black text-slate-800 mb-2">Biashara Haikupatikana</h1>
        <p className="text-slate-500 font-medium mb-8">Samahani, duka unalotafuta halipo au limeondolewa.</p>
        <button onClick={() => navigate('/explore')} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest">Rudi Sokoni</button>
    </div>
  );

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans pb-20">
      {/* STANDARD SEARCH NAVBAR */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm px-4 md:px-8">
        <div className="max-w-7xl mx-auto h-16 flex items-center gap-6">
          {/* Back & Logo */}
          <div className="flex items-center gap-4 cursor-pointer shrink-0" onClick={() => navigate('/explore')}>
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 hover:text-indigo-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm italic shadow-lg">S</div>
              <h1 className="text-lg font-black tracking-tight uppercase text-slate-900">{business.name}</h1>
            </div>
          </div>

          {/* Search in Nav */}
          <div className="flex-1 max-w-lg relative hidden md:block">
            <input
              type="text"
              placeholder={`Tafuta ndani ya ${business.name}...`}
              className="w-full bg-slate-100 border-none rounded-xl py-2.5 px-4 pl-10 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none font-medium"
              value={search} onChange={e => setSearch(e.target.value)}
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <a
              href={`https://wa.me/${business.whatsapp || business.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl font-black text-xs transition-all shadow-lg shadow-green-100 flex items-center gap-2 uppercase tracking-widest"
            >
              <span>WhatsApp</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </a>
          </div>
        </div>
      </nav>

      {/* COMPACT HERO */}
      <header className="bg-white border-b border-slate-100 py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-12">
          <div className="max-w-3xl space-y-6">
            <div className="flex flex-wrap items-center gap-3">
               <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-100">Mfanyabiashara Aliyethibitishwa</span>
               <span className="text-slate-300 font-bold">•</span>
               <span className="text-slate-500 text-xs font-black uppercase tracking-widest">{business.category}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Karibu {business.name}.
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
              {business.description || "Karibu kwenye duka letu kwa bidhaa na huduma bora nchini Tanzania."}
            </p>
            <div className="flex items-center gap-4 text-slate-400">
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="text-sm font-bold">{business.location || "Tanzania"}</span>
                </div>
            </div>
          </div>
          <div className="flex gap-4 shrink-0">
             <div className="p-8 bg-indigo-50/50 rounded-[32px] text-center min-w-[140px] border border-indigo-50">
                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-2">Viwango</p>
                <p className="text-3xl font-black text-indigo-600">4.9 <span className="text-amber-500 text-2xl">★</span></p>
             </div>
             <div className="p-8 bg-slate-50 rounded-[32px] text-center min-w-[140px] border border-slate-100">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Bidhaa</p>
                <p className="text-3xl font-black text-slate-900">{products.length}+</p>
             </div>
          </div>
        </div>
      </header>

      {/* PRODUCT LISTING */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Bidhaa na Huduma</h2>
              <p className="text-slate-500 font-medium mt-1">Chagua bidhaa unazohitaji na uwasiliane nasi.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-slate-200">Zote</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((p) => (
            <div key={p.id} className="group bg-white rounded-[32px] border border-slate-100 overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-2 transition-all duration-500">
              <div className="aspect-square bg-slate-50 relative overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-700 bg-gradient-to-br from-slate-50 to-slate-100">
                    📦
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-black text-[12px] shadow-sm text-indigo-600">
                    {new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(p.price)}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-black text-lg text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{p.name}</h3>
                <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-2 h-10 leading-relaxed">{p.description}</p>
                <a
                  href={`https://wa.me/${business.whatsapp || business.phone}?text=Habari, nahitaji bidhaa hii: ${p.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-900 text-[11px] font-black rounded-2xl transition-all duration-300 uppercase tracking-[0.15em] flex items-center justify-center gap-2"
                >
                  Agiza Sasa 🛍️
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
            <div className="py-24 text-center bg-white rounded-[40px] border border-dashed border-slate-200 mt-8">
                <div className="text-5xl mb-6 opacity-20">📦</div>
                <h3 className="text-xl font-black text-slate-800 mb-1">Hakuna Bidhaa Bado</h3>
                <p className="text-slate-500 font-medium">Biashara hii bado haijaongeza bidhaa kwenye soko.</p>
            </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 mt-20">
        <div className="bg-slate-900 rounded-[40px] p-12 md:p-20 text-white relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black italic text-xl">S</div>
                        <span className="text-xl font-black tracking-tighter uppercase">{business.name}</span>
                    </div>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                        {business.description || "Tunatoa huduma bora zaidi kwa wateja wetu kote nchini Tanzania."}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Mawasiliano</h4>
                        <ul className="space-y-4 text-sm font-bold text-slate-300">
                            <li className="flex items-center gap-3">
                                <span className="text-indigo-500">📍</span> {business.location || "Dar es Salaam"}
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-indigo-500">📞</span> +{business.whatsapp || business.phone || "255..."}
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Tufuate</h4>
                        <div className="flex flex-col gap-4 text-sm font-bold text-slate-300">
                            <a href="#" className="hover:text-indigo-400 transition-colors">Instagram</a>
                            <a href="#" className="hover:text-indigo-400 transition-colors">Facebook</a>
                            <a href="#" className="hover:text-indigo-400 transition-colors">Twitter</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]"></div>
            <div className="mt-20 pt-10 border-t border-white/5 text-center">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em]">Powered by SmartBiashara • 2025</p>
            </div>
        </div>
      </footer>
    </div>
  );
}
