import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      navigate('/');
    } catch (err) {
      switch (err.code) {
        case 'auth/user-not-found':
          setError('Hakuna akaunti inayopatikana kwa barua pepe hii.');
          break;
        case 'auth/wrong-password':
          setError('Nywila si sahihi. Tafadhali jaribu tena.');
          break;
        case 'auth/too-many-requests':
          setError('Majaribio mengi sana. Tafadhali jaribu baadaye.');
          break;
        default:
          setError('Imeshindikana kuingia. Hakiki barua pepe na nywila yako.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, "businesses", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // Tengeneza profile ya mwanzo kama haipo
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
      console.error("FULL GOOGLE ERROR:", err);
      if (err.code === 'auth/popup-blocked') {
        setError('Tafadhali ruhusu popups kwenye browser yako.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Google Login haijawashwa kule Firebase Console.');
      } else {
        setError(`Hitilafu: ${err.message}`); // Hii itakuambia kosa halisi
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Tafadhali weka barua pepe yako kwanza.');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      setTimeout(() => {
        setShowResetModal(false);
        setResetEmailSent(false);
      }, 3000);
    } catch (err) {
      setError('Imeshindikana kutuma barua ya kuweka upya nywila.');
    } finally {
      setLoading(false);
    }
  };

  const checkCapsLock = (e) => {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      setCapsLockOn(true);
    } else {
      setCapsLockOn(false);
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
            Simamia Biashara <br/>
            <span className="text-indigo-400 italic">Kitaalamu Zaidi.</span>
          </h2>
          <p className="text-slate-400 text-lg font-medium max-w-sm leading-relaxed">
            Msaidizi wako wa kidijitali katika kukuza masoko na mauzo nchini Tanzania.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
            {[
              { text: "Tengeneza matangazo yenye mvuto.", icon: "🎯" },
              { text: "Fikia wateja wapya kwa urahisi.", icon: "📈" },
              { text: "Usalama wa hali ya juu wa data.", icon: "🔒" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 text-slate-300">
                <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs">{item.icon}</div>
                <p className="font-bold text-sm">{item.text}</p>
              </div>
            ))}
        </div>

        <div className="relative z-10 pt-6 border-t border-white/10 flex gap-8">
            <div>
              <p className="text-xl font-black">10K+</p>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Wateja</p>
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
              Biashara Portal
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-1 tracking-tight">Karibu Tena</h1>
            <p className="text-slate-500 font-bold text-sm">Ingia uendelee na mauzo yako leo.</p>
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

          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
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
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Nywila</label>
                <button type="button" onClick={() => setShowResetModal(true)} className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline decoration-2">Umesahau?</button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} required
                  className="w-full p-3.5 bg-slate-50/50 border-2 border-slate-100 focus:border-indigo-600 focus:bg-white rounded-[20px] outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 pr-12 text-sm shadow-sm"
                  placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} onKeyUp={checkCapsLock}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors">
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
              {capsLockOn && <p className="text-[9px] text-amber-600 font-black uppercase tracking-widest mt-1.5 flex items-center gap-1">⚠️ Caps Lock imewashwa</p>}
            </div>

            <div className="flex items-center justify-between px-2 pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer group/check">
                <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="w-4 h-4 rounded-lg accent-indigo-600 border-slate-200 cursor-pointer" />
                <span className="text-xs text-slate-500 font-bold group-hover/check:text-indigo-600 transition-colors">Nikumbuke</span>
              </label>
              <Link to="/signup" className="text-xs text-indigo-600 font-black hover:text-indigo-800 transition-colors">Jisajili</Link>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-slate-950 hover:bg-indigo-600 text-white font-black py-4 rounded-[20px] shadow-xl shadow-slate-200 hover:shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 text-base"
            >
              {loading ? (
                <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Ingia Sasa</>
              )}
            </button>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <span className="relative px-4 bg-white/0 text-slate-400 text-[9px] font-black uppercase tracking-[0.4em]">Au</span>
            </div>

            <button
              type="button" onClick={handleGoogleSignIn} disabled={loading}
              className="w-full bg-white border-2 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 text-slate-700 font-black py-3.5 rounded-[20px] transition-all flex items-center justify-center gap-3 text-sm shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              Google Account
            </button>
          </form>

          <p className="mt-8 text-center text-[9px] text-slate-300 font-black uppercase tracking-[0.5em] relative z-10">© 2025 SmartBiashara • Tanzania</p>
        </motion.div>
      </div>

      {/* MODAL RESET */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowResetModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[32px] max-w-md w-full p-10 shadow-2xl" onClick={e => e.stopPropagation()}>
              {resetEmailSent ? (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">✅</div>
                  <h3 className="text-2xl font-black mb-2">Imetunwa!</h3>
                  <p className="text-slate-500 font-medium">Angalia email yako kuweka upya nywila.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-black mb-2">Reset Password</h3>
                  <p className="text-slate-500 font-medium mb-8">Weka barua pepe yako na tutakutumia kiungo.</p>
                  <input type="email" placeholder="barua@pepe.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 focus:border-indigo-600 rounded-2xl outline-none mb-6 font-bold" />
                  <div className="flex gap-4">
                    <button onClick={() => setShowResetModal(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-sm uppercase tracking-widest transition-colors">Ghairi</button>
                    <button onClick={handlePasswordReset} disabled={loading} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-100">Tuma</button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
