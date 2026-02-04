import React, { useState, useEffect } from 'react';
import { Page, User, LauncherSettings, Instance } from './types';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Instances from './pages/Instances';
import Settings from './pages/Settings';
import News from './pages/News';
import Mods from './pages/Mods';
import TitleBar from './components/TitleBar';
import AccountModal from './components/AccountModal';
import { discordRPC } from './discordRPC';

const App: React.FC = () => {
    const [activePage, setActivePage] = useState<Page>(Page.HOME);
    const [selectedInstance, setSelectedInstance] = useState<Instance | null>(null);
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('amethyst_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [isAccountModalOpen, setAccountModalOpen] = useState(false);
    
    const [instances, setInstances] = useState<Instance[]>(() => {
        const defaultInstances = [
            { id: '1', name: "GOLDSHIELD", version: "1.21.11", type: "Fabric", lastPlayed: "Never", icon: "⚡", color: "from-yellow-500/20 to-amber-500/20" },
            { id: '2', name: "Survival 1.20.1", version: "1.20.1", type: "Fabric", lastPlayed: "2 hours ago", icon: "🧊", color: "from-green-500/20 to-emerald-500/20" },
            { id: '3', name: "RLCraft v2.9", version: "1.12.2", type: "Forge", lastPlayed: "Yesterday", icon: "🔥", color: "from-red-500/20 to-orange-500/20" }
        ];
        
        const saved = localStorage.getItem('amethyst_instances');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Update GOLDSHIELD version to match default
            const goldshieldIndex = parsed.findIndex((inst: Instance) => inst.name === 'GOLDSHIELD');
            if (goldshieldIndex >= 0) {
                parsed[goldshieldIndex] = defaultInstances[0];
                // Immediately save updated instances back to localStorage (synchronously)
                localStorage.setItem('amethyst_instances', JSON.stringify(parsed));
                return parsed;
            } else {
                // If GOLDSHIELD doesn't exist, add it
                const updated = [defaultInstances[0], ...parsed];
                localStorage.setItem('amethyst_instances', JSON.stringify(updated));
                return updated;
            }
        }
        // First time - save defaults to localStorage
        localStorage.setItem('amethyst_instances', JSON.stringify(defaultInstances));
        return defaultInstances;
    });

    const [settings, setSettings] = useState<LauncherSettings>(() => {
        const saved = localStorage.getItem('amethyst_settings');
        const defaultGamePath = process.env.APPDATA 
            ? `${process.env.APPDATA}\\.amethyst\\minecraft`
            : `${process.env.HOME}\\.amethyst\\minecraft`;

        const baseDefaults: LauncherSettings = {
            ram: 4096,
            javaPath: '',
            closeOnLaunch: true,
            gamePath: defaultGamePath,
            theme: 'dark',
            rpcEnabled: true,
            showSnapshots: false,
            showOldVersions: false,
            language: 'en',
        };

        if (saved) {
            const parsed = JSON.parse(saved);
            return {
                ...baseDefaults,
                ...parsed,
                language: parsed.language || 'en',
            };
        }

        return baseDefaults;
    });

    useEffect(() => {
        // @ts-ignore
        if (!window.electron) {
            // @ts-ignore
            window.electron = {
                updatePresence: (data: any) => console.log('RPC Update:', data),
                launchGame: (config: any) => console.log('Launching with config:', config),
                openFolder: (path: string) => alert(`Opening system folder: ${path}`),
                minimizeWindow: () => console.log('Minimize'),
                closeWindow: () => console.log('Close'),
            };
        }
    }, []);

    const toggleTheme = () => {
        setSettings(prev => ({
            ...prev,
            theme: prev.theme === 'dark' ? 'light' : 'dark'
        }));
    };

    const toggleLanguage = () => {
        setSettings(prev => ({
            ...prev,
            language: prev.language === 'ru' ? 'en' : 'ru',
        }));
    };

    useEffect(() => {
        localStorage.setItem('amethyst_settings', JSON.stringify(settings));
        if (settings.theme === 'light') {
            document.documentElement.classList.add('theme-light');
        } else {
            document.documentElement.classList.remove('theme-light');
        }

        // Update Discord RPC state
        console.log(`🎮 Discord RPC: ${settings.rpcEnabled ? 'enabled' : 'disabled'}`);
        discordRPC.setEnabled(settings.rpcEnabled);
        if (settings.rpcEnabled) {
            console.log(`📍 Current page: ${activePage}, Language: ${settings.language}`);
            discordRPC.updateBrowsingPresence(String(activePage), settings.theme, settings.language);
        } else {
            discordRPC.clearPresence();
        }
    }, [settings, activePage, selectedInstance]);

    useEffect(() => {
        localStorage.setItem('amethyst_instances', JSON.stringify(instances));
    }, [instances]);

    useEffect(() => {
        if (user) localStorage.setItem('amethyst_user', JSON.stringify(user));
        else localStorage.removeItem('amethyst_user');
    }, [user]);

    // Cleanup Discord RPC on app close
    useEffect(() => {
        const handleBeforeUnload = () => {
            console.log('🔌 App closing - clearing Discord RPC');
            discordRPC.clearPresence();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            discordRPC.clearPresence();
        };
    }, []);

    const isLight = settings.theme === 'light';

    return (
        <div className={`flex flex-col h-screen relative overflow-hidden transition-all-500 ${isLight ? 'text-slate-700' : 'text-white bg-[#0c0c0e]'}`}>
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img 
                    src={isLight 
                        ? "https://images.unsplash.com/photo-1518655061766-48c257ee899e?auto=format&fit=crop&q=80&w=1920" 
                        : "https://images.unsplash.com/photo-1634919209701-b2d9d395101d?auto=format&fit=crop&q=80&w=1920"
                    }
                    onError={(e) => {
                        // Fallback на solid цвет при ошибке загрузки
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                    className={`w-full h-full object-cover filter blur-[4px] scale-105 transition-all duration-1000 ${isLight ? 'opacity-30' : 'opacity-40'}`}
                    alt="background"
                />
                <div className={`absolute inset-0 transition-all duration-500 ${isLight ? 'bg-gradient-to-b from-slate-200/50 via-transparent to-slate-200/80' : 'bg-gradient-to-b from-[#0c0c0e]/60 via-transparent to-[#0c0c0e]'}`} />
                <div className={`absolute inset-0 transition-all duration-500 ${isLight ? 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(226,228,233,0.7)_100%)]' : 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(12,12,14,0.8)_100%)]'}`} />
            </div>

            <TitleBar />
            <div className="flex flex-1 z-10 overflow-hidden">
                <Sidebar 
                    activePage={activePage} 
                    onPageChange={setActivePage} 
                    onOpenProfile={() => setAccountModalOpen(true)}
                    user={user}
                    rpcActive={settings.rpcEnabled}
                    theme={settings.theme}
                    onToggleTheme={toggleTheme}
                    language={settings.language}
                    onToggleLanguage={toggleLanguage}
                />
                <main className="flex-1 overflow-y-auto relative">
                    {activePage === Page.HOME && <Home user={user} settings={settings} selectedInstance={selectedInstance} onResetInstance={() => setSelectedInstance(null)} onToggleLanguage={toggleLanguage} />}
                    {activePage === Page.INSTANCES && <Instances theme={settings.theme} instances={instances} onUpdateInstances={setInstances} onPlay={(i) => { setSelectedInstance(i); setActivePage(Page.HOME); }} />}
                    {activePage === Page.MODS && <Mods theme={settings.theme} language={settings.language as 'en' | 'ru'} />}
                    {activePage === Page.SETTINGS && <Settings settings={settings} onUpdate={setSettings} />}
                    {activePage === Page.NEWS && <News theme={settings.theme} />}
                </main>
            </div>

            {isAccountModalOpen && (
                <AccountModal 
                    user={user} 
                    theme={settings.theme}
                    language={settings.language as 'en' | 'ru'}
                    onClose={() => setAccountModalOpen(false)} 
                    onLogin={(u) => setUser(u)}
                    onLogout={() => setUser(null)}
                />
            )}
        </div>
    );
};

export default App;
