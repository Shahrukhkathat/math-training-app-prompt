"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Settings, Calculator, Grid3x3, Scale, List, Brain, ArrowLeft } from "lucide-react"
import BasicCalculation from "@/components/games/BasicCalculation"
import MathPuzzle from "@/components/games/MathPuzzle"
import InequalitySolver from "@/components/games/InequalitySolver"
import SequenceIdentifier from "@/components/games/SequenceIdentifier"
import MathMemory from "@/components/games/MathMemory"
import SettingsPage from "@/components/SettingsPage"
import { useSoundManager } from "@/hooks/useSoundManager"

export default function Home() {
  const [currentView, setCurrentView] = useState<string>("menu")
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const { playSound } = useSoundManager()

  const gameModesConfig = [
    {
      id: "basic-calc",
      name: "Basic Calculation",
      icon: Calculator,
      description: "Plus, Minus, Multiply, Divide",
      component: BasicCalculation
    },
    {
      id: "math-puzzle",
      name: "Math Puzzle Solver",
      icon: Grid3x3,
      description: "Find the missing number",
      component: MathPuzzle
    },
    {
      id: "inequality",
      name: "Inequality Solver",
      icon: Scale,
      description: "Compare expressions",
      component: InequalitySolver
    },
    {
      id: "sequence",
      name: "Sequence Identifier",
      icon: List,
      description: "Find the next number",
      component: SequenceIdentifier
    },
    {
      id: "math-memory",
      name: "Math Memory",
      icon: Brain,
      description: "Advanced calculation memory",
      component: MathMemory
    }
  ]

  const CurrentGame = gameModesConfig.find(g => g.id === currentView)?.component

  if (currentView === "settings") {
    return (
      <SettingsPage 
        onBack={() => setCurrentView("menu")}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
      />
    )
  }

  if (CurrentGame) {
    return (
      <CurrentGame 
        onBack={() => setCurrentView("menu")}
        difficulty={difficulty}
      />
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--math-blue-light)" }}>
      {/* Top Bar */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: "var(--math-blue-deep)" }}>
        <h1 className="text-xl font-bold text-white">Math Training</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            playSound('click')
            setCurrentView("settings")
          }}
          className="text-white hover:bg-white/20"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Game Mode Selection */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--math-blue-deep)" }}>
            Choose Your Challenge
          </h2>
          <p className="text-gray-700">
            Train your mental calculation skills
          </p>
        </div>

        <div className="grid gap-4">
          {gameModesConfig.map((mode) => {
            const Icon = mode.icon
            return (
              <Card
                key={mode.id}
                className="p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border-2"
                style={{ 
                  backgroundColor: "white",
                  borderColor: "var(--math-blue-deep)"
                }}
                onClick={() => {
                  playSound('click')
                  setCurrentView(mode.id)
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: "var(--math-blue-deep)" }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold" style={{ color: "var(--math-blue-deep)" }}>
                      {mode.name}
                    </h3>
                    <p className="text-sm text-gray-600">{mode.description}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="mt-8 text-center text-sm text-gray-700">
          <p>Current Difficulty: <span className="font-semibold capitalize">{difficulty}</span></p>
          <p className="mt-1">Change difficulty in Settings</p>
        </div>
      </div>
    </div>
  )
}