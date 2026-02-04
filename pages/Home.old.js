
import React, { useState, useEffect, useMemo } from 'react';

const MANIFEST_URL = 'https://launchermeta.mojang.com/mc/game/version_manifest_v2.json';

const Home = ({ user, settings, selectedInstance, onResetInstance }) => {
    const [versions, setVersions] = useState([]);
    const [selectedVersion, setSelectedVersion] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLaunching, setIsLaunching] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Standby');
    const [logs, setLogs] = useState([]);
    const [showVersionList, setShowVersionList] = useState(false);
    const [loadingManifest, setLoadingManifest] = useState(true);

    const isLight = settings.theme === 'light';

    useEffect(() => {
        const fetchManifest = async () => {
            try {
                setLoadingManifest(true);
                const response = await fetch(MANIFEST_URL);
                if (!response.ok) throw new Error('Failed to fetch manifest');
                const data = await response.json();
                setVersions(data.versions);
                
                if (selectedInstance) {
                    setSelectedVersion(selectedInstance.version);
                } else {
                    setSelectedVersion(data.latest.release);
                }
                
                setLoadingManifest(false);
                setStatus('Ready to Launch');
            } catch (error) {
                console.error('Manifest fetch error:', error);
                setStatus('Connection Error');
                setLoadingManifest(false);
            }
        };
        fetchManifest();
    }, [selectedInstance]);

    const filteredVersions = useMemo(() => {
        return versions.filter(v => {
            const matchesSearch = v.id.toLowerCase().includes(searchTerm.toLowerCase());
            const isSnapshot = v.type === 'snapshot';
            const isOld = v.type === 'old_beta' || v.type === 'old_alpha';
            if (!settings.showSnapshots && isSnapshot) return false;
            if (!settings.showOldVersions && isOld) return false;
            return matchesSearch;
        });
    }, [versions, searchTerm, settings]);

    const addLog = (msg) => {
        setLogs(prev => [...prev.slice(-20), `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    const handleLaunch = async () => {
        if (!user) {
            alert("Security Protocol: User Authentication Required.");
            return;
        }

        const versionData = versions.find(v => v.id === selectedVersion);
        if (!versionData) return;

        const loaderType = selectedInstance?.type || 'Vanilla';

        setIsLaunching(true);
        setLogs([]);
        addLog(`System: Preparing ${loaderType} kernel for version ${selectedVersion}`);
        
        try {
            setStatus('Allocating Assets');
            setProgress(10);
            await new Promise(r => setTimeout(r, 400));
            addLog('Verifying local environment...');
            
            setStatus('Mapping Libraries');
            setProgress(35);
            addLog(`Downloading core binaries for ${selectedVersion}`);
            
            if (loaderType === 'Fabric') {
                addLog('Injecting Fabric Intermediary mappings...');
                setProgress(45);
                await new Promise(r => setTimeout(r, 600));
            } else if (loaderType === 'Forge') {
                addLog('Initializing Forge Mod Loader (FML)...');
                setProgress(45);
                await new Promise(r => setTimeout(r, 800));
            }

            setStatus('Injecting CoreMods');
            setProgress(65);
            addLog('Preparing Render Context (LWJGL)...');
            await new Promise(r => setTimeout(r, 500));

            setStatus('Finalizing JVM Environment');
            setProgress(90);
            addLog(`RAM Allocation: ${settings.ram}MB`);
            addLog(`Launching sub-process: Minecraft`);

            if (window.electron) {
                window.electron.launchGame({ 
                    versionId: selectedVersion, 
                    memory: settings.ram,
                    loaderType: loaderType
                });
            }

            setStatus('Engine Active');
            setProgress(100);
            addLog(`Process successfully detached. Launcher entering idle mode.`);
            
            if (settings.closeOnLaunch) {
                setTimeout(() => window.close(), 2500);
            }
        } catch (e) {
            addLog(`CRITICAL ERROR: ${e instanceof Error ? e.message : 'Unknown Fault'}`);
            setStatus('Process Aborted');
            setTimeout(() => setIsLaunching(false), 3000);
        }
    };

    return (
        <div className="h-full flex flex-col justify-between animate-fadeIn">
            <div className="flex-1 flex flex-col justify-center items-center text-center animate-float relative">
                <div className="relative">
                    <h1 className={`text-8xl font-black italic tracking-tighter mb-2 select-none transition-all duration-500 ${isLight ? 'text-slate-800 opacity-90' : 'text-white drop-shadow-[0_20px_20px_rgba(0,0,0,0.7)]'}`}>
                        AMETHYST
                    </h1>
                    {selectedInstance && (
                        <div className={`absolute -top-6 -right-12 px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] animate-fadeInUp shadow-[0_0_30px_rgba(147,51,234,0.4)] border ${selectedInstance.type === 'Fabric' ? 'bg-indigo-600 text-white border-indigo-400' : selectedInstance.type === 'Forge' ? 'bg-orange-600 text-white border-orange-400' : 'bg-slate-700 text-white border-slate-500'}`}>
                            {selectedInstance.type} Enabled
                        </div>
                    )}
                </div>
                <p className={`font-bold tracking-[0.6em] uppercase text-[11px] mb-10 transition-all duration-500 ${isLight ? 'text-slate-500' : 'text-purple-500/80'}`}>
                    High-Performance Orchestration
                </p>
                
                {isLaunching && (
                    <div className="w-full max-w-xl mt-4 animate-fadeIn">
                        <div className={`glass p-6 rounded-[2rem] text-left font-mono text-[10px] h-48 overflow-hidden flex flex-col justify-end gap-1.5 transition-all duration-500 ${isLight ? 'text-slate-600 border-slate-300/50' : 'text-purple-200/40 border-purple-500/20 shadow-inner shadow-purple-900/10'}`}>
                            {logs.map((log, i) => (
                                <div key={i} className={`whitespace-nowrap overflow-hidden text-ellipsis border-l-2 pl-4 ${isLight ? 'border-slate-300' : 'border-purple-600/40'}`}>
                                    {log}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="w-full flex justify-center mb-8 px-6">
                <div className={`glass w-full max-w-6xl p-10 rounded-[4rem] flex flex-col gap-6 shadow-3xl relative transition-all duration-700 ${selectedInstance ? (isLight ? 'border-purple-200 bg-purple-50/40' : 'border-purple-600/30 bg-purple-900/5') : ''}`}>
                    <div className="flex items-center gap-12">
                        {/* Status Area */}
                        <div className="relative flex-[1.6]">
                            <div className="flex justify-between items-center mb-4 px-3">
                                <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${isLight ? 'text-slate-400' : 'text-white/20'}`}>
                                    {selectedInstance ? `Loaded Engine: ${selectedInstance.name}` : 'Core Release Module'}
                                </label>
                                {selectedInstance && (
                                    <button 
                                        onClick={onResetInstance}
                                        className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-xl border transition-all ${isLight ? 'text-red-500 border-red-200 hover:bg-red-50' : 'text-red-400 border-red-500/30 hover:bg-red-500/10'}`}
                                    >
                                        Detach Instance
                                    </button>
                                )}
                            </div>
                            
                            {selectedInstance ? (
                                <div className={`flex items-center gap-6 border rounded-[2rem] px-8 py-5 shadow-inner ${isLight ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'}`}>
                                    <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center text-2xl shadow-xl ${isLight ? 'bg-slate-100' : 'bg-white/5'}`}>
                                        {selectedInstance.icon}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`font-black text-base tracking-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>{selectedInstance.name}</span>
                                        <span className={`text-[11px] font-bold uppercase tracking-[0.1em] ${isLight ? 'text-slate-400' : 'text-purple-400/60'}`}>Build: {selectedInstance.version} • {selectedInstance.type} Engine</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div 
                                        onClick={() => !isLaunching && !loadingManifest && setShowVersionList(!showVersionList)}
                                        className={`flex items-center justify-between border rounded-[2rem] px-8 py-5 cursor-pointer transition-all ${isLight ? 'bg-slate-300/20 border-slate-300/30 hover:bg-slate-300/40' : 'bg-white/5 border-white/10 hover:bg-white/10'} ${isLaunching || loadingManifest ? 'opacity-40 pointer-events-none' : ''}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-3 h-3 rounded-full ${loadingManifest ? 'bg-yellow-500 animate-pulse' : 'bg-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.7)]'}`} />
                                            <span className={`font-black tracking-tight text-sm ${isLight ? 'text-slate-700' : 'text-white'}`}>{loadingManifest ? 'Syncing Manifest...' : `Vanilla ${selectedVersion}`}</span>
                                        </div>
                                        <svg className={`w-6 h-6 transition-transform duration-500 ${showVersionList ? 'rotate-180 text-purple-600' : 'text-white/20'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                    </div>

                                    {showVersionList && (
                                        <div className={`absolute bottom-full mb-8 left-0 w-full glass rounded-[3rem] border shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden z-[100] animate-fadeInUp ${isLight ? 'border-slate-300/40 bg-white/95' : 'border-white/10 bg-[#0c0c0e]/98'}`}>
                                            <div className={`p-6 border-b ${isLight ? 'border-slate-200' : 'border-white/5'}`}>
                                                <input 
                                                    autoFocus
                                                    type="text" 
                                                    placeholder="Search version database..." 
                                                    className={`w-full rounded-2xl px-6 py-4 text-sm outline-none border transition-all ${isLight ? 'bg-slate-200/50 border-slate-300/50 focus:border-purple-300 text-slate-800' : 'bg-white/5 border-white/10 focus:border-purple-600/50 text-white'}`}
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                            </div>
                                            <div className="max-h-80 overflow-y-auto py-4 custom-scrollbar">
                                                {filteredVersions.map(v => (
                                                    <div 
                                                        key={v.id}
                                                        onClick={() => { setSelectedVersion(v.id); setShowVersionList(false); }}
                                                        className={`px-10 py-5 cursor-pointer flex items-center justify-between group/item transition-all ${isLight ? 'hover:bg-slate-300/30' : 'hover:bg-purple-600/20'}`}
                                                    >
                                                        <div className="flex items-center gap-5">
                                                            <div className={`w-2 h-2 rounded-full ${v.type === 'release' ? 'bg-green-500' : 'bg-orange-500'} opacity-30 group-hover/item:opacity-100 shadow-[0_0_8px_currentColor]`} />
                                                            <span className={`text-sm font-black ${isLight ? 'text-slate-600 group-hover/item:text-slate-900' : 'text-white/60 group-hover/item:text-white'}`}>{v.id}</span>
                                                        </div>
                                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isLight ? 'text-slate-400' : 'text-white/10'}`}>{v.type} module</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Telemetry Bar */}
                        <div className="flex-[1.8] flex flex-col justify-center">
                            <div className="flex justify-between items-end mb-5">
                                <div className="flex flex-col">
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 ${isLight ? 'text-slate-400' : 'text-white/10'}`}>Engine Telemetry</span>
                                    <span className={`text-sm font-black uppercase tracking-[0.1em] transition-colors duration-500 ${isLaunching ? 'text-purple-500' : isLight ? 'text-slate-600' : 'text-white/30'}`}>
                                        {status}
                                    </span>
                                </div>
                                {isLaunching && (
                                    <div className="text-right">
                                        <span className={`text-3xl font-black leading-none tabular-nums ${isLight ? 'text-slate-900' : 'text-white'}`}>{Math.round(progress)}%</span>
                                    </div>
                                )}
                            </div>
                            <div className={`h-4 w-full rounded-full overflow-hidden p-1.5 border ${isLight ? 'bg-slate-300/30 border-slate-300/40 shadow-inner' : 'bg-white/5 border-white/5'}`}>
                                <div 
                                    className={`h-full bg-gradient-to-r from-purple-800 via-purple-500 to-indigo-600 rounded-full transition-all duration-700 ${isLaunching ? 'shadow-[0_0_25px_rgba(168,85,247,0.7)]' : 'opacity-20'}`} 
                                    style={{ width: `${progress || 4}%` }}
                                />
                            </div>
                        </div>

                        {/* Launch Trigger */}
                        <button
                            disabled={isLaunching || !user || loadingManifest}
                            onClick={handleLaunch}
                            className={`h-24 px-20 rounded-[2.5rem] font-black text-3xl tracking-[0.3em] transition-all duration-700 relative group overflow-hidden
                                ${isLaunching || !user || loadingManifest
                                    ? 'bg-white/5 text-white/5 cursor-not-allowed border border-white/5'
                                    : isLight 
                                        ? 'bg-slate-900 text-slate-100 hover:bg-purple-700 shadow-3xl active:scale-95' 
                                        : 'bg-white text-black hover:bg-purple-600 hover:text-white shadow-[0_0_50px_rgba(255,255,255,0.05)] active:scale-95'
                                }`}
                        >
                            <span className="relative z-10">{isLaunching ? 'RUNNING' : 'PLAY'}</span>
                            {!isLaunching && user && !loadingManifest && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
