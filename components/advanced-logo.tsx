"use client"

import { motion } from "framer-motion"
import { useState } from "react"

interface AdvancedLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "minimal" | "icon-only"
  animated?: boolean
  className?: string
}

const sizeClasses = {
  sm: "w-8 h-8 text-sm",
  md: "w-12 h-12 text-base",
  lg: "w-16 h-16 text-lg",
  xl: "w-24 h-24 text-2xl",
}

export default function AdvancedLogo({
  size = "md",
  variant = "default",
  animated = true,
  className = "",
}: AdvancedLogoProps) {
  const [isHovered, setIsHovered] = useState(false)

  const logoVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { scale: 1.05, rotate: 2 },
    tap: { scale: 0.95 },
  }

  const textVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    hover: { x: 5 },
  }

  if (variant === "icon-only") {
    return (
      <motion.div
        className={`${sizeClasses[size]} bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg ${className}`}
        variants={animated ? logoVariants : {}}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <motion.span
          className="text-white font-bold"
          animate={isHovered && animated ? { rotate: [0, -10, 10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          HF
        </motion.span>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`flex items-center space-x-3 ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className={`${sizeClasses[size]} bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg`}
        variants={animated ? logoVariants : {}}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
      >
        <motion.span
          className="text-white font-bold"
          animate={isHovered && animated ? { rotate: [0, -10, 10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          HF
        </motion.span>
      </motion.div>

      {variant !== "minimal" && (
        <motion.div
          variants={animated ? textVariants : {}}
          initial="initial"
          animate="animate"
          whileHover="hover"
          className="flex flex-col"
        >
          <motion.h1
            className={`font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent ${
              size === "sm" ? "text-lg" : size === "md" ? "text-xl" : size === "lg" ? "text-2xl" : "text-3xl"
            }`}
          >
            Hulet Fish
          </motion.h1>
          {size !== "sm" && (
            <motion.p
              className="text-xs text-slate-500 dark:text-slate-400 -mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Tourism Platform
            </motion.p>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
