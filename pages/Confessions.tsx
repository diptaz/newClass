import React, { useState } from 'react';
import { useStore } from '../context/Store';
import { Confession } from '../types';
import { Send, MessageSquare, Heart } from 'lucide-react';

const COLORS = [
  'bg-yellow-200',
  'bg-blue-200',
  'bg-green-200',
  'bg-pink-200',
  'bg-purple-200',
  'bg-orange-200',
];

export const Confessions = () => {
  const { confessions, addConfession } = useStore();
  const [newContent, setNewContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    const newConfession: Confession = {
      id: Date.now().toString(),
      content: newContent,
      timestamp: new Date().toISOString(),
      likes: 0,
      color: randomColor
    };

    addConfession(newConfession);
    setNewContent('');
  };

  return (
    <div className="p-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
          <MessageSquare className="text-primary" size={40} />
          Confessions Wall
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Share your thoughts anonymously. What happens in AC24DIA, stays in AC24DIA.
        </p>
      </div>

      {/* Input Area */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Type your confession here..."
            className="w-full p-4 pr-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary focus:ring-0 transition-colors resize-none shadow-sm"
            rows={3}
          />
          <button
            type="submit"
            disabled={!newContent.trim()}
            className="absolute bottom-4 right-4 p-2 bg-primary text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-110"
          >
            <Send size={20} />
          </button>
        </form>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {confessions.map((confession) => (
          <div
            key={confession.id}
            className={`${confession.color} p-6 rounded-lg shadow-md transform hover:-translate-y-1 transition-transform duration-200 relative group`}
            style={{ minHeight: '200px' }}
          >
            <div className="font-handwriting text-lg text-gray-800 leading-relaxed break-words">
              {confession.content}
            </div>
            
            <div className="absolute bottom-4 right-4 flex items-center gap-1 text-gray-600 opacity-70 group-hover:opacity-100 transition-opacity">
               <Heart size={16} className="fill-current text-red-500" />
               <span className="text-sm font-medium">{confession.likes}</span>
            </div>

            <div className="absolute bottom-4 left-4 text-xs text-gray-500 opacity-50">
              {new Date(confession.timestamp).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
