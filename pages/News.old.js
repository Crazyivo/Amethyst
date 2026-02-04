
import React from 'react';

const News = ({ theme }) => {
    const isLight = theme === 'light';
    const news = [
        {
            id: 1,
            title: "Amethyst v2.5.0 Released",
            description: "A major update to our launcher core including faster asset downloads and native Silicon support.",
            imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
            date: "Today"
        },
        {
            id: 2,
            title: "Minecraft 1.21 Tricky Trials",
            description: "Explore the new trial chambers and master the mace in the latest Minecraft update.",
            imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800",
            date: "June 13, 2024"
        },
        {
            id: 3,
            title: "Performance Modpacks",
            description: "We've added curated performance modpacks for 1.20.x versions to the library.",
            imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
            date: "Last Week"
        }
    ];

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="flex justify-between items-center mb-10">
                <h2 className={`text-3xl font-black italic uppercase tracking-tighter ${isLight ? 'text-slate-900' : 'text-white'}`}>Community News</h2>
                <div className="flex gap-2">
                    <button className={`p-2 rounded-lg transition-colors ${isLight ? 'bg-black/5 hover:bg-black/10 text-slate-600' : 'bg-white/5 hover:bg-white/10 text-white'}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg></button>
                    <button className={`p-2 rounded-lg transition-colors ${isLight ? 'bg-black/5 hover:bg-black/10 text-slate-600' : 'bg-white/5 hover:bg-white/10 text-white'}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {news.map(item => (
                    <article key={item.id} className={`glass rounded-[2rem] overflow-hidden group cursor-pointer hover:-translate-y-2 transition-transform duration-500 ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
                        <div className="h-48 relative overflow-hidden">
                            <img 
                                src={item.imageUrl} 
                                alt={item.title} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute top-4 left-4 bg-purple-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                {item.date}
                            </div>
                        </div>
                        <div className="p-8">
                            <h3 className={`text-xl font-bold mb-4 group-hover:text-purple-400 transition-colors ${isLight ? 'text-slate-800' : 'text-white'}`}>{item.title}</h3>
                            <p className={`text-sm leading-relaxed mb-6 line-clamp-2 ${isLight ? 'text-slate-500' : 'text-white/50'}`}>{item.description}</p>
                            <button className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 group/btn ${isLight ? 'text-slate-900' : 'text-white'}`}>
                                Read Full Story 
                                <svg className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default News;
