"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

interface PriceData {
  timestamp: number
  value: number
}

export function PriceChart() {
  const [priceData, setPriceData] = useState<PriceData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await fetch(
          "https://public-api.birdeye.so/defi/ohlcv?address=So11111111111111111111111111111111111111112&type=1H&time_from=1704067200",
          {
            headers: {
              'X-API-KEY': process.env.NEXT_PUBLIC_BIRDEYE_API_KEY || '',
            }
          }
        )
        const data = await response.json()
        
        if (data.success) {
          const formattedData = data.data.items.map((item: any) => ({
            timestamp: item.unixTime * 1000,
            value: item.close
          }))
          setPriceData(formattedData)
        } else {
          setError("Failed to fetch price data")
        }
      } catch (err) {
        setError("Error fetching price data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPriceData()
  }, [])

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatPrice = (value: number) => {
    return `$${value.toFixed(2)}`
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl mt-5 p-5 overflow-hidden">
      <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-purple-400" />
        SOL Price
      </h2>

      {isLoading ? (
        <div className="h-[300px] flex items-center justify-center">
          <div className="animate-pulse text-white/50">Loading price data...</div>
        </div>
      ) : error ? (
        <div className="h-[300px] flex items-center justify-center text-red-400">
          {error}
        </div>
      ) : (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatDate}
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: "rgba(255,255,255,0.7)" }}
              />
              <YAxis
                domain={["auto", "auto"]}
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: "rgba(255,255,255,0.7)" }}
                tickFormatter={formatPrice}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "rgba(255,255,255,0.7)" }}
                formatter={(value: number) => [formatPrice(value), "Price"]}
                labelFormatter={formatDate}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="url(#gradient)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#8B5CF6" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
} 