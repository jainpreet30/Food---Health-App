import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, Utensils, Zap, Sparkles, X, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

const Meals = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [dailyLog, setDailyLog] = useState(null);

  const fetchLog = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/logs/daily', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setDailyLog(data);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    fetchLog();
  }, []);
  
  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', icon: '🍳' },
    { id: 'lunch', label: 'Lunch', icon: '🍲' },
    { id: 'dinner', label: 'Dinner', icon: '🥗' },
    { id: 'snacks', label: 'Snacks', icon: '🍏' },
  ];

  const handleSearch = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const token = user?.token;
      const { data } = await axios.get(`http://localhost:5000/api/logs/search?query=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAISuggestion = async () => {
    setLoadingAI(true);
    try {
      const token = user?.token;
      const { data } = await axios.post('http://localhost:5000/api/ai/suggest-meal', {
        mealType: activeTab
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAiSuggestion(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI(false);
    }
  };

  const logMeal = async (meal) => {
    try {
      const token = user?.token;
      await axios.post('http://localhost:5000/api/logs/meal', {
        type: activeTab,
        meal: {
          name: meal.name || meal.mealName,
          calories: meal.calories,
          macros: meal.macros || {
            protein: meal.protein || 0,
            carbs: meal.carbs || 0,
            fats: meal.fat || 0
          }
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`${meal.name || meal.mealName} logged for ${activeTab}!`);
      setAiSuggestion(null);
      setSearchResults([]);
      setSearchQuery('');
      fetchLog();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black">Food <span className="gradient-text">Journal</span></h1>
          <p className="text-gray-400">Track your intake and get AI recommendations.</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 glass rounded-[2rem] max-w-md">
        {mealTypes.map(m => (
          <button
            key={m.id}
            onClick={() => setActiveTab(m.id)}
            className={cn(
              "flex-1 flex gap-2 items-center justify-center py-3 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest transition-all",
              activeTab === m.id ? "bg-primary text-dark shadow-lg shadow-primary/20" : "text-gray-500 hover:text-white hover:bg-white/5"
            )}
          >
            <span>{m.icon}</span> {m.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Manual Search Sector */}
        <div className="glass p-8 rounded-[2.5rem] space-y-6">
           <h2 className="text-2xl font-black flex items-center gap-3">
             <Search className="text-primary" /> Log Entry
           </h2>
           <div className="relative group">
              <input 
                type="text" 
                placeholder="Search food items (e.g. Paneer Tikka)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pl-8 text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
              />
              <button 
                onClick={handleSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-dark p-2 rounded-xl"
              >
                 <Search size={20} />
              </button>
           </div>
           
           <div className="space-y-3 pt-4">
             <p className="text-xs font-black uppercase text-gray-500 tracking-widest">
               {searchResults.length > 0 ? "Search Results" : "Common Foods"}
             </p>
             {(searchResults.length > 0 ? searchResults : [
               { name: "Oats", calories: 150, protein: 5 },
               { name: "Apple", calories: 52, protein: 0 },
               { name: "Eggs", calories: 155, protein: 13 }
             ]).map((food, idx) => (
               <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                     <span className="p-3 bg-white/5 rounded-xl group-hover:bg-primary/20 group-hover:text-primary transition-all">🍛</span>
                     <div>
                       <p className="font-bold">{food.name}</p>
                       <p className="text-xs text-gray-400 uppercase tracking-widest">{food.calories} kcal • {food.protein}g Protein</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => logMeal(food)}
                    className="text-gray-600 hover:text-primary transition-colors p-2"
                  >
                    <Plus size={20}/>
                  </button>
               </div>
             ))}
           </div>
        </div>

        {/* AI Helper Sector */}
        <div className="flex flex-col gap-6">
          <div className="glass p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-primary group-hover:scale-125 transition-all duration-700">
               <Sparkles size={120} />
            </div>
            <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
               <Zap className="text-primary animate-pulse" /> AI Advisor
            </h2>
            <p className="text-gray-400 mb-8 max-w-sm">Not sure what to eat? Our AI Coach suggests healthy meals tailored to your goals.</p>
            
            {!aiSuggestion ? (
               <button 
                onClick={handleAISuggestion}
                disabled={loadingAI}
                className="w-full py-5 bg-primary/10 border border-primary/30 text-primary font-black rounded-3xl hover:bg-primary hover:text-dark transition-all flex items-center justify-center gap-3"
              >
                {loadingAI ? "STIRRING THE POT..." : "GET RECOMMENDATION"} <Sparkles size={20} />
              </button>
            ) : (
                <div className="space-y-6 animate-in slide-in-from-right duration-500">
                   <div className="p-6 bg-primary text-dark rounded-3xl space-y-3 relative">
                      <button onClick={() => setAiSuggestion(null)} className="absolute top-4 right-4 text-dark/40 hover:text-dark"><X size={20}/></button>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">AI Suggested</span>
                      <h3 className="text-2xl font-black leading-none">{aiSuggestion.mealName}</h3>
                      <p className="font-black text-xl italic opacity-80">{aiSuggestion.calories} kcal</p>
                      <p className="text-sm font-medium leading-relaxed">{aiSuggestion.description}</p>
                   </div>
                   <button 
                    onClick={() => logMeal(aiSuggestion)}
                    className="w-full py-4 glass-pill text-white/50 hover:text-white font-bold rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                   >
                      Log this suggestion <ChevronRight size={16}/>
                   </button>
                </div>
            )}
          </div>
          
          <div className="glass p-8 rounded-[2.5rem] flex-1 flex flex-col">
             <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
               <Utensils className="text-gray-600" /> Daily Breakdown
             </h2>
             {dailyLog?.meals?.[activeTab]?.length > 0 ? (
               <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2">
                 {dailyLog.meals[activeTab].map((meal, idx) => (
                   <div key={idx} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                     <div>
                       <p className="font-bold">{meal.name}</p>
                       <p className="text-xs text-gray-400">{meal.calories} kcal</p>
                     </div>
                     <div className="text-[10px] font-black uppercase tracking-widest text-primary">
                       {meal.macros?.protein || 0}g P
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="flex-1 flex items-center justify-center p-8 border-2 border-dashed border-white/5 rounded-3xl">
                  <p className="text-gray-600 font-bold uppercase tracking-widest text-xs text-center">No {activeTab} logged yet</p>
               </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Meals;
