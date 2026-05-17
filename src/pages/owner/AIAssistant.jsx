import { useState, useEffect } from 'react';
import { generateMarketingContent } from '../../gemini';
import { db, auth } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function AIAssistant() {
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState("Advert");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [business, setBusiness] = useState(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "businesses", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setBusiness(docSnap.data());
      }
    };
    fetchBusiness();
  }, []);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);

    const businessInfo = business || {
      name: "Biashara Yangu",
      category: "Huduma",
      location: "Tanzania"
    };

    const aiResponse = await generateMarketingContent(category, prompt, businessInfo);
    setResult(aiResponse);
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    alert("Maudhui yamenakiliwa!");
  };

  const handleWhatsAppShare = () => {
    if (!result) return;
    const text = encodeURIComponent(`*SmartBiashara Marketing Tool*\n\n${result}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const categories = [
    { id: 'Advert', name: 'Tangazo', icon: '📢' },
    { id: 'Caption', name: 'Caption', icon: '📸' },
    { id: 'WhatsApp', name: 'WhatsApp', icon: '💬' },
    { id: 'Strategy', name: 'Mkakati', icon: '🎯' }
  ];

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Smart Content Engine 🚀</h1>
          <p className="text-slate-500 font-medium mt-2 text-lg">Tengeneza marketing content yenye mvuto kwa sekunde.</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-2xl flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Smart Engine Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex bg-slate-50/50 p-2 border-b border-slate-100">
              {categories.map(c => (
                <button
                  key={c.id} onClick={() => setCategory(c.id)}
                  className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${category === c.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <span>{c.icon}</span> {c.name}
                </button>
              ))}
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Elezea unachotaka mfumo ufanye</label>
                <textarea
                  className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-[24px] outline-none transition-all text-lg font-medium resize-none placeholder:text-slate-300"
                  rows="6" placeholder={`Mfano: Tengeneza tangazo la punguzo la 20% kwa ajili ya sikukuu ya Eid...`}
                  value={prompt} onChange={e => setPrompt(e.target.value)}
                ></textarea>
              </div>

              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium px-1">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 Mfumo utatumia taarifa zako za <b>{business?.name || 'biashara'}</b> kuboresha matokeo.
              </div>

              <button
                onClick={handleGenerate} disabled={loading || !prompt}
                className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Tengeneza Maudhui 🚀</>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
           {result ? (
              <div className="bg-indigo-900 rounded-[40px] p-10 text-white shadow-2xl shadow-indigo-200 sticky top-10 border border-white/10">
                 <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">RESULT OUTPUT</span>
                    <button onClick={copyToClipboard} className="text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition">Copy</button>
                 </div>

                 <div className="prose prose-invert max-w-none">
                    <p className="text-indigo-50 font-medium whitespace-pre-wrap leading-relaxed text-lg italic">
                      {result}
                    </p>
                 </div>

                 <div className="mt-12 flex gap-3">
                    <button
                      onClick={handleWhatsAppShare}
                      className="flex-1 bg-white text-indigo-900 py-3.5 rounded-2xl font-black text-sm hover:bg-indigo-50 transition active:scale-95"
                    >
                      Send to WhatsApp
                    </button>
                    <button className="p-3.5 bg-indigo-800 text-white rounded-2xl hover:bg-indigo-700 transition"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg></button>
                 </div>
              </div>
           ) : (
             <div className="h-full min-h-[400px] border-4 border-dashed border-slate-100 rounded-[40px] flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl mb-6">✨</div>
                <h4 className="text-xl font-black text-slate-300">Tayari kuanza?</h4>
                <p className="text-slate-400 text-sm mt-2 font-medium">Andika maelezo yako upande wa kushoto na ubonyeze kitufe cha kutengeneza.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
