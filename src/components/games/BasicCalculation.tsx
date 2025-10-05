import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import GameLayout from "./GameLayout"
import { useSoundManager } from "@/hooks/useSoundManager"

interface BasicCalculationProps {
  onBack: () => void
  difficulty: "easy" | "medium" | "hard"
}

export default function BasicCalculation({ onBack, difficulty }: BasicCalculationProps) {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [question, setQuestion] = useState<any>(null)
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const { playSound } = useSoundManager()

  const generateQuestion = () => {
    const operations = ["+", "-", "*", "/"]
    const operation = operations[Math.floor(Math.random() * operations.length)]
    
    let num1, num2, correctAnswer
    
    const ranges = {
      easy: { min: 1, max: 20 },
      medium: { min: 10, max: 50 },
      hard: { min: 20, max: 100 }
    }
    
    const range = ranges[difficulty]
    
    if (operation === "/") {
      num2 = Math.floor(Math.random() * (range.max / 2 - 2)) + 2
      correctAnswer = Math.floor(Math.random() * 20) + 1
      num1 = num2 * correctAnswer
    } else {
      num1 = Math.floor(Math.random() * (range.max - range.min)) + range.min
      num2 = Math.floor(Math.random() * (range.max - range.min)) + range.min
      
      switch (operation) {
        case "+":
          correctAnswer = num1 + num2
          break
        case "-":
          correctAnswer = num1 - num2
          break
        case "*":
          correctAnswer = num1 * num2
          break
        default:
          correctAnswer = 0
      }
    }
    
    const options = [correctAnswer]
    while (options.length < 4) {
      const offset = Math.floor(Math.random() * 20) - 10
      const option = correctAnswer + offset
      if (!options.includes(option) && option !== correctAnswer) {
        options.push(option)
      }
    }
    
    options.sort(() => Math.random() - 0.5)
    
    setQuestion({
      text: `${num1} ${operation} ${num2} = ?`,
      options,
      correctAnswer
    })
    setTimeLeft(10)
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

  const handleAnswer = (answer: number) => {
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
      title="Basic Calculation"
      score={score}
      timeLeft={timeLeft}
      onBack={onBack}
    >
      {question && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-2" style={{ color: "var(--math-blue-deep)" }}>
              {question.text}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {question.options.map((option: number, index: number) => {
              let bgColor = "var(--math-blue-deep)"
              
              if (selectedAnswer === option) {
                bgColor = feedback === "correct" ? "var(--math-success)" : "var(--math-error)"
              } else if (feedback === "wrong" && option === question.correctAnswer) {
                bgColor = "var(--math-success)"
              }
              
              return (
                <Button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={feedback !== null}
                  className="h-20 text-2xl font-semibold text-white transition-all"
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