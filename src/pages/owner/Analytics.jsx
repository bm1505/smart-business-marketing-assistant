import React from 'react';

export default function Analytics() {
  const charts = [
    { title: 'Engagement Rate', value: '64%', desc: 'Tangu mwezi uliopita', color: 'text-indigo-600' },
    { title: 'Leads Generated', value: '432', desc: 'Jumla ya mwaka huu', color: 'text-emerald-600' },
    { title: 'Best Channel', value: 'WhatsApp', desc: 'Inaleta mauzo zaidi', color: 'text-amber-600' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-950 tracking-tight">📈 Marketing Analytics</h1>
        <p className="text-slate-500 font-medium text-lg">Fuatilia mafanikio ya kampeni zako za masoko.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {charts.map((c, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-indigo-100 transition-colors">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{c.title}</h4>
            <p className={`text-6xl font-black ${c.color} tracking-tighter`}>{c.value}</p>
            <p className="text-sm text-slate-400 mt-4 font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              {c.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50">
        <div className="flex justify-between items-center mb-10">
           <h3 className="text-xl font-black text-slate-900 tracking-tight">Monthly Performance Overview</h3>
           <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-3 py-1.5 rounded-lg">
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span> Engagement
              </span>
           </div>
        </div>

        <div className="h-72 flex items-end justify-between gap-3 md:gap-6">
          {[40, 70, 45, 90, 65, 80, 50, 85, 95, 60, 75, 100].map((h, i) => (
            <div key={i} className="flex-1 group relative">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {h}% Growth
              </div>
              <div
                className="bg-indigo-600 rounded-2xl transition-all duration-500 group-hover:bg-indigo-400 group-hover:scale-x-110"
                style={{ height: `${h}%` }}
              ></div>
              <p className="text-[10px] text-center font-black text-slate-400 mt-4 uppercase tracking-tighter">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-2xl">🚀</div>
            <div>
              <p className="text-lg font-black text-slate-900">Ukuaji wa Jumla (Annual Growth)</p>
              <p className="text-sm text-emerald-600 font-bold">+24.8% ikilinganishwa na mwaka jana</p>
            </div>
          </div>
          <button className="w-full md:w-auto bg-slate-900 text-white font-black text-sm px-8 py-4 rounded-2xl hover:bg-black transition shadow-lg shadow-slate-200">
            Download PDF Report
          </button>
        </div>
      </div>
    </div>
  );
}
