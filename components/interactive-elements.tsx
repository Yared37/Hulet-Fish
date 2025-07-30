"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

interface AnimatedButtonProps {
  children: ReactNode
  className?: string
  variant?: "default" | "primary" | "secondary" | "ghost" | "outline"
  size?: "sm" | "default" | "lg"
  icon?: LucideIcon
  onClick?: () => void
  disabled?: boolean
}

export function AnimatedButton({
  children,
  className,
  variant = "default",
  size = "default",
  icon: Icon,
  onClick,
  disabled,
}: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        variant={variant}
        size={size}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "relative overflow-hidden group transition-all duration-300",
          "hover:shadow-lg hover:shadow-primary/25",
          variant === "default" && "hover:bg-primary/90",
          className,
        )}
      >
        {/* Ripple effect */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />

        <span className="relative z-10 flex items-center gap-2">
          {Icon && (
            <motion.div animate={{ rotate: 0 }} whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
              <Icon className="w-4 h-4" />
            </motion.div>
          )}
          {children}
        </span>
      </Button>
    </motion.div>
  )
}

interface AnimatedBadgeProps {
  children: ReactNode
  className?: string
  variant?: "default" | "secondary" | "destructive" | "outline"
  pulse?: boolean
}

export function AnimatedBadge({ children, className, variant = "default", pulse = false }: AnimatedBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Badge
        variant={variant}
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          "hover:shadow-md hover:shadow-primary/20",
          pulse && "animate-pulse",
          className,
        )}
      >
        <span className="relative z-10">{children}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </Badge>
    </motion.div>
  )
}

interface AnimatedIconProps {
  icon: LucideIcon
  className?: string
  size?: number
  color?: string
  hoverColor?: string
  animation?: "spin" | "bounce" | "pulse" | "wiggle" | "float"
}

export function AnimatedIcon({
  icon: Icon,
  className,
  size = 24,
  color = "currentColor",
  hoverColor,
  animation = "float",
}: AnimatedIconProps) {
  const getAnimation = () => {
    switch (animation) {
      case "spin":
        return { rotate: 360 }
      case "bounce":
        return { y: [-2, 0, -2] }
      case "pulse":
        return { scale: [1, 1.1, 1] }
      case "wiggle":
        return { rotate: [-5, 5, -5, 5, 0] }
      case "float":
        return { y: [-2, 2, -2] }
      default:
        return {}
    }
  }

  return (
    <motion.div
      whileHover={getAnimation()}
      transition={{
        duration: animation === "spin" ? 0.5 : 1,
        repeat: animation === "bounce" || animation === "pulse" || animation === "float" ? Number.POSITIVE_INFINITY : 0,
        repeatType: "reverse",
      }}
      className={cn("inline-flex items-center justify-center", className)}
    >
      <Icon
        size={size}
        className={cn("transition-colors duration-300", hoverColor && `hover:text-[${hoverColor}]`)}
        style={{ color }}
      />
    </motion.div>
  )
}

interface HoverRevealProps {
  children: ReactNode
  revealContent: ReactNode
  className?: string
}

export function HoverReveal({ children, revealContent, className }: HoverRevealProps) {
  return (
    <div className={cn("relative group overflow-hidden", className)}>
      <motion.div
        initial={{ opacity: 1 }}
        whileHover={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10"
      >
        {children}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {revealContent}
      </motion.div>
    </div>
  )
}

// Enhanced Card Components
interface AnimatedCardProps {
  children: ReactNode
  className?: string
  variant?: "default" | "feature" | "tour" | "testimonial" | "pricing" | "gallery"
  hoverScale?: number
  hoverRotate?: number
  glowEffect?: boolean
  floatEffect?: boolean
  onClick?: () => void
}

export function AnimatedCard({
  children,
  className,
  variant = "default",
  hoverScale = 1.02,
  hoverRotate = 0,
  glowEffect = false,
  floatEffect = false,
  onClick,
}: AnimatedCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "feature":
        return "hover:shadow-2xl hover:shadow-blue-500/10 border-transparent hover:border-blue-200/50"
      case "tour":
        return "hover:shadow-2xl hover:shadow-amber-500/20 border-transparent hover:border-amber-200/50"
      case "testimonial":
        return "hover:shadow-xl hover:shadow-green-500/10 border-transparent hover:border-green-200/30"
      case "pricing":
        return "hover:shadow-2xl hover:shadow-purple-500/20 border-transparent hover:border-purple-200/50"
      case "gallery":
        return "hover:shadow-2xl hover:shadow-red-500/20 border-transparent hover:border-red-200/50"
      default:
        return "hover:shadow-xl hover:shadow-gray-500/10 border-transparent hover:border-gray-200/30"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{
        scale: hoverScale,
        rotate: hoverRotate,
        y: floatEffect ? -8 : 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20,
        },
      }}
      whileTap={{ scale: 0.98 }}
      className="group relative"
      onClick={onClick}
    >
      <div
        className={cn(
          "relative overflow-hidden transition-all duration-500 ease-out cursor-pointer",
          "backdrop-blur-sm bg-white/80 dark:bg-gray-900/80",
          "border border-gray-200/50 dark:border-gray-700/50",
          "rounded-lg",
          getVariantStyles(),
          glowEffect &&
            "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
          className,
        )}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
  )
}

// Specialized card variants
export function FeatureCard({ children, className, ...props }: Omit<AnimatedCardProps, "variant">) {
  return (
    <AnimatedCard variant="feature" className={className} hoverScale={1.03} floatEffect {...props}>
      {children}
    </AnimatedCard>
  )
}

export function TourCard({ children, className, ...props }: Omit<AnimatedCardProps, "variant">) {
  return (
    <AnimatedCard variant="tour" className={className} hoverScale={1.02} glowEffect {...props}>
      {children}
    </AnimatedCard>
  )
}

export function TestimonialCard({ children, className, ...props }: Omit<AnimatedCardProps, "variant">) {
  return (
    <AnimatedCard variant="testimonial" className={className} hoverScale={1.01} hoverRotate={1} {...props}>
      {children}
    </AnimatedCard>
  )
}

export function PricingCard({ children, className, ...props }: Omit<AnimatedCardProps, "variant">) {
  return (
    <AnimatedCard variant="pricing" className={className} hoverScale={1.05} floatEffect glowEffect {...props}>
      {children}
    </AnimatedCard>
  )
}

export function GalleryCard({ children, className, ...props }: Omit<AnimatedCardProps, "variant">) {
  return (
    <AnimatedCard variant="gallery" className={className} hoverScale={1.02} {...props}>
      {children}
    </AnimatedCard>
  )
}
