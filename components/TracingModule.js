'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, Star, CheckCircle, Volume2 } from 'lucide-react'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function TracingModule() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isUppercase, setIsUppercase] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [score, setScore] = useState(null)
  
  const canvasRef = useRef(null)

  const currentLetter = ALPHABET[currentIndex]
  const displayLetter = isUppercase ? currentLetter : currentLetter.toLowerCase()

  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Dancing+Script:wght@700&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }, [])

  useEffect(() => {
    clearCanvas()
  }, [currentIndex, isUppercase])

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
    setScore(null)
  }

  const startDrawing = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY

    ctx.beginPath()
    ctx.moveTo(clientX - rect.left, clientY - rect.top)
    ctx.lineWidth = 14
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#2563EB'
    setIsDrawing(true)
    setHasDrawn(true)
  }

  const draw = (e) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()

    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY

    ctx.lineTo(clientX - rect.left, clientY - rect.top)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const prevLetter = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : ALPHABET.length - 1))
  }

  const nextLetter = () => {
    setCurrentIndex((prev) => (prev < ALPHABET.length - 1 ? prev + 1 : 0))
  }

  const speakLetter = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(displayLetter)
      utterance.lang = 'es-ES'
      window.speechSynthesis.speak(utterance)
    }
  }

  const evaluateTracing = () => {
    if (!hasDrawn) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    
    let drawnPixels = 0
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] > 0) drawnPixels++
    }

    let stars = 3
    let message = '¡Excelente trazo! 🌟🌟🌟'
    
    if (drawnPixels < 1500) {
      stars = 1
      message = '¡Sigue intentándolo! 💪'
    } else if (drawnPixels < 3500) {
      stars = 2
      message = '¡Muy buen trabajo! 👍'
    }

    setScore({ stars, message })
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-2">
      
      {/* FLECHAS DE NAVEGACIÓN Y SELECTOR MAY/MIN */}
      <div className="flex items-center justify-between w-full bg-white p-3 rounded-2xl shadow-sm mb-4 border border-slate-100">
        <button 
          onClick={prevLetter}
          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-transform active:scale-95 shadow"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsUppercase(false)}
            className={`px-3 py-1 rounded-lg text-sm font-bold transition ${!isUppercase ? 'bg-blue-600 text-white shadow' : 'bg-slate-100 text-slate-600'}`}
          >
            a (min)
          </button>
          <button 
            onClick={() => setIsUppercase(true)}
            className={`px-3 py-1 rounded-lg text-sm font-bold transition ${isUppercase ? 'bg-blue-600 text-white shadow' : 'bg-slate-100 text-slate-600'}`}
          >
            A (MAY)
          </button>
        </div>

        <button 
          onClick={nextLetter}
          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-transform active:scale-95 shadow"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* ÁREA DE DIBUJO CON FUENTE CURSIVA DE FONDO */}
      <div className="relative w-full h-[360px] bg-white rounded-3xl shadow-md border-4 border-dashed border-amber-300 flex items-center justify-center overflow-hidden">
        <span 
          className="absolute text-[210px] text-slate-200 select-none pointer-events-none"
          style={{ fontFamily: "'Dancing Script', 'Caveat', cursive" }}
        >
          {displayLetter}
        </span>

        <canvas
          ref={canvasRef}
          width={360}
          height={360}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 cursor-crosshair touch-none"
        />
      </div>

      {/* BOTONES */}
      <div className="flex gap-2 w-full mt-4">
        <button 
          onClick={speakLetter}
          className="flex-1 py-3 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-2xl flex items-center justify-center gap-1 transition shadow-sm text-sm"
        >
          <Volume2 size={18} /> Escuchar
        </button>
        <button 
          onClick={clearCanvas}
          className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl flex items-center justify-center gap-1 transition shadow-sm text-sm"
        >
          <RefreshCw size={18} /> Borrar
        </button>
        <button 
          onClick={evaluateTracing}
          disabled={!hasDrawn}
          className={`flex-1 py-3 font-bold rounded-2xl flex items-center justify-center gap-1 transition text-white shadow-sm text-sm ${
            hasDrawn ? 'bg-green-500 hover:bg-green-600' : 'bg-slate-300 cursor-not-allowed'
          }`}
        >
          <CheckCircle size={18} /> Calificar
        </button>
      </div>

      {/* CONTROL DE CALIFICACIÓN */}
      {score && (
        <div className="mt-4 p-4 bg-white rounded-2xl shadow-md border-2 border-green-400 w-full text-center">
          <h3 className="text-lg font-bold text-slate-800 mb-1">{score.message}</h3>
          <div className="flex justify-center gap-1">
            {[1, 2, 3].map((star) => (
              <Star 
                key={star} 
                size={32} 
                className={star <= score.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} 
              />
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
