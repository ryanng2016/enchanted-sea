import Image from "next/image";

const projects = [
  {
    title: "Le Mieux",
    rightLabel: "Custom Template",
    imageSrc: "/lm1.png",
    href: "/projects/project-1",
  },
  {
    title: "Enchanted Sea",
    rightLabel: "Portfolio",
    imageSrc: "/prism.jpg",
    href: "/projects/project-2",
  },
  {
    title: "Kizo Lab",
    rightLabel: "Custom Template",
    imageSrc: "/kizo_b.png",
    href: "/projects/project-3",
  },
  {
    title: "1",
    rightLabel: "Custom Template",
    imageSrc: "/.png",
    href: "/projects/project-4",
  },
  {
    title: "2",
    rightLabel: "Custom Template",
    imageSrc: "/.png",
    href: "/projects/project-5",
  },
];

function ProjectsColumn() {
  return (
    <div className="space-y-8 flex flex-col items-end">
      {projects.map((p) => (
        <a
  key={p.title}
  href={p.href}
  className="relative block w-full md:w-[550px] hover:z-30"
>
<div
  className="relative w-full h-[200px] md:h-[250px]
  border border-blue-700 bg-black/5
  transition-all duration-500 ease-out
  hover:shadow-[0_0_60px_rgba(37,99,235,0.45)]"
>
  <div className="absolute inset-0 overflow-hidden">
    <Image
      src={p.imageSrc}
      alt={p.title}
      fill
      quality={100}
      sizes="550px"
      className="object-cover"
    />
  </div>
</div>

          {/* Labels */}
          <div className="mt-2 flex items-end justify-between text-blue-700">
            <div className="leading-tight">
              <p className="text-sm font-medium font-roboto">
                {p.title}
              </p>
            </div>
            <p className="text-xs opacity-80 font-roboto">
              {p.rightLabel}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative h-screen bg-[#F9F7F6] overflow-x-visible overflow-y-hidden px-6">
      {/* 3D Grid (above waves, below content) */}
      <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden [perspective:1200px]">
        <div className="zgrid-plane" />
      </div>

      {/* NAV (stays fixed) */}
      <nav className="fixed top-0 left-0 right-0 z-[60] px-6 pt-6 pb-0 pointer-events-auto">
  <div className="flex items-center justify-between">
    <h1 className="text-[#111111] text-4xl font-display">
      <a
        href="/"
        className="flex items-center gap-2 transition-all duration-300 hover:[text-shadow:0_0_15px_rgba(37,99,235,0.85)]"
      >
        <span>Enchanted Sea</span>
        <span className="inline-block animate-slow-spin text-blue-700 text-xs relative -top-1">
          ★
        </span>
      </a>
    </h1>

    <ul className="flex gap-6 text-gray-700">
      <li>
        <a
          href="#projects"
          className="text-blue-700 font-roboto transition-all duration-300 hover:[text-shadow:0_0_20px_rgba(37,99,235,0.85)]"
        >
          Projects
        </a>
      </li>
      <li>
        <a
          href="#services"
          className="text-blue-700 font-roboto transition-all duration-300 hover:[text-shadow:0_0_20px_rgba(37,99,235,0.85)]"
        >
          Services
        </a>
      </li>
    </ul>
  </div>
</nav>

      {/* CONTENT AREA: left is static, right scrolls */}
      <section className="relative z-10 pt-20">
        {/* take full viewport height minus nav area */}
        <div className="grid gap-10 md:grid-cols-[768px_1fr] h-[calc(100vh-96px)]">
          {/* LEFT: static */}
          <aside className="space-y-5 text-[14px] leading-relaxed text-blue-700 font-normal font-roboto">
            <p>
              Enchanted Sea Studios is an LA-based creative agency specializing in web design and
              development. We aim to provide creatives and brands with deeply personalized digital
              spaces that are intentional, immersive, and most importantly, unique.
            </p>
          </aside>

{/* RIGHT */}
<div className="relative z-20 overflow-visible">
  <div
    className="
      -mt-[72px]
      h-[calc(100vh-96px+72px)]
      overflow-y-auto
      overflow-x-visible
      pr-13
      pb-32
      pt-[72px]
      no-scrollbar
    "
  >
    <div className="-mr-0">
      <ProjectsColumn />
    </div>
  </div>
</div>
        </div>
      </section>

      {/* Bottom Glow + Wave */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-[60vh] overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-blue-600/25 via-blue-600/10 to-transparent blur-sm" />
        <div className="absolute inset-0 opacity-30 wave wave1" />
        <div className="absolute inset-0 opacity-20 wave wave2" />
      </div>
    </main>
  );
}