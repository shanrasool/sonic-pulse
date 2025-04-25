import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { Activity } from "lucide-react";
import { useBlockchainData } from '../../hooks/use-blockchain-data';

interface TpsData {
  time: string;
  tps: number;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    payload: TpsData;
    value: number;
  }>;
}

export function TPSBarGraph() {
  const { tps, isLoading } = useBlockchainData();
  const [tpsHistory, setTpsHistory] = useState<TpsData[]>([]);
  const maxDataPoints = 10;

  useEffect(() => {
    if (tps !== null) {
      setTpsHistory(prevHistory => {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newHistory = [...prevHistory, { time: timestamp, tps }];
        
        if (newHistory.length > maxDataPoints) {
          return newHistory.slice(newHistory.length - maxDataPoints);
        }
        return newHistory;
      });
    }
  }, [tps]);

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/90 backdrop-blur p-2 rounded border border-white/20 text-white">
          <p className="text-sm">{`Time: ${payload[0].payload.time}`}</p>
          <p className="text-sm font-semibold text-blue-400">{`TPS: ${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/15 mt-5 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-xl p-5 overflow-hidden">
      <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-blue-400" />
        Transactions Per Second
      </h2>

      {!isLoading && tps !== null ? (
        <>
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Current TPS</span>
              <span className="text-white font-medium text-lg">{tps.toFixed(2)}</span>
            </div>
          </div>

          <div className="h-64 w-full">
            {tpsHistory.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tpsHistory}>
                  <XAxis 
                    dataKey="time" 
                    tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }} 
                    axisLine={{ stroke: 'rgba(255, 255, 255, 0.3)' }}
                  />
                  <YAxis 
                    tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255, 255, 255, 0.3)' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="tps" 
                    fill="url(#tpsGradient)" 
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="tpsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-white/50">Collecting data...</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4 animate-pulse">
          <div className="flex justify-between mt-2">
            <div className="h-4 bg-white/10 rounded w-24"></div>
            <div className="h-4 bg-white/10 rounded w-16"></div>
          </div>
          <div className="h-64 bg-white/10 rounded w-full"></div>
        </div>
      )}
    </div>
  );
} 