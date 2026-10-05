'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, Star, CheckCircle } from 'lucide-react'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function CursiveTracingApp() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isUppercase, setIsUppercase] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [score, setScore] = useState(null)
  
  const canvasRef = useRef(null)

  const currentLetter = ALPHABET[currentIndex]
  const displayLetter = isUppercase ? currentLetter : currentLetter.toLowerCase()

  // Cargar fuente cursiva si no está
  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Dancing+Script:wght@700&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }, [])

  // Limpiar lienzo al cambiar de letra o modo
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

  // Lógica para dibujar en Canvas (Mouse y Touch)
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

  // Navegación con flechas
  const prevLetter = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : ALPHABET.length - 1))
  }

  const nextLetter = () => {
    setCurrentIndex((prev) => (prev < ALPHABET.length - 1 ? prev + 1 : 0))
  }

  // Control de Calificación
  const evaluateTracing = () => {
    if (!hasDrawn) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    
    let drawnPixels = 0
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] > 0) drawnPixels++
    }

    // Algoritmo de calificación según área dibujada
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4 font-sans select-none">
      
      {/* BARRA DE NAVEGACIÓN SUPERIOR CON FLECHAS */}
      <div className="flex items-center justify-between w-full max-w-md bg-white p-4 rounded-2xl shadow-md mb-4">
        <button 
          onClick={prevLetter}
          className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-transform active:scale-95 shadow"
        >
          <ChevronLeft size={28} />
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-slate-700">Letra:</span>
          {/* Selector Mayúscula / Minúscula */}
          <div className="bg-slate-200 p-1 rounded-xl flex gap-1">
            <button 
              onClick={() => setIsUppercase(false)}
              className={`px-3 py-1 rounded-lg text-lg font-bold transition ${!isUppercase ? 'bg-white shadow text-blue-600' : 'text-slate-600'}`}
            >
              a (min)
            </button>
            <button 
              onClick={() => setIsUppercase(true)}
              className={`px-3 py-1 rounded-lg text-lg font-bold transition ${isUppercase ? 'bg-white shadow text-blue-600' : 'text-slate-600'}`}
            >
              A (MAY)
            </button>
          </div>
        </div>

        <button 
          onClick={nextLetter}
          className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-transform active:scale-95 shadow"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* ÁREA DE TRAZADO / CANVAS */}
      <div className="relative w-full max-w-md h-[380px] bg-white rounded-3xl shadow-lg border-4 border-blue-200 flex items-center justify-center overflow-hidden">
        
        {/* Plantilla de Letra Cursiva de Fondo */}
        <span 
          className="absolute text-[220px] text-slate-200 font-normal pointer-events-none"
          style={{ fontFamily: "'Dancing Script', 'Caveat', cursive" }}
        >
          {displayLetter}
        </span>

        {/* Canvas de Dibujo */}
        <canvas
          ref={canvasRef}
          width={380}
          height={380}
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

      {/* BOTONES DE ACCIÓN */}
      <div className="flex gap-4 w-full max-w-md mt-4">
        <button 
          onClick={clearCanvas}
          className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-2xl flex items-center justify-center gap-2 transition"
        >
          <RefreshCw size={20} /> Borrar
        </button>
        <button 
          onClick={evaluateTracing}
          disabled={!hasDrawn}
          className={`flex-1 py-3 font-bold rounded-2xl flex items-center justify-center gap-2 transition text-white shadow ${
            hasDrawn ? 'bg-green-500 hover:bg-green-600' : 'bg-slate-300 cursor-not-allowed'
          }`}
        >
          <CheckCircle size={20} /> Calificar
        </button>
      </div>

      {/* CONTROL DE CALIFICACIÓN (MODAL/PANEL AL FINAL) */}
      {score && (
        <div className="mt-4 p-4 bg-white rounded-2xl shadow-md border-2 border-green-400 w-full max-w-md text-center animate-bounce">
          <h3 className="text-xl font-bold text-slate-800 mb-2">{score.message}</h3>
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map((star) => (
              <Star 
                key={star} 
                size={36} 
                className={star <= score.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} 
              />
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
