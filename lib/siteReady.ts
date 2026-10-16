import { useSyncExternalStore } from "react";

// Tiny store: the home-page 3D scene flips this once its first frames have rendered,
// and the intro screen waits for it before revealing the site.
let ready = false;
const listeners = new Set<() => void>();

export function markSiteReady() {
  if (ready) return;
  ready = true;
  listeners.forEach((l) => l());
}

export function useSiteReady() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => ready,
    () => false,
  );
}
