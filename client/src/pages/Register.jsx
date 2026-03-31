import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Activity, AlertCircle } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      navigate('/onboarding');
    } catch (err) {
      setError('Registration failed. Email might already be taken.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-dark">
      <div className="w-full max-w-sm glass p-10 rounded-[3rem] animate-in zoom-in duration-500 shadow-2xl shadow-primary/10">
        <div className="flex flex-col items-center mb-10">
          <div className="p-4 bg-primary text-dark rounded-3xl mb-6 shadow-xl shadow-primary/30">
            <Activity size={32} />
          </div>
          <h1 className="text-3xl font-black mb-1 text-white text-center">Join the Aura</h1>
          <p className="text-gray-400 text-sm font-medium">Start your elite health journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 group">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="password"
                placeholder="Secure Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                required
                minLength={6}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-400/10 border border-red-400/20 rounded-2xl text-red-400 text-sm font-bold animate-in fade-in zoom-in">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-dark font-black py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            GET STARTED <UserPlus size={18} />
          </button>

          <p className="text-center text-sm text-gray-500 font-medium pt-4">
            Already have an account? <Link to="/login" className="text-primary hover:underline decoration-2 underline-offset-4">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
