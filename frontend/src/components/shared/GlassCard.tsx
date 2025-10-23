import React from 'react'
import { motion } from 'framer-motion'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
}) => {
  const hoverAnimation = hover
    ? {
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2 },
      }
    : {}

  return (
    <motion.div
      className={'glass rounded-2xl shadow-lg p-6 ' + (hover ? 'cursor-pointer ' : '') + className}
      whileHover={hoverAnimation}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
