import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface GameLayoutProps {
  title: string
  score: number
  timeLeft: number
  onBack: () => void
  children: ReactNode
}

export default function GameLayout({ title, score, timeLeft, onBack, children }: GameLayoutProps) {
  const progressValue = (timeLeft / 10) * 100

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--math-blue-light)" }}>
      {/* Top Bar */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: "var(--math-blue-deep)" }}>
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        <div className="w-10" />
      </div>

      {/* Score and Timer */}
      <div className="px-4 py-4 border-b-2" style={{ borderColor: "var(--math-blue-deep)" }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-semibold" style={{ color: "var(--math-blue-deep)" }}>
              Points: {score}
            </div>
            <div className="text-lg font-semibold" style={{ color: "var(--math-blue-deep)" }}>
              Time: {timeLeft}s
            </div>
          </div>
          <Progress 
            value={progressValue} 
            className="h-2"
            style={{
              backgroundColor: "rgba(30, 58, 138, 0.2)"
            }}
          />
        </div>
      </div>

      {/* Game Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8 border-2" style={{ borderColor: "var(--math-blue-deep)" }}>
          {children}
        </div>
      </div>
    </div>
  )
}