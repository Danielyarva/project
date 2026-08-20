# Design System — Handmade Mortar & Pestle Store

Source: `./design/reference.png` (mobile e-commerce UI kit), adapted into a responsive
web design system per CLAUDE.md. This document is the source of truth for visual design;
CLAUDE.md remains the source of truth for tech stack, data models, and features.

## Core Principles
- Clean, minimal, monochrome UI chrome — color comes from product photography only
- Bold sans-serif typography throughout, no serif anywhere
- Rounded cards, soft shadows, generous white space
- Fully responsive: mobile-first (2-column grid, bottom tab bar) scaling up to desktop
  (horizontal nav, wider grid)
- Supports light mode (default) and dark mode, user-toggleable

## Color Tokens

### Light mode (default)
| Token | Value | Usage |
|---|---|---|
| `--bg` | `#FAFAFA` | Page background |
| `--surface` | `#FFFFFF` | Cards, sheets, nav bar |
| `--text-primary` | `#111111` | Headings, body text |
| `--text-secondary` | `#6B6B6B` | Descriptions, meta text |
| `--border` | `#E5E5E5` | Card borders, dividers |
| `--accent` | `#000000` | Primary buttons, active states |
| `--accent-text` | `#FFFFFF` | Text on primary buttons |
| `--danger` | `#DC2626` | Remove/delete confirmations |
| `--star` | `#111111` | Rating stars (filled = black, not yellow) |

### Dark mode
| Token | Value | Usage |
|---|---|---|
| `--bg` | `#0A0A0A` | Page background |
| `--surface` | `#171717` | Cards, sheets, nav bar |
| `--text-primary` | `#FAFAFA` | Headings, body text |
| `--text-secondary` | `#A3A3A3` | Descriptions, meta text |
| `--border` | `#2A2A2A` | Card borders, dividers |
| `--accent` | `#FFFFFF` | Primary buttons, active states |
| `--accent-text` | `#000000` | Text on primary buttons |
| `--danger` | `#EF4444` | Remove/delete confirmations |
| `--star` | `#FAFAFA` | Rating stars |

Implementation: Tailwind `class` dark mode strategy (not `media`), so it's an explicit
user toggle rather than following OS setting alone. Root `<html>` element gets a `dark`
class. Preference is read from `localStorage` before first paint (inline script in
`index.html`) to avoid a flash of the wrong theme, and mirrored in each user's account
settings once logged in so it persists across devices. Toggle lives on the
Account/Settings page (see Navigation below), not buried in a menu.

## Typography
- Font: a bold, clean sans-serif (e.g. Inter or similar variable font)
- Headings: bold (600–700 weight), tight letter spacing
- Body: regular–medium weight, comfortable line height for descriptions
- No serif anywhere, including admin panel

## Spacing & Shape
- Card corner radius: 16–20px
- Button corner radius: fully pill-shaped (9999px)
- Card shadow: soft, low-opacity (`shadow-sm`/`shadow-md` equivalent), no hard borders
  as the primary separator — shadow + white surface does the work
- Consistent 4px-based spacing scale (Tailwind default spacing)

## Core Components

**Primary button**: black pill (white pill in dark mode), white/black text, bold,
used for "Add to Cart", "Checkout", "Confirm", form submits. Full-width on mobile
sticky bars, auto-width elsewhere.

**Secondary button**: outline pill, transparent background, black/white border and text.
Used for "Cancel", "Remove" (paired with a danger-colored confirm).

**Card**: white/surface background, rounded 16–20px, soft shadow, used for product tiles,
review entries, cart rows, admin table rows on mobile.

**Quantity stepper**: `− [count] +` pill control, used on product detail and cart rows.

**Size selector (chips)**: instead of the reference's color dots, sizes render as
pill-shaped chips ("Small", "Medium", "Large") since product variation here is
size/material, not color. Selecting a chip navigates to the sibling product
(same `groupSlug`, different `slug`) — each size is its own document per CLAUDE.md's
data model, so this is a navigation, not just local state.

**Material**: not a per-product swatch (materials aren't interchangeable on one item);
surfaced only as a filter chip in the shop filter sheet (granite / marble / wood).

**Rating stars**: monochrome filled/outline stars, never colored, next to numeric
average and review count.

**Bottom sheet / modal**: used for filters and destructive confirmations ("Remove from
Cart?"), slides up from bottom on mobile, centered modal on desktop.

## Navigation

**Mobile**:
- Fixed bottom tab bar: Home, Shop, Cart (with item-count badge), Account — icons only
  or icon + micro-label, active tab = filled/black icon or underline dot
- Hamburger drawer (top-left) for secondary links: About, Contact, Admin (if applicable),
  theme toggle also mirrored here for quick access
- Top bar: logo/name centered or left, search icon, cart icon

**Desktop**:
- Full horizontal nav bar: logo left, primary links center (Shop, About, Contact),
  search + cart + account icons right, same pill-button language for any CTA
- No bottom tab bar; account dropdown includes Settings (theme toggle), Orders, Logout

**Account/Settings page** (both breakpoints): profile info, order history, and a
**light/dark mode toggle** — pill-shaped segmented control (Light / Dark), matching
button language.

## Key Page Layouts

**Shop/category page**: prominent search bar with icon at top, 2-column product grid
on mobile (3–4 columns desktop), filter button opens bottom-sheet/modal with category
chips, price range slider, material chips, sort pills, star-rating filter.

**Product detail page** (`/products/:slug`): image gallery (swipeable on mobile), name,
star rating + review count, price, size chips (groupSlug siblings), description,
quantity stepper, reviews section below the fold; sticky bottom bar on mobile showing
price + "Add to Cart" pill.

**Reviews**: avatar (initials fallback), name, star rating, comment, relative timestamp;
submit form only for logged-in users.

**Cart**: item rows — thumbnail, name, size, price, quantity stepper, remove (opens
confirmation sheet before removing); order summary card; "Checkout" pill button.

**Checkout**: MVP uses Stripe **hosted Checkout** (redirect) per CLAUDE.md — our cart
page's summary + single "Checkout" pill is the full extent of our custom UI; Stripe's
own hosted page handles address/payment entry. We are *not* building the reference's
multi-step address → shipping → promo → payment-method flow; that's explicitly the
stretch/custom-Payment-Element path CLAUDE.md defers.

**Admin panel**: same visual language (white surfaces, rounded cards, pill buttons) but
denser/table-oriented on desktop; card-list layout on mobile. Sections: Products
(add/edit/delete + image upload), Orders, Contact Messages.

## Open items carried into later segments
- Exact font choice finalized when Tailwind config is set up (Segment 7)
- Icon set choice (e.g. lucide-react) finalized alongside frontend shell (Segment 7)
- Dark mode persistence to user profile requires a `themePreference` field decision —
  not in CLAUDE.md's User model yet; will add as an optional field with a default when
  building the User schema in Segment 3, keeping it non-breaking for guests
  (falls back to `localStorage` only when logged out)
