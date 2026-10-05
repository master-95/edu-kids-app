'use client';
import { useState, useEffect } from 'react';

const PHONICS_DATA = [
  { icon: '🍎', name: 'Manzana', letter: 'A' },
  { icon: '🎈', name: 'Globo', letter: 'G' },
  { icon: '🐱', name: 'Gato', letter: 'G' },
  { icon: '🐶', name: 'Perro', letter: 'P' },
  { icon: '🚗', name: 'Auto', letter: 'A' },
  { icon: '☀️', name: 'Sol', letter: 'S' },
  { icon: '⭐️', name: 'Estrella', letter: 'E' },
  { icon: '🐘', name: 'Elefante', letter: 'E' },
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function PhonicsModule({ onSuccess }) {
  const [currentItem, setCurrentItem] = useState(PHONICS_DATA[0]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    const item = PHONICS_DATA[Math.floor(Math.random() * PHONICS_DATA.length)];
    setCurrentItem(item);

    const opts = new Set([item.letter]);
    while (opts.size < 4) {
      const randChar = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      opts.add(randChar);
    }
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
  };

  const handleSelect = (letter) => {
    if (letter === currentItem.letter) {
      onSuccess(true, generateQuestion);
    } else {
      onSuccess(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-around w-full h-full p-2">
      <h2 className="text-2xl font-bold text-gray-700 text-center">
        ¿Con qué letra empieza?
      </h2>

      <div className="text-7xl my-4 p-6 bg-indigo-50 rounded-2xl border-2 border-indigo-200 shadow-inner">
        {currentItem.icon}
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        {options.map((letter) => (
          <button
            key={letter}
            onClick={() => handleSelect(letter)}
            className="py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-3xl rounded-2xl shadow-lg border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all"
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
}