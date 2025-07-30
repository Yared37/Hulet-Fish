"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  variant?: "default" | "feature" | "tour" | "testimonial" | "pricing" | "gallery"
  hoverScale?: number
  hoverRotate?: number
  glowEffect?: boolean
  floatEffect?: boolean
}

export default function AnimatedCard({
  children,
  className,
  variant = "default",
  hoverScale = 1.02,
  hoverRotate = 0,
  glowEffect = false,
  floatEffect = false,
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
    >
      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-500 ease-out cursor-pointer",
          "backdrop-blur-sm bg-white/80 dark:bg-gray-900/80",
          "border border-gray-200/50 dark:border-gray-700/50",
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
      </Card>
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
