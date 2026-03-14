import { useState, useCallback } from "react";

// Manages the category drawer open/close state.
// drawerCat is the full category object when the drawer is open, null when closed.
export function useDrawerState() {
  const [drawerCat, setDrawerCat] = useState(null);

  const openDrawer  = useCallback(cat => setDrawerCat(cat), []);
  const closeDrawer = useCallback(()  => setDrawerCat(null), []);

  return { drawerCat, openDrawer, closeDrawer };
}
