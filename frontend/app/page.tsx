"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Search, ArrowRight, Layers, RefreshCw, AlertCircle } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-mobile"
import { useBlockchainData } from "@/hooks/use-blockchain-data"
import { NetworkStatusCard } from "@/components/layout/network-card"
import { EconomicsCard } from "@/components/layout/economic-card"
import { EpochProgressCard } from "@/components/layout/epoch-card"
import { InflationGovernanceCard } from "@/components/layout/inflation-card"

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const isMobile = useMediaQuery("(max-width: 640px)")
  const {
    latestBlock,
    slotHeight,
    epochInfo,
    inflationRate,
    inflationGovernor,
    supply,
    totalTransactions,
    tps,
    isLoading,
    error,
    refreshData,
  } = useBlockchainData()

  const handleSearch = () => {
    console.log("Searching for:", searchTerm)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex flex-col items-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <motion.div
            className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,50,255,0.15),transparent_50%)]"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/4 left-1/4 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(80,100,255,0.1),transparent_40%)]"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, -30, 0],
              y: [0, 30, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(150,50,200,0.1),transparent_35%)]"
            animate={{
              scale: [1, 1.15, 1],
              x: [0, 40, 0],
              y: [0, -20, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 18,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-3xl px-2 sm:px-0 py-8 sm:py-12"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col items-center mb-6 sm:mb-8"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mb-3 sm:mb-4 shadow-lg shadow-purple-500/20">
            <Layers className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2 text-white tracking-tight text-center">
            Sonic Pulse
          </h1>
          <p className="text-center text-white/70 max-w-md text-sm sm:text-base px-4">Analytics for Sonic SVM</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-5 sm:p-8 w-full mb-6"
        >
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4 sm:w-5 sm:h-5" />
              <Input
                className="pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 h-12 sm:h-14 text-base sm:text-lg"
                placeholder={isMobile ? "Enter address, tx hash..." : "Enter address, tx hash or block number..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            <div className="flex gap-4">
              <Button onClick={handleSearch} className="flex-1 h-11 sm:h-12 gap-2 text-sm sm:text-base" size="lg">
                Search <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex items-center justify-between mb-4 px-1"
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${isLoading ? "bg-yellow-400 animate-pulse" : error ? "bg-red-500" : "bg-green-400"}`}
            ></div>
            <span className="text-white/70 text-xs sm:text-sm">
              {isLoading ? "Fetching data..." : error ? "Error loading data" : "Live data"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
            className="text-white/70 hover:text-white hover:bg-white/10 p-1 h-8"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="ml-1 text-xs">Refresh</span>
          </Button>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-xl p-3 mb-4 flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-white/90 text-sm">Failed to load blockchain data. Please try again.</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NetworkStatusCard
            latestBlock={latestBlock}
            slotHeight={slotHeight}
            epochInfo={epochInfo}
            tps={tps}
            totalTransactions={totalTransactions}
            isLoading={isLoading}
          />

          <EconomicsCard
            supply={supply}
            inflationRate={inflationRate}
            inflationGovernor={inflationGovernor}
            isLoading={isLoading}
          />

          <EpochProgressCard
            epochInfo={epochInfo}
            isLoading={isLoading}
          />

          <InflationGovernanceCard
            inflationGovernor={inflationGovernor}
            isLoading={isLoading}
          />
        </div>

        <div className="mt-6 text-center text-white/40 text-xs sm:text-sm">
          Explore the Sonic SVM with real-time data and insights
        </div>
      </motion.div>
    </div>
  )
}
