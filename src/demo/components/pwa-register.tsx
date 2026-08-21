import { useEffect } from "react";

/** Registers the lightweight service worker for installable PWA shell. */
export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // After deploy, stale code-split chunks 404 — reload once to pick up new HTML.
    const onPreloadError = (event: Event) => {
      event.preventDefault();
      const key = "daalcrm-chunk-reload";
      try {
        if (sessionStorage.getItem(key) === "1") return;
        sessionStorage.setItem(key, "1");
      } catch {
        /* ignore */
      }
      window.location.reload();
    };
    window.addEventListener("vite:preloadError", onPreloadError);

    const onLoad = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* ignore SW registration failures in unsupported contexts */
      });
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    return () => window.removeEventListener("vite:preloadError", onPreloadError);
  }, []);
  return null;
}
