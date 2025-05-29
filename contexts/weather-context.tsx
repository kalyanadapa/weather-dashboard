"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useCallback } from "react"

interface WeatherData {
  name: string
  main: {
    temp: number
    humidity: number
    feels_like: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
  }
  sys: {
    country: string
  }
}

interface ForecastData {
  list: Array<{
    dt: number
    main: {
      temp: number
    }
    weather: Array<{
      main: string
      icon: string
    }>
  }>
}

interface WeatherState {
  currentWeather: WeatherData | null
  forecast: ForecastData | null
  loading: boolean
  error: string | null
  lastSearchedCity: string | null
  temperatureUnit: "celsius" | "fahrenheit"
}

type WeatherAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CURRENT_WEATHER"; payload: WeatherData }
  | { type: "SET_FORECAST"; payload: ForecastData }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_LAST_SEARCHED_CITY"; payload: string }
  | { type: "TOGGLE_TEMPERATURE_UNIT" }

const initialState: WeatherState = {
  currentWeather: null,
  forecast: null,
  loading: false,
  error: null,
  lastSearchedCity: null,
  temperatureUnit: "celsius",
}

function weatherReducer(state: WeatherState, action: WeatherAction): WeatherState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_CURRENT_WEATHER":
      return { ...state, currentWeather: action.payload, error: null }
    case "SET_FORECAST":
      return { ...state, forecast: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }
    case "CLEAR_ERROR":
      return { ...state, error: null }
    case "SET_LAST_SEARCHED_CITY":
      return { ...state, lastSearchedCity: action.payload }
    case "TOGGLE_TEMPERATURE_UNIT":
      return {
        ...state,
        temperatureUnit: state.temperatureUnit === "celsius" ? "fahrenheit" : "celsius",
      }
    default:
      return state
  }
}

const WeatherContext = createContext<{
  state: WeatherState
  dispatch: React.Dispatch<WeatherAction>
  fetchWeather: (city: string) => Promise<void>
  fetchForecast: (city: string) => Promise<void>
  fetchWeatherByCoords: (lat: number, lon: number) => Promise<void>
} | null>(null)

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(weatherReducer, initialState)

  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY

  const fetchWeather = useCallback(
    async (city: string) => {
      if (!API_KEY) {
        dispatch({ type: "SET_ERROR", payload: "API key not configured" })
        return
      }

      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "CLEAR_ERROR" })

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
        )

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("City not found. Please check the spelling and try again.")
          }
          throw new Error("Failed to fetch weather data. Please try again.")
        }

        const data = await response.json()
        dispatch({ type: "SET_CURRENT_WEATHER", payload: data })
        dispatch({ type: "SET_LAST_SEARCHED_CITY", payload: city })

        // Save to localStorage
        localStorage.setItem("lastSearchedCity", city)

        // Fetch forecast as well
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`,
        )
        if (forecastResponse.ok) {
          const forecastData = await forecastResponse.json()
          dispatch({ type: "SET_FORECAST", payload: forecastData })
        }
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: error instanceof Error ? error.message : "An unexpected error occurred",
        })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    [API_KEY],
  )

  const fetchForecast = useCallback(
    async (city: string) => {
      if (!API_KEY) return

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`,
        )

        if (response.ok) {
          const data = await response.json()
          dispatch({ type: "SET_FORECAST", payload: data })
        }
      } catch (error) {
        console.error("Failed to fetch forecast:", error)
      }
    },
    [API_KEY],
  )

  const fetchWeatherByCoords = useCallback(
    async (lat: number, lon: number) => {
      if (!API_KEY) {
        dispatch({ type: "SET_ERROR", payload: "API key not configured" })
        return
      }

      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "CLEAR_ERROR" })

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch weather data for your location.")
        }

        const data = await response.json()
        dispatch({ type: "SET_CURRENT_WEATHER", payload: data })
        dispatch({ type: "SET_LAST_SEARCHED_CITY", payload: data.name })

        // Save to localStorage
        localStorage.setItem("lastSearchedCity", data.name)

        // Fetch forecast as well
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
        )
        if (forecastResponse.ok) {
          const forecastData = await forecastResponse.json()
          dispatch({ type: "SET_FORECAST", payload: forecastData })
        }
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: error instanceof Error ? error.message : "An unexpected error occurred",
        })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    [API_KEY],
  )

  // Load last searched city from localStorage on mount
  useEffect(() => {
    const lastCity = localStorage.getItem("lastSearchedCity")
    if (lastCity) {
      dispatch({ type: "SET_LAST_SEARCHED_CITY", payload: lastCity })
      fetchWeather(lastCity)
    }
  }, [fetchWeather])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (state.lastSearchedCity) {
      const interval = setInterval(() => {
        fetchWeather(state.lastSearchedCity!)
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [state.lastSearchedCity, fetchWeather])

  return (
    <WeatherContext.Provider value={{ state, dispatch, fetchWeather, fetchForecast, fetchWeatherByCoords }}>
      {children}
    </WeatherContext.Provider>
  )
}

export function useWeather() {
  const context = useContext(WeatherContext)
  if (!context) {
    throw new Error("useWeather must be used within a WeatherProvider")
  }
  return context
}
