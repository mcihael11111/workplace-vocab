import { useState, useCallback } from "react";

// Manages the category drawer open/close state.
// drawerCat is the full category object when the drawer is open, null when closed.
// drawerStartIndex is an optional term index to open directly to detail view.
export function useDrawerState() {
  const [drawerCat, setDrawerCat] = useState(null);
  const [drawerStartIndex, setDrawerStartIndex] = useState(null);

  const openDrawer = useCallback((cat, startIndex = null) => {
    setDrawerCat(cat);
    setDrawerStartIndex(startIndex);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerCat(null);
    setDrawerStartIndex(null);
  }, []);

  return { drawerCat, drawerStartIndex, openDrawer, closeDrawer };
}
