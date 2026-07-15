"use client";

import { useMemo, useState } from "react";

const starterPrompts = [
  "A logo concept generator starter for brand exploration and creative direction.",
  "Create a production-ready workflow with risks, data flow, and owner handoffs.",
  "Generate a sample user journey and API contract for this starter.",
  "Give me a launch checklist and extension roadmap for this template."
];
const metrics = [
  "Server route",
  "Responsive UI",
  "Env setup"
];
const steps = [
  "Capture input",
  "Run server route",
  "Return structured output"
];
const chips = [
  "Image studio",
  "Next.js",
  "OpenAI",
  "Mobile ready"
];
const endpoint = "/api/generate-image";

export default function Home() {
  const [prompt, setPrompt] = useState(starterPrompts[0]);
  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  const status = useMemo(() => {
    if (isRunning) return "Running";
    if (result?.demo) return "Local response";
    if (result) return "Completed";
    return "Ready";
  }, [isRunning, result]);

  async function submit(event) {
    event.preventDefault();
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt || isRunning) return;

    setIsRunning(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: cleanPrompt }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Template run failed.");
      setResult(data);
    } catch (runError) {
      setError(runError.message);
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f8fafc] text-[#0f172a]">
      <section className="mx-auto min-h-screen max-w-[1500px] px-3 py-3 sm:px-5">
        <header className="grid gap-3 sm:grid-cols-[1fr_auto]"><div className="rounded-md border bg-white border-slate-200 p-4"><h1 className="text-3xl font-black sm:text-5xl">OpenAI Image Logo Concepts</h1><p className="mt-2 text-sm leading-6 opacity-65">A logo concept generator starter for brand exploration and creative direction.</p></div><div className="rounded-md border bg-white border-slate-200 p-4"><p className="text-xs uppercase opacity-45">Status</p><p className="text-2xl font-black">{status}</p></div></header>
        <div className="mt-3 grid gap-3 lg:grid-cols-[240px_1fr_320px]"><aside className="rounded-md border bg-white border-slate-200 p-3"><div className="space-y-2">{starterPrompts.map((example) => (
                <button
                  key={example}
                  className="w-full border border-current/10 bg-white/45 px-3 py-3 text-left text-sm leading-6 opacity-80 transition hover:opacity-100"
                  onClick={() => setPrompt(example)}
                  type="button"
                >
                  {example}
                </button>
              ))}</div></aside><main className="rounded-md border bg-white border-slate-200 p-4"><form className="space-y-3" onSubmit={submit}>
              <textarea
                className="min-h-44 w-full resize-y border border-current/10 bg-white/70 px-4 py-3 text-sm leading-7 outline-none placeholder:opacity-40 focus:border-current/30"
                onChange={(event) => setPrompt(event.target.value)}
                value={prompt}
              />
              <button
                className="min-h-12 w-full px-5 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-40 bg-slate-950 text-white hover:bg-slate-800"
                disabled={isRunning || !prompt.trim()}
                type="submit"
              >
                {isRunning ? "Running..." : "Create brief"}
              </button>
            </form></main><aside className="rounded-md border bg-white border-slate-200 p-4">{error ? <div className="border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-100">{error}</div> : null}
            {result ? (
              <article className="border border-current/10 bg-white/60 p-4 text-sm leading-7 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <strong>Result</strong>
                  <span className="border border-current/10 px-2 py-1 text-xs opacity-60">{result.model || "local"}</span>
                </div>
                <pre className="mt-4 max-h-[420px] overflow-auto whitespace-pre-wrap bg-black/5 p-4 text-sm leading-7">
                  {result.output || result.clientSecret || JSON.stringify(result, null, 2)}
                </pre>
              </article>
            ) : null}</aside></div>
      </section>
    </main>
  );
}
