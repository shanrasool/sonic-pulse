import { BarChart3 } from "lucide-react"

interface InflationGovernanceCardProps {
  inflationGovernor: {
    initial: number
    terminal: number
    taper: number
    foundation: number
  } | null
  isLoading: boolean
}

export function InflationGovernanceCard({ inflationGovernor, isLoading }: InflationGovernanceCardProps) {
  return (
    <div className="bg-black/40 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-xl p-5 overflow-hidden">
      <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-blue-400" />
        Inflation Governance
      </h2>

      {inflationGovernor && !isLoading && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm">Initial Rate</span>
            <span className="text-white font-medium">{(inflationGovernor.initial * 100).toFixed(2)}%</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm">Terminal Rate</span>
            <span className="text-white font-medium">{(inflationGovernor.terminal * 100).toFixed(2)}%</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm">Taper Rate</span>
            <span className="text-white font-medium">{(inflationGovernor.taper * 100).toFixed(2)}%</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm">Foundation Percent</span>
            <span className="text-white font-medium">{(inflationGovernor.foundation * 100).toFixed(2)}%</span>
          </div>
        </div>
      )}

      {!inflationGovernor && !isLoading && (
        <p className="text-white/50 text-sm">Inflation governance data unavailable</p>
      )}

      {isLoading && (
        <div className="space-y-3 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-white/10 rounded w-24"></div>
              <div className="h-4 bg-white/10 rounded w-16"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 