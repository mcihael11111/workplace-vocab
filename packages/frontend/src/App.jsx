import { useState, useEffect, useRef } from "react";
import { SiteNav }            from "./components/layout/SiteNav.jsx";
import { Footer }             from "./components/layout/Footer.jsx";
import { HeroSection }        from "./components/sections/HeroSection.jsx";
import { WelcomeStrip }       from "./components/sections/WelcomeStrip.jsx";
import { CategoriesSection }  from "./components/sections/CategoriesSection.jsx";
import { FeaturedSection }    from "./components/sections/FeaturedSection.jsx";
import { CtaSection }         from "./components/sections/CtaSection.jsx";
import { ProgressSection }    from "./components/sections/ProgressSection.jsx";
import { Ticker }             from "./components/ui/Ticker.jsx";
import { CategoryDrawer }     from "./components/overlays/CategoryDrawer.jsx";
import { FlashcardModal }     from "./components/overlays/FlashcardModal.jsx";
import { LoginModal }         from "./components/overlays/LoginModal.jsx";
import { MilestoneSheet }     from "./components/overlays/MilestoneSheet.jsx";
import { useModalState }      from "./hooks/useModalState.js";
import { useDrawerState }     from "./hooks/useDrawerState.js";
import { useProgress }        from "./hooks/useProgress.js";
import { useAuth }            from "./context/AuthContext.jsx";
import { ALL_WORDS }          from "./data/words.js";
import { CATEGORIES }         from "./data/categories.js";
import { AdSlot }             from "./components/ui/AdSlot.jsx";
import { TermOfTheDay }       from "./components/ui/TermOfTheDay.jsx";

// Daily term is always unlocked regardless of view limit
const DAILY_TERM_NAME = ALL_WORDS[Math.floor(Date.now() / 86400000) % ALL_WORDS.length]?.term;
const DAILY_UNLOCKED  = new Set(DAILY_TERM_NAME ? [DAILY_TERM_NAME] : []);

