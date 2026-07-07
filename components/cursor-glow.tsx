"use client";

import { useEffect, useRef, useState } from "react";

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  // Starts false so server and client render the same thing on first paint —
  // this only flips true after mount, once we can safely check the browser's
  // hover capability (touch devices skip the effect entirely).
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client capability detection post-mount, not a sync loop
    setEnabled(true);

    function handleMove(event: MouseEvent) {
      const node = glowRef.current;
      if (!node) return;
      node.style.left = `${event.clientX}px`;
      node.style.top = `${event.clientY}px`;
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-1/2 top-1/2 z-0 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 mix-blend-multiply transition-[left,top] duration-300 ease-out"
      style={{
        background:
          "radial-gradient(circle, rgba(124,58,237,0.16) 0%, rgba(6,182,212,0.12) 45%, rgba(255,255,255,0) 75%)"
      }}
    />
  );
}
