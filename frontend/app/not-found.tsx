"use client"

import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-3xl px-2 sm:px-0 py-8 sm:py-12"
      >
        <div className="bg-white/15 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-xl p-5 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Invalid Input</h1>
          <p className="text-white/70 mb-6">
            The input provided is not a valid wallet address or transaction hash.
          </p>
          <Link 
            href="/"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
} 