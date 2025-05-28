"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { useWeather } from "@/contexts/weather-context"

export function SearchInput() {
  const [query, setQuery] = useState("")
  const { fetchWeather, state } = useWeather()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      await fetchWeather(query.trim())
      setQuery("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          disabled={state.loading}
          className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent disabled:opacity-50"
        />
      </div>
    </form>
  )
}
