import React, { useState, useEffect } from 'react';
import { User, Activity, Target, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

const Profile = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    goal: 'maintain',
    foodPreference: 'veg',
    activityLevel: 'moderate'
  });
  
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  // Initialize form with existing user data
  useEffect(() => {
    if (user && user.profile) {
      setFormData({
        age: user.profile.age || '',
        gender: user.profile.gender || 'male',
        height: user.profile.height || '',
        weight: user.profile.weight || '',
        goal: user.profile.goal || 'maintain',
        foodPreference: user.profile.foodPreference || 'veg',
        activityLevel: user.profile.activityLevel || 'moderate'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus({ ...status, success: false, error: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age),
          height: Number(formData.height),
          weight: Number(formData.weight)
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Update user state globally to reflect new macros
        login({ ...data, token: user.token });
        setStatus({ loading: false, success: true, error: '' });
        
        // Hide success message after 3 seconds
        setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 3000);
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.message });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in duration-700 pb-10">
      <header>
        <h1 className="text-4xl font-black flex items-center gap-3">
          <User className="text-primary" size={36} /> My <span className="gradient-text">Profile</span>
        </h1>
        <p className="text-gray-400 mt-2">Adjust your biological stats and fitness goals.</p>
      </header>

      <form onSubmit={handleSubmit} className="glass p-8 md:p-10 rounded-[2.5rem] space-y-8">
        
        {status.error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm font-bold">
            {status.error}
          </div>
        )}

        {status.success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl text-sm font-bold flex gap-2 items-center">
             <CheckCircle2 size={18} /> Profile successfully updated! Your targets have been recalculated.
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-xl font-black tracking-widest uppercase text-gray-500 flex gap-2 items-center">
            <Activity size={18} /> Biological Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-2">Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} min="1" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-2">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-dark/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-2">Height (cm)</label>
              <input type="number" name="height" value={formData.height} onChange={handleChange} min="50" max="300" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-2">Weight (kg)</label>
              <input type="number" name="weight" value={formData.weight} onChange={handleChange} min="20" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-all" />
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-white/5 my-8"></div>

        <div className="space-y-6">
          <h2 className="text-xl font-black tracking-widest uppercase text-gray-500 flex gap-2 items-center">
            <Target size={18} /> Lifestyle & Goals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-2">Primary Goal</label>
              <select name="goal" value={formData.goal} onChange={handleChange} className="w-full bg-dark/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer">
                <option value="weight loss">Weight Loss</option>
                <option value="maintain">Maintain Weight</option>
                <option value="muscle gain">Muscle Gain</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-2">Activity Level</label>
              <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="w-full bg-dark/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer">
                <option value="sedentary">Sedentary (Little/no exercise)</option>
                <option value="moderate">Moderate (Workout 3-5 days/wk)</option>
                <option value="active">Active (Heavy workout 6-7 days/wk)</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-2">Dietary Preference</label>
              <select name="foodPreference" value={formData.foodPreference} onChange={handleChange} className="w-full bg-dark/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer">
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="jain">Jain</option>
              </select>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={status.loading}
          className="w-full mt-4 bg-primary text-dark font-black px-8 py-5 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all text-lg flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {status.loading ? 'Saving...' : <><Save size={20} /> Save Profile Settings</>}
        </button>
      </form>
    </div>
  );
};

export default Profile;
