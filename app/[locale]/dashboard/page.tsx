"use client"

import { motion } from "framer-motion"
import { Construction, Rocket, Cog } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex h-[80vh] w-full items-center justify-center p-6">
      <div className="relative flex flex-col items-center text-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-visible">
          <motion.div
            className="absolute h-64 w-64 rounded-full bg-primary/10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute h-96 w-96 rounded-full bg-primary/5 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Icon Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-6"
        >
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/5 border border-primary/10 shadow-sm">
            <Construction className="h-7 w-7 text-primary/80" />
            
            <motion.div
              className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-background border border-border shadow-sm"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Rocket className="h-3.5 w-3.5 text-amber-500/80" />
            </motion.div>

            <motion.div
              className="absolute -bottom-1 -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border shadow-sm"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Cog className="h-3 w-3 text-primary/60" />
            </motion.div>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <h1 className="text-xl font-semibold tracking-tight text-foreground/90">
            Module Under Development
          </h1>
          <p className="mx-auto max-w-[280px] text-sm text-muted-foreground/80 leading-relaxed">
            We are currently refining this module to provide a seamless ERP experience. 
            Expected deployment in the next release.
          </p>
        </motion.div>

        {/* Progress bar placeholder */}
        <div className="mt-8 w-48 h-1 bg-muted/40 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary/60"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            style={{ width: "100%" }}
          />
        </div>

        <motion.div
          className="mt-4 text-[10px] font-bold text-primary/40 uppercase tracking-[0.3em]"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          System Evolution in Progress
        </motion.div>
      </div>
    </div>
  )
}
