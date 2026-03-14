import { useState } from "react";
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
import { useModalState }      from "./hooks/useModalState.js";
import { useDrawerState }     from "./hooks/useDrawerState.js";
import { useProgress }        from "./hooks/useProgress.js";
import { useAuth }            from "./context/AuthContext.jsx";

export default function App() {
  const { user }                             = useAuth();
  const { completedTerms, toggleComplete }   = useProgress(user);

  const [search,       setSearch]       = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeDomain, setActiveDomain] = useState("All");
  const [activeView,   setActiveView]   = useState("home");  // "home" | "progress"
  const [loginOpen,    setLoginOpen]    = useState(false);

  const { modalWords, modalIndex, openModal, closeModal, prevCard, nextCard, openRelated } = useModalState();
  const { drawerCat,  openDrawer, closeDrawer } = useDrawerState();

  // Redirect to home if user signs out while on progress view
  const handleSignOut = () => { setActiveView("home"); };

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
          <HeroSection search={search} onSearchChange={setSearch}/>
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
          user={user}
          completedTerms={completedTerms}
          onToggleComplete={toggleComplete}
        />
      )}

      {/* Login modal */}
      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)}/>}
    </div>
  );
}
