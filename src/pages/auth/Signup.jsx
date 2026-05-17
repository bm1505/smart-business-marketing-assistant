import { useState } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "businesses", user.uid), {
        name: businessName,
        email: email,
        category: 'Jumla',
        location: 'Tanzania',
        description: 'Karibu kwenye duka letu!',
        whatsapp: '',
        createdAt: new Date().toISOString()
      });

      navigate('/');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Barua pepe hii tayari inatumika.');
      } else {
        setError('Imeshindikana kujisajili. Hakiki taarifa zako.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, "businesses", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName || 'Biashara Yangu',
          email: user.email,
          category: 'Jumla',
          location: 'Tanzania',
          description: 'Karibu kwenye duka letu!',
          whatsapp: '',
          createdAt: new Date().toISOString()
        });
      }
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Imeshindikana kujisajili na Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-slate-50 font-sans selection:bg-indigo-100 overflow-hidden">
      {/* LEFT SIDE: ENTERPRISE BRANDING */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="hidden lg:flex lg:w-[42%] bg-slate-950 relative flex-col justify-between p-12 overflow-hidden text-white"
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black italic text-xl shadow-2xl shadow-indigo-500/20">S</div>
            <span className="text-xl font-black tracking-tighter uppercase">SmartBiashara</span>
          </div>

          <h2 className="text-5xl font-black leading-[1.05] mb-6 tracking-tight">
            Anza Safari ya <br/>
            <span className="text-indigo-400 italic">Mafanikio Leo.</span>
          </h2>
          <p className="text-slate-400 text-lg font-medium max-w-sm leading-relaxed">
            Jiunge na mfumo unaoaminika na mamia ya wafanyabiashara nchini Tanzania.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
            {[
              { text: "Tengeneza wasifu wa kitaalamu.", icon: "🏢" },
              { text: "Fikia masoko mapya ya kidijitali.", icon: "🚀" },
              { text: "Simamia mauzo yako kwa urahisi.", icon: "📈" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 text-slate-300">
                <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs">{item.icon}</div>
                <p className="font-bold text-sm">{item.text}</p>
              </div>
            ))}
        </div>

        <div className="relative z-10 pt-6 border-t border-white/10 flex gap-8">
            <div>
              <p className="text-xl font-black">500+</p>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Wafanyabiashara</p>
            </div>
            <div>
              <p className="text-xl font-black">24/7</p>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Usaidizi</p>
            </div>
        </div>
      </motion.div>

      {/* RIGHT SIDE: FORM */}
      <div className="w-full lg:w-[58%] flex items-center justify-center p-4 lg:p-6 bg-slate-50/50 overflow-y-auto lg:overflow-hidden relative">
        {/* Background Decorative Element */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"></div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ y: -5, transition: { duration: 0.3, ease: "easeOut" } }}
          className="max-w-[420px] w-full bg-white/80 backdrop-blur-xl p-8 lg:p-10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white hover:border-indigo-100 hover:shadow-[0_40px_80px_-15px_rgba(79,70,229,0.15)] transition-all duration-500 relative group z-10"
        >
          <div className="mb-6 text-center relative">
            <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-3">
              Usajili Mpya
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-1 tracking-tight">Tengeneza Akaunti</h1>
            <p className="text-slate-500 font-bold text-sm">Anza safari yako na SmartBiashara.</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="mb-6 p-3 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 text-sm font-bold shadow-lg shadow-rose-200">!</div>
                <p className="text-rose-700 text-[12px] font-bold leading-tight">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSignup} className="space-y-4 relative z-10">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Jina la Biashara</label>
              <input
                type="text" required
                className="w-full p-3.5 bg-slate-50/50 border-2 border-slate-100 focus:border-indigo-600 focus:bg-white rounded-[20px] outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 text-sm shadow-sm"
                placeholder="Mf: Mahega Fashion Store"
                value={businessName} onChange={e => setBusinessName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Barua Pepe</label>
              <input
                type="email" required
                className="w-full p-3.5 bg-slate-50/50 border-2 border-slate-100 focus:border-indigo-600 focus:bg-white rounded-[20px] outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 text-sm shadow-sm"
                placeholder="juma@biashara.co.tz"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Nywila</label>
              <input
                type="password" required
                className="w-full p-3.5 bg-slate-50/50 border-2 border-slate-100 focus:border-indigo-600 focus:bg-white rounded-[20px] outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 text-sm shadow-sm"
                placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-start gap-2.5 px-2 pt-0.5">
                <input type="checkbox" required className="mt-1 w-4 h-4 accent-indigo-600 shrink-0 rounded-lg border-slate-200 cursor-pointer" id="terms" />
                <label htmlFor="terms" className="text-xs text-slate-500 font-bold leading-tight cursor-pointer">
                    Nakubaliana na <a href="#" className="text-indigo-600 hover:underline font-black">Vigezo</a> na faragha.
                </label>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-slate-950 hover:bg-indigo-600 text-white font-black py-4 rounded-[20px] shadow-xl shadow-slate-200 hover:shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 text-base"
            >
              {loading ? (
                <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Jisajili Sasa</>
              )}
            </button>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <span className="relative px-4 bg-white/0 text-slate-400 text-[9px] font-black uppercase tracking-[0.4em]">Au</span>
            </div>

            <button
              type="button" onClick={handleGoogleSignup} disabled={loading}
              className="w-full bg-white border-2 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 text-slate-700 font-black py-3.5 rounded-[20px] transition-all flex items-center justify-center gap-3 text-sm shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              Google Account
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between gap-4 relative z-10">
            <p className="text-slate-500 font-bold text-xs">Tayari una akaunti?</p>
            <Link to="/login" className="px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-[15px] font-black text-[10px] hover:bg-indigo-100 transition-colors uppercase tracking-widest">
              Ingia Hapa
            </Link>
          </div>

          <p className="mt-8 text-center text-[9px] text-slate-300 font-black uppercase tracking-[0.5em] relative z-10">© 2025 SmartBiashara • Tanzania</p>
        </motion.div>
      </div>
    </div>
  );
}
