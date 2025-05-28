export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center text-white">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white mb-4"></div>
      <p className="text-lg">Loading weather data...</p>
    </div>
  )
}
