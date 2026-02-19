import Link from "next/link";
import {
  Sparkles,
  Palette,
  Download,
  ArrowRight,
  Layers,
  LayoutGrid,
  Presentation,
  Keyboard,
  Github,
  Cpu,
} from "lucide-react";
import { themes } from "@/lib/themes/presets";

const features = [
  {
    icon: Cpu,
    title: "AI Generation",
    description:
      "Multi-model support. Describe your topic and get a complete, structured deck in seconds.",
  },
  {
    icon: Palette,
    title: "12 Themes",
    description:
      "Handcrafted color palettes with instant one-click switching between styles.",
  },
  {
    icon: LayoutGrid,
    title: "9 Content Blocks",
    description:
      "Text, charts, timelines, diagrams, and more. Rich building blocks for any story.",
  },
  {
    icon: Download,
    title: "PPTX Export",
    description:
      "Download as PowerPoint. Compatible with Google Slides and Keynote.",
  },
  {
    icon: Presentation,
    title: "Presentation Mode",
    description:
      "Fullscreen playback with smooth transitions. Present directly from your browser.",
  },
  {
    icon: Keyboard,
    title: "Keyboard Shortcuts",
    description:
      "Undo, redo, copy, paste, and navigate. Built for speed and flow.",
  },
];

const allThemeIds = Object.keys(themes) as Array<keyof typeof themes>;

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <Layers className="h-5 w-5 text-zinc-900" />
            <span className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold tracking-tight text-zinc-900">
              DeckForge
            </span>
          </div>
          <Link
            href="/editor/new"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-zinc-800 hover:shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-16">
        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-32 text-center sm:pb-32 sm:pt-40">
          {/* Animated badge */}
          <div className="animate-fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-sm text-zinc-500">
            <Sparkles className="h-3.5 w-3.5 text-zinc-400 animate-subtle-pulse" />
            AI-powered presentation maker
          </div>

          {/* Title */}
          <h1 className="animate-fade-in-up animation-delay-200 mx-auto max-w-4xl font-[family-name:var(--font-space-grotesk)] text-4xl font-bold leading-[1.1] tracking-tight text-zinc-900 sm:text-5xl md:text-6xl lg:text-7xl">
            Create presentations that{" "}
            <span className="font-[family-name:var(--font-space-grotesk)] italic text-zinc-400">
              speak for themselves
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up animation-delay-400 mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-500">
            Describe what you need. AI builds the deck. Export and present.
            No signup, no friction.
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up animation-delay-600 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/editor/new"
              className="group inline-flex h-12 items-center gap-2 rounded-xl bg-zinc-900 px-8 text-base font-medium text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md"
            >
              Start creating
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#themes"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-zinc-200 px-8 text-base font-medium text-zinc-600 transition-all hover:border-zinc-300 hover:bg-zinc-50"
            >
              View templates
            </Link>
          </div>

          {/* Editor Mockup */}
          <div className="animate-fade-in-up animation-delay-800 relative mx-auto mt-20 max-w-4xl">
            <div className="animate-float rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-xl shadow-zinc-200/50">
              {/* Title bar */}
              <div className="flex items-center gap-2 rounded-t-xl bg-zinc-50 px-4 py-2.5">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                </div>
                <div className="ml-4 h-2 w-32 rounded-full bg-zinc-200" />
              </div>

              {/* Editor layout: 3 panels */}
              <div className="flex overflow-hidden rounded-b-xl border-t border-zinc-100">
                {/* Left panel - slide thumbnails */}
                <div className="hidden w-44 flex-shrink-0 border-r border-zinc-100 bg-zinc-50/50 p-3 sm:block">
                  <div className="space-y-2.5">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`aspect-video w-full rounded-md border ${
                          i === 0
                            ? "border-zinc-300 bg-white shadow-sm"
                            : "border-zinc-150 bg-zinc-100/50"
                        }`}
                      >
                        <div className="flex h-full flex-col items-center justify-center gap-1 p-2">
                          <div
                            className={`h-1 w-3/4 rounded-full ${
                              i === 0 ? "bg-zinc-300" : "bg-zinc-200"
                            }`}
                          />
                          <div
                            className={`h-0.5 w-1/2 rounded-full ${
                              i === 0 ? "bg-zinc-200" : "bg-zinc-150"
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Center panel - main slide */}
                <div className="flex-1 bg-white p-6 sm:p-8">
                  <div className="mx-auto aspect-video max-w-lg rounded-lg border border-zinc-100 bg-zinc-50/30 p-6 sm:p-8">
                    <div className="flex h-full flex-col items-center justify-center gap-3">
                      <div className="h-2 w-16 rounded-full bg-zinc-200" />
                      <div className="h-4 w-48 rounded-md bg-zinc-900/10" />
                      <div className="h-1.5 w-36 rounded-full bg-zinc-200/80" />
                      <div className="mt-3 flex gap-2.5">
                        <div className="h-10 w-16 rounded-md bg-zinc-100 sm:h-14 sm:w-20" />
                        <div className="h-10 w-16 rounded-md bg-zinc-100 sm:h-14 sm:w-20" />
                        <div className="h-10 w-16 rounded-md bg-zinc-100 sm:h-14 sm:w-20" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right panel - properties */}
                <div className="hidden w-52 flex-shrink-0 border-l border-zinc-100 bg-zinc-50/50 p-4 lg:block">
                  <div className="space-y-4">
                    <div>
                      <div className="h-1.5 w-12 rounded-full bg-zinc-300" />
                      <div className="mt-2.5 h-7 w-full rounded-md border border-zinc-200 bg-white" />
                    </div>
                    <div>
                      <div className="h-1.5 w-16 rounded-full bg-zinc-300" />
                      <div className="mt-2.5 flex gap-1.5">
                        <div className="h-6 w-6 rounded-md bg-zinc-900" />
                        <div className="h-6 w-6 rounded-md bg-zinc-200" />
                        <div className="h-6 w-6 rounded-md bg-zinc-100" />
                        <div className="h-6 w-6 rounded-md border border-zinc-200 bg-white" />
                      </div>
                    </div>
                    <div>
                      <div className="h-1.5 w-10 rounded-full bg-zinc-300" />
                      <div className="mt-2.5 h-7 w-full rounded-md border border-zinc-200 bg-white" />
                    </div>
                    <div className="pt-2">
                      <div className="h-8 w-full rounded-md bg-zinc-900" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="border-t border-zinc-100 bg-zinc-50/50 py-6">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-center text-sm text-zinc-400">
              Built with Next.js, Vercel AI SDK, and Recharts
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Features
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Everything you need, nothing you don&apos;t
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`group relative rounded-2xl border border-zinc-100 p-7 transition-all duration-300 hover:border-zinc-200 hover:shadow-lg hover:shadow-zinc-100/80 ${
                  index % 2 === 1 ? "bg-zinc-50/50" : "bg-white"
                }`}
              >
                <div className="mb-4 inline-flex rounded-xl bg-zinc-100 p-2.5 text-zinc-600 transition-colors group-hover:bg-zinc-900 group-hover:text-white">
                  <feature.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-semibold text-zinc-900">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Theme Showcase Section */}
      <section id="themes" className="border-t border-zinc-100 bg-zinc-50 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Themes
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              12 handcrafted themes
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-zinc-500">
              Switch between themes instantly. Every palette is designed to make
              your content look polished and intentional.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {allThemeIds.map((themeId) => {
              const theme = themes[themeId];
              return (
                <div
                  key={themeId}
                  className="group relative overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-zinc-300"
                >
                  {/* Mini slide preview */}
                  <div
                    className="aspect-[4/3] p-5"
                    style={{ backgroundColor: theme.colors.background }}
                  >
                    <div className="flex h-full flex-col gap-2.5">
                      {/* Heading bar */}
                      <div
                        className="h-2.5 w-3/4 rounded-sm"
                        style={{
                          backgroundColor: theme.colors.heading,
                          opacity: 0.85,
                        }}
                      />
                      {/* Text lines */}
                      <div
                        className="h-1.5 w-full rounded-sm"
                        style={{
                          backgroundColor: theme.colors.text,
                          opacity: 0.3,
                        }}
                      />
                      <div
                        className="h-1.5 w-2/3 rounded-sm"
                        style={{
                          backgroundColor: theme.colors.text,
                          opacity: 0.2,
                        }}
                      />
                      {/* Color blocks */}
                      <div className="mt-auto flex gap-2">
                        <div
                          className="h-6 flex-1 rounded-sm"
                          style={{
                            backgroundColor: theme.colors.primary,
                            opacity: 0.8,
                          }}
                        />
                        <div
                          className="h-6 flex-1 rounded-sm"
                          style={{
                            backgroundColor: theme.colors.accent,
                            opacity: 0.5,
                          }}
                        />
                        <div
                          className="h-6 flex-1 rounded-sm"
                          style={{
                            backgroundColor: theme.colors.surface,
                            opacity: 0.8,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Theme info */}
                  <div className="border-t border-zinc-100 bg-white px-4 py-3">
                    <p className="text-sm font-medium text-zinc-900">
                      {theme.name}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-400">
                      {theme.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <div className="rounded-2xl border border-dashed border-zinc-200 px-8 py-16">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Ready to create?
            </h2>
            <p className="mt-4 text-base text-zinc-500">
              No account needed. No credit card. Just start building.
            </p>
            <Link
              href="/editor/new"
              className="group mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-zinc-900 px-8 text-base font-medium text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md"
            >
              Get started — it&apos;s free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 bg-zinc-50 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Layers className="h-4 w-4" />
            <span className="font-[family-name:var(--font-space-grotesk)] font-medium">
              DeckForge
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/phillipan14/deckforge"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-zinc-600"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <span className="text-sm text-zinc-300">
              Built by Phillip An
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
