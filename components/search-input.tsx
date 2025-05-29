"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Search } from "lucide-react"
import { useWeather } from "@/contexts/weather-context"
import { SearchSuggestions } from "./search-suggestions"

export function SearchInput() {
  const [query, setQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { fetchWeather, state } = useWeather()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      await fetchWeather(query.trim())
      setQuery("")
      setShowSuggestions(false)
      inputRef.current?.blur()
    }
  }

  const handleSelectCity = async (cityName: string) => {
    await fetchWeather(cityName)
    setQuery("")
    setShowSuggestions(false)
    inputRef.current?.blur()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setShowSuggestions(value.length >= 2)
  }

  const handleInputFocus = () => {
    if (query.length >= 2) {
      setShowSuggestions(true)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Search for a city..."
          disabled={state.loading}
          className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent disabled:opacity-50"
        />
      </div>

      <SearchSuggestions
        query={query}
        onSelectCity={handleSelectCity}
        isVisible={showSuggestions}
        onClose={() => setShowSuggestions(false)}
      />
    </form>
  )
}
