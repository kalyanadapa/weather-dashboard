"use client"

import { useWeather } from "@/contexts/weather-context"

export function Forecast() {
  const { state } = useWeather()

  if (!state.forecast) return null

  const { forecast, temperatureUnit } = state

  const convertTemp = (temp: number) => {
    if (temperatureUnit === "fahrenheit") {
      return Math.round((temp * 9) / 5 + 32)
    }
    return Math.round(temp)
  }

  const tempUnit = temperatureUnit === "celsius" ? "°C" : "°F"

  // Get daily forecasts (every 8th item represents roughly 24 hours)
  const dailyForecasts = forecast.list.filter((_, index) => index % 8 === 0).slice(0, 5)

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-light text-white mb-6 text-center">5-Day Forecast</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
        {dailyForecasts.map((day, index) => {
          const date = new Date(day.dt * 1000)
          const dayName = date.toLocaleDateString("en-US", { weekday: "short" })

          return (
            <div
              key={day.dt}
              className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 text-center text-white"
            >
              <p className="font-medium mb-2">{dayName}</p>
              <img
                src={getWeatherIcon(day.weather[0].icon) || "/placeholder.svg"}
                alt={day.weather[0].main}
                className="w-16 h-16 mx-auto mb-2"
              />
              <p className="text-lg font-semibold">
                {convertTemp(day.main.temp)}
                {tempUnit}
              </p>
              <p className="text-sm text-white/80 capitalize">{day.weather[0].main}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
