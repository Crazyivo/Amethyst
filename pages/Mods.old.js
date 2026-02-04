
import React, { useState } from 'react';

const Mods = ({ theme }) => {
    const isLight = theme === 'light';
    const [searchTerm, setSearchTerm] = useState('');
    const [mods, setMods] = useState([
        { id: '1', name: "Sodium", version: "0.5.8", author: "jellysquid", enabled: true, description: "Modern rendering engine for Minecraft." },
        { id: '2', name: "Lithium", version: "0.11.2", author: "jellysquid", enabled: true, description: "General-purpose game physics/tick optimization." },
        { id: '3', name: "Iris Shaders", version: "1.7.0", author: "coderbot", enabled: false, description: "Modern shaders for Sodium." },
    ]);

    const toggleMod = (id) => {
        setMods(mods.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
    };

    const filteredMods = mods.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="max-w-6xl mx-auto py-8 animate-fadeIn">
            <div className="flex justify-between items-center mb-10">
                <h2 className={`text-3xl font-black italic uppercase tracking-tighter ${isLight ? 'text-slate-900' : 'text-white'}`}>Active Mods</h2>
                <input 
                    type="text"
                    placeholder="Search mods..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className={`px-6 py-2 rounded-xl text-sm border outline-none transition-all ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/5 focus:border-purple-500/50'}`}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMods.map(mod => (
                    <div key={mod.id} className={`glass p-6 rounded-[2rem] border transition-all ${isLight ? 'border-slate-100 hover:bg-white' : 'border-white/5 hover:bg-white/5'} ${!mod.enabled && 'opacity-60 grayscale'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className={`font-black text-lg ${isLight ? 'text-slate-800' : 'text-white'}`}>{mod.name}</h3>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-white/30'}`}>by {mod.author}</span>
                            </div>
                            <button 
                                onClick={() => toggleMod(mod.id)}
                                className={`w-10 h-6 rounded-full relative transition-all ${mod.enabled ? 'bg-green-500' : 'bg-slate-700'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${mod.enabled ? 'left-5' : 'left-1'}`} />
                            </button>
                        </div>
                        <p className={`text-xs mb-6 line-clamp-2 ${isLight ? 'text-slate-500' : 'text-white/50'}`}>{mod.description}</p>
                        <div className="flex justify-between items-center pt-4 border-t border-white/5">
                            <span className="text-[10px] font-bold text-purple-400">v{mod.version}</span>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${mod.enabled ? 'text-green-500' : 'text-slate-500'}`}>{mod.enabled ? 'Enabled' : 'Disabled'}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Mods;
