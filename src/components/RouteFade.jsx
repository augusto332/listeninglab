import { motion } from 'framer-motion'

export default function RouteFade({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}
