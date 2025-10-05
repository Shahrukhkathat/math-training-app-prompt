import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import GameLayout from "./GameLayout"
import { useSoundManager } from "@/hooks/useSoundManager"

interface InequalitySolverProps {
  onBack: () => void
  difficulty: "easy" | "medium" | "hard"
}

export default function InequalitySolver({ onBack, difficulty }: InequalitySolverProps) {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(8)
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
    
    // Left expression
    const leftNum1 = Math.floor(Math.random() * (range.max - range.min)) + range.min
    const leftNum2 = Math.floor(Math.random() * (range.max / 2)) + 1
    const leftOp = operations[Math.floor(Math.random() * operations.length)]
    const leftResult = leftOp === "+" ? leftNum1 + leftNum2 : leftNum1 - leftNum2
    
    // Right expression
    const rightNum1 = Math.floor(Math.random() * (range.max - range.min)) + range.min
    const rightNum2 = Math.floor(Math.random() * (range.max / 2)) + 1
    const rightOp = operations[Math.floor(Math.random() * operations.length)]
    const rightResult = rightOp === "+" ? rightNum1 + rightNum2 : rightNum1 - rightNum2
    
    let correctAnswer
    if (leftResult < rightResult) correctAnswer = "<"
    else if (leftResult > rightResult) correctAnswer = ">"
    else correctAnswer = "="
    
    setQuestion({
      leftExpr: `${leftNum1} ${leftOp} ${leftNum2}`,
      rightExpr: `${rightNum1} ${rightOp} ${rightNum2}`,
      leftResult,
      rightResult,
      correctAnswer
    })
    setTimeLeft(8)
    setFeedback(null)
    setSelectedAnswer(null)
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
    const isCorrect = answer === question.correctAnswer
    setFeedback(isCorrect ? "correct" : "wrong")
    
    playSound(isCorrect ? 'correct' : 'wrong')
    
    if (isCorrect) {
      setScore(score + 10)
    }
    
    setTimeout(generateQuestion, 1500)
  }

  return (
    <GameLayout
      title="Inequality Solver"
      score={score}
      timeLeft={timeLeft}
      onBack={onBack}
    >
      {question && (
        <div className="space-y-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold" style={{ color: "var(--math-blue-deep)" }}>
              Which comparison is correct?
            </h3>
          </div>

          <div className="flex items-center justify-center gap-6 text-3xl font-bold mb-8" style={{ color: "var(--math-blue-deep)" }}>
            <div className="bg-white p-6 rounded-lg border-2" style={{ borderColor: "var(--math-blue-deep)" }}>
              {question.leftExpr}
            </div>
            <div className="text-4xl">?</div>
            <div className="bg-white p-6 rounded-lg border-2" style={{ borderColor: "var(--math-blue-deep)" }}>
              {question.rightExpr}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {["<", "=", ">"].map((symbol) => {
              let bgColor = "var(--math-blue-deep)"
              
              if (selectedAnswer === symbol) {
                bgColor = feedback === "correct" ? "var(--math-success)" : "var(--math-error)"
              } else if (feedback === "wrong" && symbol === question.correctAnswer) {
                bgColor = "var(--math-success)"
              }
              
              return (
                <Button
                  key={symbol}
                  onClick={() => handleAnswer(symbol)}
                  disabled={feedback !== null}
                  className="h-20 text-4xl font-bold text-white transition-all"
                  style={{ backgroundColor: bgColor }}
                >
                  {symbol}
                </Button>
              )
            })}
          </div>
        </div>
      )}
    </GameLayout>
  )
}