import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { SEOHead } from "../ui/SEOHead.jsx";

// Full-page About view.
export function AboutPage({ onOpenLogin }) {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <SEOHead title="About" description="Workplace Vocab closes the language gap in modern workplaces. Learn the terms that unlock confidence, clarity, and career momentum." />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 96px" }}>

        {/* Back */}
        <Link
          to="/"
          style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "#64748B", fontSize: 14, fontWeight: 600, padding: "0 0 40px", marginBottom: 0, textDecoration: "none" }}
        >
          <ChevronLeft size={15} strokeWidth={2.5}/> Back to home
        </Link>

        {/* Hero */}
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6366F1", marginBottom: 16 }}>
          About Workplace Vocab
        </p>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, fontFamily: "'DM Serif Display', Georgia, serif", color: "#1A1A2E", marginBottom: 24 }}>
          The vocabulary that<br/>
          <span style={{ fontStyle: "italic", color: "#6366F1" }}>unlocks leadership.</span>
        </h1>
        <p style={{ fontSize: 18, color: "#475569", lineHeight: 1.75, marginBottom: 64, maxWidth: 620 }}>
          You know that thing where someone says "north star metric" or "unit economics" in a meeting and everyone nods? And you nod too, but you're already planning to Google it the second you get back to your desk? Yeah. That's the thing this is for.
        </p>

        <Divider/>

        {/* Why it exists */}
        <Section label="Why it exists">
          <p>
            There's a whole layer of language at work that nobody actually teaches you. You're just expected to pick it up — from meetings, from Slack, from overhearing someone say "let's circle back on the OKRs" like that's a normal sentence. And when you don't know a term, it's awkward to ask. So you don't. And the gap quietly grows.
          </p>
          <p>
            That's what Workplace Vocab is here to fix. No textbooks, no hour-long courses. Just clear, honest explanations of the words that actually come up at work — the ones that make you sound like you know what you're talking about (because you will).
          </p>
        </Section>

        <Divider/>

        {/* Who it's for */}
        <Section label="Who it's for">
          <p>
            Honestly? Pretty much anyone with a job. But especially:
          </p>
          <p>
            You just landed your first role on a product team and stand-ups feel like a foreign language. Or you're a marketer who's suddenly working with engineers and half the words in their Jira tickets might as well be in code. Maybe you're running a startup and you want to talk to every part of your team without sounding like you're bluffing. Or you've switched industries and you're rebuilding your vocabulary from scratch — even though you've got ten years of experience.
          </p>
          <p>
            If you've ever walked out of a meeting thinking "I really should know what that means" — welcome. You're in the right place.
          </p>
        </Section>

        <Divider/>

        {/* The content */}
        <Section label="What you'll find here">
          <p>
            Every term here was picked because it actually comes up — in sprint reviews, strategy meetings, stakeholder decks, product critiques, job interviews. Nothing theoretical. Nothing you'd only find in a textbook. Just the language that shows up when real work is happening.
          </p>
          <p>
            And each term goes deeper than a one-liner. You get a plain-language definition, why it matters in context, a real scenario so you can see it in action, and related terms so the ideas start connecting instead of sitting in a list. Because that's how vocabulary actually sticks — when you can see how things link together.
          </p>
          <p>
            Right now there are over 400 terms across Product Design, Engineering, Business, Marketing, Finance, and Legal. And it keeps growing.
          </p>
        </Section>

        <Divider/>

        {/* The builder */}
        <Section label="Who built this">
          <p>
            Hi — I'm Michael Papanikolaou, a designer and product person based in Australia. I built this because I spent years sitting in rooms where the people with the clearest vocabulary had a real advantage. Not always the best ideas — just the best words for them. And I watched smart, capable people hold back because they weren't sure if they were using a term correctly.
          </p>
          <p>
            That bugged me. Language shouldn't be a gatekeeping thing. If you've got the words, you can jump into the conversation. And if you can do that, you can lead it. That's the whole idea behind this.
          </p>
          <p style={{ marginBottom: 0 }}>
            You can see more of what I'm working on at{" "}
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
            Want to give it a go?
          </h2>
          <p style={{ fontSize: 16, color: "#64748B", margin: 0, lineHeight: 1.65, maxWidth: 480 }}>
            It's free. Sign up, save your progress, and work through the terms at whatever pace suits you.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
            <button
              onClick={onOpenLogin}
              style={{ background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 12, padding: "14px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}
            >
              Start learning — it's free
            </button>
            <Link
              to="/categories"
              style={{ background: "none", color: "#64748B", border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "13px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer", textDecoration: "none", display: "inline-block" }}
            >
              Browse terms
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "#F1F5F9", margin: "16px 0" }}/>;
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
