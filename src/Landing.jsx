"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { motion, useInView } from "framer-motion"
import {
  Sparkles,
  TrendingUp,
  BarChart3,
  Zap,
  Shield,
  Globe,
  MessageSquare,
  Bell,
  CheckCircle,
  Crown,
  ArrowRight,
  Menu,
  X,
  Twitter,
  Linkedin,
  Mail,
  ChevronDown,
  Users,
} from "lucide-react"

const AnimatedSection = ({ children, delay = 0 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [openFaq, setOpenFaq] = useState(null)

  // Text carousel states
  const [currentHeadingIndex, setCurrentHeadingIndex] = useState(0)
  const [currentDescriptionIndex, setCurrentDescriptionIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Carousel content
  const headingVariations = ["tu marca", "la competencia", "figuras públicas", "temas sociales"]

  const descriptionVariations = [
    "Descubre qué se dice sobre tu marca en tiempo real. Analiza sentimientos, identifica tendencias y toma decisiones basadas en datos.",
    "Analiza la competencia y descubre oportunidades. Identifica qué estrategias funcionan y optimiza tu presencia digital.",
    "Identifica crisis de reputación antes de que escalen. Recibe alertas sobre menciones negativas y protege la imagen pública proactivamente.",
    "Descubre qué temas resuenan en las redes y actúa en consecuencia de manera estratégica.",
  ]

  // Carousel effect for heading
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentHeadingIndex((prev) => (prev + 1) % headingVariations.length)
        setIsTransitioning(false)
      }, 300)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Carousel effect for description
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDescriptionIndex((prev) => (prev + 1) % descriptionVariations.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: MessageSquare,
      title: "Monitoreo en Tiempo Real",
      description: "Rastrea menciones de tu marca en múltiples plataformas sociales instantáneamente",
    },
    {
      icon: Sparkles,
      title: "Análisis con IA",
      description: "Obtén insights automáticos sobre sentimientos y tendencias con inteligencia artificial",
    },
    {
      icon: BarChart3,
      title: "Reportes Detallados",
      description: "Visualiza datos complejos de forma simple con gráficos interactivos y reportes personalizables",
    },
    {
      icon: Bell,
      title: "Alertas Inteligentes",
      description: "Recibe notificaciones cuando se detecten menciones importantes de tu marca",
    },
    {
      icon: Globe,
      title: "Multi-Plataforma",
      description: "Monitorea YouTube, Reddit, Twitter y más redes sociales desde un solo lugar",
    },
    {
      icon: Zap,
      title: "Fácil de Configurar",
      description: "Empieza a monitorear en minutos, sin integraciones complejas",
    },
  ]

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/ mes",
      description: "Para probar Listening Lab con funciones esenciales",
      features: [
        "Hasta 150 menciones a modo de prueba",
        "1 keyword activa",
        "Soporte via formulario de contacto",
        "Monitoreo básico en YouTube y Reddit",
        "Reportes descargables"
      ],
      limitations: [],
      icon: Shield,
      cta: "Empezar Gratis",
      highlighted: false,
    },
    {
      name: "Básico",
      price: "$30",
      period: "/ mes",
      description: "Ideal para quienes están comenzando con el monitoreo",
      features: [
        "Todo lo incluido en el plan Free",
        "Hasta 3,000 menciones/mes",
        "Hasta 5 keyword activas",
        "Monitoreo de Instagram, Twitter y Tiktok",
        "Análisis de sentimiento con IA",
        "Historial de menciones extraídas almacenado por 1 año"
      ],
      limitations: ["Sin clasificación automática", "Sin resúmenes y reportes potenciados por IA"],
      icon: TrendingUp,
      cta: "Elegir Básico",
      highlighted: false,
    },
    {
      name: "Team",
      price: "$75",
      period: "/ mes",
      description: "Para equipos que necesitan colaborar en el monitoreo",
      features: [
        "Todo lo incluido en el plan Básico",
        "Hasta 8,000 menciones/mes",
        "Hasta 10 keyword activas",
        "Agregar y gestionar usuarios del equipo",
        "Canales de soporte adicionales"
      ],
      limitations: ["Sin clasificación automática", "Sin resúmenes y reportes potenciados por IA"]  ,
      icon: Users,
      cta: "Elegir Team",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$150",
      period: "/ mes",
      description: "Para equipos que necesitan funciones avanzadas",
      features: [
        "Todo lo incluido en el plan Team",
        "Hasta 20,000 menciones/mes",
        "Hasta 20 keywords activas",
        "Clasificación automática de menciones con IA",
        "Reportes avanzados potenciados por IA",
        "Historial de menciones extraídas almacenado por 2 años",
        "Soporte prioritario",
      ],
      limitations: [],
      icon: Crown,
      cta: "Elegir Pro",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "",
      period: "",
      description: "Para organizaciones con grandes volúmenes de datos y necesidades específicas",
      features: [
        "Todo lo incluido en el plan Pro",
        "Límite de menciones a medida",
        "Funcionalidades personalizadas",
        "Account Manager dedicado",
        "Acompañamiento estratégico",
      ],
      limitations: [],
      icon: Shield,
      cta: "Contactar Ventas",
      highlighted: false,
    },
  ]

  const steps = [
    {
      number: "01",
      title: "Configura tus Keywords",
      description:
        "Define las palabras clave que quieres monitorear: tu marca, productos, competidores o términos relevantes.",
    },
    {
      number: "02",
      title: "Selecciona tus Plataformas",
      description:
        "Elige las redes sociales que deseas rastrear. Nuestro sistema comenzará a recopilar menciones automáticamente.",
    },
    {
      number: "03",
      title: "Analiza y Actúa",
      description: "Visualiza insights en tiempo real, recibe alertas importantes y toma decisiones basadas en datos.",
    },
  ]

  const faqs = [
    {
      question: "¿Qué plataformas soportan?",
      answer:
        "Actualmente soportamos YouTube, Reddit, Twitter, Instagram, Facebook y TikTok. Estamos agregando nuevas plataformas constantemente.",
    },
    {
      question: "¿Cómo funciona el análisis de sentimientos?",
      answer:
        "Utilizamos inteligencia artificial avanzada para analizar el tono y contexto de cada mención, clasificándolas como positivas, negativas o neutrales.",
    },
    {
      question: "¿Puedo cambiar de plan en cualquier momento?",
      answer:
        "Sí, puedes actualizar o cancelar tu plan en cualquier momento desde tu panel de control. Los cambios se aplican inmediatamente.",
    },
    {
      question: "¿Hay límite en el número de menciones?",
      answer:
        "El número de menciones está sujeto al límite de tu plan. Cada plan define cuántas menciones puedes monitorear, además de las keywords y plataformas disponibles. ",
    },
    {
      question: "¿Ofrecen soporte técnico?",
      answer: "Sí, ofrecemos soporte a través de formulario de contacto para los planes básicos, y soporte prioritario para los planes Pro y Enterprise, conforme a lo especificado en cada plan.",
    },
  ]

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleRegister = () => {
    console.log("Navigate to register")
  }

  const handleLogin = () => {
    console.log("Navigate to login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleLogoClick}
              className="flex items-center gap-3 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Listening Lab
              </span>
            </motion.button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {["Características", "Precios", "Cómo Funciona", "FAQ"].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item
                    .toLowerCase()
                    .replace(" ", "-")
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")}`}
                  className="text-sm text-slate-300 hover:text-white transition-colors"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{ y: -2 }}
                >
                  {item}
                </motion.a>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" className="text-slate-300 hover:text-white" onClick={handleLogin}>
                  Iniciar Sesión
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  onClick={handleRegister}
                >
                  Crear cuenta gratis
                </Button>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="md:hidden text-slate-300 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4 space-y-4"
            >
              <a
                href="#caracteristicas"
                className="block text-sm text-slate-300 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Características
              </a>
              <a
                href="#precios"
                className="block text-sm text-slate-300 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Precios
              </a>
              <a
                href="#como-funciona"
                className="block text-sm text-slate-300 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cómo Funciona
              </a>
              <a
                href="#faq"
                className="block text-sm text-slate-300 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </a>
              <div className="pt-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full border-slate-700 text-slate-300 bg-transparent"
                  onClick={handleLogin}
                >
                  Iniciar Sesión
                </Button>
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  onClick={handleRegister}
                >
                  Crear cuenta gratis
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Badge
                variant="secondary"
                className="mb-6 bg-gradient-to-r from-blue-500/10 to-purple-600/10 text-blue-400 border-blue-500/20"
              >
                <Zap className="w-3 h-3 mr-1" />
                Powered by AI
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
            >
              <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Descubre qué se dice sobre
              </span>
              <br />
              <span
                className={`inline-block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent transition-all duration-300 ${
                  isTransitioning ? "opacity-0 transform -translate-y-2" : "opacity-100 transform translate-y-0"
                }`}
                style={{ minHeight: "1.2em" }}
              >
                {headingVariations[currentHeadingIndex]}
              </span>
            </motion.h1>

            <div className="relative min-h-[120px] md:min-h-[100px] mb-8">
              {descriptionVariations.map((desc, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: currentDescriptionIndex === index ? 1 : 0,
                    y: currentDescriptionIndex === index ? 0 : -10,
                  }}
                  transition={{ duration: 0.5 }}
                  className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto absolute inset-0"
                >
                  {desc}
                </motion.p>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25"
                  onClick={handleRegister}
                >
                  Crear cuenta gratis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-8 text-slate-500"
            >
              {[
                { icon: CheckCircle, text: "Sin tarjeta de crédito" },
                { icon: CheckCircle, text: "Configuración en 2 minutos" },
                { icon: CheckCircle, text: "Cancela cuando quieras" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <item.icon className="w-4 h-4 text-green-400" />
                  <span className="text-sm">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="caracteristicas" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4 bg-slate-800/50 text-slate-300 border-slate-700/50">
                Características
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Todo lo que necesitas para
                <br />
                monitorear tu marca
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Herramientas poderosas diseñadas para ayudarte a entender y gestionar tu presencia en redes sociales
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <AnimatedSection key={index} delay={index * 0.1}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300 h-full group cursor-pointer">
                      <CardContent className="p-6">
                        <motion.div
                          className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center mb-4"
                          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                        </motion.div>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-slate-400 text-sm">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4 bg-slate-800/50 text-slate-300 border-slate-700/50">
                Cómo Funciona
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Comienza en 3 simples pasos</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Configurar tu monitoreo es rápido y sencillo. Estarás rastreando menciones en minutos
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <AnimatedSection key={index} delay={index * 0.2}>
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-center">
                    <motion.div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 mb-6"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {step.number}
                      </span>
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                    <p className="text-slate-400">{step.description}</p>
                  </div>
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gradient-to-r from-blue-500/30 to-purple-600/30"></div>
                  )}
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precios" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4 bg-slate-800/50 text-slate-300 border-slate-700/50">
                Precios
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Planes simples y transparentes</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Ahora contamos con un plan completamente gratuito, sin necesidad de tarjeta de crédito.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, index) => {
              const Icon = plan.icon
              return (
                <AnimatedSection key={index} delay={index * 0.1}>
                  <motion.div
                    whileHover={{ y: -12, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="h-full"
                  >
                    <Card
                      className={`relative h-full ${
                        plan.highlighted
                          ? "bg-gradient-to-br from-slate-800/70 to-slate-800/50 border-blue-500/50 shadow-xl shadow-blue-500/10"
                          : "bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50"
                      } backdrop-blur-sm hover:border-blue-500/40 transition-all duration-300`}
                    >
                      {plan.highlighted && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: "spring" }}
                          className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                        >
                          <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                            Más Popular
                          </Badge>
                        </motion.div>
                      )}
                      <CardContent className="p-8">
                        <div className="flex items-center gap-3 mb-4">
                          <motion.div
                            whileHover={{ rotate: [0, -15, 15, 0] }}
                            transition={{ duration: 0.5 }}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              plan.highlighted
                                ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20"
                                : "bg-gradient-to-r from-slate-500/20 to-slate-600/20"
                            }`}
                          >
                            <Icon className={`w-5 h-5 ${plan.highlighted ? "text-amber-400" : "text-slate-400"}`} />
                          </motion.div>
                          <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                        </div>

                        <div className="mb-6">
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-4xl font-bold text-white">{plan.price}</span>
                            <span className="text-slate-400">{plan.period}</span>
                          </div>
                          <p className="text-sm text-slate-400">{plan.description}</p>
                        </div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            className={`w-full mb-6 ${
                              plan.highlighted
                                ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                : "bg-slate-700 hover:bg-slate-600"
                            }`}
                            onClick={() => {
                              if (plan.name === "Enterprise") {
                                window.location.href = "mailto:ventas@listeninglab.com?subject=Consulta Plan Enterprise"
                              } else {
                                handleRegister()
                              }
                            }}
                          >
                            {plan.cta}
                          </Button>
                        </motion.div>

                        <div className="space-y-3">
                          {plan.features.map((feature, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              viewport={{ once: true }}
                              className="flex items-start gap-2"
                            >
                              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-slate-300">{feature}</span>
                            </motion.div>
                          ))}
                          {plan.limitations.map((limitation, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: (plan.features.length + i) * 0.05 }}
                              viewport={{ once: true }}
                              className="flex items-start gap-2"
                            >
                              <X className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-slate-500">{limitation}</span>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4 bg-slate-800/50 text-slate-300 border-slate-700/50">
                FAQ
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Preguntas Frecuentes</h2>
              <p className="text-lg text-slate-400">Todo lo que necesitas saber sobre Listening Lab</p>
            </div>
          </AnimatedSection>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300">
                    <CardContent className="p-0">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-800/30 transition-colors"
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      >
                        <span className="font-semibold text-white pr-4">{faq.question}</span>
                        <motion.div animate={{ rotate: openFaq === index ? 180 : 0 }} transition={{ duration: 0.3 }}>
                          <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        </motion.div>
                      </motion.button>
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: openFaq === index ? "auto" : 0,
                          opacity: openFaq === index ? 1 : 0,
                        }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-slate-400">{faq.answer}</div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 p-12 text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-2xl"></div>
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Listo para empezar?</h2>
                <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                  Únete a cientos de marcas que ya confían en Listening Lab para monitorear su presencia en redes
                  sociales
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-500"
                  />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 whitespace-nowrap"
                      onClick={handleRegister}
                    >
                      Comenzar Gratis
                    </Button>
                  </motion.div>
                </div>

                <p className="text-sm text-slate-400 mt-4">Sin tarjeta de crédito requerida. Cancela cuando quieras.</p>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <AnimatedSection>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    Listening Lab
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-4">
                  Monitorea tu marca en redes sociales con inteligencia artificial
                </p>
                <div className="flex items-center gap-3">
                  {[Twitter, Linkedin].map((Icon, index) => (
                    <motion.a
                      key={index}
                      href="#"
                      whileHover={{ scale: 1.2, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Product */}
            <AnimatedSection delay={0.1}>
              <div>
                <h4 className="font-semibold text-white mb-4">Producto</h4>
                <ul className="space-y-2">
                  <li>
                    <motion.a
                      whileHover={{ x: 5 }}
                      href="#caracteristicas"
                      className="text-sm text-slate-400 hover:text-white transition-colors inline-block"
                    >
                      Características
                    </motion.a>
                  </li>
                  <li>
                    <motion.a
                      whileHover={{ x: 5 }}
                      href="#precios"
                      className="text-sm text-slate-400 hover:text-white transition-colors inline-block"
                    >
                      Precios
                    </motion.a>
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            {/* Company */}
            <AnimatedSection delay={0.2}>
              <div>
                <h4 className="font-semibold text-white mb-4">Compañía</h4>
                <ul className="space-y-2">
                  {["Sobre Nosotros", "Blog"].map((item, index) => (
                    <li key={index}>
                      <motion.a
                        whileHover={{ x: 5 }}
                        href="#"
                        className="text-sm text-slate-400 hover:text-white transition-colors inline-block"
                      >
                        {item}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            {/* Legal */}
            <AnimatedSection delay={0.3}>
              <div>
                <h4 className="font-semibold text-white mb-4">Legal</h4>
                <ul className="space-y-2">
                  {["Privacidad", "Términos y condiciones"].map((item, index) => (
                    <li key={index}>
                      <motion.a
                        whileHover={{ x: 5 }}
                        href="#"
                        className="text-sm text-slate-400 hover:text-white transition-colors inline-block"
                      >
                        {item}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="pt-8 border-t border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <p className="text-sm text-slate-500">© 2025 Listening Lab. Todos los derechos reservados.</p>
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 text-sm text-slate-500">
              <Mail className="w-4 h-4" />
              <a href="mailto:hola@listeninglab.com" className="hover:text-slate-400 transition-colors">
                hola@listeninglab.com
              </a>
            </motion.div>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
