'use client';
import { useRef, useEffect, useState } from 'react';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'.split('');

export default function TracingModule() {
  const canvasRef = useRef(null);
  const [currentChar, setCurrentChar] = useState('A');
  const isDrawing = useRef(false);

  useEffect(() => {
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    return () => window.removeEventListener('resize', setupCanvas);
  }, [currentChar]);

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    clearCanvas();
  };

  const drawGuideText = (ctx, canvas) => {
    ctx.font = `bold ${canvas.height * 0.65}px sans-serif`;
    ctx.fillStyle = '#e2e8f0';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(currentChar, canvas.width / 2, canvas.height / 2);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGuideText(ctx, canvas);
  };

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const speakCurrentChar = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentChar);
      utterance.lang = 'es-ES';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex gap-2 mb-3 overflow-x-auto w-full p-2 bg-white/50 rounded-xl">
        {ALPHABET.map((char) => (
          <button
            key={char}
            onClick={() => {
              setCurrentChar(char);
              if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance(char);
                u.lang = 'es-ES';
                window.speechSynthesis.speak(u);
              }
            }}
            className={`px-3 py-1 rounded-lg font-bold text-lg transition-all ${
              currentChar === char
                ? 'bg-indigo-600 text-white shadow-md scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {char}
          </button>
        ))}
      </div>

      <div className="relative flex-1 w-full border-4 border-dashed border-amber-300 bg-white rounded-2xl overflow-hidden min-h-[300px]">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onTouchStart={(e) => {
            e.preventDefault();
            startDrawing(e);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            draw(e);
          }}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 w-full h-full cursor-crosshair"
        />
      </div>

      <div className="flex gap-4 mt-3">
        <button
          onClick={speakCurrentChar}
          className="px-4 py-2 bg-amber-400 hover:bg-amber-500 font-bold rounded-xl text-gray-800 shadow transition-transform active:scale-95"
        >
          🔊 Escuchar
        </button>
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-rose-400 hover:bg-rose-500 font-bold rounded-xl text-white shadow transition-transform active:scale-95"
        >
          🧹 Borrar
        </button>
      </div>
    </div>
  );
}