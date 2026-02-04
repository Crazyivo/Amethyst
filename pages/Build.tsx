
import React from 'react';

interface BuildProps {
    theme?: 'dark' | 'light';
}

const Build: React.FC<BuildProps> = ({ theme }) => {
    const isLight = theme === 'light';
    
    // @ts-ignore
    const isElectron = !!window.electron && !window.electron.__isMock;

    return (
        <div className="max-w-4xl mx-auto py-12 animate-fadeIn">
            <div className="mb-12">
                <h2 className={`text-5xl font-black italic uppercase tracking-tighter mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Build Center
                </h2>
                <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isElectron ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
                        {isElectron ? 'Native Mode Active' : 'Web Preview Mode'}
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-white/20'}`}>
                        V3.0.0 Stable Build
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Step 1 */}
                <div className={`glass p-10 rounded-[3rem] border ${isLight ? 'border-slate-200 bg-white' : 'border-white/5 bg-[#0c0c0e]/50'}`}>
                    <div className="flex items-start gap-8">
                        <div className="w-16 h-16 rounded-[2rem] bg-purple-600 flex items-center justify-center text-white font-black text-2xl shrink-0 shadow-lg shadow-purple-900/40">
                            1
                        </div>
                        <div>
                            <h3 className={`text-2xl font-black mb-4 ${isLight ? 'text-slate-800' : 'text-white'}`}>Подготовка окружения</h3>
                            <p className={`text-sm leading-relaxed mb-6 ${isLight ? 'text-slate-500' : 'text-white/50'}`}>
                                Для работы десктопной версии тебе нужна среда Node.js. Она позволяет лаунчеру выходить за рамки браузера и управлять файлами игры.
                            </p>
                            <a 
                                href="https://nodejs.org/" 
                                target="_blank" 
                                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/10 text-purple-400 rounded-2xl font-bold text-xs hover:bg-purple-500 hover:text-white transition-all border border-purple-500/20 uppercase tracking-widest"
                            >
                                Скачать Node.js
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Step 2 */}
                <div className={`glass p-10 rounded-[3rem] border ${isLight ? 'border-slate-200 bg-white' : 'border-white/5 bg-[#0c0c0e]/50'}`}>
                    <div className="flex items-start gap-8">
                        <div className="w-16 h-16 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shrink-0 shadow-lg shadow-indigo-900/40">
                            2
                        </div>
                        <div className="flex-1">
                            <h3 className={`text-2xl font-black mb-4 ${isLight ? 'text-slate-800' : 'text-white'}`}>Установка зависимостей</h3>
                            <p className={`text-sm leading-relaxed mb-6 ${isLight ? 'text-slate-500' : 'text-white/50'}`}>
                                Открой терминал в папке проекта и выполни команду для загрузки ядра Electron:
                            </p>
                            <div className="bg-black/80 rounded-3xl p-6 font-mono text-sm text-green-400 border border-white/5 shadow-inner relative group">
                                <span className="text-white/20 select-none mr-4">$</span>
                                <span>npm install</span>
                                <button className="absolute right-6 top-6 text-white/20 hover:text-white transition-colors uppercase text-[10px] font-black">Copy</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step 3 */}
                <div className={`glass p-10 rounded-[3rem] border ${isLight ? 'border-slate-200 bg-white' : 'border-white/5 bg-[#0c0c0e]/50'}`}>
                    <div className="flex items-start gap-8">
                        <div className="w-16 h-16 rounded-[2rem] bg-emerald-600 flex items-center justify-center text-white font-black text-2xl shrink-0 shadow-lg shadow-emerald-900/40">
                            3
                        </div>
                        <div className="flex-1">
                            <h3 className={`text-2xl font-black mb-4 ${isLight ? 'text-slate-800' : 'text-white'}`}>Запуск лаунчера</h3>
                            <p className={`text-sm leading-relaxed mb-6 ${isLight ? 'text-slate-500' : 'text-white/50'}`}>
                                Теперь ты можешь запустить лаунчер как настоящее приложение одним кликом:
                            </p>
                            <div className="bg-black/80 rounded-3xl p-6 font-mono text-sm text-green-400 border border-white/5 shadow-inner relative group">
                                <span className="text-white/20 select-none mr-4">$</span>
                                <span>npm start</span>
                                <button className="absolute right-6 top-6 text-white/20 hover:text-white transition-colors uppercase text-[10px] font-black">Copy</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final Step: Packaging */}
                <div className={`p-1 w-full rounded-[3.5rem] bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 shadow-2xl mt-8`}>
                    <div className={`p-10 rounded-[3.4rem] ${isLight ? 'bg-white' : 'bg-[#0c0c0e]'} flex flex-col items-center text-center`}>
                        <h4 className={`text-3xl font-black italic mb-4 uppercase tracking-tighter ${isLight ? 'text-slate-900' : 'text-white'}`}>Сборка в .EXE</h4>
                        <p className={`text-sm max-w-xl mb-8 ${isLight ? 'text-slate-500' : 'text-white/40'}`}>
                            Когда дизайн готов, добавь <code className="bg-white/10 px-2 py-1 rounded">electron-builder</code> в package.json, чтобы превратить папку в один исполняемый файл для твоих игроков.
                        </p>
                        <button className={`px-12 py-5 bg-white text-black rounded-3xl font-black uppercase tracking-[0.3em] text-sm hover:scale-105 transition-transform shadow-xl`}>
                            Подробнее о дистрибуции
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Build;
