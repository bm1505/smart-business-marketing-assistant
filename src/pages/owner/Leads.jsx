import { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { generateLeads } from '../../gemini';

export default function Leads() {
  const [searchTerm, setSearchTerm] = useState("");
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState([
    { id: 1, name: 'Hamisi Juma', interest: 'Viatu vya Michezo', status: 'Hot Lead', contact: '0712345678' },
    { id: 2, name: 'Maria Salum', interest: 'Nguo za Watoto', status: 'Warm Lead', contact: '0654123456' },
    { id: 3, name: 'Peter John', interest: 'Electronics', status: 'Cold Lead', contact: '0789123456' },
  ]);

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

  const findLeads = async () => {
    setLoading(true);
    const businessInfo = business || {
      name: "Biashara Yangu",
      category: "Huduma",
      location: "Tanzania"
    };

    const newLeads = await generateLeads(businessInfo);
    if (newLeads && newLeads.length > 0) {
      setLeads(prev => [...newLeads, ...prev]);
    }
    setLoading(false);
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">🎯 Lead Finder</h1>
          <p className="text-slate-500 font-medium">Mfumo unatafuta wateja wanaohitaji <b>{business?.category || 'bidhaa zako'}</b>.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <input
            type="text" placeholder="Tafuta keyword..."
            className="flex-1 md:w-64 px-6 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          />
          <button
            onClick={findLeads}
            disabled={loading}
            className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black shadow-lg hover:bg-black transition disabled:opacity-50"
          >
            {loading ? "Inatafuta..." : "Find Leads 🚀"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b">
            <tr>
              <th className="p-6">Customer Name</th>
              <th className="p-6">Interest</th>
              <th className="p-6">Classification</th>
              <th className="p-6">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/50 transition">
                <td className="p-6">
                   <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{lead.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{lead.contact}</span>
                   </div>
                </td>
                <td className="p-6 text-slate-500 font-medium">{lead.interest}</td>
                <td className="p-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    lead.status === 'Hot Lead' ? 'bg-rose-100 text-rose-600' :
                    lead.status === 'Warm Lead' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="p-6">
                  <a
                    href={`https://wa.me/${lead.contact}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition inline-block"
                  >
                    Wasiliana
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
