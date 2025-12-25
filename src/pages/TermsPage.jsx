export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-300">
            Términos y Condiciones
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Reglas claras para una buena experiencia
          </h1>
          <p className="text-base text-slate-300 sm:text-lg">
            Estos Términos y Condiciones regulan el uso de Listening Lab. Al acceder
            a la plataforma, confirmas que has leído y aceptas estos términos.
          </p>
          <p className="text-sm text-slate-400">
            Última actualización: 15 de marzo de 2025.
          </p>
        </header>

        <section className="space-y-6 text-slate-200">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">1. Uso de la plataforma</h2>
            <p className="text-sm text-slate-300 sm:text-base">
              Listening Lab ofrece herramientas digitales para gestionar contenidos,
              métricas y experiencias de escucha. Te comprometes a usar el servicio
              de manera legal, responsable y conforme a estos términos.
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
            <h2 className="text-xl font-semibold">3. Contenido y propiedad intelectual</h2>
            <p className="text-sm text-slate-300 sm:text-base">
              El software, marca y diseño de Listening Lab están protegidos por
              derechos de propiedad intelectual. Conservas la titularidad de tu
              contenido, pero nos otorgas una licencia limitada para alojarlo y
              procesarlo con el fin de prestar el servicio.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">4. Conductas prohibidas</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm sm:text-base">
              <li>Usar la plataforma para actividades ilegales o no autorizadas.</li>
              <li>Interferir con la seguridad, integridad o desempeño del servicio.</li>
              <li>Subir contenido que infrinja derechos de terceros o sea ofensivo.</li>
              <li>Intentar acceder a cuentas o sistemas sin permiso expreso.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">5. Pagos y facturación</h2>
            <p className="text-sm text-slate-300 sm:text-base">
              Si accedes a planes de pago, aceptas los precios, ciclos de facturación
              y políticas de cancelación vigentes al momento de la compra. Los
              importes pueden variar y se notificarán con antelación.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">6. Limitación de responsabilidad</h2>
            <p className="text-sm text-slate-300 sm:text-base">
              En la máxima medida permitida por la ley, Listening Lab no será
              responsable por daños indirectos, incidentales o pérdidas de datos
              derivadas del uso o imposibilidad de uso del servicio.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">7. Terminación</h2>
            <p className="text-sm text-slate-300 sm:text-base">
              Puedes cancelar tu cuenta en cualquier momento. También podremos
              suspender o finalizar el acceso si se incumplen estos términos o si es
              necesario para proteger la plataforma y sus usuarios.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">8. Modificaciones</h2>
            <p className="text-sm text-slate-300 sm:text-base">
              Podemos actualizar estos términos ocasionalmente. Publicaremos la
              versión vigente en esta página y, si los cambios son sustanciales, te
              lo informaremos por medios razonables.
            </p>
          </div>

          <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-xl font-semibold">Contacto</h2>
            <p className="text-sm text-slate-300 sm:text-base">
              Para preguntas sobre estos términos, contáctanos en{' '}
              <span className="font-semibold text-white">soporte@listeninglab.com</span>.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
