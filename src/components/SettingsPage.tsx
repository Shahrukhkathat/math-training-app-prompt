"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Volume2, Info, Share2, Star, Grid3x3 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useSoundManager } from "@/hooks/useSoundManager"

interface SettingsPageProps {
  onBack: () => void
  difficulty: "easy" | "medium" | "hard"
  onDifficultyChange: (difficulty: "easy" | "medium" | "hard") => void
}

export default function SettingsPage({ onBack, difficulty, onDifficultyChange }: SettingsPageProps) {
  const { soundEnabled, toggleSound, playSound } = useSoundManager()

  const handleShare = () => {
    playSound('click')
    if (navigator.share) {
      navigator.share({
        title: 'Math Training App',
        text: 'Check out this awesome math training app!',
        url: window.location.href
      })
    } else {
      alert('Share feature not supported on this device')
    }
  }

  const handleRate = () => {
    playSound('click')
    alert('This would open the app store for rating')
  }

  const handleMoreApps = () => {
    playSound('click')
    alert('This would open a list of more apps')
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--math-blue-light)" }}>
      {/* Top Bar */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: "var(--math-blue-deep)" }}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            playSound('click')
            onBack()
          }}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <div className="w-10" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        {/* About App */}
        <Card className="p-6 border-2" style={{ borderColor: "var(--math-blue-deep)" }}>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--math-blue-deep)" }}>
              <Info className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--math-blue-deep)" }}>
                About This App
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Math Training is designed to improve your mental calculation skills, speed, accuracy, and memory. 
                Perfect for students preparing for competitive exams or anyone looking to sharpen their math abilities.
              </p>
              <p className="text-sm text-gray-600 mt-3">
                Version: <span className="font-semibold">1.2.2</span>
              </p>
            </div>
          </div>
        </Card>

        {/* Sound Control */}
        <Card className="p-6 border-2" style={{ borderColor: "var(--math-blue-deep)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--math-blue-deep)" }}>
                <Volume2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: "var(--math-blue-deep)" }}>
                  Sound Effects
                </h3>
                <p className="text-sm text-gray-600">
                  Enable or disable game sounds
                </p>
              </div>
            </div>
            <Switch
              checked={soundEnabled}
              onCheckedChange={(checked) => {
                toggleSound(checked)
                if (checked) playSound('correct')
              }}
            />
          </div>
        </Card>

        {/* Difficulty Level */}
        <Card className="p-6 border-2" style={{ borderColor: "var(--math-blue-deep)" }}>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--math-blue-deep)" }}>
              <Grid3x3 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--math-blue-deep)" }}>
                Game Difficulty Level
              </h3>
              <div className="space-y-3">
                {(["easy", "medium", "hard"] as const).map((level) => (
                  <div
                    key={level}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      difficulty === level ? 'shadow-md' : ''
                    }`}
                    style={{
                      backgroundColor: difficulty === level ? "var(--math-blue-deep)" : "white",
                      borderColor: "var(--math-blue-deep)",
                      color: difficulty === level ? "white" : "var(--math-blue-deep)"
                    }}
                    onClick={() => {
                      playSound('click')
                      onDifficultyChange(level)
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold capitalize">{level}</span>
                      {difficulty === level && (
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--math-blue-deep)" }} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleShare}
            className="w-full h-14 text-lg font-semibold text-white"
            style={{ backgroundColor: "var(--math-blue-deep)" }}
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share App with Friends
          </Button>

          <Button
            onClick={handleRate}
            variant="outline"
            className="w-full h-14 text-lg font-semibold border-2"
            style={{ 
              borderColor: "var(--math-blue-deep)",
              color: "var(--math-blue-deep)"
            }}
          >
            <Star className="w-5 h-5 mr-2" />
            Rate This App
          </Button>

          <Button
            onClick={handleMoreApps}
            variant="outline"
            className="w-full h-14 text-lg font-semibold border-2"
            style={{ 
              borderColor: "var(--math-blue-deep)",
              color: "var(--math-blue-deep)"
            }}
          >
            <Grid3x3 className="w-5 h-5 mr-2" />
            More Apps
          </Button>
        </div>
      </div>
    </div>
  )
}