type Impact = {
  title: string;
  description: string;
};

const impacts: Impact[] = [
  {
    title: "RCE no autenticado",
    description:
      "El atacante ejecuta código arbitrario en el servidor sin necesidad de credenciales ni sesión. Una sola petición HTTP basta.",
  },
  {
    title: "Robo de secretos del entorno",
    description:
      "Variables de entorno (.env) quedan expuestas: credenciales de base de datos, API keys, JWT secrets, tokens de pago.",
  },
  {
    title: "Acceso a metadata cloud",
    description:
      "Lectura de IMDS en AWS, GCP y Azure → escalamiento a credenciales temporales con permisos de la instancia.",
  },
  {
    title: "Despliegue de coin miners",
    description:
      "Patrón observado en explotación in-the-wild desde el 5 de diciembre de 2025. El servidor mina criptomonedas para el atacante.",
  },
  {
    title: "Exfiltración de base de datos",
    description:
      "Con RCE el atacante consulta la DB directamente y exporta datos de clientes, PII y registros financieros.",
  },
  {
    title: "Backdoor persistente",
    description:
      "Webshells, cron jobs, modificación de binarios o reverse shells que sobreviven al reinicio del proceso Next.js.",
  },
  {
    title: "Movimiento lateral",
    description:
      "El servidor comprometido se usa como punto de pivote hacia la red interna, otros microservicios y bases de datos privadas.",
  },
  {
    title: "Supply chain attack",
    description:
      "Inyección de código en builds, modificación del pipeline CI/CD o publicación de paquetes maliciosos desde la infraestructura comprometida.",
  },
];

const timeline = [
  { date: "29 Nov 2025", event: "Disclosure responsable por Lachlan Davidson al equipo de Meta." },
  { date: "3 Dic 2025", event: "Publicación pública de CVE-2025-55182." },
  { date: "5 Dic 2025", event: "Primera explotación activa detectada en producción." },
  { date: "11 Dic 2025", event: "Next.js publica security update oficial." },
  { date: "15 Dic 2025", event: "Microsoft Security publica análisis y guía defensiva." },
];

