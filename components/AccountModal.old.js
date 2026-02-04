
import React, { useState } from 'react';

const AccountModal = ({ user, onClose, onLogin, onLogout, theme }) => {
    const [mode, setMode] = useState('local');
    const [username, setUsername] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    
    const isLight = theme === 'light';

    const handleSubmitLocal = (e) => {
        e.preventDefault();
        if (username.trim()) {
            onLogin({
                username: username,
                uuid: btoa(username).slice(0, 16),
                accessToken: 'simulated_local_' + Date.now(),
                type: 'offline'
            });
        }
    };

    const handleAmethystAuth = () => {
        setIsConnecting(true);
        setTimeout(() => {
            setIsConnecting(false);
            onLogin({
                username: "AmethystPilot",
                uuid: "cloud-" + Math.random().toString(16).slice(2, 10),
                accessToken: 'cloud_token_' + Date.now(),
                type: 'amethyst'
            });
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <div className={`absolute inset-0 backdrop-blur-xl ${isLight ? 'bg-white/60' : 'bg-black/90'}`} onClick={onClose} />
            
            <div className={`glass w-full max-w-lg rounded-[3.5rem] overflow-hidden relative z-10 shadow-[0_0_100px_rgba(0,0,0,0.8)] border animate-fadeInUp ${isLight ? 'border-slate-200 bg-white/95' : 'border-white/10'}`}>
                <div className="p-12">
                    <div className="flex justify-between items-center mb-12">
                        <div className="flex flex-col">
                            <h2 className={`text-3xl font-black uppercase tracking-tighter italic ${isLight ? 'text-slate-900' : 'text-white'}`}>Terminal Auth</h2>
                            <span className="text-[10px] font-bold text-purple-500 tracking-[0.4em] uppercase">Amethyst Network</span>
                        </div>
                        <button onClick={onClose} className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${isLight ? 'bg-black/5 hover:bg-black/10 text-slate-600' : 'bg-white/5 hover:bg-white/10 text-white'}`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {user ? (
                        <div className="text-center">
                            <div className={`w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-purple-500/20 to-indigo-600/20 border mx-auto mb-8 p-3 group relative ${isLight ? 'border-purple-200' : 'border-purple-500/30'}`}>
                                <img 
                                    src={`https://minotar.net/helm/${user.username}/128`} 
                                    className="w-full h-full object-cover rounded-[2rem] group-hover:scale-110 transition-transform duration-500"
                                    alt="User Avatar"
                                />
                                <div className={`absolute -bottom-2 -right-2 ${user.type === 'amethyst' ? 'bg-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.8)]' : 'bg-green-500'} w-8 h-8 rounded-full border-4 flex items-center justify-center ${isLight ? 'border-white' : 'border-[#0c0c0e]'}`}>
                                    {user.type === 'amethyst' ? (
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" /></svg>
                                    ) : (
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                                    )}
                                </div>
                            </div>
                            <h3 className={`text-2xl font-black mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{user.username}</h3>
                            <p className={`text-xs font-bold uppercase tracking-widest mb-12 ${isLight ? 'text-slate-400' : 'text-white/30'}`}>
                                {user.type === 'amethyst' ? 'Amethyst Cloud Session' : 'Local Offline Session'}
                            </p>
                            
                            <button 
                                onClick={onLogout}
                                className="w-full py-5 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-3xl font-black text-sm transition-all duration-500 tracking-[0.2em]"
                            >
                                TERMINATE SESSION
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className={`flex p-1.5 rounded-3xl mb-4 border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                                <button 
                                    type="button"
                                    onClick={() => setMode('local')}
                                    className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${mode === 'local' ? (isLight ? 'bg-white text-slate-900 shadow-md' : 'bg-white text-black shadow-lg') : (isLight ? 'text-slate-400' : 'text-white/30')}`}
                                >
                                    Local
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setMode('amethyst')}
                                    className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all relative ${mode === 'amethyst' ? 'bg-purple-600 text-white shadow-lg' : (isLight ? 'text-slate-400' : 'text-white/30')}`}
                                >
                                    Amethyst ID
                                    <span className="absolute -top-1 -right-1 bg-indigo-500 text-[8px] px-1.5 py-0.5 rounded-full border border-black">LIVE</span>
                                </button>
                            </div>

                            {mode === 'local' ? (
                                <form onSubmit={handleSubmitLocal} className="space-y-6 animate-fadeIn">
                                    <div className="space-y-3">
                                        <label className={`text-[10px] font-black uppercase tracking-[0.3em] ml-4 ${isLight ? 'text-slate-400' : 'text-white/30'}`}>Local Handle</label>
                                        <input 
                                            type="text"
                                            required
                                            placeholder="Enter nickname..."
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className={`w-full border rounded-[2rem] px-8 py-5 focus:border-purple-500/50 transition-all outline-none font-bold ${isLight ? 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-300' : 'bg-white/5 border-white/10 text-white'}`}
                                        />
                                    </div>
                                    <button className="w-full py-6 bg-purple-600 text-white hover:bg-purple-500 font-black rounded-[2rem] transition-all duration-500 shadow-2xl shadow-purple-900/40 uppercase tracking-[0.3em] text-sm">
                                        Quick Start
                                    </button>
                                </form>
                            ) : (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className={`p-8 rounded-[2.5rem] border text-center ${isLight ? 'bg-purple-50 border-purple-100' : 'bg-purple-600/10 border-purple-500/20'}`}>
                                        <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                        </div>
                                        <h3 className={`text-lg font-bold mb-2 ${isLight ? 'text-slate-800' : 'text-white'}`}>Amethyst ID</h3>
                                        <p className={`text-xs leading-relaxed mb-6 ${isLight ? 'text-slate-500' : 'text-white/40'}`}>Connect your launcher to the Amethyst Cloud for synchronized instances and cosmetics.</p>
                                        
                                        <button 
                                            onClick={handleAmethystAuth}
                                            disabled={isConnecting}
                                            className={`w-full py-5 font-black rounded-2xl transition-all duration-500 uppercase tracking-widest text-xs flex items-center justify-center gap-3 ${isLight ? 'bg-slate-900 text-white hover:bg-purple-600' : 'bg-white text-black hover:bg-purple-600 hover:text-white'}`}
                                        >
                                            {isConnecting ? (
                                                <div className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${isLight ? 'border-white' : 'border-black'}`} />
                                            ) : (
                                                <>Sync via Browser</>
                                            )}
                                        </button>
                                    </div>
                                    <p className={`text-center text-[9px] font-bold uppercase tracking-[0.2em] px-6 ${isLight ? 'text-slate-300' : 'text-white/20'}`}>
                                        Cloud synchronization enabled. All instances will be mirrored.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountModal;
