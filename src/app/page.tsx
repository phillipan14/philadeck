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
    title: "Multi-model AI",
    description:
      "Bring your own API key. Works with GPT-4o, Claude Sonnet, and Gemini Flash \u2014 pick the model that fits your style.",
  },
  {
    icon: Palette,
    title: "12 handcrafted themes",
    description:
      "From minimal to neon, every theme is designed to make your content look polished and intentional. Switch instantly.",
  },
  {
    icon: LayoutGrid,
    title: "Rich content blocks",
    description:
      "Text, charts, timelines, diagrams, quotes, and more. Nine block types to build any story you can imagine.",
  },
  {
    icon: Download,
    title: "Export to PowerPoint",
    description:
      "Download native PPTX files. Open in PowerPoint, Google Slides, or Keynote \u2014 colors, fonts, and layout preserved.",
  },
  {
    icon: Presentation,
    title: "Present from anywhere",
    description:
      "Fullscreen slideshow with fade transitions, keyboard navigation, and an elapsed timer. No extra software needed.",
  },
  {
    icon: Keyboard,
    title: "Built for speed",
    description:
      "Undo, redo, copy, paste, duplicate slides, and navigate \u2014 all from your keyboard. Zero friction.",
  },
];

const steps = [
  {
    number: "1",
    title: "Describe your idea",
    description:
      "Tell AI what your presentation is about. A single sentence or a detailed brief \u2014 it works either way.",
  },
  {
    number: "2",
    title: "Review and customize",
    description:
      "Edit the generated outline, swap themes, rearrange slides, and add your own content blocks.",
  },
  {
    number: "3",
    title: "Present and export",
    description:
      "Go fullscreen with one click, or download as PowerPoint. Share with anyone, anywhere.",
  },
];

