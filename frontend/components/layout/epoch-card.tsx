import { Clock } from "lucide-react"
import { formatNumber } from "@/lib/utils"
import { motion } from "framer-motion"

interface EpochProgressCardProps {
  epochInfo: { slotIndex: number; slotsInEpoch: number; epoch: number } | null
  isLoading: boolean
}

export function EpochProgressCard({ epochInfo, isLoading }: EpochProgressCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-5 overflow-hidden">
      <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-purple-400" />
        Epoch Progress
      </h2>

      {!isLoading && epochInfo ? (
        <>
          <div className="w-full bg-white/10 rounded-full h-3 mb-4 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${(epochInfo.slotIndex / epochInfo.slotsInEpoch) * 100}%` }}
              transition={{ delay: 1, duration: 1 }}
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm">Progress</span>
            <span className="text-white font-medium">
              {`${((epochInfo.slotIndex / epochInfo.slotsInEpoch) * 100).toFixed(2)}%`}
            </span>
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="text-white/70 text-sm">Slots Remaining</span>
            <span className="text-white font-medium">
              {formatNumber(epochInfo.slotsInEpoch - epochInfo.slotIndex)}
            </span>
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="text-white/70 text-sm">Slots in Epoch</span>
            <span className="text-white font-medium">
              {`${formatNumber(epochInfo.slotIndex)} / ${formatNumber(epochInfo.slotsInEpoch)}`}
            </span>
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="text-white/70 text-sm">Current Epoch</span>
            <span className="text-white font-medium">{epochInfo.epoch}</span>
          </div>
        </>
      ) : !isLoading && !epochInfo ? (
        <p className="text-white/50 text-sm">Epoch data unavailable</p>
      ) : (
        <div className="flex flex-col gap-2 animate-pulse">
          <div className="w-full bg-white/10 rounded-full h-3"></div>
          <div className="flex justify-between mt-2">
            <div className="h-4 bg-white/10 rounded w-20"></div>
            <div className="h-4 bg-white/10 rounded w-16"></div>
          </div>
          <div className="flex justify-between mt-2">
            <div className="h-4 bg-white/10 rounded w-24"></div>
            <div className="h-4 bg-white/10 rounded w-12"></div>
          </div>
        </div>
      )}
    </div>
  )
} 