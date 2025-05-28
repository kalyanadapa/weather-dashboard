"use client"

import { useWeather } from "@/contexts/weather-context"

export function TemperatureToggle() {
  const { state, dispatch } = useWeather()

  return (
    <button
      onClick={() => dispatch({ type: "TOGGLE_TEMPERATURE_UNIT" })}
      className="fixed top-4 left-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg px-4 py-2 text-white hover:bg-white/30 transition-colors"
    >
      °{state.temperatureUnit === "celsius" ? "C" : "F"}
    </button>
  )
}
