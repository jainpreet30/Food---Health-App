import React from 'react';
import { Activity, Dumbbell, Zap, Target, Star, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

const Workout = () => {
  const levels = [
    { id: 'beginner', label: 'Beginner', icon: '🌱', duration: '15-20 min' },
    { id: 'intermediate', label: 'Intermediate', icon: '🔥', duration: '30-45 min' },
    { id: 'advanced', label: 'Advanced', icon: '⚡', duration: '60+ min' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header>
        <h1 className="text-4xl font-black">Training <span className="gradient-text">Zone</span></h1>
        <p className="text-gray-400">Personalized workout plans to crush your targets.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {levels.map((level) => (
          <div key={level.id} className="glass p-8 rounded-[2.5rem] relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer">
            <div className="absolute -top-4 -right-4 text-7xl opacity-5 group-hover:scale-125 transition-all">
              {level.icon}
            </div>
            <div className="p-3 bg-white/5 rounded-2xl w-fit mb-6 text-primary group-hover:bg-primary group-hover:text-dark transition-all">
              <Dumbbell size={24} />
            </div>
            <h3 className="text-2xl font-black mb-1">{level.label}</h3>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-6">{level.duration}</p>
            <button className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
               Start Session <ChevronRight size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <h2 className="text-2xl font-black flex items-center gap-3">
             <Star className="text-primary" /> Recommended Today
           </h2>
           <div className="glass p-10 rounded-[3rem] bg-gradient-to-br from-primary/10 to-transparent border-primary/20 relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="p-4 bg-primary text-dark font-black rounded-2xl w-fit flex items-center gap-2">
                   <Target size={20} /> FAT BURNER PRO
                </div>
                <h3 className="text-4xl font-black max-w-sm leading-tight">High Intensity Interva Training (HIIT)</h3>
                <div className="flex gap-8 text-sm font-bold uppercase tracking-widest text-gray-400">
                   <span>30 Minutes</span>
                   <span>450 Calories</span>
                </div>
                <button className="bg-white text-dark font-black px-10 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all">
                   START WORKOUT
                </button>
              </div>
              <div className="absolute -right-20 -bottom-20 opacity-10">
                 <Zap size={300} className="text-primary" />
              </div>
           </div>
        </div>

        <div className="glass p-8 rounded-[3rem] space-y-6">
           <h2 className="text-2xl font-black flex items-center gap-3">
             <Activity className="text-gray-600" /> Stats
           </h2>
           <div className="space-y-4">
              {[
                { label: 'Weekly Active Time', value: '120 min', color: 'text-emerald-400' },
                { label: 'Avg Intensity', value: 'High', color: 'text-primary' },
                { label: 'Consistency', value: '92%', color: 'text-blue-400' },
              ].map((stat) => (
                <div key={stat.label} className="p-5 bg-white/5 rounded-3xl border border-white/5">
                   <p className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">{stat.label}</p>
                   <p className={cn("text-2xl font-black", stat.color)}>{stat.value}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Workout;
