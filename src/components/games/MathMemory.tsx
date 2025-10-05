import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import GameLayout from "./GameLayout"
import { useSoundManager } from "@/hooks/useSoundManager"

interface MathMemoryProps {
  onBack: () => void
  difficulty: "easy" | "medium" | "hard"
}

export default function MathMemory({ onBack, difficulty }: MathMemoryProps) {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [question, setQuestion] = useState<any>(null)
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const { playSound } = useSoundManager()

  const generateQuestion = () => {
    const ranges = {
      easy: { min: 1, max: 20 },
      medium: { min: 10, max: 50 },
      hard: { min: 20, max: 100 }
    }
    
    const range = ranges[difficulty]
    const operations = ["+", "-"]
    
    // Main problem
    const num1 = Math.floor(Math.random() * (range.max - range.min)) + range.min
    const num2 = Math.floor(Math.random() * (range.max / 2)) + 1
    const mainOp = operations[Math.floor(Math.random() * operations.length)]
    const mainResult = mainOp === "+" ? num1 + num2 : num1 - num2
    
    // Generate option calculations that equal different results
    const options = []
    const correctOption = generateCalculation(mainResult, range)
    options.push(correctOption)
    
    // Generate 3 wrong options
    for (let i = 0; i < 3; i++) {
      const wrongResult = mainResult + Math.floor(Math.random() * 20) - 10
      if (wrongResult > 0 && wrongResult !== mainResult) {
        options.push(generateCalculation(wrongResult, range))
      }
    }
    
    options.sort(() => Math.random() - 0.5)
    
    setQuestion({
      mainProblem: `${num1} ${mainOp} ${num2}`,
      mainResult,
      options,
      correctOption
    })
    setTimeLeft(15)
    setFeedback(null)
    setSelectedAnswer(null)
  }

  const generateCalculation = (target: number, range: any) => {
    const operations = ["+", "-"]
    const op = operations[Math.floor(Math.random() * operations.length)]
    
    let a, b
    if (op === "+") {
      a = Math.floor(Math.random() * target)
      b = target - a
    } else {
      b = Math.floor(Math.random() * (range.max / 2))
      a = target + b
    }
    
    return `${a} ${op} ${b}`
  }

  useEffect(() => {
    generateQuestion()
  }, [difficulty])

  useEffect(() => {
    if (timeLeft > 0 && feedback === null) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && feedback === null) {
      setFeedback("wrong")
      playSound('timeout')
      setTimeout(generateQuestion, 1500)
    }
  }, [timeLeft, feedback])

  const handleAnswer = (answer: string) => {
    if (feedback !== null) return
    
    setSelectedAnswer(answer)
    const isCorrect = answer === question.correctOption
    setFeedback(isCorrect ? "correct" : "wrong")
    
    playSound(isCorrect ? 'correct' : 'wrong')
    
    if (isCorrect) {
      setScore(score + 15)
    }
    
    setTimeout(generateQuestion, 1500)
  }

  return (
    <GameLayout
      title="Math Memory"
      score={score}
      timeLeft={timeLeft}
      onBack={onBack}
    >
      {question && (
        <div className="space-y-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold" style={{ color: "var(--math-blue-deep)" }}>
              Which option equals the result of:
            </h3>
          </div>

          {/* Main Problem */}
          <div className="text-center mb-8">
            <div className="inline-block bg-white p-6 rounded-lg border-4" style={{ borderColor: "var(--math-blue-deep)" }}>
              <div className="text-4xl font-bold" style={{ color: "var(--math-blue-deep)" }}>
                {question.mainProblem} = ?
              </div>
            </div>
          </div>

          {/* Option Calculations */}
          <div className="grid grid-cols-2 gap-4">
            {question.options.map((option: string, index: number) => {
              let bgColor = "var(--math-blue-deep)"
              
              if (selectedAnswer === option) {
                bgColor = feedback === "correct" ? "var(--math-success)" : "var(--math-error)"
              } else if (feedback === "wrong" && option === question.correctOption) {
                bgColor = "var(--math-success)"
              }
              
              return (
                <Button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={feedback !== null}
                  className="h-20 text-xl font-semibold text-white transition-all"
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