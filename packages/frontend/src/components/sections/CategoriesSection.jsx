import { useState, useRef, useEffect, useCallback } from "react";
import { CATEGORIES } from "../../data/categories.js";
import { DomainCarousel } from "./DomainCarousel.jsx";
import { DomainSection } from "./DomainSection.jsx";

// Build domain objects: { name, categories, totalTerms }
const domainNames = [...new Set(CATEGORIES.map(c => c.domain))];
const DOMAIN_LIST = domainNames.map(name => {
  const categories = CATEGORIES.filter(c => c.domain === name);
  return { name, categories, totalTerms: categories.reduce((s, c) => s + c.count, 0) };
});

const INITIAL_COUNT = 3;   // domains visible on first render
const LOAD_BATCH   = 2;    // domains added per scroll

// Sectioned category browser: domain carousel → domain sections → infinite scroll
export function CategoriesSection({ onOpenDrawer, completedTerms = new Set(), user }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const sentinelRef = useRef(null);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount(prev => Math.min(prev + LOAD_BATCH, DOMAIN_LIST.length));
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount]); // re-observe when count changes (sentinel may move)

  const visibleDomains = DOMAIN_LIST.slice(0, visibleCount);
  const hasMore = visibleCount < DOMAIN_LIST.length;

  // Scroll to a domain section when clicked in carousel
  const handleDomainClick = useCallback((domainName) => {
    const idx = DOMAIN_LIST.findIndex(d => d.name === domainName);
    // Make sure the domain is loaded
    if (idx >= visibleCount) {
      setVisibleCount(Math.min(idx + 2, DOMAIN_LIST.length));
    }
    // Scroll after a tick to allow render
    requestAnimationFrame(() => {
      const slug = domainName.toLowerCase().replace(/\s+/g, "-");
      const el = document.getElementById(`domain-${slug}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }, [visibleCount]);

  return (
    <section
      id="categories"
      style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(40px,7vw,72px) 0 0" }}
    >
      {/* Domain carousel */}
      <DomainCarousel domains={DOMAIN_LIST} onDomainClick={handleDomainClick} />

      {/* Domain sections */}
      <div style={{ padding: "48px 24px 0", maxWidth: 1200, margin: "0 auto" }}>
        {visibleDomains.map((domain) => (
          <DomainSection
            key={domain.name}
            domain={domain}
            onOpenDrawer={onOpenDrawer}
            completedTerms={completedTerms}
            user={user}
          />
        ))}
      </div>

      {/* Sentinel for infinite scroll */}
      {hasMore && (
        <div ref={sentinelRef} style={{ padding: "32px 0", textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            color: "#94A3B8", fontSize: 13, fontWeight: 500,
          }}>
            <Spinner /> Loading more domains…
          </div>
        </div>
      )}
    </section>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: "spin 0.8s linear infinite" }}>
      <circle cx="8" cy="8" r="6" fill="none" stroke="#CBD5E1" strokeWidth="2" />
      <path d="M8 2a6 6 0 0 1 6 6" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}
