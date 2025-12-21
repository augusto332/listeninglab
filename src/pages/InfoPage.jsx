import { motion } from "framer-motion"
import { ArrowLeft, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function InfoPage({ title }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="flex items-center gap-3 mb-10 text-white"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold">Listening Lab</span>
        </motion.div>

        <motion.div
          className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-800/30 p-10 shadow-xl backdrop-blur-sm"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-blue-400 mb-4">{title}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">{title}</h1>
          <p className="text-lg text-slate-300 leading-relaxed mb-10">Próximamente</p>

          <Link to="/">
            <Button variant="ghost" className="text-slate-200 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a inicio
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
