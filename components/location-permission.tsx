"use client"

import { MapPin, X } from "lucide-react"
import { useGeolocation } from "@/hooks/use-geolocation"
import { useWeather } from "@/contexts/weather-context"
import { useEffect, useState, useRef } from "react"

export function LocationPermission() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [hasCheckedLocation, setHasCheckedLocation] = useState(false)
  const { coordinates, loading, error, requestLocation } = useGeolocation()
  const { fetchWeatherByCoords, state } = useWeather()
  const hasFetchedWeather = useRef(false)

  useEffect(() => {
    // Check if we should show location prompt
    const hasAskedBefore = localStorage.getItem("locationAsked")
    const hasLastSearchedCity = localStorage.getItem("lastSearchedCity")

    if (!hasAskedBefore && !hasLastSearchedCity && !hasCheckedLocation) {
      setShowPrompt(true)
      setHasCheckedLocation(true)
    }
  }, [hasCheckedLocation])

  useEffect(() => {
    if (coordinates && !state.currentWeather && !state.loading && !hasFetchedWeather.current) {
      hasFetchedWeather.current = true
      fetchWeatherByCoords(coordinates.latitude, coordinates.longitude)
    }
  }, [coordinates, state.currentWeather, state.loading, fetchWeatherByCoords])

  const handleAllowLocation = () => {
    localStorage.setItem("locationAsked", "true")
    requestLocation()
    setShowPrompt(false)
  }

  const handleDenyLocation = () => {
    localStorage.setItem("locationAsked", "true")
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/30 max-w-md w-full text-white">
        <div className="flex items-start gap-3 mb-4">
          <MapPin className="h-6 w-6 text-blue-300 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Use Your Location</h3>
            <p className="text-white/80 text-sm">
              Allow location access to get weather information for your current location automatically.
            </p>
          </div>
          <button onClick={handleDenyLocation} className="text-white/70 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleAllowLocation}
            disabled={loading}
            className="flex-1 bg-blue-500/80 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {loading ? "Getting Location..." : "Allow Location"}
          </button>
          <button
            onClick={handleDenyLocation}
            className="px-4 py-2 border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  )
}
