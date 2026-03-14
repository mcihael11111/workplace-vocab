import { useState } from "react";
import { SiteNav }           from "./components/layout/SiteNav.jsx";
import { Footer }            from "./components/layout/Footer.jsx";
import { HeroSection }       from "./components/sections/HeroSection.jsx";
import { CategoriesSection } from "./components/sections/CategoriesSection.jsx";
import { FeaturedSection }   from "./components/sections/FeaturedSection.jsx";
import { CtaSection }        from "./components/sections/CtaSection.jsx";
import { Ticker }            from "./components/ui/Ticker.jsx";
import { CategoryDrawer }    from "./components/overlays/CategoryDrawer.jsx";
import { FlashcardModal }    from "./components/overlays/FlashcardModal.jsx";
import { useModalState }     from "./hooks/useModalState.js";
import { useDrawerState }    from "./hooks/useDrawerState.js";

export default function App() {
  const [search,       setSearch]       = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeDomain, setActiveDomain] = useState("All");

  const { modalWords, modalIndex, openModal, closeModal, prevCard, nextCard, openRelated } = useModalState();
  const { drawerCat,  openDrawer, closeDrawer } = useDrawerState();

  return (
    <div style={{ fontFamily: "'DM Sans', -apple-system, sans-serif", background: "#fff", color: "#1A1A2E", minHeight: "100vh" }}>
      <SiteNav/>

      <HeroSection
        search={search}
        onSearchChange={setSearch}
      />

      <Ticker/>

      <CategoriesSection
        search={search}
        activeDomain={activeDomain}
        onDomainChange={setActiveDomain}
        onOpenDrawer={openDrawer}
      />

      <FeaturedSection
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onOpenModal={openModal}
      />

      <CtaSection/>
      <Footer/>

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
        />
      )}
    </div>
  );
}
