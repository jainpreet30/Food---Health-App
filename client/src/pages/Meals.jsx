import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, Utensils, Zap, Sparkles, X, ChevronRight, Edit3, Trash2 } from 'lucide-react';
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

  // Custom Dish Modals
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customDish, setCustomDish] = useState({ name: '', calories: '', protein: '', carbs: '', fats: '' });

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
      
      setAiSuggestion(null);
      setSearchResults([]);
      setSearchQuery('');
      fetchLog();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMeal = async (type, index) => {
    try {
      if(!window.confirm("Delete this meal?")) return;
      const token = user?.token;
      await axios.delete(`http://localhost:5000/api/logs/meal/${type}/${index}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
           <div className="flex items-center justify-between">
               <h2 className="text-2xl font-black flex items-center gap-3">
                 <Search className="text-primary" /> Log Entry
               </h2>
           </div>
           
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
           
           <button 
              onClick={() => setShowCustomModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold p-3 rounded-2xl transition-all text-sm mt-3"
            >
              <Edit3 size={16}/> Add Custom Dish
           </button>
           
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
                     <div className="flex items-center gap-4">
                       <div className="text-[10px] font-black uppercase tracking-widest text-primary">
                         {meal.macros?.protein || 0}g P
                       </div>
                       <button onClick={() => deleteMeal(activeTab, idx)} className="text-gray-500 hover:text-red-500 transition-colors p-1">
                         <Trash2 size={16} />
                       </button>
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

       {/* CUSTOM DISH MODAL */}
       {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass w-full max-w-md p-8 rounded-[3rem] space-y-6 relative animate-in slide-in-from-bottom-10">
            <button 
              onClick={() => setShowCustomModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                <Utensils size={32} />
              </div>
              <h3 className="text-3xl font-black">Custom Dish</h3>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Add Personalized Entry</p>
            </div>

            <div className="space-y-4 py-4">
              <input 
                type="text" 
                placeholder="Dish Name (e.g. Mom's Pasta)"
                value={customDish.name}
                onChange={e => setCustomDish({...customDish, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" 
                  placeholder="Calories (kcal)"
                  value={customDish.calories}
                  onChange={e => setCustomDish({...customDish, calories: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary/50 transition-all font-medium bg-transparent"
                />
                <input 
                  type="number" 
                  placeholder="Protein (g)"
                  value={customDish.protein}
                  onChange={e => setCustomDish({...customDish, protein: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary/50 transition-all font-medium bg-transparent"
                />
                <input 
                  type="number" 
                  placeholder="Carbs (g)"
                  value={customDish.carbs}
                  onChange={e => setCustomDish({...customDish, carbs: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary/50 transition-all font-medium bg-transparent"
                />
                <input 
                  type="number" 
                  placeholder="Fats (g)"
                  value={customDish.fats}
                  onChange={e => setCustomDish({...customDish, fats: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary/50 transition-all font-medium bg-transparent"
                />
              </div>
            </div>

            <button 
              onClick={() => {
                if (!customDish.name || !customDish.calories) return alert("Name and Calories are required!");
                logMeal({
                    name: customDish.name,
                    calories: Number(customDish.calories),
                    macros: {
                        protein: Number(customDish.protein) || 0,
                        carbs: Number(customDish.carbs) || 0,
                        fats: Number(customDish.fats) || 0
                    }
                });
                setShowCustomModal(false);
                setCustomDish({ name: '', calories: '', protein: '', carbs: '', fats: '' });
              }}
              className="w-full bg-primary text-dark font-black px-6 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all text-lg"
            >
              LOG DISH
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Meals;
