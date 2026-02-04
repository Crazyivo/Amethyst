
import React, { useState, useEffect } from 'react';
import { Instance, LoaderType, Version, VersionManifest } from '../types.ts';

interface InstancesProps {
    theme?: 'dark' | 'light';
    instances: Instance[];
    onUpdateInstances: (inst: Instance[]) => void;
    onPlay: (inst: Instance) => void;
}

const MANIFEST_URL = 'https://launchermeta.mojang.com/mc/game/version_manifest_v2.json';

const Instances: React.FC<InstancesProps> = ({ theme, instances, onUpdateInstances, onPlay }) => {
    const isLight = theme === 'light';
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [newInstanceName, setNewInstanceName] = useState('');
    const [newInstanceVersion, setNewInstanceVersion] = useState('');
    const [newInstanceType, setNewInstanceType] = useState<LoaderType>('Vanilla');
    const [allVersions, setAllVersions] = useState<Version[]>([]);
    const [loadingVersions, setLoadingVersions] = useState(false);

    useEffect(() => {
        if (isCreateModalOpen && allVersions.length === 0) {
            setLoadingVersions(true);
            fetch(MANIFEST_URL)
                .then(res => res.json())
                .then((data: VersionManifest) => {
                    setAllVersions(data.versions);
                    setNewInstanceVersion(data.latest.release);
                    setLoadingVersions(false);
                })
                .catch(() => setLoadingVersions(false));
        }
    }, [isCreateModalOpen, allVersions.length]);

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

        const newInst: Instance = {
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

    const handleDelete = (id: string) => {
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
                {instances.map((inst) => (
                    <div 
                        key={inst.id} 
                        className={`glass p-6 rounded-[2.5rem] border flex items-center justify-between group transition-all duration-500 relative overflow-hidden ${isLight ? 'border-slate-100 hover:bg-white/90' : 'border-white/5 hover:bg-white/5'}`}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r ${inst.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                        <div className="flex items-center gap-8 relative z-10">
                            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl ${isLight ? 'bg-slate-100' : 'bg-white/5'}`}>
                                {inst.icon}
                            </div>
                            <div>
                                <h3 className={`text-xl font-black ${isLight ? 'text-slate-800' : 'text-white'}`}>{inst.name}</h3>
                                <div className="flex gap-3 mt-2">
                                    <span className="text-[10px] font-black uppercase bg-purple-600 text-white px-3 py-1 rounded-xl">{inst.type}</span>
                                    <span className="text-[10px] font-black uppercase bg-white/10 px-3 py-1 rounded-xl">{inst.version}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 relative z-10">
                            <button onClick={() => handleDelete(inst.id)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                            <button onClick={() => onPlay(inst)} className={`px-10 py-4 font-black uppercase tracking-widest text-xs rounded-2xl ${isLight ? 'bg-slate-900 text-white' : 'bg-white text-black'}`}>Activate</button>
                        </div>
                    </div>
                ))}
            </div>

            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" onClick={() => setCreateModalOpen(false)} />
                    <div className={`glass w-full max-w-md p-10 rounded-[3.5rem] relative z-10 border ${isLight ? 'bg-white border-slate-200' : 'bg-[#0c0c0e] border-white/10'}`}>
                        <h3 className="text-2xl font-black italic uppercase mb-8">New Engine</h3>
                        <div className="space-y-6">
                            <input 
                                type="text"
                                placeholder="Name..."
                                value={newInstanceName}
                                onChange={e => setNewInstanceName(e.target.value)}
                                className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-purple-500"
                            />
                            <select 
                                value={newInstanceVersion}
                                onChange={e => setNewInstanceVersion(e.target.value)}
                                className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 outline-none"
                            >
                                {allVersions.map(v => <option key={v.id} value={v.id}>{v.id}</option>)}
                            </select>
                        </div>
                        <button onClick={handleCreate} className="w-full mt-8 py-5 bg-purple-600 text-white font-black rounded-3xl">Build Instance</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Instances;
