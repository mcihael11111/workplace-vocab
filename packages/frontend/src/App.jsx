import { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { SiteNav }            from "./components/layout/SiteNav.jsx";
import { Footer }             from "./components/layout/Footer.jsx";
import { HeroSection }        from "./components/sections/HeroSection.jsx";
import { WelcomeStrip }       from "./components/sections/WelcomeStrip.jsx";
import { CategoriesSection }  from "./components/sections/CategoriesSection.jsx";
import { FeaturedSection }    from "./components/sections/FeaturedSection.jsx";
import { CtaSection }         from "./components/sections/CtaSection.jsx";
import { AboutPage }          from "./components/sections/AboutPage.jsx";
import { ProgressSection }    from "./components/sections/ProgressSection.jsx";
import { Ticker }             from "./components/ui/Ticker.jsx";
import { TermPanel }          from "./components/overlays/TermPanel.jsx";
import { FlashcardModal }     from "./components/overlays/FlashcardModal.jsx";
import { LoginModal }         from "./components/overlays/LoginModal.jsx";
import { MilestoneSheet }     from "./components/overlays/MilestoneSheet.jsx";
import { SEOHead }            from "./components/ui/SEOHead.jsx";
import { useModalState }      from "./hooks/useModalState.js";
import { useDrawerState }     from "./hooks/useDrawerState.js";
import { useProgress }        from "./hooks/useProgress.js";
import { useAuth }            from "./context/AuthContext.jsx";
import { ALL_WORDS }          from "./data/words.js";
import { CATEGORIES }         from "./data/categories.js";
import { AdSlot }             from "./components/ui/AdSlot.jsx";
import { TermOfTheDay }       from "./components/ui/TermOfTheDay.jsx";
import { CategoryPage }       from "./pages/CategoryPage.jsx";
import { CategoriesIndexPage } from "./pages/CategoriesIndexPage.jsx";
import { NotFoundPage }       from "./pages/NotFoundPage.jsx";

// Daily term is always unlocked regardless of view limit
const DAILY_TERM_NAME = ALL_WORDS[Math.floor(Date.now() / 86400000) % ALL_WORDS.length]?.term;
const DAILY_UNLOCKED  = new Set(DAILY_TERM_NAME ? [DAILY_TERM_NAME] : []);

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  const { user, signOut, isPro } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [milestone,    setMilestone]    = useState(null);

  const handleMilestone = ({ type, streakDays, days }) => {
    if (type === "confetti") {
      setMilestone(3);
    } else if (type === "dailyGoal") {
      showToast({ message: `Daily goal hit! ${streakDays > 1 ? `${streakDays}-day streak` : "Keep it up"}` });
    } else if (type === "streak") {
      showToast({ message: `${days}-day streak! You're on a roll` });
    }
  };

  const handleNudge = () => {
    showToast({ message: "Sign in to save your progress", action: "Sign in", onAction: openLogin });
  };

  const {
    completedTerms, toggleComplete, markComplete,
    viewedTerms, trackView, isViewLimitReached,
    streakDays, longestStreak, todayCount,
  } = useProgress(user, { onMilestone: handleMilestone, onNudge: handleNudge });

  const [search,       setSearch]       = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeDomain, setActiveDomain] = useState("All");
  const [loginOpen,    setLoginOpen]    = useState(false);
  const [signingOut,   setSigningOut]   = useState(false);
  const [toast,        setToast]        = useState(null);

  const { modalWords, modalIndex, openModal, closeModal, prevCard, nextCard, openRelated } = useModalState();
  const { drawerCat, drawerStartIndex, openDrawer, closeDrawer } = useDrawerState();

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
        showToast({ message: `${cat.name} mastered! All terms complete.` });
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
      showToast({ message: "You're now Pro! All cards are unlocked." });
      window.history.replaceState({}, "", "/");
    }
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    navigate("/");
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
    navigate("/progress");
  };

  // Determine background based on current route
  const isSubPage = location.pathname !== "/";
  const bgColor = (location.pathname === "/progress" || location.pathname === "/about") ? "#F8FAFC" : "#fff";

  return (
    <div style={{ fontFamily: "'DM Sans', -apple-system, sans-serif", background: bgColor, color: "#1A1A2E", minHeight: "100vh" }}>
      <ScrollToTop />
      <SiteNav
        user={user}
        onOpenLogin={openLogin}
        onOpenProgress={handleOpenProgress}
        onSignOut={handleSignOut}
        signingOut={signingOut}
        completedTerms={completedTerms}
      />

      <Routes>
        {/* Home */}
        <Route path="/" element={
          <>
            <SEOHead title={null} description="Learn the vocabulary of design, product, engineering, and marketing — one term at a time." />
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
        }/>

        {/* About */}
        <Route path="/about" element={
          <AboutPage onOpenLogin={openLogin}/>
        }/>

        {/* Progress */}
        <Route path="/progress" element={
          user ? (
            <ProgressSection
              completedTerms={completedTerms}
              toggleComplete={toggleComplete}
              onOpenModal={(words, i) => {
                navigate("/");
                setTimeout(() => openModal(words, i), 50);
              }}
            />
          ) : (
            <>
              <SEOHead title="My Progress" description="Sign in to track your learning progress." />
              <div style={{ maxWidth: 520, margin: "0 auto", padding: "120px 24px", textAlign: "center" }}>
                <p style={{ fontSize: 15, color: "#64748B", marginBottom: 16 }}>Sign in to view your progress.</p>
                <button onClick={openLogin} style={{ background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Sign in</button>
              </div>
            </>
          )
        }/>

        {/* Categories index */}
        <Route path="/categories" element={
          <CategoriesIndexPage completedTerms={completedTerms} user={user}/>
        }/>

        {/* Single category */}
        <Route path="/categories/:categorySlug" element={
          <CategoryPage completedTerms={completedTerms} user={user} onOpenDrawer={openDrawer}/>
        }/>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>

      {/* Footer on sub-pages (home has its own footer in the route) */}
      {isSubPage && <Footer/>}

      {/* Category term panel (overlay — works on any page) */}
      {drawerCat && (
        <TermPanel
          cat={drawerCat}
          onClose={closeDrawer}
          startIndex={drawerStartIndex}
          isPro={isPro}
          unlockedTerms={DAILY_UNLOCKED}
          viewedTerms={viewedTerms}
          isViewLimitReached={isViewLimitReached}
          onView={trackView}
          user={user}
          completedTerms={completedTerms}
          onToggleComplete={toggleComplete}
          onMarkComplete={markComplete}
          onUpgrade={handleUpgrade}
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
          onMarkComplete={markComplete}
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
