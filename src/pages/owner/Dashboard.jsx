import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Dashboard() {
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessName = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "businesses", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBusinessName(docSnap.data().name);
        }
      }
      setLoading(false);
    };
    fetchBusinessName();
  }, []);

  const stats = [
    { label: 'Total Leads', value: '154', change: '+12%', color: 'text-indigo-600', icon: '🎯' },
    { label: 'Reach', value: '8.4k', change: '+5.2%', color: 'text-blue-600', icon: '📊' },
    { label: 'Maudhui Mpya', value: '42', change: 'Mwezi huu', color: 'text-purple-600', icon: '📝' },
    { label: 'Conversion', value: '18%', change: '+2%', color: 'text-emerald-600', icon: '📈' }
  ];

  if (loading) return (
    <div className="p-8 flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="p-10 space-y-10 max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Habari, {businessName || 'Mjasiriamali'}! 👋</h1>
          <p className="text-slate-500 font-medium mt-2">Huu ndio muhtasari wa utendaji wa biashara yako leo.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-sm hover:bg-slate-50 transition">
            Download Report
          </button>
          <button className="bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-slate-200 transition active:scale-95">
            Kampeni Mpya +
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
               <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">{s.icon}</div>
               <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">{s.change}</span>
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
            <p className={`text-3xl font-black mt-2 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Utendaji wa Marketing</h3>
            <select className="bg-slate-50 border-none rounded-xl text-xs font-bold p-2 outline-none">
                <option>Siku 7 zilizopita</option>
                <option>Mwezi huu</option>
            </select>
          </div>

          <div className="space-y-6">
            {[
              { t: 'Instagram Campaign', d: 'Mfumo umetengeneza matangazo 5', s: '85%', c: 'bg-indigo-500' },
              { t: 'WhatsApp Broadcast', d: 'Ujumbe umetumwa kwa wateja 120', s: '92%', c: 'bg-emerald-500' },
              { t: 'Google Search Ads', d: 'Maneno funguo (Keywords) yameboreshwa', s: '45%', c: 'bg-amber-500' },
            ].map((item, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="font-bold text-slate-800">{item.t}</p>
                    <p className="text-xs text-slate-400 font-medium">{item.d}</p>
                  </div>
                  <p className="text-xs font-black text-slate-900">{item.s}</p>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.c}`} style={{ width: item.s }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SMART ADVISOR CARD */}
        <div className="bg-indigo-600 p-10 rounded-[40px] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl mb-8 border border-white/10">💡</div>
            <h3 className="text-2xl font-black mb-4 leading-tight">Ushauri wa Mfumo</h3>
            <p className="text-indigo-100 font-medium leading-relaxed">
              "Tumegundua kuwa bidhaa zako za <b>vifaa vya michezo</b> zinatafutwa sana nyakati za jioni. Ungependa mfumo ukutengenezee tangazo la usiku wa leo?"
            </p>
          </div>

          <button className="relative z-10 mt-10 w-full bg-white text-indigo-600 font-black py-4 rounded-2xl shadow-lg hover:bg-indigo-50 transition active:scale-95">
            Ndio, Tengeneza Sasa 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
