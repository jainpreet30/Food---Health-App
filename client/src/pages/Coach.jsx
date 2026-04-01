import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, User, Bot } from 'lucide-react';

const Coach = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hey there! I am your AI Health Coach. What can I help you with today? You can ask me what to eat or what to do after a workout!' }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsgs = [...messages, { id: Date.now(), sender: 'user', text: input }];
    setMessages(newMsgs);
    setInput('');

    setTimeout(() => {
      let response = "I'm not quite sure about that, but remember to stay hydrated!";
      const query = input.toLowerCase();

      if (query.includes('eat') || query.includes('hungry') || query.includes('food')) {
        response = "Based on your goals, a high-protein meal like Grilled Chicken or Paneer Tikka would be perfect right now! Don't forget your greens.";
      } else if (query.includes('workout') || query.includes('exercise')) {
        response = "Great job staying active! Make sure to consume some protein within the next 30 minutes to aid muscle recovery. Hydrate well!";
      } else if (query.includes('water') || query.includes('drink')) {
        response = "You should aim for at least 3 Liters of water daily. Drink a glass right now!";
      } else if (query.includes('tired') || query.includes('sleep')) {
        response = "Rest is just as important as the workout! Aim for 7-8 hours of quality sleep to let your body recover.";
      } else if (query.includes('hello') || query.includes('hi')) {
        response = "Hello! Ready to crush some health goals today?";
      }

      setMessages([...newMsgs, { id: Date.now() + 1, sender: 'bot', text: response }]);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 h-[80vh] flex flex-col pt-4 animate-in fade-in duration-700">
      <header className="flex-shrink-0">
        <h1 className="text-4xl font-black flex items-center gap-3">
          <Sparkles className="text-primary" size={32} /> AI <span className="gradient-text">Coach</span>
        </h1>
        <p className="text-gray-400 mt-2">Chat with your personalized, local wellness mentor.</p>
      </header>

      <div className="flex-1 glass rounded-[2.5rem] overflow-hidden flex flex-col relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 pr-2">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`p-2 rounded-xl flex-shrink-0 h-10 w-10 flex items-center justify-center ${msg.sender === 'user' ? 'bg-white/10 text-white' : 'bg-primary/20 text-primary'}`}>
                {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`px-5 py-3 rounded-2xl max-w-[75%] ${msg.sender === 'user' ? 'bg-primary text-dark rounded-tr-none font-bold' : 'bg-white/5 rounded-tl-none font-medium leading-relaxed'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="p-4 bg-dark/50 border-t border-white/5 flex gap-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your coach anything..."
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-primary transition-all placeholder:text-gray-500 font-medium"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-primary text-dark p-3 rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Coach;