export default function App() {
  const { user, signOut, isPro } = useAuth();
  const [milestone,    setMilestone]    = useState(null);

  const handleMilestone = ({ type, streakDays, days }) => {
    if (type === "confetti") {
      setMilestone(3);
    } else if (type === "dailyGoal") {
      showToast({ message: `Daily goal hit! 🔥 ${streakDays > 1 ? `${streakDays}-day streak` : "Keep it up"}` });
    } else if (type === "streak") {
      showToast({ message: `${days}-day streak! 🔥 You're on a roll` });
    }
  };

  const handleNudge = () => {
    showToast({ message: "Sign in to save your progress", action: "Sign in", onAction: openLogin });
  };

  const {
    completedTerms, toggleComplete,
    viewedTerms, trackView, isViewLimitReached,
    streakDays, longestStreak, todayCount,
  } = useProgress(user, { onMilestone: handleMilestone, onNudge: handleNudge });

  const [search,       setSearch]       = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeDomain, setActiveDomain] = useState("All");
  const [activeView,   setActiveView]   = useState("home");
  const [loginOpen,    setLoginOpen]    = useState(false);
  const [signingOut,   setSigningOut]   = useState(false);
  const [toast,        setToast]        = useState(null);

  const { modalWords, modalIndex, openModal, closeModal, prevCard, nextCard, openRelated } = useModalState();
  const { drawerCat,  openDrawer, closeDrawer } = useDrawerState();

  const showToast = (msg) => {
    setToast(typeof msg === "string" ? { message: msg } : msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Category completion toasts
  const prevCompletedRef = useRef(null);
  useEffect(() => {
    if (!user || prevCompletedRef.current === null) { prevCompletedRef.current = completedTerms; return; }
    const prev = prevCompletedRef.current;
    for (const cat of CATEGORIES) {
      const words = ALL_WORDS.filter(w => w.category === cat.name);
      if (words.length === 0) continue;
      if (words.every(w => completedTerms.has(w.term)) && !words.every(w => prev.has(w.term))) {
        showToast({ message: `${cat.icon} ${cat.name} mastered! 🏆` });
      }
    }
    prevCompletedRef.current = completedTerms;
  }, [completedTerms]);

  const handleUpgrade = async () => {
    if (!user) { openLogin(); return; }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/payments/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, email: user.email }),
      });
      const { data } = await res.json();
      window.location.href = data.url;
    } catch {
      showToast({ message: "Something went wrong. Please try again." });
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("session_id")) {
      showToast({ message: "🎉 You're now Pro! All cards are unlocked." });
      window.history.replaceState({}, "", "/");
    }
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    setActiveView("home");
    try {
      await signOut();
      showToast({ message: "You've been signed out." });
    } finally {
      setSigningOut(false);
    }
  };

  const openLogin = () => setLoginOpen(true);

  const handleOpenProgress = () => {
    if (!user) { openLogin(); return; }
    setActiveView("progress");
  };

  return (
    <div style={{ fontFamily: "'DM Sans', -apple-system, sans-serif", background: activeView === "progress" ? "#F8FAFC" : "#fff", color: "#1A1A2E", minHeight: "100vh" }}>
      <SiteNav
        user={user}
        onOpenLogin={openLogin}
        onOpenProgress={handleOpenProgress}
        onSignOut={handleSignOut}
        signingOut={signingOut}
      />

      {activeView === "progress" && user ? (
        <ProgressSection
          completedTerms={completedTerms}
          toggleComplete={toggleComplete}
          onGoHome={() => setActiveView("home")}
          onOpenModal={(words, i) => {
            setActiveView("home");
            setTimeout(() => openModal(words, i), 50);
          }}
        />
      ) : (
        <>
          <HeroSection/>
          <TermOfTheDay completedTerms={completedTerms} onOpen={openModal}/>
          {user && (
            <WelcomeStrip
              user={user}
              completedTerms={completedTerms}
              onResume={openModal}
            />
          )}
          <Ticker/>
          <CategoriesSection
            search={search}
            activeDomain={activeDomain}
            onDomainChange={setActiveDomain}
            onOpenDrawer={openDrawer}
            completedTerms={completedTerms}
            user={user}
          />
          <AdSlot slot="1205581780"/>
          <FeaturedSection
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onOpenModal={openModal}
            completedTerms={completedTerms}
          />
          <CtaSection onOpenLogin={openLogin}/>
          <Footer/>
        </>
      )}

      {/* Category drawer */}
      {drawerCat && (
        <CategoryDrawer
          cat={drawerCat}
          onClose={closeDrawer}
          onOpenCard={(words, i) => {
            closeDrawer();
            setTimeout(() => openModal(words, i), 50);
          }}
        />
      )}

      {/* Flashcard modal */}
      {modalIndex !== null && modalWords && (
        <FlashcardModal
          words={modalWords}
          activeIndex={modalIndex}
          onClose={closeModal}
          onPrev={prevCard}
          onNext={nextCard}
          onOpenRelated={openRelated}
          onUpgrade={handleUpgrade}
          isPro={isPro}
          unlockedTerms={DAILY_UNLOCKED}
          viewedTerms={viewedTerms}
          isViewLimitReached={isViewLimitReached}
          onView={trackView}
          user={user}
          completedTerms={completedTerms}
          onToggleComplete={toggleComplete}
        />
      )}

      {/* Login modal */}
      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)}/>}

      {/* Milestone achievement sheet */}
      {milestone !== null && <MilestoneSheet currentCount={milestone} onClose={() => setMilestone(null)}/>}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: "#1A1A2E", color: "#fff", borderRadius: 10,
          padding: "12px 16px 12px 20px", fontSize: 14, fontWeight: 500,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)", zIndex: 2000,
          animation: "cardIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          display: "flex", alignItems: "center", gap: 12, whiteSpace: "nowrap",
        }}>
          {toast.message}
          {toast.action && (
            <button
              onClick={() => { toast.onAction?.(); setToast(null); }}
              style={{ background: "#fff", color: "#1A1A2E", border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
            >
              {toast.action}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
