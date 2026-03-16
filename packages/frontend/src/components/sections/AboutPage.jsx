import { ChevronLeft } from "lucide-react";

// Full-page About view. Rendered when activeView === "about".
export function AboutPage({ onGoHome, onOpenLogin }) {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 96px" }}>

        {/* Back */}
        <button
          onClick={onGoHome}
          style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "#64748B", fontSize: 14, fontWeight: 600, padding: "0 0 40px", marginBottom: 0 }}
        >
          <ChevronLeft size={15} strokeWidth={2.5}/> Back to home
        </button>

        {/* Hero */}
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6366F1", marginBottom: 16 }}>
          About Workplace Vocab
        </p>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, fontFamily: "'DM Serif Display', Georgia, serif", color: "#1A1A2E", marginBottom: 24 }}>
          The vocabulary that<br/>
          <span style={{ fontStyle: "italic", color: "#6366F1" }}>unlocks leadership.</span>
        </h1>
        <p style={{ fontSize: 18, color: "#475569", lineHeight: 1.75, marginBottom: 64, maxWidth: 620 }}>
          In most workplaces, there's an unspoken language. Words like "north star metric," "design system," "unit economics," or "scope creep" get thrown around in meetings as if everyone just knows what they mean. Most people don't — but few will say so. You nod along, you Google it later, and the cycle repeats.
        </p>

        <Divider/>

        {/* Why it exists */}
        <Section label="Why it exists">
          <p>
            That gap between the language people use and the language people understand is real, and it costs people confidence, clarity, and career momentum. It's not a sign that someone isn't capable — it's a sign that the vocabulary was never properly taught. Most of it exists inside industries, disciplines, and teams, passed around informally and assumed to be common knowledge.
          </p>
          <p>
            Workplace Vocab was built to close that gap. Not with jargon-heavy textbooks or hour-long courses — but with short, clear, honest explanations of the terms that actually come up in the rooms where decisions get made.
          </p>
        </Section>

        <Divider/>

        {/* Who it's for */}
        <Section label="Who it's for">
          <p>
            This isn't a resource just for designers, or just for developers, or just for people who've been working in tech for a decade. It's for anyone who works in a modern organisation and wants to show up to conversations with more confidence.
          </p>
          <p>
            The graduate joining their first product team and trying to keep up in stand-ups. The marketer who's started working alongside engineers and keeps hearing terms they can't quite place. The operations lead sitting in cross-functional meetings where half the language sounds like a different dialect. The founder who wants to communicate more precisely with each part of their team. The senior professional who has moved into a new industry and is rebuilding their context from scratch.
          </p>
          <p>
            If you've ever walked out of a meeting thinking "I should know what that means" — this was built for you.
          </p>
        </Section>

        <Divider/>

        {/* The content */}
        <Section label="The content">
          <p>
            Every term in Workplace Vocab has been chosen because it comes up in real working environments — in strategy sessions, sprint reviews, stakeholder presentations, product critiques, and hiring conversations. Not theoretical, not academic. The kind of language that moves careers.
          </p>
          <p>
            Each entry goes beyond a one-line definition. You get the plain-language meaning, the reason it matters in a professional context, a real-world example of how it shows up in conversation, and related terms that help you build a connected understanding rather than a list of isolated facts. Because vocabulary doesn't live in a vacuum — it lives inside ideas, and ideas connect.
          </p>
          <p>
            The library currently covers over 400 terms across Product Design, Engineering, Business, Marketing, Finance, and Legal — and it continues to grow.
          </p>
        </Section>

        <Divider/>

        {/* The builder */}
        <Section label="Built by">
          <p>
            Workplace Vocab was created by Michael Papanikolaou, a designer and product person based in Australia. The idea grew out of years of sitting in rooms where vocabulary was assumed, confidence gaps were quietly managed, and the people with the clearest language had a visible advantage — regardless of whether they had the best ideas.
          </p>
          <p>
            The belief behind this project is simple: language is a form of access. When you have the words, you can participate. When you can participate, you can lead. This is a tool built to give more people that access, regardless of where they started or what their background is.
          </p>
          <p style={{ marginBottom: 0 }}>
            You can find more of Michael's work at{" "}
            <a href="https://www.madebymichael.com.au/uxuidesignportfolio" target="_blank" rel="noreferrer" style={{ color: "#6366F1", fontWeight: 600, textDecoration: "none" }}>
              madebymichael.com.au
            </a>
            .
          </p>
        </Section>

        <Divider/>

        {/* CTA */}
        <div style={{ paddingTop: 48, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
          <h2 style={{ fontSize: "clamp(24px,4vw,32px)", fontWeight: 700, letterSpacing: "-0.03em", fontFamily: "'DM Serif Display', serif", color: "#1A1A2E", margin: 0, lineHeight: 1.2 }}>
            Ready to start?
          </h2>
          <p style={{ fontSize: 16, color: "#64748B", margin: 0, lineHeight: 1.65, maxWidth: 480 }}>
            Create a free account to save your progress, track your streaks, and work through every term at your own pace.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
            <button
              onClick={onOpenLogin}
              style={{ background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 12, padding: "14px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}
            >
              Start learning — it's free
            </button>
            <button
              onClick={onGoHome}
              style={{ background: "none", color: "#64748B", border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "13px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
            >
              Browse terms
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "#F1F5F9", margin: "48px 0" }}/>;
}

function Section({ label, children }) {
  return (
    <div style={{ marginBottom: 0 }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 20 }}>
        {label}
      </p>
      <div style={{ fontSize: 17, color: "#334155", lineHeight: 1.8, display: "flex", flexDirection: "column", gap: 20 }}>
        {children}
      </div>
    </div>
  );
}
