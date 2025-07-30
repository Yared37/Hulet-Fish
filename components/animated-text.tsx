"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedHeadingProps {
  children: React.ReactNode
  className?: string
  delay?: number
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  staggerChildren?: boolean
}

export function AnimatedHeading({
  children,
  className,
  delay = 0,
  tag = "h2",
  staggerChildren = false,
}: AnimatedHeadingProps) {
  const Tag = tag

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay * i },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  }

  if (staggerChildren && typeof children === "string") {
    return (
      <motion.div
        className={cn("overflow-hidden", className)}
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <Tag className="flex flex-wrap">
          {children.split(" ").map((word, index) => (
            <motion.span key={index} className="mr-[0.25em] inline-block" variants={child}>
              {word}
            </motion.span>
          ))}
        </Tag>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        damping: 12,
        stiffness: 100,
        delay,
      }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <Tag className={className}>{children}</Tag>
    </motion.div>
  )
}

interface AnimatedParagraphProps {
  children: React.ReactNode
  className?: string
  delay?: number
  staggerLines?: boolean
}

export function AnimatedParagraph({ children, className, delay = 0, staggerLines = false }: AnimatedParagraphProps) {
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delay * i },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 10,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  }

  if (staggerLines && typeof children === "string") {
    const lines = children.split(". ").filter(Boolean)

    return (
      <motion.div
        className={cn("overflow-hidden", className)}
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <p className={className}>
          {lines.map((line, index) => (
            <motion.span key={index} className="inline-block" variants={child}>
              {line}
              {index < lines.length - 1 ? ". " : ""}
            </motion.span>
          ))}
        </p>
      </motion.div>
    )
  }

  return (
    <motion.p
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        damping: 12,
        stiffness: 100,
        delay,
      }}
      viewport={{ once: true, margin: "-50px" }}
    >
      {children}
    </motion.p>
  )
}

interface AnimatedListProps {
  items: React.ReactNode[]
  className?: string
  itemClassName?: string
  delay?: number
}

export function AnimatedList({ items, className, itemClassName, delay = 0 }: AnimatedListProps) {
  return (
    <ul className={className}>
      {items.map((item, index) => (
        <motion.li
          key={index}
          className={itemClassName}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{
            type: "spring",
            damping: 12,
            stiffness: 100,
            delay: delay + index * 0.1,
          }}
          viewport={{ once: true, margin: "-50px" }}
        >
          {item}
        </motion.li>
      ))}
    </ul>
  )
}

interface AnimatedBadgeProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function AnimatedBadge({ children, className, delay = 0 }: AnimatedBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        damping: 12,
        stiffness: 100,
        delay,
      }}
      viewport={{ once: true, margin: "-50px" }}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedTextRevealProps {
  text: string
  className?: string
  delay?: number
}

export function AnimatedTextReveal({ text, className, delay = 0 }: AnimatedTextRevealProps) {
  return (
    <div className={cn("overflow-hidden relative", className)}>
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        transition={{
          ease: [0.6, 0.01, 0.05, 0.95],
          duration: 0.8,
          delay,
        }}
        viewport={{ once: true, margin: "-50px" }}
      >
        {text}
      </motion.div>
    </div>
  )
}
