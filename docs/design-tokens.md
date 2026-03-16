# Design Tokens

Shared values used across the Workplace Vocab frontend. Reference this file when building new pages or components to ensure visual consistency.

---

## Layout

| Token | Value | Usage |
|---|---|---|
| **Page max-width** | `1200px` | All page containers, section wrappers, grids. The default for any new page. |
| **Content max-width** | `900px` | Long-form reading pages only (About, Progress). Hero section text block. |
| **Paragraph max-width** | `480–620px` | Constrains line length inside wider containers. Not a page-level value. |
| **Page padding** | `0 24px` | Horizontal padding on all page containers. |
| **Grid gap** | `14px` | Category card grid gap. |
| **List gap** | `10px` | Vertical gap between term list items. |

**Rule:** If a page has a grid or card layout, use `1200px`. If a page is primarily long-form text, use `900px`. Never mix — pick one per page.

---

## Colour Palette

| Token | Value | Usage |
|---|---|---|
| **Navy** | `#1A1A2E` | Primary text, dark backgrounds, logo |
| **Slate 700** | `#334155` | Body text in long-form sections |
| **Slate 600** | `#475569` | Secondary body text |
| **Slate 500** | `#64748B` | Tertiary text, descriptions, nav links |
| **Slate 400** | `#94A3B8` | Muted labels, counters, breadcrumbs |
| **Slate 200** | `#E2E8F0` | Borders, dividers |
| **Slate 100** | `#F1F5F9` | Light borders, progress bar backgrounds |
| **Slate 50** | `#F8FAFC` | Page backgrounds (About, Progress) |
| **White** | `#FFFFFF` | Default page background, card backgrounds |
| **Indigo** | `#6366F1` | Accent links, About page highlights |

### Level Badge Colours

| Level | Background | Text |
|---|---|---|
| Beginner | `#F0FDF4` | `#16A34A` (green) |
| Intermediate | `#FFFBEB` | `#CA8A04` (amber) |
| Advanced | `#F5F3FF` | `#7C3AED` (purple) |

---

## Typography

| Token | Value | Usage |
|---|---|---|
| **UI font** | `'DM Sans', -apple-system, sans-serif` | All UI text, body copy, buttons, labels |
| **Display font** | `'DM Serif Display', Georgia, serif` | Headings, term names, page titles |
| **Nav font size** | `14px` | Navigation links |
| **Body font size** | `15–17px` | Paragraph text (15 in cards, 17 in long-form) |
| **Label font size** | `11–12px` | Uppercase section labels, category tags |
| **Letter spacing (headings)** | `-0.03em` to `-0.04em` | Tightened for display font |
| **Letter spacing (labels)** | `0.08em` to `0.1em` | Spaced out for uppercase labels |

---

## Spacing

| Token | Value | Usage |
|---|---|---|
| **Section vertical padding** | `clamp(40px, 7vw, 72px) 0` | Top padding for major homepage sections |
| **Card padding** | `18px 20px 16px` | Category cards |
| **Term row padding** | `16px 18px` | Term list items |
| **Panel padding (desktop)** | `28px` | TermPanel side padding |
| **Panel padding (mobile)** | `16px` | TermPanel side padding |

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| **Card** | `14px` | Category cards, progress category rows |
| **Term row** | `12px` | Term list items |
| **Button** | `8–12px` | Buttons (8 small, 10 medium, 12 large) |
| **Pill / badge** | `99px` | Filter pills, level badges, progress bars |
| **Panel (desktop)** | `24px 0 0 24px` | TermPanel left corners |
| **Panel (mobile)** | `20px 20px 0 0` | Bottom sheet top corners |

---

## Shadows

| Token | Value | Usage |
|---|---|---|
| **Card default** | `0 1px 4px rgba(0,0,0,0.05)` | Cards at rest |
| **Card hover** | `0 8px 24px rgba(0,0,0,0.09)` | Cards on hover |
| **Panel** | `-24px 0 80px rgba(0,0,0,0.18)` | TermPanel desktop |
| **Bottom sheet** | `0 -8px 40px rgba(0,0,0,0.2)` | TermPanel / nav mobile |
| **Toast** | `0 8px 32px rgba(0,0,0,0.2)` | Toast notifications |

---

## Breakpoints

| Token | Value | Usage |
|---|---|---|
| **Mobile** | `< 768px` | Bottom sheets, single-column, hamburger nav |
| **Desktop** | `≥ 768px` | Side panels, multi-column grids, desktop nav |