const sources = [
  { label: "Next.js Security Update (11 Dic 2025)", url: "https://nextjs.org/blog/security-update-2025-12-11" },
  { label: "Microsoft Security — CVE-2025-55182", url: "https://www.microsoft.com/en-us/security/blog/2025/12/15/defending-against-the-cve-2025-55182-react2shell-vulnerability-in-react-server-components/" },
  { label: "Google Cloud Threat Intelligence", url: "https://cloud.google.com/blog/topics/threat-intelligence/threat-actors-exploit-react2shell-cve-2025-55182" },
  { label: "AWS Security Blog", url: "https://aws.amazon.com/blogs/security/china-nexus-cyber-threat-groups-rapidly-exploit-react2shell-vulnerability-cve-2025-55182/" },
  { label: "Unit42 (Palo Alto Networks)", url: "https://unit42.paloaltonetworks.com/cve-2025-55182-react-and-cve-2025-66478-next/" },
  { label: "Sysdig — Detección", url: "https://www.sysdig.com/blog/detecting-react2shell" },
  { label: "Vercel — Boletín oficial", url: "https://vercel.com/react2shell" },
  { label: "Sitio oficial React2Shell", url: "https://react2shell.com/" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-red-500/30">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600" />

      <header className="mx-auto max-w-5xl px-6 pt-16 pb-12">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="rounded border border-red-500/40 bg-red-500/10 px-2 py-1 text-red-300">
            CVE-2025-55182
          </span>
          <span className="rounded border border-red-500/40 bg-red-500/10 px-2 py-1 text-red-300">
            CVSS 10.0 · CRITICAL
          </span>
          <span className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-400">
            Pre-Auth RCE
          </span>
          <span className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-400">
            React Server Components
          </span>
        </div>

        <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl">
          <span className="text-red-500">React</span>
          <span className="text-zinc-500">2</span>
          <span className="text-red-500">Shell</span>
        </h1>

        <p className="mt-4 max-w-3xl text-lg text-zinc-400">
          Vulnerabilidad crítica de ejecución remota de código (RCE) sin
          autenticación en React Server Components y Next.js. Una única petición
          HTTP maliciosa convierte tu servidor de renderizado en una shell del
          atacante.
        </p>

        <div className="mt-8 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 font-mono text-sm text-amber-200">
          <strong className="text-amber-100">⚠ Detectado en este proyecto:</strong>{" "}
          Esta landing corre sobre <code className="text-amber-100">next@15.0.4</code>,
          rango vulnerable (<code className="text-amber-100">15.0.0 – 16.0.6</code>).
          No expongas este servidor a internet.
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-sm font-mono uppercase tracking-widest text-red-400">
          01 · Qué es
        </h2>
        <h3 className="mt-2 text-3xl font-semibold">Insecure deserialization en RSC</h3>
        <div className="mt-6 space-y-4 text-zinc-300">
          <p>
            React Server Components serializa el árbol de componentes renderizado
            en el servidor y lo envía al cliente como un payload binario/textual.
            El cliente vuelve a deserializar ese payload para hidratar la UI.
          </p>
          <p>
            <span className="text-red-400">React2Shell</span> abusa de ese
            mecanismo en sentido inverso: el servidor también acepta payloads RSC
            entrantes (server actions, formularios, mutaciones). La rutina de
            deserialización no valida correctamente los tipos referenciados y un
            atacante puede inyectar estructuras que terminan invocando código
            arbitrario dentro del proceso Node.js.
          </p>
          <p>
            Resultado: el atacante envía un POST normal a un endpoint válido y
            obtiene ejecución de código en el servidor con los permisos del
            runtime de Next.js. Sin login, sin XSS previo, sin credenciales.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-sm font-mono uppercase tracking-widest text-red-400">
          02 · Versiones afectadas
        </h2>
        <h3 className="mt-2 text-3xl font-semibold">Next.js 15.0.0 → 16.0.6</h3>
        <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-900/60 p-6 font-mono text-sm">
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <div className="text-xs text-zinc-500">RANGO VULNERABLE</div>
              <div className="mt-1 text-red-400">15.0.0 ≤ next ≤ 16.0.6</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">COMPONENTE</div>
              <div className="mt-1 text-zinc-200">React Server Components</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">PRECONDICIÓN</div>
              <div className="mt-1 text-zinc-200">Endpoint RSC expuesto (default)</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-sm font-mono uppercase tracking-widest text-red-400">
          03 · Qué puede ocasionar
        </h2>
        <h3 className="mt-2 text-3xl font-semibold">Impacto real de la explotación</h3>
        <p className="mt-4 max-w-3xl text-zinc-400">
          RCE no autenticado es el peor escenario en seguridad web. Una vez que
          el atacante ejecuta código en tu proceso Node, todo lo que el proceso
          puede leer, modificar o conectarse, también lo puede el atacante.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {impacts.map((impact, i) => (
            <div
              key={impact.title}
              className="group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/40 p-5 transition hover:border-red-500/50 hover:bg-zinc-900/80"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-red-500/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h4 className="text-lg font-semibold text-zinc-100">
                  {impact.title}
                </h4>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {impact.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-sm font-mono uppercase tracking-widest text-red-400">
          04 · Línea de tiempo
        </h2>
        <h3 className="mt-2 text-3xl font-semibold">Cronología del disclosure</h3>
        <ol className="mt-8 space-y-4">
          {timeline.map((t) => (
            <li
              key={t.date}
              className="flex gap-6 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4"
            >
              <div className="w-28 shrink-0 font-mono text-sm text-red-400">
                {t.date}
              </div>
              <div className="text-zinc-300">{t.event}</div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-sm font-mono uppercase tracking-widest text-red-400">
          05 · Mitigación
        </h2>
        <h3 className="mt-2 text-3xl font-semibold">Cómo proteger tu aplicación</h3>
        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-5">
            <div className="text-sm font-semibold text-zinc-100">
              1. Actualizar Next.js
            </div>
            <p className="mt-1 text-sm text-zinc-400">
              Subir a una versión parcheada fuera del rango{" "}
              <code className="font-mono text-red-400">15.0.0 – 16.0.6</code>.
            </p>
            <pre className="mt-3 overflow-x-auto rounded bg-black/50 p-3 font-mono text-xs text-emerald-300">
{`npm install next@latest`}
            </pre>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-5">
            <div className="text-sm font-semibold text-zinc-100">
              2. Usar el parche oficial guiado
            </div>
            <p className="mt-1 text-sm text-zinc-400">
              Vercel publicó un asistente que ajusta automáticamente la versión
              segura compatible con tu proyecto.
            </p>
            <pre className="mt-3 overflow-x-auto rounded bg-black/50 p-3 font-mono text-xs text-emerald-300">
{`npx fix-react2shell-next`}
            </pre>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-5">
            <div className="text-sm font-semibold text-zinc-100">
              3. WAF / Detección perimetral
            </div>
            <p className="mt-1 text-sm text-zinc-400">
              Reglas en WAF para inspeccionar peticiones con cabecera{" "}
              <code className="font-mono text-red-400">Next-Action</code> o
              cuerpos RSC con tipos sospechosos. Cloudflare, AWS WAF y Sysdig
              publicaron firmas específicas.
            </p>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-5">
            <div className="text-sm font-semibold text-zinc-100">
              4. Aislar el runtime
            </div>
            <p className="mt-1 text-sm text-zinc-400">
              Correr Next.js con usuario sin privilegios, sin acceso a la red
              interna salvo lo necesario, sin secretos planos en{" "}
              <code className="font-mono text-red-400">process.env</code> cuando
              sea posible (usar secret managers).
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-sm font-mono uppercase tracking-widest text-red-400">
          06 · Fuentes
        </h2>
        <h3 className="mt-2 text-3xl font-semibold">Referencias oficiales</h3>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {sources.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm text-zinc-300 transition hover:border-red-500/50 hover:text-red-300"
              >
                {s.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mx-auto max-w-5xl px-6 py-12 text-xs text-zinc-500">
        <p>
          Landing informativa con fines educativos — UPC. No contiene payloads
          ni código vulnerable explotable. Toda la información proviene de
          publicaciones oficiales de Next.js, Vercel, Microsoft, Google Cloud,
          AWS, Sysdig y Unit42.
        </p>
      </footer>
    </div>
  );
}
