"use client"

import { useEffect, useRef } from "react"

interface VoiceWaveProps {
  audioLevel: number
  isRecording: boolean
}

export default function VoiceWave({ audioLevel, isRecording }: VoiceWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gradientRef = useRef<CanvasGradient | null>(null)

  // Draw the wave visualization
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1
    canvas.width = 300 * dpr
    canvas.height = 300 * dpr
    ctx.scale(dpr, dpr)

    // Create gradient if not already created
    if (!gradientRef.current) {
      gradientRef.current = ctx.createLinearGradient(0, 0, 0, 300)
      gradientRef.current.addColorStop(0, "white")
      gradientRef.current.addColorStop(1, "#1a73e8")
    }

    // Clear canvas
    ctx.clearRect(0, 0, 300, 300)

    // Draw circle
    const centerX = 150
    const centerY = 150
    const baseRadius = 100

    // Calculate radius based on audio level
    const radius = isRecording
      ? baseRadius * (0.8 + audioLevel * 0.2) // Pulsate between 80% and 100% of base radius
      : baseRadius

    // Draw outer circle (white with blue gradient)
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.fillStyle = gradientRef.current
    ctx.fill()

    // Draw inner circle (darker blue)
    if (isRecording) {
      // Create wave effect
      const waveCount = 8
      const waveAmplitude = 5 * audioLevel

      ctx.beginPath()

      for (let i = 0; i < 360; i++) {
        const angle = (i * Math.PI) / 180
        const waveOffset = Math.sin((i * waveCount * Math.PI) / 180) * waveAmplitude
        const x = centerX + (radius - 20 + waveOffset) * Math.cos(angle)
        const y = centerY + (radius - 20 + waveOffset) * Math.sin(angle)

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.closePath()
      ctx.fillStyle = "#1a73e8"
      ctx.fill()
    }
  }, [audioLevel, isRecording])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "300px",
        height: "300px",
        borderRadius: "50%",
      }}
    />
  )
}

