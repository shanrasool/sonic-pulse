import { DollarSign } from "lucide-react"
import { formatNumber } from "@/lib/utils"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"

interface EconomicsCardProps {
  supply: number | null
  inflationRate: { total: number; validator: number; foundation: number } | null
  inflationGovernor: { initial: number } | null
  isLoading: boolean
}

export function EconomicsCard({
  supply,
  inflationRate,
  inflationGovernor,
  isLoading
}: EconomicsCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-5 overflow-hidden">
      <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-blue-400" />
        Economics
      </h2>

      <div className="space-y-3">
        {!isLoading ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Total Supply</span>
              <span className="text-white font-medium">{formatNumber((supply ?? 0) / LAMPORTS_PER_SOL)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Current Inflation</span>
              <span className="text-white font-medium">{`${(inflationRate?.total || 0).toFixed(2)}%`}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Validator Inflation</span>
              <span className="text-white font-medium">{`${(inflationRate?.validator || 0).toFixed(2)}%`}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Foundation Inflation</span>
              <span className="text-white font-medium">{`${(inflationRate?.foundation || 0).toFixed(2)}%`}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Initial Inflation</span>
              <span className="text-white font-medium">{`${(inflationGovernor?.initial || 0).toFixed(2)}%`}</span>
            </div>
          </>
        ) : (
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
    </div>
  )
} 