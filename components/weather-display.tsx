"use client"

import { Cloud, Droplets, Wind } from "lucide-react"
import { useWeather } from "@/contexts/weather-context"

export function WeatherDisplay() {
  const { state } = useWeather()

  if (!state.currentWeather) return null

  const { currentWeather, temperatureUnit } = state

  const convertTemp = (temp: number) => {
    if (temperatureUnit === "fahrenheit") {
      return Math.round((temp * 9) / 5 + 32)
    }
    return Math.round(temp)
  }

  const tempUnit = temperatureUnit === "celsius" ? "°C" : "°F"

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`
  }

  return (
    <div className="text-center text-white">
      <div className="mb-6">
        <h1 className="text-4xl font-light mb-2">
          {currentWeather.name}, {currentWeather.sys.country}
        </h1>
        <p className="text-white/80 text-lg">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="flex flex-col items-center mb-8">
        <img
          src={getWeatherIcon(currentWeather.weather[0].icon) || "/placeholder.svg"}
          alt={currentWeather.weather[0].description}
          className="w-32 h-32 mb-4"
        />
        <div className="text-7xl font-light mb-2">
          {convertTemp(currentWeather.main.temp)}
          {tempUnit}
        </div>
        <p className="text-xl text-white/90 capitalize mb-2">{currentWeather.weather[0].description}</p>
        <p className="text-white/70">
          Feels like {convertTemp(currentWeather.main.feels_like)}
          {tempUnit}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
        <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/30">
          <div className="flex items-center gap-3 mb-2">
            <Droplets className="h-6 w-6 text-blue-300" />
            <span className="text-white/80">Humidity</span>
          </div>
          <p className="text-2xl font-semibold">{currentWeather.main.humidity}%</p>
        </div>

        <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/30">
          <div className="flex items-center gap-3 mb-2">
            <Wind className="h-6 w-6 text-green-300" />
            <span className="text-white/80">Wind Speed</span>
          </div>
          <p className="text-2xl font-semibold">{currentWeather.wind.speed} m/s</p>
        </div>

        <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/30">
          <div className="flex items-center gap-3 mb-2">
            <Cloud className="h-6 w-6 text-gray-300" />
            <span className="text-white/80">Condition</span>
          </div>
          <p className="text-2xl font-semibold capitalize">{currentWeather.weather[0].main}</p>
        </div>
      </div>
    </div>
  )
}
