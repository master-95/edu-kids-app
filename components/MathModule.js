'use client';
import { useState, useEffect } from 'react';

const ICONS = ['🌟', '🍎', '🎈', '🚗', '🐱', '🦋'];

export default function MathModule({ onSuccess }) {
  const [targetCount, setTargetCount] = useState(0);
  const [currentIcon, setCurrentIcon] = useState('🍎');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    generateNewQuestion();
  }, []);

  const generateNewQuestion = () => {
    const count = Math.floor(Math.random() * 6) + 1;
    const icon = ICONS[Math.floor(Math.random() * ICONS.length)];
    setTargetCount(count);
    setCurrentIcon(icon);

    const opts = new Set([count]);
    while (opts.size < 4) {
      opts.add(Math.floor(Math.random() * 6) + 1);
    }
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
  };

  const handleSelect = (selected) => {
    if (selected === targetCount) {
      onSuccess(true, generateNewQuestion);
    } else {
      onSuccess(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-around w-full h-full p-2">
      <h2 className="text-2xl font-bold text-gray-700 text-center">
        ¿Cuántos objetos hay?
      </h2>

      <div className="flex flex-wrap justify-center gap-4 my-6 text-5xl bg-amber-50 p-6 rounded-2xl border-2 border-amber-200 w-full min-h-[120px] items-center">
        {Array.from({ length: targetCount }).map((_, idx) => (
          <span key={idx} className="animate-bounce">
            {currentIcon}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleSelect(opt)}
            className="py-4 bg-sky-500 hover:bg-sky-600 text-white font-bold text-3xl rounded-2xl shadow-lg border-b-4 border-sky-700 active:border-b-0 active:translate-y-1 transition-all"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}