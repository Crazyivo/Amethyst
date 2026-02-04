
import React from 'react';

const TitleBar = () => {
    const handleMinimize = () => {
        window.electron?.minimizeWindow();
    };

    const handleClose = () => {
        window.electron?.closeWindow();
    };

    return (
        <div className="titlebar h-10 flex items-center justify-between px-4 z-50 bg-[#0c0c0e]/80 border-b border-white/5 backdrop-blur-md">
            <div className="flex items-center gap-3">
                <img 
                    src="https://raw.githubusercontent.com/ai-launcher/assets/main/amethyst_cube.png" 
                    onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%239333ea' d='M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z' /%3E%3Ctext x='50%25' y='60%25' font-family='Arial' font-size='40' fill='white' text-anchor='middle' font-weight='bold'%3EA%3C/text%3E%3C/svg%3E";
                    }}
                    className="w-6 h-6 object-contain drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" 
                    alt="Logo"
                />
                <span className="text-[10px] font-black tracking-[0.3em] text-white/70 uppercase">Amethyst Engine</span>
            </div>
            
            <div className="no-drag flex items-center gap-1">
                <button 
                    onClick={handleMinimize}
                    className="p-1.5 hover:bg-white/10 rounded transition-colors text-white/50 hover:text-white"
                >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/></svg>
                </button>
                <button 
                    onClick={handleClose}
                    className="p-1.5 hover:bg-red-500 rounded transition-colors text-white/50 hover:text-white"
                >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
            </div>
        </div>
    );
};

export default TitleBar;
