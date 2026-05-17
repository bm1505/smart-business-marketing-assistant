import { useState } from 'react';

export default function Messages() {
  const [messages] = useState([
    { id: 1, sender: 'Hamisi Juma', text: 'Nahitaji kujua bei ya viatu vya michezo...', time: '2h ago', status: 'unread' },
    { id: 2, sender: 'Maria Salum', text: 'Asante kwa mzigo, nimeupokea vizuri.', time: 'Yesterday', status: 'read' },
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h1 className="text-4xl font-black text-slate-950 tracking-tight">💬 Messaging Center</h1>
          <p className="text-slate-500 font-medium text-lg">Wasiliana na wateja wako kwa urahisi.</p>
        </div>
        <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95">
          New Message
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Sidebar: Message List */}
        <div className="lg:col-span-4 bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/30">
            <div className="relative">
              <input
                type="text"
                placeholder="Tafuta mazungumzo..."
                className="w-full pl-12 pr-6 py-4 bg-white border-0 ring-1 ring-slate-200 rounded-[20px] outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium transition-all shadow-sm"
              />
              <span className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
            </div>
          </div>
          <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
            {messages.map(msg => (
              <div key={msg.id} className={`p-8 hover:bg-slate-50 cursor-pointer transition-all relative group ${msg.status === 'unread' ? 'bg-indigo-50/30' : ''}`}>
                {msg.status === 'unread' && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600 rounded-r-full"></div>}
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-black text-slate-900">{msg.sender}</h4>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{msg.time}</span>
                </div>
                <p className="text-sm text-slate-500 line-clamp-1 font-medium group-hover:text-slate-700 transition-colors">{msg.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-8 bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-100 ring-4 ring-white">👤</div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Hamisi Juma</h3>
                <div className="flex items-center gap-2">
                   <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                   <p className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em]">Online</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="w-12 h-12 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-center transition-all text-xl">📞</button>
              <button className="w-12 h-12 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-center transition-all text-xl">⚙️</button>
            </div>
          </div>

          <div className="flex-1 p-10 space-y-8 overflow-y-auto bg-slate-50/30">
            <div className="flex flex-col gap-2 max-w-[75%]">
              <div className="bg-white p-6 rounded-[24px] rounded-tl-none shadow-sm border border-slate-100">
                <p className="text-slate-700 font-medium leading-relaxed">Habari, nahitaji kujua bei ya viatu vya michezo vilivyopo kwenye duka lako.</p>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">10:42 AM</span>
            </div>

            <div className="flex flex-col gap-2 max-w-[75%] ml-auto items-end">
              <div className="bg-indigo-600 p-6 rounded-[24px] rounded-tr-none shadow-xl shadow-indigo-100 text-white">
                <p className="font-medium leading-relaxed">Habari Hamisi! Vipo vya bei tofauti kuanzia 45,000/-. Unapenda rangi gani?</p>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2 text-right">10:45 AM</span>
            </div>

            <div className="p-8 border-2 border-indigo-100 border-dashed rounded-[32px] bg-white/80 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">✨</div>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-3">Smart Engine Suggestion 🚀</p>
              <p className="text-lg text-indigo-950 font-bold italic leading-relaxed">"Tuna ofa ya 10% kwa wateja wapya leo! Ungetaka nikuwekee oda?"</p>
              <button className="mt-6 bg-indigo-50 text-indigo-600 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                Tumia Jibu Hili
              </button>
            </div>
          </div>

          <div className="p-8 bg-white border-t border-slate-50">
            <div className="flex gap-4 items-center bg-slate-50 p-2 rounded-[28px] ring-1 ring-slate-100 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
              <button className="w-12 h-12 flex items-center justify-center text-2xl hover:bg-white rounded-2xl transition-colors">📎</button>
              <input
                type="text"
                placeholder="Andika ujumbe wako hapa..."
                className="flex-1 bg-transparent py-4 px-2 outline-none font-medium text-slate-700"
              />
              <button className="bg-slate-900 text-white px-8 py-4 rounded-[22px] font-black shadow-lg hover:bg-black transition-all active:scale-95">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
