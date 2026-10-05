'use client';
import { useState } from 'react';
import TracingModule from '@/components/TracingModule';
import MathModule from '@/components/MathModule';
import PhonicsModule from '@/components/PhonicsModule';

export default function Home() {
  const [activeTab, setActiveTab] = useState('tracing');
  const [feedback, setFeedback] = useState(null);

  const triggerFeedback = (isCorrect, nextFn) => {
    setFeedback(isCorrect ? '🌟 ¡Excelente!' : '❌ Inténtalo de nuevo');
    setTimeout(() => {
      setFeedback(null);
      if (isCorrect && nextFn) nextFn();
    }, 1200);
  };

  return (
    <main className="flex flex-col items-center justify-between h-screen p-3 max-w-xl mx-auto relative">
      <header className="w-full bg-white/80 backdrop-blur-md rounded-2xl p-3 shadow-md flex justify-between items-center z-10">
        <h1 className="text-xl font-extrabold text-slate-800">EduKids Web</h1>
        <nav className="flex gap-1">
          <button
            onClick={() => setActiveTab('tracing')}
            className={`px-3 py-1.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'tracing'
                ? 'bg-rose-500 text-white shadow'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Trazo
          </button>
          <button
            onClick={() => setActiveTab('math')}
            className={`px-3 py-1.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'math'
                ? 'bg-emerald-500 text-white shadow'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Mates
          </button>
          <button
            onClick={() => setActiveTab('phonics')}
            className={`px-3 py-1.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'phonics'
                ? 'bg-sky-500 text-white shadow'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Sondeo
          </button>
        </nav>
      </header>

      <div className="w-full flex-1 my-3 bg-white rounded-3xl p-4 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden max-h-[80vh]">
        {activeTab === 'tracing' && <TracingModule />}
        {activeTab === 'math' && <MathModule onSuccess={triggerFeedback} />}
        {activeTab === 'phonics' && <PhonicsModule onSuccess={triggerFeedback} />}

        {feedback && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="bg-white px-8 py-6 rounded-3xl text-3xl font-black text-slate-800 shadow-2xl scale-110">
              {feedback}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}