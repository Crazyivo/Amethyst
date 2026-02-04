
import React from 'react';

const Settings = ({ settings, onUpdate }) => {
    const isLight = settings.theme === 'light';
    
    const handleChange = (key, value) => {
        onUpdate({ ...settings, [key]: value });
    };

    const handleOpenModsFolder = () => {
        if (window.electron && window.electron.openFolder) {
            window.electron.openFolder(settings.gamePath || './minecraft/mods');
        } else {
            console.log('Simulating: Opening mods folder at', settings.gamePath || './minecraft/mods');
            alert('Opening Mods Folder...');
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h2 className={`text-4xl font-black italic uppercase tracking-tighter mb-10 ${isLight ? 'text-slate-800' : 'text-white'}`}>Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Hardware */}
                <section className={`glass p-10 rounded-[3rem] border ${isLight ? 'border-slate-300/40' : 'border-white/5'}`}>
                    <h3 className={`text-xl font-bold mb-8 flex items-center gap-3 ${isLight ? 'text-slate-700' : 'text-white'}`}>
                        <div className="p-2 bg-purple-500/20 rounded-xl text-purple-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                        </div>
                        Performance
                    </h3>
                    
                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between mb-3">
                                <label className={`text-[10px] font-black uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-white/30'}`}>RAM Allocation</label>
                                <span className="text-sm font-black text-purple-400">{Math.round(settings.ram / 1024 * 10) / 10} GB</span>
                            </div>
                            <input 
                                type="range" 
                                min="1024" 
                                max="16384" 
                                step="512"
                                value={settings.ram}
                                onChange={(e) => handleChange('ram', parseInt(e.target.value))}
                                className={`w-full h-2 rounded-full appearance-none cursor-pointer accent-purple-500 border ${isLight ? 'bg-slate-300/50 border-slate-300/30' : 'bg-white/5 border-white/5'}`}
                            />
                            <div className={`flex justify-between text-[10px] mt-3 font-bold uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-white/20'}`}>
                                <span>1 GB</span>
                                <span>16 GB</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className={`text-[10px] font-black uppercase tracking-widest block ml-1 ${isLight ? 'text-slate-400' : 'text-white/30'}`}>Java Path</label>
                            <div className="relative group">
                                <input 
                                    type="text"
                                    placeholder="Auto-detected (Java 17)"
                                    value={settings.javaPath}
                                    onChange={(e) => handleChange('javaPath', e.target.value)}
                                    className={`w-full border rounded-2xl px-5 py-4 text-sm focus:border-purple-500/50 transition-all outline-none font-bold ${isLight ? 'bg-slate-300/30 border-slate-300/40 text-slate-700 placeholder:text-slate-400' : 'bg-white/5 border-white/10 text-white'}`}
                                />
                                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-purple-400 hover:text-purple-600 transition-colors">BROWSE</button>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <label className={`text-[10px] font-black uppercase tracking-widest block ml-1 ${isLight ? 'text-slate-400' : 'text-white/30'}`}>Game Management</label>
                            <button 
                                onClick={handleOpenModsFolder}
                                className={`w-full border rounded-[1.5rem] px-6 py-5 text-sm flex items-center justify-between transition-all group/folder shadow-sm
                                    ${isLight 
                                        ? 'bg-white border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-slate-50 shadow-slate-200/50' 
                                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-xl transition-colors ${isLight ? 'bg-purple-100 text-purple-600' : 'bg-purple-500/20 text-purple-400'}`}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                        </svg>
                                    </div>
                                    <span className="font-bold tracking-tight">Open Mods Folder</span>
                                </div>
                                <svg className="w-4 h-4 text-purple-400 group-hover/folder:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </section>

                <section className={`glass p-10 rounded-[3rem] border ${isLight ? 'border-slate-300/40' : 'border-white/5'}`}>
                    <h3 className={`text-xl font-bold mb-8 flex items-center gap-3 ${isLight ? 'text-slate-700' : 'text-white'}`}>
                        <div className="p-2 bg-purple-500/20 rounded-xl text-purple-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                        </div>
                        Launcher Options
                    </h3>
                    
                    <div className="space-y-3">
                        <ToggleButton 
                            label="Close on launch" 
                            active={settings.closeOnLaunch} 
                            isLight={isLight}
                            onClick={() => handleChange('closeOnLaunch', !settings.closeOnLaunch)} 
                        />
                        <ToggleButton 
                            label="Discord RPC" 
                            active={settings.rpcEnabled} 
                            isLight={isLight}
                            onClick={() => handleChange('rpcEnabled', !settings.rpcEnabled)} 
                        />
                        <div className={`pt-4 mt-4 border-t ${isLight ? 'border-slate-300/40' : 'border-white/5'}`}>
                            <label className={`text-[10px] font-black uppercase tracking-widest mb-4 block ${isLight ? 'text-slate-400' : 'text-white/30'}`}>Version Filters</label>
                            <ToggleButton 
                                label="Show Snapshots" 
                                active={settings.showSnapshots} 
                                isLight={isLight}
                                onClick={() => handleChange('showSnapshots', !settings.showSnapshots)} 
                            />
                            <ToggleButton 
                                label="Show Old Versions" 
                                active={settings.showOldVersions} 
                                isLight={isLight}
                                onClick={() => handleChange('showOldVersions', !settings.showOldVersions)} 
                            />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

const ToggleButton = ({ label, active, onClick, isLight }) => (
    <label 
        onClick={onClick}
        className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer group ${isLight ? 'bg-slate-300/20 hover:bg-slate-300/40' : 'bg-white/5 hover:bg-white/10'}`}
    >
        <span className={`text-sm font-bold transition-colors ${isLight ? 'text-slate-500 group-hover:text-slate-800' : 'text-white/60 group-hover:text-white'}`}>{label}</span>
        <div className={`w-11 h-6 rounded-full transition-all relative ${active ? 'bg-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.3)]' : isLight ? 'bg-slate-400/40' : 'bg-white/10'}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${active ? 'left-6' : 'left-1'}`} />
        </div>
    </label>
);

export default Settings;