const allThemeIds = Object.keys(themes) as Array<keyof typeof themes>;

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0014]">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0B0014]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <Layers className="h-5 w-5 text-purple-400" />
            <span className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold tracking-tight text-white">
              PhilaDeck
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/phillipan14/philadeck"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <Link
              href="/editor/new"
              className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-purple-500 hover:to-pink-500 hover:shadow-lg hover:shadow-purple-500/25"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        {/* Background gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[128px]" />
          <div className="absolute -right-40 top-40 h-[400px] w-[400px] rounded-full bg-pink-600/15 blur-[128px]" />
          <div className="absolute left-1/2 top-60 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-32 text-center sm:pb-32 sm:pt-40">
          {/* Powered by AI badge */}
          <div className="animate-fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-purple-400 animate-subtle-pulse" />
            Powered by AI
          </div>

          {/* Title */}
          <h1 className="animate-fade-in-up animation-delay-200 mx-auto max-w-4xl font-[family-name:var(--font-space-grotesk)] text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            A new medium for{" "}
            <span className="gradient-text italic">
              presenting ideas
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up animation-delay-400 mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
            Beautiful, engaging presentations with none of the formatting and
            design work. Just describe your topic and let AI do the rest.
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up animation-delay-600 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/editor/new"
              className="group inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 text-base font-medium text-white shadow-lg shadow-purple-500/25 transition-all hover:from-purple-500 hover:to-pink-500 hover:shadow-xl hover:shadow-purple-500/30 gradient-glow"
            >
              Start creating &mdash; it&apos;s free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-purple-500/20 px-8 text-base font-medium text-purple-300 transition-all hover:border-purple-500/40 hover:bg-purple-500/5"
            >
              See how it works
            </Link>
          </div>

          {/* Editor Mockup */}
          <div className="animate-fade-in-up animation-delay-800 relative mx-auto mt-20 max-w-4xl">
            <div className="animate-float rounded-2xl border border-purple-500/10 bg-[#110020] p-1.5 shadow-2xl shadow-purple-500/10">
              {/* Title bar */}
              <div className="flex items-center gap-2 rounded-t-xl bg-[#1a0030] px-4 py-2.5">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-purple-500/30" />
                  <div className="h-2.5 w-2.5 rounded-full bg-purple-500/20" />
                  <div className="h-2.5 w-2.5 rounded-full bg-purple-500/20" />
                </div>
                <div className="ml-4 h-2 w-32 rounded-full bg-purple-500/15" />
              </div>

              {/* Editor layout: 3 panels */}
              <div className="flex overflow-hidden rounded-b-xl border-t border-purple-500/10">
                {/* Left panel - slide thumbnails */}
                <div className="hidden w-44 flex-shrink-0 border-r border-purple-500/10 bg-[#0f001a]/50 p-3 sm:block">
                  <div className="space-y-2.5">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`aspect-video w-full rounded-md border ${
                          i === 0
                            ? "border-purple-500/30 bg-[#1a0030] shadow-sm shadow-purple-500/10"
                            : "border-purple-500/10 bg-[#110020]/50"
                        }`}
                      >
                        <div className="flex h-full flex-col items-center justify-center gap-1 p-2">
                          <div
                            className={`h-1 w-3/4 rounded-full ${
                              i === 0 ? "bg-purple-400/40" : "bg-purple-500/15"
                            }`}
                          />
                          <div
                            className={`h-0.5 w-1/2 rounded-full ${
                              i === 0 ? "bg-purple-400/25" : "bg-purple-500/10"
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Center panel - main slide */}
                <div className="flex-1 bg-[#110020] p-6 sm:p-8">
                  <div className="mx-auto aspect-video max-w-lg rounded-lg border border-purple-500/10 bg-[#0f001a]/50 p-6 sm:p-8">
                    <div className="flex h-full flex-col items-center justify-center gap-3">
                      <div className="h-2 w-16 rounded-full bg-purple-500/20" />
                      <div className="h-4 w-48 rounded-md bg-purple-400/15" />
                      <div className="h-1.5 w-36 rounded-full bg-purple-500/10" />
                      <div className="mt-3 flex gap-2.5">
                        <div className="h-10 w-16 rounded-md bg-purple-500/10 sm:h-14 sm:w-20" />
                        <div className="h-10 w-16 rounded-md bg-pink-500/10 sm:h-14 sm:w-20" />
                        <div className="h-10 w-16 rounded-md bg-purple-500/10 sm:h-14 sm:w-20" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right panel - properties */}
                <div className="hidden w-52 flex-shrink-0 border-l border-purple-500/10 bg-[#0f001a]/50 p-4 lg:block">
                  <div className="space-y-4">
                    <div>
                      <div className="h-1.5 w-12 rounded-full bg-purple-400/30" />
                      <div className="mt-2.5 h-7 w-full rounded-md border border-purple-500/15 bg-[#1a0030]" />
                    </div>
                    <div>
                      <div className="h-1.5 w-16 rounded-full bg-purple-400/30" />
                      <div className="mt-2.5 flex gap-1.5">
                        <div className="h-6 w-6 rounded-md bg-purple-600" />
                        <div className="h-6 w-6 rounded-md bg-pink-500/40" />
                        <div className="h-6 w-6 rounded-md bg-purple-500/20" />
                        <div className="h-6 w-6 rounded-md border border-purple-500/15 bg-[#1a0030]" />
                      </div>
                    </div>
                    <div>
                      <div className="h-1.5 w-10 rounded-full bg-purple-400/30" />
                      <div className="mt-2.5 h-7 w-full rounded-md border border-purple-500/15 bg-[#1a0030]" />
                    </div>
                    <div className="pt-2">
                      <div className="h-8 w-full rounded-md bg-gradient-to-r from-purple-600 to-pink-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative border-t border-white/5 bg-[#0B0014] py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400">
              How it works
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-tight text-white sm:text-4xl">
              From idea to presentation in seconds
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-7 transition-all duration-300 hover:border-purple-500/20 hover:bg-purple-500/[0.03]"
              >
                <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-sm font-bold text-white shadow-lg shadow-purple-500/20">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative border-t border-white/5 bg-[#0B0014] py-24 sm:py-32">
        {/* Subtle background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/5 blur-[128px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400">
              Features
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything you need to tell your story
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass-card group relative rounded-2xl p-7 transition-all duration-300 hover:border-purple-500/20 hover:bg-purple-500/[0.03]"
              >
                <div className="mb-4 inline-flex rounded-xl bg-purple-500/10 p-2.5 text-purple-400 transition-colors group-hover:bg-purple-500/20 group-hover:text-purple-300">
                  <feature.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Theme Showcase Section */}
      <section id="themes" className="relative border-t border-white/5 bg-[#080010] py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400">
              Themes
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Switch themes in one click
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-zinc-400">
              Every palette is designed to make your slides look polished
              without touching a color picker.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {allThemeIds.map((themeId) => {
              const theme = themes[themeId];
              return (
                <div
                  key={themeId}
                  className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/20"
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
                  <div className="border-t border-white/5 bg-[#0B0014] px-4 py-3">
                    <p className="text-sm font-medium text-white">
                      {theme.name}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
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
      <section className="relative border-t border-white/5 py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-[128px]" />
        </div>
        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <div className="rounded-2xl border border-purple-500/10 bg-gradient-to-br from-purple-500/[0.08] to-pink-500/[0.08] px-8 py-16 backdrop-blur-sm">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to build something beautiful?
            </h2>
            <p className="mt-4 text-base text-zinc-400">
              No account needed. No credit card. Just start creating.
            </p>
            <Link
              href="/editor/new"
              className="group mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-8 text-base font-medium text-[#0B0014] shadow-lg transition-all hover:bg-zinc-100 hover:shadow-xl"
            >
              Get started &mdash; it&apos;s free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <div className="mt-4">
              <a
                href="https://github.com/phillipan14/philadeck"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-purple-400"
              >
                <Github className="h-3.5 w-3.5" />
                Open source on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#080010] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Layers className="h-4 w-4 text-purple-400/60" />
            <span className="font-[family-name:var(--font-space-grotesk)] font-medium text-zinc-400">
              PhilaDeck
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/phillipan14/philadeck"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-purple-400"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <span className="text-sm text-zinc-600">
              Built by Phillip An
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
