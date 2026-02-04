
import React, { useState } from 'react';
import { LauncherSettings } from '../types';
import { t } from '../translations';

interface SettingsProps {
    settings: LauncherSettings;
    onUpdate: (s: LauncherSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
    const isLight = settings.theme === 'light';
    const lang = (settings.language as 'en' | 'ru') || 'en';
    
    const handleChange = (key: keyof LauncherSettings, value: any) => {
        onUpdate({ ...settings, [key]: value });
    };

    const [isOptimizing, setIsOptimizing] = useState(false);

    const handleOpenModsFolder = () => {
        // @ts-ignore
        if (window.electron && window.electron.openFolder) {
            // @ts-ignore
            window.electron.openFolder(settings.gamePath);
        } else {
            console.log('Simulating: Opening mods folder at', settings.gamePath);
            alert('Opening Mods Folder...');
        }
    };

    const handleOptimize = async () => {
        if (!confirm('Применить рекомендованные оптимизации Minecraft?\nЭто изменит файл options.txt в вашей папке .minecraft.')) return;
        setIsOptimizing(true);
        try {
            // @ts-ignore
            if (window.electron && window.electron.optimizeMinecraft) {
                // @ts-ignore
                const res = await window.electron.optimizeMinecraft();
                if (res && res.success) {
                    alert('Оптимизация применена успешно. Путь: ' + (res.path || 'unknown'));
                } else {
                    alert('Оптимизация не удалась: ' + (res?.message || 'unknown'));
                }
            } else {
                alert('Оптимизация недоступна в этом окружении.');
            }
        } catch (e) {
            console.error('Optimize error', e);
            alert('Ошибка при применении оптимизации: ' + (e?.message || String(e)));
        } finally {
            setIsOptimizing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h2 className={`text-4xl font-black italic uppercase tracking-tighter mb-10 ${isLight ? 'text-slate-800' : 'text-white'}`}>{t('settings', lang)}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Hardware */}
                <section className={`glass p-10 rounded-[3rem] border ${isLight ? 'border-slate-300/40' : 'border-white/5'}`}>
                    <h3 className={`text-xl font-bold mb-8 flex items-center gap-3 ${isLight ? 'text-slate-700' : 'text-white'}`}>
                        <div className="p-2 bg-purple-500/20 rounded-xl text-purple-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                        </div>
                        {t('performance', lang)}
                    </h3>
                    
                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between mb-3">
                                <label className={`text-[10px] font-black uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-white/30'}`}>{t('ramAllocation', lang)}</label>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest block ml-1 ${isLight ? 'text-slate-400' : 'text-white/30'}`}>{t('javaPath', lang)}</label>
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

                        {/* NEW: Open Mods Folder Button */}
                        <div className="space-y-3 pt-2">
                            <label className={`text-[10px] font-black uppercase tracking-widest block ml-1 ${isLight ? 'text-slate-400' : 'text-white/30'}`}>{t('gameManagement', lang)}</label>
                            <div className="flex gap-2">
                                <button 
                                    onClick={handleOpenModsFolder}
                                    className={`flex-1 border rounded-2xl px-3 py-4 text-xs flex items-center justify-center gap-2 transition-all group/folder shadow-sm
                                        ${isLight 
                                            ? 'bg-white border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-slate-50 shadow-slate-200/50' 
                                            : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                                >
                                    <div className={`p-1.5 rounded-lg transition-colors ${isLight ? 'bg-purple-100 text-purple-600' : 'bg-purple-500/20 text-purple-400'}`}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                        </svg>
                                    </div>
                                    <span className="font-bold tracking-tight hidden sm:inline text-[10px]">{t('openModsFolder', lang)}</span>
                                </button>

                                <button 
                                    onClick={handleOptimize}
                                    disabled={isOptimizing}
                                    className={`flex-1 border rounded-2xl px-3 py-4 text-xs flex items-center justify-center gap-2 transition-all group/opt shadow-sm
                                        ${isLight 
                                            ? 'bg-white border-slate-200 text-slate-700 hover:border-green-300 hover:bg-slate-50 shadow-slate-200/50' 
                                            : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                                >
                                    <div className={`p-1.5 rounded-lg transition-colors ${isLight ? 'bg-green-100 text-green-600' : 'bg-green-500/20 text-green-400'}`}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12l5 5L20 7" />
                                        </svg>
                                    </div>
                                    <span className="font-bold tracking-tight hidden sm:inline text-[10px]">{t('optimizeMinecraft', lang)}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Launcher Behavior */}
                <section className={`glass p-10 rounded-[3rem] border ${isLight ? 'border-slate-300/40' : 'border-white/5'}`}>
                    <h3 className={`text-xl font-bold mb-8 flex items-center gap-3 ${isLight ? 'text-slate-700' : 'text-white'}`}>
                        <div className="p-2 bg-purple-500/20 rounded-xl text-purple-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                        </div>
                        {t('launcherOptions', lang)}
                    </h3>
                    
                    <div className="space-y-3">
                        <ToggleButton 
                            label={t('discordRPC', lang)}
                            active={settings.rpcEnabled} 
                            isLight={isLight}
                            onClick={() => handleChange('rpcEnabled', !settings.rpcEnabled)} 
                        />
                        <div className={`pt-4 mt-4 border-t ${isLight ? 'border-slate-300/40' : 'border-white/5'}`}>
                            <label className={`text-[10px] font-black uppercase tracking-widest mb-4 block ${isLight ? 'text-slate-400' : 'text-white/30'}`}>{t('versionFilters', lang)}</label>
                            <ToggleButton 
                                label={t('showSnapshots', lang)}
                                active={settings.showSnapshots} 
                                isLight={isLight}
                                onClick={() => handleChange('showSnapshots', !settings.showSnapshots)} 
                            />
                            <ToggleButton 
                                label={t('showOldVersions', lang)}
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

const ToggleButton = ({ label, active, onClick, isLight }: { label: string, active: boolean, onClick: () => void, isLight: boolean }) => (
    <div 
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
        className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer group ${isLight ? 'bg-slate-300/20 hover:bg-slate-300/40' : 'bg-white/5 hover:bg-white/10'}`}
    >
        <span className={`text-sm font-bold transition-colors ${isLight ? 'text-slate-500 group-hover:text-slate-800' : 'text-white/60 group-hover:text-white'}`}>{label}</span>
        <div className={`w-11 h-6 rounded-full transition-all relative ${active ? 'bg-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.3)]' : isLight ? 'bg-slate-400/40' : 'bg-white/10'}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${active ? 'left-6' : 'left-1'}`} />
        </div>
    </div>
);

export default Settings;
