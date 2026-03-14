# Frontend

## Stack

- **Vite 5** — build tool and dev server
- **React 18** — UI library
- **Inline styles** — no CSS framework; CSS files for global resets + keyframes only
- **DM Sans** + **DM Serif Display** — Google Fonts

---

## Component Tree

```
App
├── SiteNav
├── HeroSection
│   └── SearchBar
├── Ticker
├── CategoriesSection
│   ├── FilterPills        (domain filter)
│   └── CategoryCard[]
├── FeaturedSection
│   ├── FilterPills        (level filter)
│   └── GridCard[]
│       └── Badge
├── CtaSection
├── Footer
├── CategoryDrawer         (conditional — portal-like overlay)
│   └── DrawerWordRow[]
│       └── Badge
└── FlashcardModal         (conditional — portal-like overlay)
    ├── ChevronBtn (×2)
    ├── Badge
    └── RelatedChip[]
```

---

## Component Reference

### Layout

#### `SiteNav`
Sticky top nav, 60px height. Collapses to hamburger at `< 768px`. Nav links: Categories, Flashcards, About.

**Props:** none — reads `useWindowSize` internally.

#### `Footer`
Footer with logo, credit link (Michael Papanikolaou), and anchor nav links.

**Props:** none.

---

### Sections

#### `HeroSection`
| Prop | Type | Description |
|---|---|---|
| `search` | `string` | Controlled search value |
| `onSearchChange` | `(value: string) => void` | Called on input change |

#### `CategoriesSection`
| Prop | Type | Description |
|---|---|---|
| `search` | `string` | Search query passed through to `filterCategories` |
| `activeDomain` | `string` | Active domain filter id |
| `onDomainChange` | `(id: string) => void` | Called when domain pill is clicked |
| `onOpenDrawer` | `(cat: Category) => void` | Called when a CategoryCard is clicked |

#### `FeaturedSection`
| Prop | Type | Description |
|---|---|---|
| `activeFilter` | `string` | Active level filter id |
| `onFilterChange` | `(id: string) => void` | Called when level pill is clicked |
| `onOpenModal` | `(words: Word[], index: number) => void` | Called when a GridCard is clicked |

#### `CtaSection`
No props. Buttons use `document.getElementById` to scroll to sections.

---

### Cards

#### `GridCard`
| Prop | Type | Description |
|---|---|---|
| `word` | `Word` | Term object |
| `onOpen` | `() => void` | Opens FlashcardModal |

#### `CategoryCard`
| Prop | Type | Description |
|---|---|---|
| `cat` | `Category` | Category object |
| `onClick` | `() => void` | Opens CategoryDrawer |

---

### Overlays

#### `FlashcardModal`
| Prop | Type | Description |
|---|---|---|
| `words` | `Word[]` | Array of words being navigated |
| `activeIndex` | `number` | Currently displayed word index |
| `onClose` | `() => void` | Close the modal |
| `onPrev` | `() => void` | Navigate to previous word |
| `onNext` | `() => void` | Navigate to next word |
| `onOpenRelated` | `(word: Word) => void` | Open a related term |

Desktop: centred modal with fixed `ChevronBtn` arrows. Mobile (`< 768px`): bottom sheet with swipe.

Keyboard: `Escape` closes, `←` / `→` navigate.

#### `CategoryDrawer`
| Prop | Type | Description |
|---|---|---|
| `cat` | `Category` | Category to display |
| `onClose` | `() => void` | Close the drawer |
| `onOpenCard` | `(words: Word[], index: number) => void` | Open flashcard modal from a term row |

Desktop: right-side panel. Mobile: bottom sheet. Keyboard: `Escape` closes.

#### `DrawerWordRow`
| Prop | Type | Description |
|---|---|---|
| `word` | `Word` | Term to display |
| `cat` | `Category` | Parent category (for accent colours) |
| `onOpen` | `() => void` | Opens FlashcardModal at this term |

---

### UI Primitives

#### `Badge`
| Prop | Type | Description |
|---|---|---|
| `level` | `"Beginner" \| "Intermediate" \| "Advanced"` | Colour and text |

#### `SearchBar`
Controlled input. `value` + `onChange(string)`.

#### `Ticker`
No props. Scrolling marquee of 20 term names. Animation: `@keyframes ticker`.

#### `ChevronBtn`
| Prop | Type | Description |
|---|---|---|
| `direction` | `"left" \| "right"` | Which side to render |
| `disabled` | `boolean` | Dimmed and non-clickable |
| `onClick` | `() => void` | Navigate handler |

#### `RelatedChip`
| Prop | Type | Description |
|---|---|---|
| `label` | `string` | Term name |
| `linked` | `boolean` | Whether the term exists in ALL_WORDS |
| `color` | `string` | Background hex (from parent category) |
| `accent` | `string` | Accent hex (from parent category) |
| `onClick` | `() => void \| undefined` | Only set when `linked = true` |

#### `FilterPills`
| Prop | Type | Description |
|---|---|---|
| `options` | `Array<{ id, name }>` | Pill options |
| `active` | `string` | Active option id |
| `onChange` | `(id: string) => void` | Selection handler |

---

## Hooks

### `useWindowSize()`
Returns `window.innerWidth` as a number. Updates on resize. Defaults to `1200` on SSR.

**Used by:** `SiteNav`, `FlashcardModal`, `CategoryDrawer`.

### `useModalState()`
Manages flashcard modal state.

Returns: `{ modalWords, modalIndex, openModal, closeModal, prevCard, nextCard, openRelated }`

### `useDrawerState()`
Manages category drawer open/close.

Returns: `{ drawerCat, openDrawer, closeDrawer }`

### `useKeyboardNav(keyMap, deps)`
Attaches a `keydown` listener for the provided key→callback map. Auto-cleans up.

```js
useKeyboardNav({ Escape: onClose, ArrowLeft: onPrev, ArrowRight: onNext }, [onClose, onPrev, onNext]);
```

---

## Utils

### `styleTokens.js`
Exports `LEVEL_COLORS`, `BRAND`, `TRANSITIONS` objects.

### `filterUtils.js`
- `filterCategories(categories, domain, search)` — pure filter for the categories section
- `filterByLevel(words, level)` — pure filter for the featured section

### `termLookup.js`
- `CAT_MAP` — `{ [categoryName]: Category }` built from CATEGORIES at module load
- `findTermByName(name)` — case-insensitive term lookup in ALL_WORDS

---

## Styles

| File | Purpose |
|---|---|
| `styles/global.css` | Box-sizing reset, body font, scrollbar styles |
| `styles/animations.css` | All `@keyframes` and `.fade-up` utility class |
| `styles/fonts.css` | Google Fonts `@import` |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Phase 2 | Base URL of the backend API |

In Phase 1, `VITE_API_URL` is defined but unused — all data comes from `src/data/`.
