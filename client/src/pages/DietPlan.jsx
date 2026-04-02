import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CalendarDays, Flame, CheckCircle2, ChevronRight, Apple } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DietPlan = () => {
  const { user } = useAuth();
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeDay, setActiveDay] = useState(1);

  // Fetch the existing plan
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/ai/weekly-plan');
        if (res.data) setWeeklyPlan(res.data);
      } catch (err) {
        console.error("Error fetching weekly plan", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, []);

  const handleGeneratePlan = async () => {
    setGenerating(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/weekly-plan');
      setWeeklyPlan(res.data);
      setActiveDay(1);
    } catch (err) {
      console.error("Error generating plan", err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse pt-20 text-center text-gray-400">Loading your diet plan...</div>;
  }

  // Helper component for meals
  const MealCard = ({ title, meal, timeIcon }) => {
    if (!meal) return null;
    return (
      <div className="glass p-6 rounded-3xl hover:bg-white/10 transition-colors border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-all"></div>
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="text-primary">{timeIcon}</span> {title}
            </h3>
            <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <Flame size={14}/> {meal.calories} kcal
            </div>
        </div>
        <h4 className="text-lg font-medium text-white mb-2">{meal.mealName}</h4>
        <p className="text-gray-400 text-sm leading-relaxed">{meal.description}</p>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <header className="mb-10 text-center md:text-left flex flex-col md:flex-row md:justify-between md:items-end">
        <div>
            <h1 className="text-4xl md:text-5xl font-black flex items-center justify-center md:justify-start gap-4 mb-3">
            <CalendarDays className="text-primary" size={40} /> 
            Weekly <span className="gradient-text">Diet Plan</span>
            </h1>
            <p className="text-gray-400 text-lg">Your hyper-personalized 7-day culinary roadmap.</p>
        </div>
        {weeklyPlan && (
            <button 
                onClick={handleGeneratePlan}
                disabled={generating}
                className="mt-4 md:mt-0 text-sm text-primary hover:text-white transition-colors underline flex items-center justify-center md:justify-start gap-1"
            >
                Regenerate Plan
            </button>
        )}
      </header>

      {!weeklyPlan ? (
        <div className="glass p-12 rounded-[3rem] text-center max-w-2xl mx-auto mt-20 relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[100px] rounded-full point-events-none"></div>
             
             <Apple className="w-20 h-20 text-primary mx-auto mb-6 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
             <h2 className="text-3xl font-black mb-4">No Plan active</h2>
             <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg leading-relaxed">
                 Let our AI analyze your profile, target calories, and preferences to build you the perfect week.
             </p>
             <button 
                onClick={handleGeneratePlan}
                disabled={generating}
                className="bg-primary text-dark font-black py-4 px-10 rounded-2xl hover:scale-105 active:scale-95 transition-all text-lg shadow-[0_0_20px_rgba(34,197,94,0.3)] disabled:opacity-50 flex items-center gap-2 mx-auto justify-center min-w-[250px]"
             >
                 {generating ? (
                     <span className="animate-pulse">Generating your magic...</span>
                 ) : (
                     <>Generate Custom Plan <ChevronRight size={20}/></>
                 )}
             </button>
        </div>
      ) : (
        <div className="space-y-8">
            {/* Day Selector */}
            <div className="flex overflow-x-auto pb-4 gap-3 snap-x scrollbar-hide">
                {weeklyPlan.map((dayPlan) => (
                    <button 
                        key={dayPlan.day}
                        onClick={() => setActiveDay(dayPlan.day)}
                        className={`snap-center flex-shrink-0 px-6 py-4 rounded-2xl font-bold transition-all whitespace-nowrap border ${activeDay === dayPlan.day ? 'bg-primary text-dark border-primary shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'glass border-white/5 text-gray-400 hover:bg-white/10'}`}
                    >
                        Day {dayPlan.day}
                    </button>
                ))}
            </div>

            {/* Active Day Content */}
            {weeklyPlan.map((dayPlan) => (
                <div key={dayPlan.day} className={activeDay === dayPlan.day ? 'block animate-in slide-in-from-right-4 duration-500' : 'hidden'}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black">Plan for Day {dayPlan.day}</h2>
                        <div className="bg-dark/50 px-4 py-2 rounded-xl text-primary font-bold border border-white/5 flex items-center gap-2">
                           <CheckCircle2 size={18}/> Target: {dayPlan.totalCaloriesExpected} kcal
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <MealCard title="Breakfast" meal={dayPlan.meals.breakfast} timeIcon="🌅" />
                        <MealCard title="Lunch" meal={dayPlan.meals.lunch} timeIcon="☀️" />
                        {dayPlan.meals.snacks && <MealCard title="Snacks" meal={dayPlan.meals.snacks} timeIcon="☕" />}
                        <MealCard title="Dinner" meal={dayPlan.meals.dinner} timeIcon="🌙" />
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default DietPlan;
