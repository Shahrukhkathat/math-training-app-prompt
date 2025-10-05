import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import GameLayout from "./GameLayout"
import { useSoundManager } from "@/hooks/useSoundManager"

interface MathPuzzleProps {
  onBack: () => void
  difficulty: "easy" | "medium" | "hard"
}

export default function MathPuzzle({ onBack, difficulty }: MathPuzzleProps) {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [puzzle, setPuzzle] = useState<any>(null)
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const { playSound } = useSoundManager()

  const generatePuzzle = () => {
    const ranges = {
      easy: { min: 1, max: 10 },
      medium: { min: 5, max: 20 },
      hard: { min: 10, max: 30 }
    }
    
    const range = ranges[difficulty]
    
    // Generate a 3x3 grid with a pattern
    // Pattern: Each row adds the same number
    const baseNum = Math.floor(Math.random() * (range.max - range.min)) + range.min
    const increment = Math.floor(Math.random() * 5) + 2
    
    const grid = []
    for (let i = 0; i < 3; i++) {
      const row = []
      for (let j = 0; j < 3; j++) {
        row.push(baseNum + (i * 3 + j) * increment)
      }
      grid.push(row)
    }
    
    // Pick a random cell to hide
    const hiddenRow = Math.floor(Math.random() * 3)
    const hiddenCol = Math.floor(Math.random() * 3)
    const correctAnswer = grid[hiddenRow][hiddenCol]
    grid[hiddenRow][hiddenCol] = "?"
    
    // Generate options
    const options = [correctAnswer]
    while (options.length < 4) {
      const offset = Math.floor(Math.random() * 10) - 5
      const option = correctAnswer + offset
      if (!options.includes(option) && option > 0) {
        options.push(option)
      }
    }
    
    options.sort(() => Math.random() - 0.5)
    
    setPuzzle({ grid, options, correctAnswer })
    setTimeLeft(15)
    setFeedback(null)
    setSelectedAnswer(null)
  }

  useEffect(() => {
    generatePuzzle()
  }, [difficulty])

  useEffect(() => {
    if (timeLeft > 0 && feedback === null) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && feedback === null) {
      setFeedback("wrong")
      playSound('timeout')
      setTimeout(generatePuzzle, 1500)
    }
  }, [timeLeft, feedback])

  const handleAnswer = (answer: number) => {
    if (feedback !== null) return
    
    setSelectedAnswer(answer)
    const isCorrect = answer === puzzle.correctAnswer
    setFeedback(isCorrect ? "correct" : "wrong")
    
    playSound(isCorrect ? 'correct' : 'wrong')
    
    if (isCorrect) {
      setScore(score + 15)
    }
    
    setTimeout(generatePuzzle, 1500)
  }

  return (
    <GameLayout
      title="Math Puzzle Solver"
      score={score}
      timeLeft={timeLeft}
      onBack={onBack}
    >
      {puzzle && (
        <div className="space-y-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold" style={{ color: "var(--math-blue-deep)" }}>
              Find the missing number in the pattern
            </h3>
          </div>

          {/* 3x3 Grid */}
          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-6">
            {puzzle.grid.map((row: any[], rowIndex: number) => (
              row.map((cell: any, colIndex: number) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="aspect-square flex items-center justify-center text-2xl font-bold rounded-lg border-2"
                  style={{
                    backgroundColor: cell === "?" ? "var(--math-blue-deep)" : "white",
                    borderColor: "var(--math-blue-deep)",
                    color: cell === "?" ? "white" : "var(--math-blue-deep)"
                  }}
                >
                  {cell}
                </div>
              ))
            ))}
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4">
            {puzzle.options.map((option: number, index: number) => {
              let bgColor = "var(--math-blue-deep)"
              
              if (selectedAnswer === option) {
                bgColor = feedback === "correct" ? "var(--math-success)" : "var(--math-error)"
              } else if (feedback === "wrong" && option === puzzle.correctAnswer) {
                bgColor = "var(--math-success)"
              }
              
              return (
                <Button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={feedback !== null}
                  className="h-16 text-xl font-semibold text-white transition-all"
                  style={{ backgroundColor: bgColor }}
                >
                  {option}
                </Button>
              )
            })}
          </div>
        </div>
      )}
    </GameLayout>
  )
}