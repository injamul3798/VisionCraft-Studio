import React from 'react'
import { Sparkles, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass sticky top-0 z-40 border-b border-white/20 shadow-lg"
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg glow-hover relative overflow-hidden"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 shimmer" />
              <Sparkles className="text-white relative z-10" size={26} />
            </motion.div>
            <div>
              <h1 className="text-xl font-black text-gradient-animate tracking-tight">
                VisionCraft Studio
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-gray-700">
                <Zap size={12} className="text-primary-500" />
                <span className="font-medium">AI-Powered Design Studio</span>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-primary-600 transition-all duration-300 rounded-xl hover:bg-white/50 backdrop-blur-sm"
            >
              Projects
            </Link>
            <div className="px-3 py-1.5 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-full text-xs font-bold text-primary-700 border border-primary-200/50">
              Beta
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
