"use client"

import { WeatherProvider } from "@/contexts/weather-context"
import { SearchInput } from "@/components/search-input"
import { WeatherDisplay } from "@/components/weather-display"
import { Forecast } from "@/components/forecast"
import { ErrorDisplay } from "@/components/error-display"
import { Loading } from "@/components/loading"
import { TemperatureToggle } from "@/components/temperature-toggle"
import { useWeather } from "@/contexts/weather-context"

function DashboardContent() {
  const { state } = useWeather()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-green-500 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <TemperatureToggle />

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-light text-white mb-4">Weather Dashboard</h1>
            <p className="text-white/80 text-lg mb-8">Get real-time weather information for any city</p>
            <SearchInput />
          </div>

          <div className="mt-12">
            {state.loading ? (
              <Loading />
            ) : state.currentWeather ? (
              <>
                <WeatherDisplay />
                <Forecast />
              </>
            ) : (
              <div className="text-center text-white">
                <p className="text-xl">Search for a city to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ErrorDisplay />
    </div>
  )
}

export default function WeatherDashboard() {
  return (
    <WeatherProvider>
      <DashboardContent />
    </WeatherProvider>
  )
}
