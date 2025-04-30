"use client"

import type { JSX } from "react"
import React from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useTransactionByHash } from "@/services/transaction/queries"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Hash, Clock, CheckCircle2, XCircle, Copy, ExternalLink, CreditCard, Cpu, ArrowDownUp, Layers, Code, ChevronDown, ChevronRight, Wallet, Coins, Shield, ArrowRight, RefreshCw, Send, ReceiptText } from 'lucide-react'
import {
  CustomAccordion as Accordion,
  CustomAccordionContent as AccordionContent,
  CustomAccordionItem as AccordionItem,
  CustomAccordionTrigger as AccordionTrigger,
} from "@/components/ui/accordion"
import { CustomButton as Button } from "@/components/ui/custom-button"
import { CustomBadge as Badge } from "@/components/ui/badge"
import {
  CustomTooltip as Tooltip,
  CustomTooltipContent as TooltipContent,
  CustomTooltipProvider as TooltipProvider,
  CustomTooltipTrigger as TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const TX_TYPE_PATTERNS = [
  { pattern: "system_program::transfer", name: "SOL Transfer", icon: <Send className="h-4 w-4" /> },
  { pattern: "spl-token", name: "Token Transfer", icon: <Coins className="h-4 w-4" /> },
  { pattern: "swap", name: "Token Swap", icon: <RefreshCw className="h-4 w-4" /> },
  { pattern: "create_account", name: "Create Account", icon: <Wallet className="h-4 w-4" /> },
  { pattern: "initialize_mint", name: "Initialize Mint", icon: <Coins className="h-4 w-4" /> },
  { pattern: "initialize_account", name: "Initialize Account", icon: <Wallet className="h-4 w-4" /> },
  { pattern: "close_account", name: "Close Account", icon: <XCircle className="h-4 w-4" /> },
  { pattern: "stake", name: "Stake Transaction", icon: <Shield className="h-4 w-4" /> },
  { pattern: "vote", name: "Vote Transaction", icon: <CheckCircle2 className="h-4 w-4" /> },
]

export default function TransactionPage() {
  const router = useRouter()
  const params = useParams()
  const txHash = params.tx as string
  const { data, isLoading, error } = useTransactionByHash(txHash)
  const [copied, setCopied] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    accountKeys: false,
    instructions: false,
    logMessages: false,
    balanceChanges: false,
    rawTransaction: false,
  })
  const [transactionType, setTransactionType] = useState<{ name: string; icon: JSX.Element } | null>(null)
  useEffect(() => {
    if (data?.data?.meta?.logMessages) {
      const logs = data.data.meta.logMessages.join(" ")
      for (const type of TX_TYPE_PATTERNS) {
        if (logs.toLowerCase().includes(type.pattern.toLowerCase())) {
          setTransactionType(type)
          break
        }
      }
    }
  }, [data])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(null), 2000)
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const truncateString = (str: string, length = 8) => {
    if (!str) return ""
    return str.length > length * 2 ? `${str.substring(0, length)}...${str.substring(str.length - length)}` : str
  }

  const formatDate = (timestamp: number | null | undefined) => {
    if (!timestamp) return "Unknown"
    return format(new Date(timestamp * 1000), "MMM dd, yyyy HH:mm:ss")
  }

  const formatLamportsToSol = (lamports: number) => {
    return (lamports / 1000000000).toFixed(9)
  }

  const isSuccess = !data?.data?.meta?.err

  const getBalanceChanges = () => {
    if (
      !data?.data?.meta?.preBalances ||
      !data?.data?.meta?.postBalances ||
      !data?.data?.transaction?.message?.accountKeys
    ) {
      return []
    }

    const { preBalances, postBalances } = data.data.meta
    const { accountKeys } = data.data.transaction.message

    return accountKeys
      .map((account, index) => {
        const preBalance = preBalances[index] || 0
        const postBalance = postBalances[index] || 0
        const change = postBalance - preBalance

        return {
          account,
          preBalance,
          postBalance,
          change,
        }
      })
      .filter((item) => item.change !== 0)
  }

  const getTokenBalanceChanges = () => {
    if (!data?.data?.meta?.preTokenBalances || !data?.data?.meta?.postTokenBalances) {
      return []
    }

    const preBalances = data.data.meta.preTokenBalances || []
    const postBalances = data.data.meta.postTokenBalances || []
    
    const preBalanceMap = new Map()
    preBalances.forEach(balance => {
      const key = `${balance.accountIndex}-${balance.mint}`
      preBalanceMap.set(key, balance)
    })
    

    const changes: any[] = []
    
    postBalances.forEach(postBalance => {
      const key = `${postBalance.accountIndex}-${postBalance.mint}`
      const preBalance = preBalanceMap.get(key)
      
      if (preBalance) {
        const preAmount = parseInt(preBalance.uiTokenAmount?.amount || "0")
        const postAmount = parseInt(postBalance.uiTokenAmount?.amount || "0")
        const change = postAmount - preAmount
        
        if (change !== 0) {
          changes.push({
            accountIndex: postBalance.accountIndex,
            mint: postBalance.mint,
            preAmount,
            postAmount,
            change,
            decimals: postBalance.uiTokenAmount?.decimals || 0,
            uiAmount: postBalance.uiTokenAmount?.uiAmount,
            uiAmountString: postBalance.uiTokenAmount?.uiAmountString,
          })
        }
        
        preBalanceMap.delete(key)
      } else {
        changes.push({
          accountIndex: postBalance.accountIndex,
          mint: postBalance.mint,
          preAmount: 0,
          postAmount: parseInt(postBalance.uiTokenAmount?.amount || "0"),
          change: parseInt(postBalance.uiTokenAmount?.amount || "0"),
          decimals: postBalance.uiTokenAmount?.decimals || 0,
          uiAmount: postBalance.uiTokenAmount?.uiAmount,
          uiAmountString: postBalance.uiTokenAmount?.uiAmountString,
        })
      }
    })
    
    preBalanceMap.forEach((preBalance, key) => {
      changes.push({
        accountIndex: preBalance.accountIndex,
        mint: preBalance.mint,
        preAmount: parseInt(preBalance.uiTokenAmount?.amount || "0"),
        postAmount: 0,
        change: -parseInt(preBalance.uiTokenAmount?.amount || "0"),
        decimals: preBalance.uiTokenAmount?.decimals || 0,
        uiAmount: preBalance.uiTokenAmount?.uiAmount,
        uiAmountString: preBalance.uiTokenAmount?.uiAmountString,
      })
    })
    
    return changes
  }

  const balanceChanges = getBalanceChanges()
  const tokenBalanceChanges = getTokenBalanceChanges()

  const formatInstruction = (instruction: any) => {
    let programName = "Unknown Program"
    if (instruction.programIdIndex !== undefined && data?.data?.transaction?.message?.accountKeys) {
      const programId = data.data.transaction.message.accountKeys[instruction.programIdIndex]
      
      if (programId === "11111111111111111111111111111111") {
        programName = "System Program"
      } else if (programId === "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") {
        programName = "Token Program"
      } else if (programId === "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL") {
        programName = "Associated Token Program"
      }
    }

    return {
      programName,
      accounts: instruction.accounts || [],
      data: instruction.data || "",
    }
  }

  const downloadTransactionJson = () => {
    if (!data) return
    
    const jsonString = JSON.stringify(data.data, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement("a")
    a.href = url
    a.download = `transaction-${txHash.substring(0, 8)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      <div className="fixed top-1/4 left-1/4 w-1/2 h-1/2 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-1/4 right-1/4 w-1/3 h-1/3 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full px-2 sm:px-0 py-8 sm:py-12"
      >

        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg border border-white/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <Hash className="h-6 w-6" />
          </div>
          Transaction Details
          {transactionType && (
            <Badge variant="token" className="ml-2">
              {transactionType.icon}
              <span className="ml-1">{transactionType.name}</span>
            </Badge>
          )}
        </h1>

        {isLoading && (
          <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.15)] p-5">
            <div className="animate-pulse flex flex-col gap-4">
              <div className="h-4 bg-white/10 rounded w-3/4"></div>
              <div className="h-4 bg-white/10 rounded w-1/2"></div>
              <div className="h-4 bg-white/10 rounded w-2/3"></div>
              <div className="h-20 bg-white/10 rounded w-full"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 backdrop-blur-2xl border border-red-500/30 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.2)] p-5 flex items-center gap-3">
            <XCircle className="h-5 w-5 text-red-400" />
            <p className="text-red-200">Error loading transaction details. Please try again later.</p>
          </div>
        )}

        {data && data.success && (
          <div className="space-y-4">
            <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.15)] p-5">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-md border border-white/10">
                  <Hash className="h-5 w-5" />
                </div>
                Transaction Overview
              </h2>

              <div className="space-y-4">
                {/* Transaction Hash */}
                <div className="space-y-1">
                  <div className="text-white/70 text-sm">Transaction Hash</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="bg-white/5 px-3 py-2 rounded-md border border-white/10 font-mono text-xs text-white/90 break-all flex-grow">
                      {txHash}
                    </div>
                    <div className="flex items-center gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => copyToClipboard(txHash)}
                            >
                              {copied === txHash ? (
                                <CheckCircle2 className="h-4 w-4 text-green-400" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{copied === txHash ? "Copied!" : "Copy transaction hash"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => window.open(`https://explorer.sonic.game/tx/${txHash}`, "_blank")}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View on Sonic Explorer</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Status:</span>
                      <Badge variant={isSuccess ? "success" : "destructive"} className="font-medium">
                        {isSuccess ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                        {isSuccess ? "Success" : "Failed"}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Block Time:</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-white/50" />
                        <span className="text-white/90">{formatDate(data.data.blockTime)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Slot:</span>
                      <Badge variant="secondary" className="font-medium">
                        <Layers className="h-3 w-3 mr-1" />
                        {data.data.slot}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Fee:</span>
                      <Badge variant="default" className="font-medium">
                        <CreditCard className="h-3 w-3 mr-1" />
                        {data.data.meta?.fee ? formatLamportsToSol(data.data.meta.fee) : "N/A"} SOL
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Compute Units:</span>
                      <Badge variant="secondary" className="font-medium">
                        <Cpu className="h-3 w-3 mr-1" />
                        {data.data.meta?.computeUnitsConsumed || "N/A"}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Recent Blockhash:</span>
                      <span className="text-white/90 font-mono text-xs">
                        {truncateString(data.data.transaction?.message.recentBlockhash || "", 6)}
                      </span>
                    </div>
                  </div>
                </div>

                {data.data.meta?.err && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-md">
                    <div className="text-white/70 text-sm mb-1">Error:</div>
                    <div className="text-red-400 font-mono text-xs break-all">
                      {typeof data.data.meta.err === "string"
                        ? data.data.meta.err
                        : JSON.stringify(data.data.meta.err, null, 2)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {balanceChanges.length > 0 && (
              <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.15)] p-5">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-md border border-white/10">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                  Transaction Flow
                </h2>

                <div className="relative py-6">
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/30 to-blue-500/30"></div>
                  
                  <div className="relative z-10 flex items-center justify-center mb-8">
                    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-[0_0_15px_rgba(168,85,247,0.2)] max-w-[80%]">
                      <div className="flex items-center gap-2 mb-1">
                        <Send className="h-4 w-4 text-purple-400" />
                        <span className="text-white font-medium">Sender</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-xs text-white/90 truncate">
                          {truncateString(data.data.transaction?.signatures[0] ? data.data.transaction?.message.accountKeys[0] : "", 10)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(data.data.transaction?.message.accountKeys[0] || "")}
                        >
                          {copied === data.data.transaction?.message.accountKeys[0] ? (
                            <CheckCircle2 className="h-3 w-3 text-green-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative z-10 flex items-center justify-center mb-8">
                    <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-xl border border-white/20 rounded-xl p-3 shadow-[0_0_20px_rgba(168,85,247,0.3)] max-w-[80%]">
                      <div className="flex items-center gap-2 mb-2">
                        <ReceiptText className="h-4 w-4 text-white" />
                        <span className="text-white font-medium">Transaction Details</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-white/70">Type:</div>
                        <div className="text-white/90 font-medium">{transactionType?.name || "Unknown"}</div>
                        
                        <div className="text-white/70">Fee:</div>
                        <div className="text-white/90">{data.data.meta?.fee ? formatLamportsToSol(data.data.meta.fee) : "N/A"} SOL</div>
                        
                        <div className="text-white/70">Status:</div>
                        <div className={isSuccess ? "text-green-400" : "text-red-400"}>
                          {isSuccess ? "Success" : "Failed"}
                        </div>
                        
                        <div className="text-white/70">Instructions:</div>
                        <div className="text-white/90">{data.data.transaction?.message.instructions.length || 0}</div>
                      </div>
                    </div>
                  </div>
                  
                  {balanceChanges.filter(change => change.change > 0).map((change, index) => (
                    <div key={index} className="relative z-10 flex items-center justify-center mb-4">
                      <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-[0_0_15px_rgba(168,85,247,0.2)] max-w-[80%]">
                        <div className="flex items-center gap-2 mb-1">
                          <Wallet className="h-4 w-4 text-green-400" />
                          <span className="text-white font-medium">Recipient</span>
                        </div>
                        <div className="flex items-center gap-1 mb-1">
                          <span className="font-mono text-xs text-white/90 truncate">
                            {truncateString(change.account, 10)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(change.account)}
                          >
                            {copied === change.account ? (
                              <CheckCircle2 className="h-3 w-3 text-green-400" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        <div className="text-green-400 text-xs font-medium">
                          +{formatLamportsToSol(change.change)} SOL
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.15)] p-5">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("accountKeys")}
              >
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-md border border-white/10">
                    <Wallet className="h-5 w-5" />
                  </div>
                  Account Keys
                  <Badge variant="token" className="ml-2">
                    {data.data.transaction?.message.accountKeys.length || 0}
                  </Badge>
                </h2>
                {expandedSections.accountKeys ? (
                  <ChevronDown className="h-5 w-5 text-white/50" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-white/50" />
                )}
              </div>

              {expandedSections.accountKeys && data.data.transaction?.message.accountKeys && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {data.data.transaction.message.accountKeys.map((key, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white/5 rounded-md p-2 border border-white/10"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                        {index + 1}
                      </div>
                      <span className="text-white/90 font-mono text-xs truncate flex-grow">
                        {truncateString(key, 10)}
                      </span>
                      <div className="flex items-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  copyToClipboard(key)
                                }}
                              >
                                {copied === key ? (
                                  <CheckCircle2 className="h-3 w-3 text-green-400" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{copied === key ? "Copied!" : "Copy address"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  window.open(`https://explorer.sonic.game/address/${key}`, "_blank")
                                }}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View on Sonic Explorer</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.15)] p-5">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("instructions")}
              >
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-md border border-white/10">
                    <Code className="h-5 w-5" />
                  </div>
                  Instructions
                  <Badge variant="token" className="ml-2">
                    {data.data.transaction?.message.instructions.length || 0}
                  </Badge>
                </h2>
                {expandedSections.instructions ? (
                  <ChevronDown className="h-5 w-5 text-white/50" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-white/50" />
                )}
              </div>

              {expandedSections.instructions && data.data.transaction?.message.instructions && (
                <div className="mt-4 space-y-3">
                  <Accordion type="multiple" className="w-full">
                    {data.data.transaction.message.instructions.map((instruction, index) => {
                      const formattedInstruction = formatInstruction(instruction)
                      return (
                        <AccordionItem key={index} value={`instruction-${index}`} className="border-white/10">
                          <AccordionTrigger className="py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                                {index + 1}
                              </div>
                              <span className="text-white font-medium">{formattedInstruction.programName}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="text-white/70 space-y-3 pt-2">
                            <div className="flex justify-between items-center">
                              <span className="text-white/70">Program:</span>
                              <span className="text-white/90">{formattedInstruction.programName}</span>
                            </div>
                            
                            <div>
                              <div className="text-white/70 mb-1">Accounts:</div>
                              <div className="bg-black/30 rounded-md p-2">
                                {formattedInstruction.accounts.length > 0 ? (
                                  <div className="space-y-1">
                                    {formattedInstruction.accounts.map((accountIndex: number, i: number) => {
                                      const accountAddress = data.data.transaction?.message.accountKeys[accountIndex] || ""
                                      return (
                                        <div key={i} className="flex items-center justify-between text-xs">
                                          <span className="text-white/90">Account {i + 1}:</span>
                                          <div className="flex items-center gap-1">
                                            <span className="font-mono text-white/90 truncate">
                                              {truncateString(accountAddress, 8)}
                                            </span>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-5 w-5"
                                              onClick={() => copyToClipboard(accountAddress)}
                                            >
                                              {copied === accountAddress ? (
                                                <CheckCircle2 className="h-2 w-2 text-green-400" />
                                              ) : (
                                                <Copy className="h-2 w-2" />
                                              )}
                                            </Button>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                ) : (
                                  <span className="text-white/50 text-xs">No accounts</span>
                                )}
                              </div>
                            </div>
                            
                            {/* Data */}
                            <div>
                              <div className="text-white/70 mb-1">Data:</div>
                              <div className="bg-black/30 rounded-md p-2 font-mono text-xs overflow-x-auto">
                                {formattedInstruction.data ? (
                                  <pre className="text-white/90">{formattedInstruction.data}</pre>
                                ) : (
                                  <span className="text-white/50">No data</span>
                                )}
                              </div>
                            </div>
                            
                            {/* Raw JSON */}
                            <div>
                              <div className="text-white/70 mb-1">Raw Instruction:</div>
                              <div className="bg-black/30 rounded-md p-2 font-mono text-xs overflow-x-auto">
                                <pre>{JSON.stringify(instruction, null, 2)}</pre>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    })}
                  </Accordion>
                </div>
              )}
            </div>

            {/* Balance Changes */}
            {balanceChanges.length > 0 && (
              <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.15)] p-5">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection("balanceChanges")}
                >
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <div className="p-1.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-md border border-white/10">
                      <ArrowDownUp className="h-5 w-5" />
                    </div>
                    SOL Balance Changes
                    <Badge variant="token" className="ml-2">
                      {balanceChanges.length}
                    </Badge>
                  </h2>
                  {expandedSections.balanceChanges ? (
                    <ChevronDown className="h-5 w-5 text-white/50" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-white/50" />
                  )}
                </div>

                {expandedSections.balanceChanges && (
                  <div className="mt-4 space-y-3">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-white/70 border-b border-white/10">
                            <th className="text-left py-2 px-3">Account</th>
                            <th className="text-right py-2 px-3">Pre Balance (SOL)</th>
                            <th className="text-right py-2 px-3">Post Balance (SOL)</th>
                            <th className="text-right py-2 px-3">Change (SOL)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {balanceChanges.map((change, index) => (
                            <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                              <td className="py-2 px-3">
                                <div className="flex items-center gap-1">
                                  <span className="font-mono text-xs text-white/90 truncate max-w-[120px]">
                                    {truncateString(change.account, 8)}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => copyToClipboard(change.account)}
                                  >
                                    {copied === change.account ? (
                                      <CheckCircle2 className="h-3 w-3 text-green-400" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </Button>
                                </div>
                              </td>
                              <td className="text-right py-2 px-3 text-white/90">
                                {formatLamportsToSol(change.preBalance)}
                              </td>
                              <td className="text-right py-2 px-3 text-white/90">
                                {formatLamportsToSol(change.postBalance)}
                              </td>
                              <td
                                className={cn(
                                  "text-right py-2 px-3 font-medium",
                                  change.change > 0 ? "text-green-400" : "text-red-400",
                                )}
                              >
                                {change.change > 0 ? "+" : ""}
                                {formatLamportsToSol(change.change)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
            {tokenBalanceChanges.length > 0 && (
              <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.1)] p-6 mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Coins className="h-5 w-5 text-white/70" />
                  <h3 className="text-lg font-medium text-white">Token Balance Changes</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-white/50 text-sm border-b border-white/10">
                        <th className="text-left py-2 px-3 font-medium">Token</th>
                        <th className="text-right py-2 px-3 font-medium">Pre Balance</th>
                        <th className="text-right py-2 px-3 font-medium">Post Balance</th>
                        <th className="text-right py-2 px-3 font-medium">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tokenBalanceChanges.map((change, index) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-xs text-white/90 truncate max-w-[120px]">
                                {truncateString(change.mint, 8)}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard(change.mint)}
                              >
                                {copied === change.mint ? (
                                  <CheckCircle2 className="h-3 w-3 text-green-400" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          </td>
                          <td className="text-right py-2 px-3 text-white/90">
                            {change.preBalance}
                          </td>
                          <td className="text-right py-2 px-3 text-white/90">
                            {change.postBalance}
                          </td>
                          <td
                            className={cn(
                              "text-right py-2 px-3 font-medium",
                              Number(change.postBalance) - Number(change.preBalance) > 0 
                                ? "text-green-400" 
                                : "text-red-400"
                            )}
                          >
                            {Number(change.postBalance) - Number(change.preBalance) > 0 ? "+" : ""}
                            {(Number(change.postBalance) - Number(change.preBalance)).toString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}


        
