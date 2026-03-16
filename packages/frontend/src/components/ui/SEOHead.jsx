import { useEffect } from "react";

// Sets document title and meta description for the current page.
// Lightweight alternative to react-helmet for a Vite SPA.
export function SEOHead({ title, description }) {
  useEffect(() => {
    const suffix = "Workplace Vocab";
    document.title = title ? `${title} — ${suffix}` : suffix;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    if (description) meta.setAttribute("content", description);

    return () => {
      document.title = suffix;
    };
  }, [title, description]);

  return null;
}
