export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-300">
            Política de Privacidad
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Tu información, tu control
          </h1>
          <p className="text-base text-slate-300 sm:text-lg">
            Esta Política de Privacidad explica cómo Listening Lab recopila, usa y
            protege tus datos personales cuando utilizas nuestra plataforma digital.
            Al acceder o crear una cuenta, aceptas las prácticas descritas aquí.
          </p>
          <p className="text-sm text-slate-400">
            Última actualización: 15 de marzo de 2025.
          </p>
        </header>

        <section className="space-y-6 text-slate-200">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Información que recopilamos</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm sm:text-base">
              <li>Datos de registro como nombre, correo electrónico y contraseña cifrada.</li>
              <li>Información de perfil y preferencias para personalizar la experiencia.</li>
              <li>Datos de uso, como interacción con funciones, páginas visitadas y dispositivos.</li>
              <li>Comunicaciones que nos envías al solicitar soporte o participar en encuestas.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Cómo usamos tu información</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm sm:text-base">
              <li>Proveer, mantener y mejorar los servicios de la plataforma.</li>
              <li>Personalizar contenidos, recomendaciones y notificaciones.</li>
              <li>Responder a solicitudes, dudas y requerimientos de soporte.</li>
              <li>Garantizar la seguridad, prevenir fraudes y cumplir obligaciones legales.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Compartición de datos</h2>
            <p className="text-sm text-slate-300 sm:text-base">
              No vendemos tu información. Solo compartimos datos con proveedores que
              nos ayudan a operar la plataforma (por ejemplo, alojamiento, analítica o
              envío de correos), siempre bajo acuerdos de confidencialidad y
              seguridad. También podemos divulgar información si es requerido por ley
              o para proteger nuestros derechos.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Retención y seguridad</h2>
            <p className="text-sm text-slate-300 sm:text-base">
              Conservamos tu información mientras tu cuenta esté activa o según sea
              necesario para prestar los servicios. Implementamos medidas técnicas y
              organizativas para proteger los datos contra accesos no autorizados,
              pérdida o uso indebido.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Tus derechos</h2>
            <p className="text-sm text-slate-300 sm:text-base">
              Puedes solicitar acceso, corrección, eliminación o portabilidad de tus
              datos personales. También puedes retirar tu consentimiento para ciertos
              usos en cualquier momento. Escríbenos para ejercer estos derechos.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Cookies y tecnologías similares</h2>
            <p className="text-sm text-slate-300 sm:text-base">
              Usamos cookies y tecnologías similares para recordar preferencias,
              analizar el uso del servicio y mejorar la experiencia. Puedes gestionar
              el uso de cookies desde la configuración de tu navegador.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Cambios en esta política</h2>
            <p className="text-sm text-slate-300 sm:text-base">
              Podemos actualizar esta Política de Privacidad para reflejar cambios
              en nuestras prácticas. Publicaremos la versión actualizada y, si los
              cambios son significativos, te lo comunicaremos de forma destacada.
            </p>
          </div>

          <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-xl font-semibold">Contacto</h2>
            <p className="text-sm text-slate-300 sm:text-base">
              Si tienes preguntas sobre esta política o deseas ejercer tus derechos,
              puedes escribirnos a{' '}
              <span className="font-semibold text-white">soporte@listeninglab.com</span>.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
