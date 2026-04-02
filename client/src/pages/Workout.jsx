import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Dumbbell, Zap, Target, Star, ChevronRight, X, CheckCircle2, Clock, Flame } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const Workout = () => {
  const { user } = useAuth();
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Custom states inside the modal
  const [customDuration, setCustomDuration] = useState(30);

  // Daily Log for dynamic stats
  const [dailyLog, setDailyLog] = useState(null);

  const fetchDailyLog = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/logs/daily');
      setDailyLog(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDailyLog();
  }, []);

  const levels = [
    { id: 'beginner', label: 'Beginner Flow', icon: '🌱', defaultDuration: 15, intensity: 'low' },
    { id: 'intermediate', label: 'Intermediate Core', icon: '🔥', defaultDuration: 30, intensity: 'moderate' },
    { id: 'advanced', label: 'Advanced Grind', icon: '⚡', defaultDuration: 60, intensity: 'high' },
  ];

  const handleStartWorkout = (workout) => {
    setSelectedWorkout(workout);
    setCustomDuration(workout.defaultDuration);
    setSuccess(false);
  };

  const getComputedCalories = (duration, intensity) => {
      const multiplier = intensity === 'high' ? 15 : intensity === 'moderate' ? 10 : 6;
      return duration * multiplier;
  };

  const submitWorkout = async () => {
    setLoading(true);
    try {
      const type = selectedWorkout.id === 'hiit' ? 'High Intensity Interval Training' : selectedWorkout.label;
      const duration = parseInt(customDuration) || 30;
      const intensity = selectedWorkout.intensity || 'high';
      const caloriesBurned = getComputedCalories(duration, intensity);

      const res = await axios.post('http://localhost:5000/api/logs/exercise', {
        type, duration, intensity, caloriesBurned
      });

      if (res.status === 200) {
        setSuccess(true);
        fetchDailyLog(); // refresh stats immediately
        setTimeout(() => {
          setSelectedWorkout(null);
          setSuccess(false);
        }, 1500);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to log workout');
    } finally {
      setLoading(false);
    }
  };

  // Compile Dynamic Data
  const exerciseList = dailyLog?.exercise || [];
  const totalActiveMinutes = exerciseList.reduce((acc, curr) => acc + curr.duration, 0);
  const totalBurnedCalories = exerciseList.reduce((acc, curr) => acc + curr.caloriesBurned, 0);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 relative">
      <header>
        <h1 className="text-4xl font-black">Training <span className="gradient-text">Zone</span></h1>
        <p className="text-gray-400">Personalized workout plans to crush your targets.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {levels.map((level) => (
          <div key={level.id} onClick={() => handleStartWorkout(level)} className="glass p-8 rounded-[2.5rem] relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer">
            <div className="absolute -top-4 -right-4 text-7xl opacity-5 group-hover:scale-125 transition-all">
              {level.icon}
            </div>
            <div className="p-3 bg-white/5 rounded-2xl w-fit mb-6 text-primary group-hover:bg-primary group-hover:text-dark transition-all">
              <Dumbbell size={24} />
            </div>
            <h3 className="text-2xl font-black mb-1">{level.label}</h3>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-6">{level.intensity} Intensity</p>
            <button 
              className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all"
            >
               Configure Session <ChevronRight size={16} />
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
                <h3 className="text-4xl font-black max-w-sm leading-tight">High Intensity Interval Training (HIIT)</h3>
                <div className="flex gap-8 text-sm font-bold uppercase tracking-widest text-gray-400">
                   <span>Scaleable Time</span>
                   <span>Massive Burn</span>
                </div>
                <button 
                  onClick={() => handleStartWorkout({ id: 'hiit', label: 'HIIT Session', defaultDuration: 30, intensity: 'high' })}
                  className="bg-white text-dark font-black px-10 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all">
                   SET WORKOUT
                </button>
              </div>
              <div className="absolute -right-20 -bottom-20 opacity-10">
                 <Zap size={300} className="text-primary" />
              </div>
           </div>

           {/* Completed Sessions Ledger */}
           <h2 className="text-2xl font-black flex items-center gap-3 pt-6">
             <CheckCircle2 className="text-emerald-400" /> Completed Today
           </h2>
           {exerciseList.length === 0 ? (
               <div className="glass p-8 rounded-3xl text-center text-gray-400">No workouts logged today. Let's get moving!</div>
           ) : (
               <div className="space-y-4">
                  {exerciseList.map((ex, index) => (
                      <div key={index} className="glass p-5 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-all">
                          <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-primary">
                                  <Activity size={24} />
                              </div>
                              <div>
                                  <h4 className="font-bold text-lg">{ex.type}</h4>
                                  <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{ex.intensity} intensity</p>
                              </div>
                          </div>
                          <div className="text-right">
                              <p className="font-black text-xl gradient-text">{ex.caloriesBurned} kcal</p>
                              <p className="text-sm text-gray-400 font-bold">{ex.duration} min</p>
                          </div>
                      </div>
                  ))}
               </div>
           )}

        </div>

        <div className="space-y-6">
            <div className="glass p-8 rounded-[3rem] space-y-6">
               <h2 className="text-2xl font-black flex items-center gap-3">
                 <Activity className="text-gray-600" /> Live Stats
               </h2>
               <div className="space-y-4">
                  {[
                    { label: 'Active Time Today', value: `${totalActiveMinutes} min`, color: 'text-emerald-400' },
                    { label: 'Calories Burned', value: `${totalBurnedCalories} kcal`, color: 'text-primary' },
                    { label: 'Sessions Logged', value: exerciseList.length, color: 'text-blue-400' },
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

      {/* WORKOUT MODAL WITH DURATION OVERRIDE */}
      {selectedWorkout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass w-full max-w-md p-8 rounded-[3rem] space-y-8 relative animate-in slide-in-from-bottom-10">
            <button 
              onClick={() => setSelectedWorkout(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                <Dumbbell size={32} />
              </div>
              <h3 className="text-3xl font-black">{selectedWorkout.label}</h3>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">{selectedWorkout.intensity} intensity</p>
            </div>

            <div className="space-y-6 py-4">
              {/* Custom Duration Slider */}
              <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-gray-400">
                      <span>Duration</span>
                      <span className="text-white flex items-center gap-1"><Clock size={16}/> {customDuration} min</span>
                  </div>
                  <input 
                      type="range" 
                      min="5" 
                      max="120" 
                      step="5"
                      value={customDuration}
                      onChange={(e) => setCustomDuration(e.target.value)}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary" 
                  />
              </div>

              <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                <span className="font-bold text-gray-300">Estimated Burn</span>
                <span className="text-primary font-black text-2xl flex items-center gap-2">
                    <Flame size={20}/> {getComputedCalories(customDuration, selectedWorkout.intensity)} kcal
                </span>
              </div>
            </div>

            {success ? (
              <div className="w-full bg-emerald-500/20 text-emerald-400 font-black px-6 py-5 rounded-2xl flex items-center justify-center gap-2">
                <CheckCircle2 size={20} /> LOGGED SUCCESSFULLY
              </div>
            ) : (
              <button 
                onClick={submitWorkout}
                disabled={loading}
                className="w-full bg-primary text-dark font-black px-6 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all text-lg disabled:opacity-50"
              >
                {loading ? 'LOGGING...' : 'FINISH & LOG'}
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Workout;
