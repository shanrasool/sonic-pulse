import { Activity } from "lucide-react"
import { formatNumber } from "@/lib/utils"
import { BlockResponse } from "@solana/web3.js"

interface NetworkStatusCardProps {
  latestBlock: BlockResponse | null
  slotHeight: number
  epochInfo: { blockHeight?: number } | null
  tps: number | null
  totalTransactions: number | null
  isLoading: boolean
}

export function NetworkStatusCard({
  latestBlock,
  slotHeight,
  epochInfo,
  tps,
  totalTransactions,
  isLoading
}: NetworkStatusCardProps) {
  const formatBlockTime = (timestamp: number | undefined) => {
    if (!timestamp) return "N/A"
    return new Date(timestamp * 1000).toLocaleString()
  }

  return (
    <div className="bg-black/40 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-xl p-5 overflow-hidden">
      <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-purple-400" />
        Network Status
      </h2>

      <div className="space-y-3">
        {!isLoading ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Current Slot</span>
              <span className="text-white font-medium">{formatNumber(slotHeight)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Latest Block Time</span>
              <span className="text-white font-medium">{formatBlockTime(latestBlock?.blockTime || 0)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Block Height</span>
              <span className="text-white font-medium">{formatNumber(epochInfo?.blockHeight || 0)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">TPS</span>
              <span className="text-white font-medium">{tps?.toFixed(0)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Total Transactions</span>
              <span className="text-white font-medium">{formatNumber(totalTransactions || 0)}</span>
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