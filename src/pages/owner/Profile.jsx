import { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    category: '',
    location: '',
    description: '',
    whatsapp: '',
    instagram: '',
    website: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, "businesses", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(prev => ({ ...prev, ...docSnap.data() }));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");

      await setDoc(doc(db, "businesses", user.uid), profile, { merge: true });
      alert("Profile yako imesasishwa kikamilifu! ✨");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Imeshindikana kuhifadhi. Tafadhali jaribu tena.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="p-20 flex justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Business Profile 🏢</h1>
          <p className="text-slate-500 font-medium mt-2 text-lg">Sanidi utambulisho wa biashara yako kwa ajili ya wateja na mfumo.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 transition active:scale-95 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? "Inahifadhi..." : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> Hifadhi Mabadiliko</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT: MAIN INFO */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 md:p-10 space-y-8">
            <h3 className="text-lg font-black text-slate-800 border-b border-slate-50 pb-4">Taarifa za Msingi</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Jina la Biashara</label>
                <input
                  type="text" className="w-full p-4 bg-slate-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800"
                  placeholder="Mf: Mahega Fashion Store"
                  value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Sekta / Category</label>
                <select
                   className="w-full p-4 bg-slate-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800 appearance-none"
                   value={profile.category} onChange={e => setProfile({...profile, category: e.target.value})}
                >
                    <option value="">Chagua Category</option>
                    <option value="Mavazi">Mavazi & Mitindo</option>
                    <option value="Chakula">Chakula & Vinywaji</option>
                    <option value="Electronics">Electronics & Tech</option>
                    <option value="Urembo">Urembo & Vipodozi</option>
                    <option value="Huduma">Huduma (Services)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Maelezo ya Biashara (System Context)</label>
              <textarea
                rows="5" className="w-full p-4 bg-slate-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-700 leading-relaxed"
                placeholder="Elezea kwa undani biashara yako inafanya nini, bidhaa gani unauza, na kwa nini wateja wakuchague..."
                value={profile.description} onChange={e => setProfile({...profile, description: e.target.value})}
              ></textarea>
              <p className="text-[10px] text-slate-400 italic mt-2">* Mfumo utatumia maelezo haya kutengeneza matangazo yenye usahihi zaidi.</p>
            </div>
          </section>

          <section className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 md:p-10 space-y-8">
            <h3 className="text-lg font-black text-slate-800 border-b border-slate-50 pb-4">Mahali & Mawasiliano</h3>
            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">WhatsApp (Mf: 255...)</label>
                 <input
                   type="text" className="w-full p-4 bg-slate-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800"
                   placeholder="255712345678"
                   value={profile.whatsapp} onChange={e => setProfile({...profile, whatsapp: e.target.value})}
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Location / Mkoa</label>
                 <input
                   type="text" className="w-full p-4 bg-slate-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800"
                   placeholder="Mf: Kariakoo, Dar es Salaam"
                   value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})}
                 />
               </div>
            </div>
          </section>
        </div>

        {/* RIGHT: PREVIEW OR SIDE INFO */}
        <div className="space-y-8">
           <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
              <h4 className="text-xl font-black mb-4 tracking-tight">Identity Score</h4>
              <p className="text-slate-400 text-sm mb-6 font-medium">Kamilisha wasifu wako ili mfumo uweze kutoa matokeo bora zaidi.</p>

              <div className="flex items-end gap-2 mb-2">
                 <span className="text-4xl font-black">85%</span>
                 <span className="text-indigo-400 text-xs font-bold uppercase mb-1">Excellent</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-500" style={{ width: '85%' }}></div>
              </div>
           </div>

           <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 space-y-6">
              <h4 className="font-black text-slate-800">Miongozo ya Mfumo</h4>
              <ul className="space-y-4">
                 {[
                   "Tumia maneno ya kuvutia kwenye maelezo.",
                   "Hakikisha eneo la biashara ni sahihi.",
                   "Weka namba ya WhatsApp kuanza na 255."
                 ].map((tip, i) => (
                   <li key={i} className="flex gap-3 text-xs text-slate-500 font-medium">
                      <span className="text-indigo-600">✔</span> {tip}
                   </li>
                 ))}
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
}
