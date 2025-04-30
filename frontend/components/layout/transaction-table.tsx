"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CheckCircle2, XCircle, ChevronDown, ChevronRight, Clock, CreditCard, Hash, Copy, ExternalLink, Cpu, FileText } from 'lucide-react'
import { CustomButton as Button } from "@/components/ui/custom-button"
import { CustomBadge as Badge } from "@/components/ui/badge"
import {
  CustomTooltip as Tooltip,
  CustomTooltipContent as TooltipContent,
  CustomTooltipProvider as TooltipProvider,
  CustomTooltipTrigger as TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { TransactionsResponse } from "@/services/transactions/types"

interface TransactionTableProps {
  data: TransactionsResponse | undefined;
  isLoading: boolean;
  error: any;
  address: string;
}

export function TransactionTable({ data, isLoading, error, address }: TransactionTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({})
  const [copied, setCopied] = useState<string | null>(null)

  const toggleRow = (index: number) => {
    setExpandedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(null), 2000)
  }

  const truncateString = (str: string, length = 8) => {
    if (!str) return ""
    return str.length > length * 2 
      ? `${str.substring(0, length)}...${str.substring(str.length - length)}`
      : str
  }

  const formatDate = (timestamp: number | null | undefined) => {
    if (!timestamp) return "Unknown"
    return format(new Date(timestamp * 1000), "MMM dd, yyyy HH:mm:ss")
  }

  const formatLamportsToSol = (lamports: number) => {
    return (lamports / 1000000000).toFixed(9)
  }

  if (isLoading) {
    return (
      <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.15)] p-5 w-full">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-md border border-white/10">
            <Clock className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-white/5 rounded-lg border border-white/5"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !data?.success) {
    return (
      <div className="bg-red-500/10 backdrop-blur-2xl border border-red-500/30 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.2)] p-5 w-full">
        <div className="flex items-center gap-3">
          <XCircle className="h-5 w-5 text-red-400" />
          <p className="text-red-200">Error loading transaction data. Please try again later.</p>
        </div>
      </div>
    )
  }

  if (!data?.data?.transactions || data.data.transactions.length === 0) {
    return (
      <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.15)] p-5 w-full">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-md border border-white/10">
            <Clock className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
        </div>
        <p className="text-white/70 text-center py-6">No transactions found for this address.</p>
      </div>
    )
  }

  return (
    <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.15)] p-5 w-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-md border border-white/10">
          <Clock className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
        <Badge variant="token" className="ml-2">
          {data.data.transactions.length}
        </Badge>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10">
        {/* Table Header - Desktop */}
        <div className="hidden md:grid grid-cols-5 bg-white/5 p-3 text-xs font-medium text-white/70">
          <div>Signature</div>
          <div>Block Time</div>
          <div>Status</div>
          <div>Fee (SOL)</div>
          <div>Compute Units</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-white/10">
          {data.data.transactions.map((tx, index) => {
            const isExpanded = expandedRows[index] || false
            const signature = tx.transaction?.signatures[0] || ""
            const isSuccess = !tx.meta?.err
            
            return (
              <div key={index} className="bg-transparent hover:bg-white/5 transition-colors">
                {/* Mobile View */}
                <div 
                  className="md:hidden p-3 cursor-pointer"
                  onClick={() => toggleRow(index)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-white/50" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-white/50" />
                      )}
                      <Hash className="h-4 w-4 text-white/70" />
                    </div>
                    <Badge variant={isSuccess ? "success" : "destructive"} className="text-xs">
                      {isSuccess ? "Success" : "Failed"}
                    </Badge>
                  </div>
                  <div className="pl-6 space-y-1 text-sm">
                    <div className="flex items-center gap-1 text-white/90 font-mono text-xs">
                      {truncateString(signature, 12)}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={(e) => {
                          e.stopPropagation()
                          copyToClipboard(signature)
                        }}
                      >
                        {copied === signature ? (
                          <CheckCircle2 className="h-3 w-3 text-green-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <div className="flex items-center gap-1 text-white/70">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">{formatDate(tx.blockTime)}</span>
                    </div>
                  </div>
                </div>

                {/* Desktop View */}
                <div 
                  className="hidden md:grid grid-cols-5 p-3 items-center cursor-pointer"
                  onClick={() => toggleRow(index)}
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-white/50" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-white/50" />
                    )}
                    <div className="flex items-center gap-1 text-white/90 font-mono text-xs">
                      {truncateString(signature)}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6" 
                              onClick={(e) => {
                                e.stopPropagation()
                                copyToClipboard(signature)
                              }}
                            >
                              {copied === signature ? (
                                <CheckCircle2 className="h-3 w-3 text-green-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{copied === signature ? "Copied!" : "Copy signature"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <div className="text-white/70 text-sm">{formatDate(tx.blockTime)}</div>
                  <div>
                    <Badge variant={isSuccess ? "success" : "destructive"} className="text-xs">
                      {isSuccess ? "Success" : "Failed"}
                    </Badge>
                  </div>
                  <div className="text-white/90 text-sm">
                    {tx.meta?.fee ? formatLamportsToSol(tx.meta.fee) : "N/A"}
                  </div>
                  <div className="text-white/90 text-sm">
                    {tx.meta?.computeUnitsConsumed || "N/A"}
                  </div>
                </div>

                {/* Expanded Details - Both Mobile and Desktop */}
                {isExpanded && (
                  <div className="bg-gradient-to-r from-purple-900/10 to-blue-900/10 border-t border-white/10 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="text-white text-sm font-medium flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          Transaction Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex flex-col gap-1">
                            <span className="text-white/70">Signature:</span>
                            <div className="flex items-center gap-2">
                              <span className="text-white/90 font-mono text-xs break-all bg-white/5 p-2 rounded-md">
                                {signature}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 shrink-0" 
                                onClick={() => copyToClipboard(signature)}
                              >
                                {copied === signature ? (
                                  <CheckCircle2 className="h-3 w-3 text-green-400" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 shrink-0" 
                                onClick={() => window.open(`https://explorer.solana.com/tx/${signature}`, "_blank")}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Slot:</span>
                            <span className="text-white/90">{tx.slot}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Block Time:</span>
                            <span className="text-white/90">{formatDate(tx.blockTime)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Recent Blockhash:</span>
                            <span className="text-white/90 font-mono text-xs">
                              {truncateString(tx.transaction?.message.recentBlockhash || "", 6)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-white text-sm font-medium flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Fee & Compute
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white/70">Fee:</span>
                            <Badge variant="secondary">
                              {tx.meta?.fee ? formatLamportsToSol(tx.meta.fee) : "N/A"} SOL
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Compute Units:</span>
                            <Badge variant="secondary">
                              <Cpu className="h-3 w-3 mr-1" />
                              {tx.meta?.computeUnitsConsumed || "N/A"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Status:</span>
                            <Badge variant={isSuccess ? "success" : "destructive"}>
                              {isSuccess ? (
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              {isSuccess ? "Success" : "Failed"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Log Messages */}
                      {tx.meta?.logMessages && tx.meta.logMessages.length > 0 && (
                        <div className="col-span-1 md:col-span-2 space-y-2">
                          <h4 className="text-white text-sm font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Log Messages
                          </h4>
                          <div className="bg-black/30 rounded-md p-2 max-h-40 overflow-y-auto font-mono text-xs text-white/70">
                            {tx.meta.logMessages.map((log, i) => (
                              <div key={i} className={cn(
                                "py-0.5 px-1", 
                                log.includes("Error") ? "text-red-400" : 
                                log.includes("success") ? "text-green-400" : ""
                              )}>
                                {log}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {tx.transaction?.message.accountKeys && tx.transaction.message.accountKeys.length > 0 && (
                        <div className="col-span-1 md:col-span-2 space-y-2">
                          <h4 className="text-white text-sm font-medium flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            Account Keys ({tx.transaction.message.accountKeys.length})
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {tx.transaction.message.accountKeys.map((key, i) => (
                              <div key={i} className="flex items-center gap-1 bg-white/5 rounded-md p-2">
                                <span className="text-white/90 font-mono text-xs truncate">
                                  {key === address ? (
                                    <span className="text-purple-400">{truncateString(key, 10)} (You)</span>
                                  ) : (
                                    truncateString(key, 10)
                                  )}
                                </span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 ml-auto shrink-0" 
                                  onClick={() => copyToClipboard(key)}
                                >
                                  {copied === key ? (
                                    <CheckCircle2 className="h-3 w-3 text-green-400" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
