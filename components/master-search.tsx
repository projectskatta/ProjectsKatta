"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const routeHints = [
  { terms: ["bee", "basic electronics", "notes", "pyq", "sppu", "msbte", "semester"], href: "/education" },
  { terms: ["project", "arduino", "esp32", "robot", "source code", "report"], href: "/projects" },
  { terms: ["kit", "buy", "component", "sensor", "relay", "motor"], href: "/store" },
  { terms: ["game", "canvas", "code locker"], href: "/games" }
];

export function MasterSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const suggestion = useMemo(() => {
    const normalized = query.toLowerCase();
    return routeHints.find((hint) => hint.terms.some((term) => normalized.includes(term)))?.href ?? "/education";
  }, [query]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    const params = value ? `?q=${encodeURIComponent(value)}` : "";
    router.push(`${suggestion}${params}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-4xl">
      <label className="relative block">
        <span className="sr-only">Search ProjectsKatta</span>
        <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search BEE solutions, Arduino projects, ESP32 kits..."
          className="h-16 w-full rounded-lg border border-zinc-300 bg-white pl-14 pr-4 text-base font-semibold text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-200 sm:h-20 sm:text-xl"
        />
      </label>
    </form>
  );
}
