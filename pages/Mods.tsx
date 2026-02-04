
import React, { useState } from 'react';
import { Mod } from '../types.ts';

interface ModsProps {
    theme?: 'dark' | 'light';
    language?: 'en' | 'ru';
}

const Mods: React.FC<ModsProps> = ({ theme, language = 'en' }) => {
    const isLight = theme === 'light';
    const [searchTerm, setSearchTerm] = useState('');
    const [mods, setMods] = useState<Mod[]>([
        // GOLDSHIELD Profile Mods - Optimization & Shaders
        { id: '1', name: "Sodium", version: "0.5.8", author: "jellysquid", enabled: true, description: "Modern rendering engine for Minecraft." },
        { id: '2', name: "Lithium", version: "0.11.2", author: "jellysquid", enabled: true, description: "General-purpose game physics/tick optimization." },
        { id: '3', name: "Iris Shaders", version: "1.7.0", author: "coderbot", enabled: true, description: "Modern shaders for Sodium." },
        { id: '4', name: "Ferrite Core", version: "5.1.0", author: "malte0811", enabled: true, description: "Memory usage optimization." },
        { id: '5', name: "Phosphor", version: "0.8.1", author: "jellysquid", enabled: true, description: "Lighting engine optimization." },
        { id: '6', name: "FerriteCore", version: "5.1.0", author: "malte0811", enabled: true, description: "Reduces memory usage of Minecraft." },
        { id: '7', name: "Starlight", version: "1.1.2", author: "spottedleaf", enabled: true, description: "Advanced light engine rewrite." },
        { id: '8', name: "Entity Culling", version: "1.6.2", author: "tr7zw", enabled: true, description: "Skip rendering of hidden entities." },
        { id: '9', name: "Debugify", version: "1.0.0", author: "isXander", enabled: true, description: "Fixes common Minecraft bugs." },
        { id: '10', name: "C2ME", version: "0.2.0", author: "YatopiaMC", enabled: true, description: "Chunk loading optimization." },
        // Shader Packs for Iris
        { id: '11', name: "Complementary Shaders", version: "4.7.2", author: "EminGT", enabled: false, description: "High quality realistic shaders." },
        { id: '12', name: "Sildur's Vibrant Shaders", version: "1.401", author: "Sildur", enabled: false, description: "Vibrant and colorful shaders." },
        { id: '13', name: "BSL Shaders", version: "8.2.08", author: "CaptainTzig", enabled: false, description: "Balanced shader with great visuals." },
    ]);

    // Переводы
    const translations = {
        en: {
            activeMods: 'Active Mods',
            searchMods: 'Search mods...',
            enabled: 'Enabled',
            disabled: 'Disabled',
        },
        ru: {
            activeMods: 'Активные моды',
            searchMods: 'Поиск модов...',
            enabled: 'Включено',
            disabled: 'Отключено',
        }
    };

    const t = translations[language as keyof typeof translations] || translations.en;

    const toggleMod = (id: string) => {
        setMods(mods.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
    };

    const filteredMods = mods.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="max-w-6xl mx-auto py-8 animate-fadeIn px-6">
            <div className="flex justify-between items-center mb-10">
                <h2 className={`text-3xl font-black italic uppercase tracking-tighter ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.activeMods}</h2>
                <input 
                    type="text"
                    placeholder={t.searchMods}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className={`px-6 py-2 rounded-xl text-sm border outline-none transition-all ${isLight ? 'bg-slate-100 border-slate-200 text-slate-900' : 'bg-white/5 border-white/5 text-white focus:border-purple-500/50'}`}
                />
            </div>

            {filteredMods.length === 0 ? (
                <div className={`text-center py-12 ${isLight ? 'text-slate-400' : 'text-white/40'}`}>
                    No mods found
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMods.map(mod => (
                        <div key={mod.id} className={`glass p-6 rounded-[2rem] border transition-all relative z-10 hover:z-20 ${isLight ? 'border-slate-100 hover:bg-white hover:shadow-2xl' : 'border-white/5 hover:bg-white/5 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]'} ${!mod.enabled && 'opacity-60 grayscale'}`}>
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
                                <span className={`text-[10px] font-black uppercase tracking-widest ${mod.enabled ? 'text-green-500' : 'text-slate-500'}`}>{mod.enabled ? t.enabled : t.disabled}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Mods;
