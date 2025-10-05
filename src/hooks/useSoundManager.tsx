"use client"

import { useEffect, useState } from 'react'

type SoundType = 'correct' | 'wrong' | 'timeout' | 'click'

export function useSoundManager() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)

  // Load sound settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('soundEnabled')
    if (saved !== null) {
      setSoundEnabled(saved === 'true')
    }
  }, [])

  // Initialize Audio Context on first user interaction
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioContext) {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)()
      setAudioContext(context)
    }
  }, [audioContext])

  const playSound = (type: SoundType) => {
    if (!soundEnabled || !audioContext) return

    // Resume context if suspended (required for some browsers)
    if (audioContext.state === 'suspended') {
      audioContext.resume()
    }

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Configure sound based on type
    switch (type) {
      case 'correct':
        // Cheerful ding - ascending tone
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.2)
        break

      case 'wrong':
        // Buzz - low frequency
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
        oscillator.type = 'sawtooth'
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
        break

      case 'timeout':
        // Warning beep - pulsing
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + 0.15)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
        break

      case 'click':
        // Subtle click
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.05)
        break
    }
  }

  const toggleSound = (enabled: boolean) => {
    setSoundEnabled(enabled)
    localStorage.setItem('soundEnabled', String(enabled))
  }

  return {
    soundEnabled,
    toggleSound,
    playSound
  }
}