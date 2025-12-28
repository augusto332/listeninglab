export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 py-16">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-2xl shadow-black/40 backdrop-blur sm:p-12">
          {/* Header */}
          <header className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-300">
              Términos y Condiciones
            </p>
            <h1 className="text-3xl font-semibold sm:text-4xl lg:text-5xl">
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Reglas claras para una buena experiencia
              </span>
            </h1>
            <p className="text-base text-slate-300 sm:text-lg">
              Estos Términos y Condiciones regulan el uso de Listening Lab. Al acceder
              a la plataforma, confirmas que has leído y aceptas estos términos.
            </p>
            <p className="text-sm text-slate-400">
              Listening Lab es una plataforma digital operada por su equipo
              desarrollador.
            </p>
            <p className="text-sm text-slate-400">
              Última actualización: 20 de diciembre de 2025.
            </p>
          </header>

          {/* Body */}
          <section className="space-y-8 text-slate-200">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">1. Uso de la plataforma</h2>
              <p className="text-sm text-slate-300 sm:text-base">
                Listening Lab ofrece herramientas digitales para gestionar contenidos,
                métricas y análisis de escucha. Te comprometes a usar el servicio de
                manera legal, responsable y conforme a estos términos.
              </p>
              <p className="text-sm text-slate-300 sm:text-base">
                La información y los análisis proporcionados no constituyen
                asesoramiento legal, financiero ni profesional, y se ofrecen
                únicamente con fines informativos.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold">2. Cuentas y seguridad</h2>
              <p className="text-sm text-slate-300 sm:text-base">
                Eres responsable de mantener la confidencialidad de tus credenciales y
                de toda actividad que ocurra en tu cuenta. Si detectas un uso no
                autorizado, debes notificarnos de inmediato.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold">
                3. Contenido y propiedad intelectual
              </h2>
              <p className="text-sm text-slate-300 sm:text-base">
                El software, marca y diseño de Listening Lab están protegidos por
                derechos de propiedad intelectual. Conservas la titularidad de tu
                contenido, pero nos otorgas una licencia no exclusiva, limitada y
                revocable para alojarlo, procesarlo y analizarlo únicamente con el fin
                de prestar el servicio.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold">
                4. Contenido de terceros y fuentes externas
              </h2>
              <p className="text-sm text-slate-300 sm:text-base">
                La plataforma puede mostrar o procesar contenido generado por terceros
                y obtenido de fuentes públicas. Listening Lab no garantiza la
                exactitud, integridad ni legalidad de dicho contenido y no se hace
                responsable por su uso.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold">5. Conductas prohibidas</h2>
              <ul className="list-disc space-y-2 pl-5 text-sm sm:text-base">
                <li>Usar la plataforma para actividades ilegales o no autorizadas.</li>
                <li>Interferir con la seguridad, integridad o desempeño del servicio.</li>
                <li>Subir contenido que infrinja derechos de terceros u otras normas.</li>
                <li>Intentar acceder a cuentas o sistemas sin permiso expreso.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold">6. Pagos y facturación</h2>
              <p className="text-sm text-slate-300 sm:text-base">
                Si accedes a planes de pago, aceptas los precios, ciclos de facturación
                y políticas de cancelación vigentes al momento de la compra. Los planes,
                límites y funcionalidades pueden variar según el tipo de suscripción.
              </p>
              <p className="text-sm text-slate-300 sm:text-base">
                Salvo que la ley disponga lo contrario, los pagos no son reembolsables.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold">
                7. Limitación de responsabilidad
              </h2>
              <p className="text-sm text-slate-300 sm:text-base">
                El servicio se proporciona “tal cual” y “según disponibilidad”. En la
                máxima medida permitida por la ley, Listening Lab no será responsable
                por daños indirectos, incidentales o pérdidas de datos derivadas del
                uso o imposibilidad de uso del servicio.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold">8. Terminación</h2>
              <p className="text-sm text-slate-300 sm:text-base">
                Puedes cancelar tu cuenta en cualquier momento. También podremos
                suspender o finalizar el acceso si se incumplen estos términos o si es
                necesario para proteger la plataforma y sus usuarios.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold">9. Modificaciones</h2>
              <p className="text-sm text-slate-300 sm:text-base">
                Podemos actualizar estos términos ocasionalmente. Publicaremos la
                versión vigente en esta página y, si los cambios son sustanciales, te
                lo informaremos por medios razonables.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold">
                10. Ley aplicable y jurisdicción
              </h2>
              <p className="text-sm text-slate-300 sm:text-base">
                Estos términos se rigen por las leyes de la República Argentina.
                Cualquier controversia será sometida a los tribunales competentes de
                dicha jurisdicción.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-700/60 bg-slate-900/70 p-6 shadow-lg shadow-black/30">
              <h2 className="text-xl font-semibold">Contacto</h2>
              <p className="text-sm text-slate-300 sm:text-base">
                Para preguntas sobre estos términos, contáctanos en{" "}
                <span className="font-semibold text-white">
                  support@listeninglab.app
                </span>.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
