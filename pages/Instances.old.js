
import React, { useState, useEffect } from 'react';

const MANIFEST_URL = 'https://launchermeta.mojang.com/mc/game/version_manifest_v2.json';

const Instances = ({ theme, instances, onUpdateInstances, onPlay }) => {
    const isLight = theme === 'light';
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [newInstanceName, setNewInstanceName] = useState('');
    const [newInstanceVersion, setNewInstanceVersion] = useState('');
    const [newInstanceType, setNewInstanceType] = useState('Vanilla');
    const [allVersions, setAllVersions] = useState([]);
    const [loadingVersions, setLoadingVersions] = useState(false);

    useEffect(() => {
        if (isCreateModalOpen && allVersions.length === 0) {
            setLoadingVersions(true);
            fetch(MANIFEST_URL)
                .then(res => res.json())
                .then((data) => {
                    setAllVersions(data.versions);
                    setNewInstanceVersion(data.latest.release);
                    setLoadingVersions(false);
                })
                .catch(() => setLoadingVersions(false));
        }
    }, [isCreateModalOpen]);

    const handleCreate = () => {
        if (!newInstanceName || !newInstanceVersion) return;
        
        const colors = {
            'Vanilla': 'from-slate-500/20 to-slate-600/20',
            'Fabric': 'from-indigo-500/20 to-purple-500/20',
            'Forge': 'from-orange-500/20 to-yellow-600/20',
            'Quilt': 'from-pink-500/20 to-purple-600/20'
        };

        const icons = {
            'Vanilla': '📦',
            'Fabric': '🧵',
            'Forge': '🔨',
            'Quilt': '🌸'
        };

        const newInst = {
            id: Date.now().toString(),
            name: newInstanceName,
            version: newInstanceVersion,
            type: newInstanceType,
            lastPlayed: 'Never',
            icon: icons[newInstanceType],
            color: colors[newInstanceType]
        };
        onUpdateInstances([newInst, ...instances]);
        setCreateModalOpen(false);
        setNewInstanceName('');
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this instance?')) {
            onUpdateInstances(instances.filter(i => i.id !== id));
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8 animate-fadeIn">
            <div className="flex justify-between items-center mb-10">
                <div className="flex flex-col">
                    <h2 className={`text-4xl font-black italic uppercase tracking-tighter ${isLight ? 'text-slate-900' : 'text-white'}`}>Library</h2>
                    <span className={`text-[10px] font-bold uppercase tracking-[0.4em] ${isLight ? 'text-slate-400' : 'text-white/20'}`}>Local Engine Repositories</span>
                </div>
                <button 
                    onClick={() => setCreateModalOpen(true)}
                    className={`px-8 py-3 text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl group flex items-center gap-3 ${isLight ? 'bg-slate-900 text-white hover:bg-purple-600' : 'bg-white text-black hover:bg-purple-600 hover:text-white shadow-white/5'}`}
                >
                    <svg className="w-4 h-4 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                    Add New Engine
                </button>
            </div>

            <div className="grid grid-cols-1 gap-5">
                {instances.length > 0 ? instances.map((inst) => (
                    <div 
                        key={inst.id} 
                        className={`glass p-6 rounded-[2.5rem] border flex items-center justify-between group transition-all duration-500 relative overflow-hidden ${isLight ? 'border-slate-100 hover:bg-white/90 hover:shadow-2xl hover:shadow-slate-200/50' : 'border-white/5 hover:bg-white/5 hover:shadow-2xl hover:shadow-purple-900/10'}`}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r ${inst.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                        
                        <div className="flex items-center gap-8 relative z-10">
                            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500 shadow-inner ${isLight ? 'bg-slate-100' : 'bg-white/5'}`}>
                                {inst.icon}
                            </div>
                            <div>
                                <h3 className={`text-xl font-black transition-colors tracking-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>{inst.name}</h3>
                                <div className="flex gap-3 mt-2">
                                    <span className={`text-[10px] font-black uppercase tracking-[0.1em] px-3 py-1 rounded-xl shadow-sm transition-all ${inst.type === 'Fabric' ? 'bg-indigo-600 text-white' : inst.type === 'Forge' ? 'bg-orange-600 text-white' : isLight ? 'bg-slate-200 text-slate-500' : 'bg-white/10 text-white/50'}`}>
                                        {inst.type}
                                    </span>
                                    <span className={`text-[10px] font-black uppercase tracking-[0.1em] px-3 py-1 rounded-xl ${isLight ? 'bg-slate-200 text-slate-500' : 'bg-white/10 text-white/50'}`}>{inst.version}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-12 relative z-10">
                            <div className="text-right hidden md:block">
                                <span className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isLight ? 'text-slate-400' : 'text-white/30'}`}>Last Build</span>
                                <span className={`text-sm font-bold ${isLight ? 'text-slate-600' : 'text-white'}`}>{inst.lastPlayed}</span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => handleDelete(inst.id)}
                                    className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${isLight ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                </button>
                                <button 
                                    onClick={() => onPlay(inst)}
                                    className={`px-10 py-4 font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-lg active:scale-95 ${isLight ? 'bg-slate-900 text-white hover:bg-purple-600' : 'bg-white text-black hover:bg-purple-600 hover:text-white'}`}
                                >
                                    Activate
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className={`p-20 text-center glass rounded-[3rem] border border-dashed flex flex-col items-center gap-6 ${isLight ? 'border-slate-300' : 'border-white/10'}`}>
                        <p className={`text-lg font-bold ${isLight ? 'text-slate-400' : 'text-white/20'}`}>No instances detected in local storage</p>
                    </div>
                )}
            </div>

            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 animate-fadeIn">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" onClick={() => setCreateModalOpen(false)} />
                    <div className={`glass w-full max-w-md p-10 rounded-[3.5rem] relative z-10 border shadow-[0_0_100px_rgba(0,0,0,0.5)] ${isLight ? 'bg-white' : 'bg-[#0c0c0e] border-white/10'}`}>
                        <div className="flex justify-between items-center mb-10">
                            <h3 className={`text-2xl font-black italic uppercase tracking-tighter ${isLight ? 'text-slate-900' : 'text-white'}`}>New Engine</h3>
                            <button onClick={() => setCreateModalOpen(false)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isLight ? 'bg-slate-100 text-slate-400 hover:text-slate-600' : 'bg-white/5 text-white/20 hover:text-white'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className={`text-[10px] font-black uppercase tracking-widest ml-3 ${isLight ? 'text-slate-400' : 'text-white/30'}`}>Instance Designation</label>
                                <input 
                                    autoFocus
                                    type="text"
                                    placeholder="e.g. Modded Survival"
                                    value={newInstanceName}
                                    onChange={e => setNewInstanceName(e.target.value)}
                                    className={`w-full p-5 rounded-2xl outline-none border transition-all font-bold ${isLight ? 'bg-slate-100 border-slate-200 text-slate-900 focus:border-purple-300' : 'bg-white/5 border-white/5 focus:border-purple-500/50 text-white'}`}
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className={`text-[10px] font-black uppercase tracking-widest ml-3 ${isLight ? 'text-slate-400' : 'text-white/30'}`}>Target Version</label>
                                    <select 
                                        disabled={loadingVersions}
                                        value={newInstanceVersion}
                                        onChange={e => setNewInstanceVersion(e.target.value)}
                                        className={`w-full p-5 rounded-2xl outline-none border transition-all font-bold cursor-pointer ${isLight ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-white/5 border-white/5 text-white'} ${loadingVersions ? 'opacity-50' : ''}`}
                                    >
                                        {loadingVersions ? (
                                            <option>Loading manifest...</option>
                                        ) : (
                                            allVersions.map(v => <option key={v.id} value={v.id}>{v.id} ({v.type})</option>)
                                        )}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className={`text-[10px] font-black uppercase tracking-widest ml-3 ${isLight ? 'text-slate-400' : 'text-white/30'}`}>Loader Core</label>
                                    <select 
                                        value={newInstanceType}
                                        onChange={e => setNewInstanceType(e.target.value)}
                                        className={`w-full p-5 rounded-2xl outline-none border transition-all font-bold cursor-pointer ${isLight ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-white/5 border-white/5 text-white'}`}
                                    >
                                        <option value="Vanilla">Vanilla</option>
                                        <option value="Fabric">Fabric</option>
                                        <option value="Forge">Forge</option>
                                        <option value="Quilt">Quilt</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <button 
                            disabled={loadingVersions}
                            onClick={handleCreate}
                            className="w-full mt-12 py-5 bg-purple-600 text-white font-black rounded-3xl shadow-2xl shadow-purple-900/30 hover:bg-purple-500 transition-all uppercase tracking-[0.3em] text-sm active:scale-95"
                        >
                            Sync & Build
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Instances;
