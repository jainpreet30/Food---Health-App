import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
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

  const [streakData, setStreakData] = useState({ currentStreak: 0, history: [false,false,false,false,false,false,false] });

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const { data: dailyData } = await axios.get('http://localhost:5000/api/logs/daily', { headers: { Authorization: `Bearer ${user?.token}` } });
        setDailyLog(dailyData);
        
        const { data: streakRes } = await axios.get('http://localhost:5000/api/logs/streak', { headers: { Authorization: `Bearer ${user?.token}` } });
        setStreakData(streakRes);
      } catch (err) {
        console.error("Log not found, expected for new day.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLog();
  }, []);

  const setWater = async (amount) => {
    try {
      const { data } = await axios.put('http://localhost:5000/api/logs/water', { amount, absolute: true }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setDailyLog(data);
    } catch (err) {
      console.error(err);
    }
  };

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
          <Link to="/meals" className="glass-pill px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
            <Plus size={20} className="text-primary" /> Log Food
          </Link>
          <Link to="/coach" className="bg-primary text-dark font-black px-8 py-3 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center">
            AI COACH
          </Link>
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
          <div className="mt-4 flex gap-1 cursor-pointer">
             {Array.from({ length: 12 }, (_, i) => i + 1).map(i => {
               const glassAmount = i * 250;
               const isFilled = glassAmount <= (dailyLog?.waterIntake || 0);
               return (
                 <div 
                   key={i} 
                   onClick={() => setWater(glassAmount)}
                   className={cn(
                     "h-8 flex-1 rounded-lg transition-all duration-300 hover:bg-blue-300 transform hover:-translate-y-1", 
                     isFilled ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-white/5"
                   )} 
                 />
               );
             })}
          </div>
          <p className="mt-3 text-xs font-bold text-gray-500 text-center">Tap a glass to set your intake</p>
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
                  <span>{dailyLog?.totalMacros?.[macro] || 0}g / {user?.metrics?.targetMacros?.[macro] || 150}g</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      macro === 'protein' ? "bg-emerald-400" : macro === 'carbs' ? "bg-blue-400" : "bg-primary"
                    )}
                    style={{ width: `${Math.min(100, ((dailyLog?.totalMacros?.[macro] || 0) / (user?.metrics?.targetMacros?.[macro] || 150)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consistency & BMI Sidebar */}
        <div className="flex flex-col gap-6">
            
          {/* Consistency Streak */}
          <div className="glass p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center space-y-3 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/20 rounded-full blur-[40px] -mr-4 -mt-4"></div>
             <Flame className="text-orange-500 animate-pulse" size={48} />
             <div className="space-y-1">
                 <h3 className="text-4xl font-black gradient-text">{streakData.currentStreak} {streakData.currentStreak === 1 ? 'Day' : 'Days'}</h3>
                 <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Consistency Streak</p>
             </div>
             <div className="flex gap-2 mt-2">
                 {['M','T','W','T','F','S','S'].map((day, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${streakData.history[i] ? 'bg-orange-500 text-dark' : 'bg-white/5 text-gray-500'}`}>
                        {day}
                    </div>
                 ))}
             </div>
          </div>

          {/* BMI Tracker */}
          <div className="glass p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center space-y-2 relative overflow-hidden">
             <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-primary to-orange-500 opacity-50"></div>
             <Target className="text-primary mb-2" size={32} />
             <div className="space-y-0">
                 <h3 className="text-3xl font-black">{user?.metrics?.bmi ? user.metrics.bmi.toFixed(1) : '--'}</h3>
                 <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Current BMI</p>
             </div>
             {user?.metrics?.bmi && (
                 <p className="text-xs font-bold mt-2 px-3 py-1 glass-pill rounded-full text-emerald-400">
                     {user.metrics.bmi >= 18.5 && user.metrics.bmi <= 24.9 ? "Perfectly Healthy" : "Keep working on your goals!"}
                 </p>
             )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
