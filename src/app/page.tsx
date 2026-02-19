import Link from "next/link";
import {
  Sparkles,
  Palette,
  Download,
  ArrowRight,
  Layers,
  Zap,
  Github,
} from "lucide-react";
import { themes, themeList } from "@/lib/themes/presets";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered",
    description:
      "Generate complete presentations from a simple prompt. Our AI understands context, structure, and design.",
  },
  {
    icon: Palette,
    title: "12 Themes",
    description:
      "Beautiful built-in themes with instant switching. From minimal to bold, find the perfect look.",
  },
  {
    icon: Download,
    title: "Export Anywhere",
    description:
      "Download as PPTX or PDF. Works with PowerPoint, Google Slides, and Keynote.",
  },
];

const showcaseThemes = [
  "minimal",
  "midnight",
  "sunrise",
  "lavender",
  "coral",
  "neon",
] as const;

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6 text-white" />
            <span className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-white">
              DeckForge
            </span>
          </div>
          <Link
            href="/editor/new"
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-zinc-950 pt-16">
        {/* Background gradient effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-500/50 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-32 text-center sm:pb-32 sm:pt-40">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-400">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            AI-powered presentation maker
          </div>

          {/* Title */}
          <h1 className="mx-auto max-w-4xl font-[family-name:var(--font-space-grotesk)] text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Create Beautiful{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Presentations
            </span>{" "}
            with AI
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
            Generate stunning slide decks in seconds. No signup required. Just
            describe what you need and let AI craft the perfect presentation.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/editor/new"
              className="group inline-flex h-12 items-center gap-2 rounded-xl bg-white px-8 text-base font-semibold text-zinc-900 shadow-lg shadow-white/10 transition-all hover:bg-zinc-100 hover:shadow-white/20"
            >
              Create Presentation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/15 px-8 text-base font-medium text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
            >
              Learn More
            </Link>
          </div>

          {/* Slide preview mockup */}
          <div className="relative mx-auto mt-16 max-w-3xl sm:mt-20">
            <div className="rounded-xl border border-white/10 bg-white/5 p-2 shadow-2xl shadow-black/50 backdrop-blur-sm">
              <div className="aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
                <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
                  <div className="h-3 w-40 rounded-full bg-white/20" />
                  <div className="h-8 w-80 rounded-lg bg-gradient-to-r from-indigo-500/40 to-purple-500/40" />
                  <div className="mt-2 h-2 w-64 rounded-full bg-white/10" />
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-16 w-24 rounded-md bg-white/5 sm:h-20 sm:w-32"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Glow effect under the mockup */}
            <div className="absolute -bottom-4 left-1/2 h-8 w-3/4 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-2xl" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Features
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Everything you need to build great decks
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-500">
              From AI generation to polished exports, DeckForge handles the
              heavy lifting so you can focus on your message.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-zinc-200 bg-zinc-50/50 p-8 transition-all hover:border-zinc-300 hover:bg-white hover:shadow-lg hover:shadow-zinc-100"
              >
                <div className="mb-4 inline-flex rounded-xl bg-zinc-900 p-3 text-white shadow-sm">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900">
                  {feature.title}
                </h3>
                <p className="mt-2 leading-relaxed text-zinc-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Themes Preview Section */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Themes
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              12 handcrafted themes
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-500">
              Switch between themes instantly. Each one is designed to make your
              content shine.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {showcaseThemes.map((themeId) => {
              const theme = themes[themeId];
              return (
                <div
                  key={themeId}
                  className="group flex flex-col items-center gap-3"
                >
                  <div className="relative w-full overflow-hidden rounded-xl border border-zinc-200 shadow-sm transition-all group-hover:scale-105 group-hover:shadow-md">
                    {/* Mini slide preview */}
                    <div
                      className="aspect-video p-3"
                      style={{ backgroundColor: theme.colors.background }}
                    >
                      <div className="flex h-full flex-col items-center justify-center gap-1.5">
                        <div
                          className="h-1.5 w-3/4 rounded-full"
                          style={{
                            backgroundColor: theme.colors.heading,
                            opacity: 0.8,
                          }}
                        />
                        <div
                          className="h-1 w-1/2 rounded-full"
                          style={{
                            backgroundColor: theme.colors.text,
                            opacity: 0.4,
                          }}
                        />
                        <div className="mt-1 flex gap-1">
                          <div
                            className="h-3 w-5 rounded-sm"
                            style={{
                              backgroundColor: theme.colors.primary,
                              opacity: 0.3,
                            }}
                          />
                          <div
                            className="h-3 w-5 rounded-sm"
                            style={{
                              backgroundColor: theme.colors.accent,
                              opacity: 0.2,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    {/* Color swatch bar */}
                    <div className="flex h-2">
                      <div
                        className="flex-1"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <div
                        className="flex-1"
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                      <div
                        className="flex-1"
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                      <div
                        className="flex-1"
                        style={{ backgroundColor: theme.colors.surface }}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-zinc-900">
                      {theme.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {theme.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Remaining themes count */}
          <p className="mt-8 text-center text-sm text-zinc-500">
            +{themeList.length - showcaseThemes.length} more themes available in
            the editor
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-zinc-950 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-white sm:text-4xl">
            Ready to build your next deck?
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            No account needed. Start creating in seconds.
          </p>
          <Link
            href="/editor/new"
            className="group mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-8 text-base font-semibold text-zinc-900 shadow-lg shadow-white/10 transition-all hover:bg-zinc-100 hover:shadow-white/20"
          >
            Create Presentation
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-zinc-950 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Layers className="h-4 w-4" />
            <span>
              Built with Next.js, Tailwind CSS, and AI
            </span>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <Github className="h-4 w-4" />
            Open source on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
