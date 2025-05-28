"use client"

import { AlertCircle, X } from "lucide-react"
import { useWeather } from "@/contexts/weather-context"

export function ErrorDisplay() {
  const { state, dispatch } = useWeather()

  if (!state.error) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-red-500/90 backdrop-blur-md text-white p-4 rounded-lg shadow-lg border border-red-400/50">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium">Error</p>
            <p className="text-sm opacity-90 mt-1">{state.error}</p>
          </div>
          <button
            onClick={() => dispatch({ type: "CLEAR_ERROR" })}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
