"use client"
import React from "react"
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface WordRotateProps {
  words: string[]
  duration?: number
}

export function WordRotate({
  words,
  className,
  duration = 2000,
}: HTMLMotionProps<"div"> & WordRotateProps) {
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIndex((prev) => (prev === words.length - 1 ? 0 : prev + 1))
    }, duration)
    return () => clearTimeout(timeoutId)
  }, [index, words, duration])

  return (
    <div className="overflow-hidden py-1">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className={cn("inline-block", className)}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
