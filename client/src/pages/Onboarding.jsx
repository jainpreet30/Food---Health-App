import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, ChevronLeft, User, Ruler, Activity, Target, Save, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

const Onboarding = () => {
  const { updateProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    profile: {
      age: 25,
      gender: 'male',
      height: 170,
      weight: 70,
      activityLevel: 'moderate',
      goal: 'maintain_weight'
    },
    preferences: {
      dietType: 'veg',
      allergies: []
    }
  });

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      profile: { ...prev.profile, [name]: value }
    }));
  };

  const handlePreferenceChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [name]: value }
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: "Basics", icon: User },
    { title: "Body", icon: Ruler },
    { title: "Lifestyle", icon: Activity },
    { title: "Goal", icon: Target },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 pb-24">
      <div className="w-full max-w-xl glass p-8 md:p-12 rounded-[3.5rem] relative shadow-2xl shadow-primary/5">
        
        {/* Progress Header */}
        <div className="flex justify-between items-center mb-12">
          {steps.map((s, i) => (
             <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500",
                  step > i ? "bg-primary text-dark" : step === i + 1 ? "bg-primary/20 text-primary border border-primary/50" : "bg-white/5 text-gray-600"
                )}>
                  <s.icon size={20} />
                </div>
                <span className={cn("text-[10px] uppercase font-black tracking-widest", step === i + 1 ? "text-primary" : "text-gray-500")}>
                  {s.title}
                </span>
             </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="min-h-[300px] animate-in fade-in slide-in-from-right duration-500">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-black mb-6">Tell us about <span className="gradient-text">yourself.</span></h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 uppercase">Age</label>
                  <input 
                    type="number" name="age" value={formData.profile.age} onChange={handleProfileChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 uppercase">Gender</label>
                  <select 
                    name="gender" value={formData.profile.gender} onChange={handleProfileChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary/50"
                  >
                    <option value="male" className="bg-dark">Male</option>
                    <option value="female" className="bg-dark">Female</option>
                    <option value="other" className="bg-dark">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-black mb-6">Body <span className="gradient-text">Metrics.</span></h2>
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-500 uppercase tracking-widest text-xs">Height</span>
                    <span className="text-primary">{formData.profile.height} cm</span>
                  </div>
                  <input type="range" name="height" min="100" max="250" value={formData.profile.height} onChange={handleProfileChange} className="w-full accent-primary" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-500 uppercase tracking-widest text-xs">Weight</span>
                    <span className="text-primary">{formData.profile.weight} kg</span>
                  </div>
                  <input type="range" name="weight" min="30" max="200" value={formData.profile.weight} onChange={handleProfileChange} className="w-full accent-primary" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-black mb-6">Your <span className="gradient-text">Lifestyle.</span></h2>
              <div className="grid grid-cols-1 gap-3">
                {['sedentary', 'light', 'moderate', 'active', 'very_active'].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleProfileChange({ target: { name: 'activityLevel', value: level } })}
                    className={cn(
                      "w-full p-4 rounded-2xl border text-left transition-all",
                      formData.profile.activityLevel === level ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-gray-400"
                    )}
                  >
                    <span className="font-bold capitalize">{level.replace('_', ' ')}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-black mb-6">Define your <span className="gradient-text">Goal.</span></h2>
              <div className="grid grid-cols-1 gap-4">
                 {[
                   { id: 'lose_weight', label: 'Lose Weight', desc: 'Burn fat and get leaner' },
                   { id: 'maintain_weight', label: 'Stay Fit', desc: 'Maintain your current physique' },
                   { id: 'gain_muscle', label: 'Build Muscle', desc: 'Get stronger and bigger' },
                 ].map(g => (
                   <button
                     key={g.id}
                     onClick={() => handleProfileChange({ target: { name: 'goal', value: g.id } })}
                     className={cn(
                       "w-full p-6 rounded-3xl border text-left transition-all group",
                       formData.profile.goal === g.id ? "bg-primary text-dark border-primary" : "bg-white/5 border-white/10 text-gray-100"
                     )}
                   >
                     <div className="flex justify-between items-center">
                       <div>
                         <p className="font-black text-xl">{g.label}</p>
                         <p className={cn("text-xs font-bold uppercase", formData.profile.goal === g.id ? "text-dark/60" : "text-gray-500")}>{g.desc}</p>
                       </div>
                       {formData.profile.goal === g.id && <Zap size={24} className="animate-glow" />}
                     </div>
                   </button>
                 ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div className="flex gap-4 mt-12">
          {step > 1 && (
            <button onClick={prevStep} className="p-4 rounded-2xl glass-pill text-gray-400 hover:text-white transition-colors">
              <ChevronLeft />
            </button>
          )}
          
          {step < 4 ? (
            <button 
              onClick={nextStep} 
              className="flex-1 bg-primary text-dark font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
            >
              CONTINUE <ChevronRight size={20} />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-primary text-dark font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
            >
              {loading ? "SAVING..." : "FINISH SETUP"} <Save size={20} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Onboarding;
