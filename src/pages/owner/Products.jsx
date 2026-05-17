import { useState, useEffect } from 'react';
import { db, auth, storage } from '../../firebase';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion, AnimatePresence } from 'framer-motion';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "products"), where("ownerId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const prods = [];
      querySnapshot.forEach((doc) => {
        prods.push({ id: doc.id, ...doc.data() });
      });
      setProducts(prods);
    });

    return () => unsubscribe();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || loading) return;

    setLoading(true);
    try {
      let imageUrl = "";

      // 1. Upload image if exists
      if (imageFile) {
        const storageRef = ref(storage, `products/${user.uid}/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // 2. Save to Firestore
      await addDoc(collection(db, "products"), {
        ownerId: user.uid,
        name,
        price: parseFloat(price),
        description,
        category,
        imageUrl,
        createdAt: new Date()
      });

      // Reset form
      setName('');
      setPrice('');
      setDescription('');
      setCategory('');
      setImageFile(null);
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding product: ", error);
      alert("Imeshindikana kuongeza bidhaa. Tafadhali jaribu tena.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Je, una uhakika unataka kufuta bidhaa hii?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight text-indigo-900">BIDHAA ZAKO</h1>
          <p className="text-slate-500 font-medium">Simamia bidhaa unazouza kwenye soko la SmartBiashara.</p>
          <button
            onClick={() => window.open(`/b/${auth.currentUser?.uid}`, '_blank')}
            className="mt-2 text-indigo-600 font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-1"
          >
            Angalia Duka Lako la Umma ↗
          </button>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
        >
          {isAdding ? 'Funga' : 'Ongeza Bidhaa Mpya'}
          <span className="text-xl">{isAdding ? '×' : '+'}</span>
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl mb-12"
          >
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Jina la Bidhaa</label>
                <input
                  type="text" placeholder="Mf: Shati la Kiume"
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                  value={name} onChange={(e) => setName(e.target.value)} required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Bei (TSH)</label>
                <input
                  type="number" placeholder="Mf: 25000"
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                  value={price} onChange={(e) => setPrice(e.target.value)} required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Jamii (Category)</label>
                <select
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                  value={category} onChange={(e) => setCategory(e.target.value)} required
                >
                  <option value="">Chagua Jamii</option>
                  <option value="Mavazi">Mavazi</option>
                  <option value="Vyakula">Vyakula</option>
                  <option value="Vifaa vya Kielektroniki">Vifaa vya Kielektroniki</option>
                  <option value="Huduma">Huduma</option>
                  <option value="Nyingine">Nyingine</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Picha ya Bidhaa</label>
                <input
                  type="file" accept="image/*"
                  className="w-full bg-slate-50 border-none rounded-2xl p-3.5 focus:ring-2 focus:ring-indigo-500 transition-all font-semibold text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Maelezo ya Bidhaa</label>
                <textarea
                  placeholder="Elezea bidhaa yako kwa ufupi..."
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 transition-all font-semibold h-32"
                  value={description} onChange={(e) => setDescription(e.target.value)} required
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit" disabled={loading}
                  className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Inahifadhi...' : 'Hifadhi Bidhaa'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            layout key={product.id}
            className="bg-white rounded-[32px] border border-slate-100 hover:shadow-2xl hover:shadow-indigo-100 transition-all group relative overflow-hidden flex flex-col"
          >
            <div className="aspect-square bg-slate-50 overflow-hidden relative">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl grayscale opacity-20">📦</div>
              )}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="w-10 h-10 bg-white/90 text-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-colors"
                 >
                   🗑️
                 </button>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 w-fit">
                {product.category}
              </span>
              <h3 className="text-xl font-black text-slate-800 mb-2">{product.name}</h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-2 font-medium">{product.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-2xl font-black text-indigo-600">
                  {new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(product.price)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}

        {products.length === 0 && !isAdding && (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-indigo-200">📦</div>
            <h3 className="text-xl font-bold text-slate-800">Hujawa na bidhaa bado</h3>
            <p className="text-slate-500 font-medium">Anza kwa kuongeza bidhaa yako ya kwanza!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
