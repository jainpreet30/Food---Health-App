import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Droplets, Flame, Target, Utensils, Plus, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

const StatCard = ({ title, value, target, unit, icon: Icon, color, children }) => (
  <div className="glass p-6 rounded-3xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
    <div className={cn("absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-10", color)} />
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-2xl", color.replace('bg-', 'bg-opacity-20 bg-'))}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      {target && (
        <span className="text-xs font-bold px-3 py-1 glass-pill rounded-full text-gray-400">
          Target: {target}{unit}
        </span>
      )}
    </div>
    <div className="space-y-1">
      <h3 className="text-gray-400 font-medium text-sm">{title}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-black">{value}</span>
        <span className="text-gray-500 text-sm font-bold uppercase">{unit}</span>
      </div>
    </div>
    {children}
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [dailyLog, setDailyLog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/logs/daily');
        setDailyLog(data);
      } catch (err) {
        console.error("Log not found, expected for new day.");
      } finally {
        setLoading(false);
      }
    };
    fetchLog();
  }, []);

  const data = [
    { name: 'Consumed', value: dailyLog?.totalCalories || 0, color: '#fbbf24' },
    { name: 'Remaining', value: Math.max(0, (user?.metrics?.targetCalories || 2000) - (dailyLog?.totalCalories || 0)), color: '#1f2937' },
  ];

  if (loading) return <div className="h-screen flex items-center justify-center"><Zap className="animate-glow text-primary" size={48} /></div>;

  const targetCals = user?.metrics?.targetCalories || 2000;
  const consumedCals = dailyLog?.totalCalories || 0;
  const progress = Math.min(100, (consumedCals / targetCals) * 100);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom duration-700">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black mb-2">Hello, <span className="gradient-text">{user?.name || 'Warrior'}</span></h1>
          <p className="text-gray-400 text-lg">Today is a great day to crush your health goals.</p>
        </div>
        <div className="flex gap-3">
          <button className="glass-pill px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
            <Plus size={20} className="text-primary" /> Log Food
          </button>
          <button className="bg-primary text-dark font-black px-8 py-3 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
            AI COACH
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calorie Ring Stat */}
        <StatCard title="Calories" value={consumedCals} target={targetCals} unit="kcal" icon={Flame} color="bg-amber-400">
          <div className="mt-6 h-4 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary animate-glow" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </StatCard>

        {/* Water Intake */}
        <StatCard title="Hydration" value={(dailyLog?.waterIntake || 0) / 1000} target={3} unit="L" icon={Droplets} color="bg-blue-400">
          <div className="mt-4 flex gap-1">
             {[1,2,3,4,5,6,7,8].map(i => (
               <div key={i} className={cn("h-8 flex-1 rounded-lg", i <= (dailyLog?.waterIntake || 0) / 250 ? "bg-blue-500" : "bg-white/5")} />
             ))}
          </div>
        </StatCard>

        {/* Exercise */}
        <StatCard title="Activity" value={dailyLog?.exercise?.length || 0} unit="Sessions" icon={Zap} color="bg-emerald-400">
           <p className="mt-4 text-xs font-bold text-emerald-400 uppercase tracking-widest">Active today</p>
        </StatCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Macros Breakdown */}
        <div className="lg:col-span-2 glass p-8 rounded-[2.5rem]">
          <h2 className="text-2xl font-black mb-8">Macros Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['protein', 'carbs', 'fats'].map(macro => (
              <div key={macro} className="space-y-3">
                <div className="flex justify-between text-sm font-bold uppercase tracking-wider text-gray-400">
                  <span>{macro}</span>
                  <span>{dailyLog?.totalMacros[macro] || 0}g / {user?.metrics?.targetMacros[macro] || 150}g</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      macro === 'protein' ? "bg-emerald-400" : macro === 'carbs' ? "bg-blue-400" : "bg-primary"
                    )}
                    style={{ width: `${Math.min(100, ((dailyLog?.totalMacros[macro] || 0) / (user?.metrics?.targetMacros[macro] || 150)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weight Trend Placeholder (Post-MVP) */}
        <div className="glass p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center space-y-4">
          <Target className="text-gray-700" size={64} />
          <h3 className="text-xl font-black">Progress Tracking</h3>
          <p className="text-gray-500 text-sm">Weight trends will appear here as you log daily data.</p>
          <button className="glass-pill px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
            Set Goal
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
