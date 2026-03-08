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
    <div style={{ overflow: "clip", paddingBottom: "0.15em", paddingTop: "0.05em" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: "60%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-60%" }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className={cn("inline-block", className)}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
