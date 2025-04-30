"use client"

import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { useAccountInfo } from "@/services/account/queries"
import { useTransactions } from "@/services/transactions/queries"
import { Wallet, Copy, Coins, ExternalLink, Code, CheckCircle2, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { CustomAccordion, CustomAccordionContent, CustomAccordionItem, CustomAccordionTrigger } from "@/components/ui/accordion"
import { CustomBadge } from "@/components/ui/badge"
import { CustomTooltip, CustomTooltipContent, CustomTooltipProvider, CustomTooltipTrigger } from "@/components/ui/tooltip"
import { CustomButton } from "@/components/ui/custom-button"
import { TransactionTable } from "@/components/layout/transaction-table"
import { fetchIdl } from "@/lib/utils"

export default function AddressPage() {
  const params = useParams()
  const address = params.address as string
  const { data, isLoading, error } = useAccountInfo(address)
  const { data: transactions, isLoading: transactionsLoading, error: transactionsError } = useTransactions(address)
  console.log(transactions)
  const [copied, setCopied] = useState(false)
  const [idl, setIdl] = useState<any>(null)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  useEffect(() => {
    const fetchIdlData = async () => {
      if(data?.data?.accountInfo?.executable) {
        try {
          const idl = await fetchIdl(data.data.accountInfo.owner)
          setIdl(idl)
        } catch (error) {
          console.error(error)
        }
      }
    }
    fetchIdlData()
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full px-2 sm:px-0 py-8 sm:py-12"
      >
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Wallet className="h-6 w-6" />
          Address Details
        </h1>

        {isLoading && (
          <div className="bg-black/15 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-xl p-5">
            <div className="animate-pulse flex flex-col gap-4">
              <div className="h-4 bg-white/20 rounded w-3/4"></div>
              <div className="h-4 bg-white/20 rounded w-1/2"></div>
              <div className="h-4 bg-white/20 rounded w-2/3"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 backdrop-blur-2xl border border-red-500/30 rounded-2xl shadow-xl p-5 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-200" />
            <p className="text-red-200">Error loading account details. Please try again later.</p>
          </div>
        )}

        {data && (
          <div className="space-y-4">
            <div className="bg-black/40 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-xl p-5">
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Account Overview
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Address:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono text-sm break-all sm:text-right">
                      {address.length > 20 ? truncateAddress(address) : address}
                    </span>
                    <CustomTooltipProvider>
                      <CustomTooltip>
                        <CustomTooltipTrigger asChild>
                          <CustomButton
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => copyToClipboard(address)}
                          >
                            {copied ? (
                              <CheckCircle2 className="h-4 w-4 text-green-400" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </CustomButton>
                        </CustomTooltipTrigger>
                        <CustomTooltipContent>
                          <p>{copied ? "Copied!" : "Copy address"}</p>
                        </CustomTooltipContent>
                      </CustomTooltip>
                    </CustomTooltipProvider>
                    <CustomTooltipProvider>
                      <CustomTooltip>
                        <CustomTooltipTrigger asChild>
                          <CustomButton
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => window.open(`https://explorer.sonic.game/address/${address}`, "_blank")}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </CustomButton>
                        </CustomTooltipTrigger>
                        <CustomTooltipContent>
                          <p>View on Sonic Explorer</p>
                        </CustomTooltipContent>
                      </CustomTooltip>
                    </CustomTooltipProvider>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/70">Balance:</span>
                  <CustomBadge variant="secondary" className="font-medium">
                    <Coins className="h-3 w-3 mr-1" />
                    {data?.data?.balance} SOL
                  </CustomBadge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/70">Transaction Count:</span>
                  <span className="text-white">{data?.data?.transactionCount}</span>
                </div>

                {data?.data?.accountInfo && (
                  <CustomAccordion type="single" collapsible className="w-full">
                    <CustomAccordionItem value="account-details" className="border-white/20">
                      <CustomAccordionTrigger className="text-white/70 py-2">
                        <div className="flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          Account Details
                        </div>
                      </CustomAccordionTrigger>
                      <CustomAccordionContent className="text-white/70 space-y-2 pt-2">
                        {data.data.accountInfo.owner && (
                          <div className="flex items-center justify-between">
                            <span>Owner:</span>
                            <span className="font-mono text-xs break-all max-w-[200px] text-right">
                              {data.data.accountInfo.owner}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span>Executable:</span>
                          <CustomBadge variant={data.data.accountInfo.executable ? "default" : "outline"}>
                            {data.data.accountInfo.executable ? "Yes" : "No"}
                          </CustomBadge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Lamports:</span>
                          <span>{data.data.accountInfo.lamports}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Rent Epoch:</span>
                          <span>{data.data.accountInfo.rentEpoch}</span>
                        </div>
                      </CustomAccordionContent>
                    </CustomAccordionItem>
                  </CustomAccordion>
                )}
              </div>
            </div>

            {data?.data?.userTokens && data.data.userTokens.length > 0 && (
              <div className="bg-white/15 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-xl p-5">
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  Token Holdings ({data.data.userTokens.length})
                </h2>

                <CustomAccordion type="multiple" className="w-full">
                  {data.data.userTokens.map((token, index) => (
                    <CustomAccordionItem key={index} value={`token-${index}`} className="border-white/20">
                      <CustomAccordionTrigger className="py-3">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                              {token.mint.substring(0, 2)}
                            </div>
                            <span className="text-white font-medium">
                              {token.mint.substring(0, 6)}...{token.mint.substring(token.mint.length - 4)}
                            </span>
                          </div>
                          <CustomBadge variant="secondary" className="ml-auto mr-4">
                            {token.amount}
                          </CustomBadge>
                        </div>
                      </CustomAccordionTrigger>
                      <CustomAccordionContent className="text-white/70 space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                          <span>Mint Address:</span>
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-xs break-all max-w-[200px] text-right">
                              {token.mint.substring(0, 6)}...{token.mint.substring(token.mint.length - 4)}
                            </span>
                            <CustomButton
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(token.mint)}
                            >
                              <Copy className="h-3 w-3" />
                            </CustomButton>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Amount:</span>
                          <span>{token.amount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Decimals:</span>
                          <span>{token.decimals}</span>
                        </div>
                        <CustomButton
                          variant="outline"
                          size="sm"
                          className="w-full mt-2 text-xs"
                          onClick={() => window.open(`https://explorer.solana.com/address/${token.mint}`, "_blank")}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Token on Explorer
                        </CustomButton>
                      </CustomAccordionContent>
                    </CustomAccordionItem>
                  ))}
                </CustomAccordion>
              </div>
            )}

{data.data.accountInfo.executable && (
              <div className="bg-black/40 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-xl p-5 mt-4">
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Program IDL
                </h2>
                {idl ? (
                  <div className="space-y-3">
                    <div className="bg-black/30 rounded-lg p-3 max-h-[300px] overflow-y-auto">
                      <pre className="text-white/80 text-sm font-mono whitespace-pre-wrap break-all">
                        {JSON.stringify(idl, null, 2)}
                      </pre>
                    </div>
                    <CustomButton
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => copyToClipboard(JSON.stringify(idl, null, 2))}
                    >
                      {copied ? (
                        <CheckCircle2 className="h-3 w-3 mr-1 text-green-400" />
                      ) : (
                        <Copy className="h-3 w-3 mr-1" />
                      )}
                      {copied ? "Copied!" : "Copy IDL"}
                    </CustomButton>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-white/70">
                    <AlertCircle className="h-4 w-4" />
                    <span>IDL not found for this program</span>
                  </div>
                )}
              </div>
            )}
              <TransactionTable 
                data={transactions} 
                isLoading={transactionsLoading} 
                error={transactionsError} 
                address={address} 
              />
          </div>
        )}
      </motion.div>
    </div>
  )
}
