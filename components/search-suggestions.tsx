"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin } from "lucide-react"

interface City {
  name: string
  country: string
  state?: string
  lat: number
  lon: number
}

interface SearchSuggestionsProps {
  query: string
  onSelectCity: (city: string) => void
  isVisible: boolean
  onClose: () => void
}

export function SearchSuggestions({ query, onSelectCity, isVisible, onClose }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<City[]>([])
  const [loading, setLoading] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim() || query.length < 2 || !API_KEY) {
        setSuggestions([])
        return
      }

      setLoading(true)
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`,
        )

        if (response.ok) {
          const data = await response.json()
          setSuggestions(data)
        }
      } catch (error) {
        console.error("Failed to fetch suggestions:", error)
      } finally {
        setLoading(false)
      }
    }

    // Debounce the API call
    const timeoutId = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timeoutId)
  }, [query, API_KEY])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isVisible, onClose])

  if (!isVisible || (!loading && suggestions.length === 0)) return null

  return (
    <div
      ref={suggestionsRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl overflow-hidden z-10"
    >
      {loading ? (
        <div className="p-4 text-center text-white/70">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mx-auto mb-2"></div>
          Searching...
        </div>
      ) : (
        <div className="max-h-60 overflow-y-auto">
          {suggestions.map((city, index) => (
            <button
              key={`${city.name}-${city.country}-${index}`}
              onClick={() => {
                onSelectCity(city.name)
                onClose()
              }}
              className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-white/70 flex-shrink-0" />
                <div className="text-white">
                  <div className="font-medium">
                    {city.name}
                    {city.state && `, ${city.state}`}
                  </div>
                  <div className="text-sm text-white/70">{city.country}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
