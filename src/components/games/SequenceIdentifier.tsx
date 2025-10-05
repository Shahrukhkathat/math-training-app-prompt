import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import GameLayout from "./GameLayout"
import { useSoundManager } from "@/hooks/useSoundManager"

interface SequenceIdentifierProps {
  onBack: () => void
  difficulty: "easy" | "medium" | "hard"
}

export default function SequenceIdentifier({ onBack, difficulty }: SequenceIdentifierProps) {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(12)
  const [question, setQuestion] = useState<any>(null)
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const { playSound } = useSoundManager()

  const generateQuestion = () => {
    const ranges = {
      easy: { start: 1, max: 10, step: [2, 3, 5] },
      medium: { start: 5, max: 20, step: [3, 4, 5, 7] },
      hard: { start: 10, max: 30, step: [5, 7, 9, 11] }
    }
    
    const range = ranges[difficulty]
    const startNum = Math.floor(Math.random() * range.max) + range.start
    const step = range.step[Math.floor(Math.random() * range.step.length)]
    
    // Generate sequence
    const sequence = []
    for (let i = 0; i < 5; i++) {
      sequence.push(startNum + (i * step))
    }
    
    const correctAnswer = startNum + (5 * step)
    
    // Generate options
    const options = [correctAnswer]
    while (options.length < 4) {
      const offset = Math.floor(Math.random() * (step * 2)) - step
      const option = correctAnswer + offset
      if (!options.includes(option) && option !== correctAnswer && option > 0) {
        options.push(option)
      }
    }
    
    options.sort(() => Math.random() - 0.5)
    
    setQuestion({ sequence, options, correctAnswer, step })
    setTimeLeft(12)
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
      setScore(score + 12)
    }
    
    setTimeout(generateQuestion, 1500)
  }

  return (
    <GameLayout
      title="Sequence Identifier"
      score={score}
      timeLeft={timeLeft}
      onBack={onBack}
    >
      {question && (
        <div className="space-y-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold" style={{ color: "var(--math-blue-deep)" }}>
              What comes next in the sequence?
            </h3>
          </div>

          {/* Sequence Display */}
          <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
            {question.sequence.map((num: number, index: number) => (
              <div key={index}>
                <div
                  className="w-16 h-16 flex items-center justify-center text-2xl font-bold rounded-lg border-2"
                  style={{
                    backgroundColor: "white",
                    borderColor: "var(--math-blue-deep)",
                    color: "var(--math-blue-deep)"
                  }}
                >
                  {num}
                </div>
              </div>
            ))}
            <div className="text-2xl font-bold mx-2" style={{ color: "var(--math-blue-deep)" }}>
              →
            </div>
            <div
              className="w-16 h-16 flex items-center justify-center text-3xl font-bold rounded-lg border-2"
              style={{
                backgroundColor: "var(--math-blue-deep)",
                borderColor: "var(--math-blue-deep)",
                color: "white"
              }}
            >
              ?
            </div>
          </div>

          {/* Options */}
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