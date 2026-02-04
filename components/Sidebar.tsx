import React from 'react';
import { Page, User } from '../types';
import { t } from '../translations';

interface SidebarProps {
    activePage: Page;
    onPageChange: (page: Page) => void;
    onOpenProfile: () => void;
    user: User | null;
    rpcActive?: boolean;
    theme?: 'dark' | 'light';
    onToggleTheme?: () => void;
    language?: 'en' | 'ru';
    onToggleLanguage?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
    activePage, 
    onPageChange, 
    onOpenProfile, 
    user, 
    rpcActive, 
    theme, 
    onToggleTheme,
    language = 'en',
    onToggleLanguage,
}) => {
    const navItems = [
        { id: Page.HOME, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { id: Page.INSTANCES, icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
        { id: Page.MODS, icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z' },
        { id: Page.NEWS, icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
        { id: Page.SETTINGS, icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    ];

    const labels: Record<Page, string> = {
        [Page.HOME]: t('home', language),
        [Page.INSTANCES]: t('instances', language),
        [Page.MODS]: t('mods', language),
        [Page.SETTINGS]: t('settings', language),
        [Page.NEWS]: t('news', language),
    };

    const isLight = theme === 'light';

    return (
        <aside className={`w-20 transition-all-500 flex flex-col items-center py-6 border-r border-white/5 backdrop-blur-xl ${isLight ? 'bg-white/40 border-slate-200' : 'bg-[#0c0c0e]/40'}`}>
            <div className="flex-1 flex flex-col gap-4">
                {navItems.map((item) => {
                    const isDisabled = item.id === Page.MODS || item.id === Page.NEWS || item.id === Page.INSTANCES;
                    return (
                    <button
                        key={item.id}
                        onClick={() => !isDisabled && onPageChange(item.id)}
                        disabled={isDisabled}
                        className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 group relative
                            ${isDisabled 
                                ? 'opacity-30 cursor-not-allowed text-white/20' 
                                : activePage === item.id 
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' 
                                : isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-black/5' : 'text-white/40 hover:text-white hover:bg-white/5'
                            }`}
                        title={isDisabled ? 'Скоро будет добавлено' : ''}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                        </svg>
                        
                        {item.id === Page.SETTINGS && rpcActive && (
                            <div className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
                            </div>
                        )}

                        <div className={`absolute left-16 px-2 py-1 rounded font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 text-[10px] ${isLight ? 'bg-slate-900 text-white' : 'bg-white text-black'}`}>
                            {labels[item.id]}
                        </div>
                    </button>
                    );
                })}

                <button
                    onClick={onToggleTheme}
                    className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-500 group relative mt-4
                        ${isLight ? 'text-orange-500 bg-orange-500/10 hover:bg-orange-500/20' : 'text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20'}`}
                >
                    <div className={`transition-transform duration-700 ${isLight ? 'rotate-0' : 'rotate-[360deg]'}`}>
                        {isLight ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                        )}
                    </div>
                    <div className={`absolute left-16 px-2 py-1 rounded font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 text-[10px] ${isLight ? 'bg-slate-900 text-white' : 'bg-white text-black'}`}>
                        {isLight 
                            ? t('lightMode', language) 
                            : t('darkMode', language)}
                    </div>
                </button>
                
                <button
                    onClick={onToggleLanguage}
                    className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-500 group relative mt-2
                        ${isLight ? 'text-slate-700 bg-slate-200/60 hover:bg-slate-300' : 'text-white bg-white/10 hover:bg-white/20'}`}
                >
                    <span className="text-xs font-black tracking-[0.15em]">
                        {language === 'ru' ? 'RU' : 'EN'}
                    </span>
                    <div className={`absolute left-16 px-2 py-1 rounded font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 text-[10px] ${isLight ? 'bg-slate-900 text-white' : 'bg-white text-black'}`}>
                        {language === 'ru' ? 'Язык: Русский' : 'Language: English'}
                    </div>
                </button>
            </div>

            <button 
                onClick={onOpenProfile}
                className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all duration-300 relative group ${isLight ? 'border-slate-200 hover:border-purple-500' : 'border-white/10 hover:border-purple-500'}`}
            >
                {user ? (
                    <img 
                        src={`https://minotar.net/helm/${user.username}/48`} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className={`w-full h-full flex items-center justify-center ${isLight ? 'bg-slate-100 text-slate-400' : 'bg-white/5 text-white/40'}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                )}
                {user && <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-[#0c0c0e] rounded-full ${user.type === 'amethyst' ? 'bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,1)]' : 'bg-green-500'}`} />}
            </button>
        </aside>
    );
};

export default Sidebar;
