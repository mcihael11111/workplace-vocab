import { useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../data/categories.js";
import { DOMAINS } from "../data/domains.js";
import { ALL_WORDS } from "../data/words.js";
import { filterCategories } from "../utils/filterUtils.js";
import { FilterPills } from "../components/ui/FilterPills.jsx";
import { Breadcrumbs } from "../components/ui/Breadcrumbs.jsx";
import { SEOHead } from "../components/ui/SEOHead.jsx";
import { Trophy } from "lucide-react";

export function CategoriesIndexPage({ completedTerms = new Set(), user }) {
  const [activeDomain, setActiveDomain] = useState("All");
  const filteredCats = filterCategories(CATEGORIES, activeDomain, "");

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 96px" }}>
      <SEOHead
        title="Browse Categories"
        description="Explore 27 categories of workplace vocabulary across Product Design, Engineering, Business, Marketing, Finance, and Legal."
      />

      <Breadcrumbs items={[
        { label: "Home", to: "/" },
        { label: "Categories" },
      ]} />

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 8 }}>Browse by category</p>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700, letterSpacing: "-0.03em", fontFamily: "'DM Serif Display', serif", color: "#1A1A2E", margin: 0 }}>
            {activeDomain !== "All" ? activeDomain : "Every area of practice"}
          </h1>
        </div>
        <FilterPills options={DOMAINS} active={activeDomain} onChange={setActiveDomain} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(220px, 100%), 1fr))", gap: 14, alignItems: "start" }}>
        {filteredCats.map(cat => {
          const catWords = user ? ALL_WORDS.filter(w => w.category === cat.name) : [];
          const completedCount = user ? catWords.filter(w => completedTerms.has(w.term)).length : undefined;
          const totalCount = user ? catWords.length : undefined;
          const hasProgress = completedCount !== undefined && totalCount > 0;
          const allDone = hasProgress && completedCount === totalCount;

          return (
            <CategoryCardLink
              key={cat.id}
              cat={cat}
              completedCount={completedCount}
              totalCount={totalCount}
              hasProgress={hasProgress}
              allDone={allDone}
            />
          );
        })}
      </div>
    </div>
  );
}

function CategoryCardLink({ cat, completedCount, totalCount, hasProgress, allDone }) {
  const [hov, setHov] = useState(false);
  const pct = hasProgress ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Link
      to={`/categories/${cat.id}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: allDone ? "#F0FDF4" : "#fff",
        border: `1.5px solid ${allDone ? "#86EFAC" : hov ? cat.accent : "#E2E8F0"}`,
        borderRadius: 14, padding: "18px 20px 16px", cursor: "pointer",
        transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? "0 8px 24px rgba(0,0,0,0.09)" : "0 1px 4px rgba(0,0,0,0.05)",
        display: "flex", flexDirection: "column", gap: 8, textDecoration: "none", color: "inherit",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: cat.color, borderRadius: 10 }}>
          <cat.icon size={20} color={cat.accent} strokeWidth={1.75} />
        </span>
        {allDone && (
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "#16A34A", background: "#DCFCE7", border: "1px solid #86EFAC", padding: "3px 9px", borderRadius: 99, display: "flex", alignItems: "center", gap: 4 }}>
            <Trophy size={11} color="#16A34A" strokeWidth={2.5} /> Complete
          </span>
        )}
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A2E", marginBottom: 3 }}>{cat.name}</div>
        <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>{cat.description}</div>
      </div>
      {hasProgress && !allDone && completedCount > 0 && (
        <div style={{ height: 3, background: "#E2E8F0", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 99, background: cat.accent, width: `${pct}%`, transition: "width 0.4s ease" }} />
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: hov ? cat.accent : "#94A3B8", transition: "color 0.15s" }}>
          {hasProgress ? `${completedCount} / ${totalCount} terms` : `${cat.count} terms`}
        </span>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: hov ? cat.accent : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={hov ? "#fff" : "#94A3B8"} strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </div>
      </div>
    </Link>
  );
}
