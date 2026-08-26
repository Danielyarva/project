# Design System — StoneCraft

Source: `./design/reference-v2.png` (StoneCraft mobile mockups — Home, Shop, Product Detail,
Cart, Checkout, Our Story, Shipping & Returns, Contact, About Us, Footer/Menu), adapted
into a responsive web design system per CLAUDE.md. This document is the source of truth
for visual design; CLAUDE.md remains the source of truth for tech stack, data models,
and features.

This is v2 of the design system (Segment 16), replacing the original monochrome UI-kit
direction. Superseded decisions are noted inline where relevant.

## Brand
- **Name: StoneCraft** (replaces "Mortar & Pestle Co." site-wide — copy, metadata,
  emails, package name where cosmetic)
- Tagline: "Handmade. Natural. Timeless."
- Positioning: warm, artisanal, natural-material craftsmanship — not the cold
  minimal-tech-product look of v1

## Logo / Wordmark
- Icon: small mortar-and-pestle glyph (simple line/solid icon, terracotta or dark
  brown), sits to the left of the wordmark. Built as an inline SVG, not a raster
  image file — no logo asset exists yet, this is the icon drawn to match the
  reference's silhouette.
- Wordmark: "StoneCraft" set in **Fraunces** (serif, see Typography), bold weight,
  dark brown/near-black (`--text-primary`).
- Tagline "Handmade. Natural. Timeless." renders in small-caps-style Inter, letter-spaced,
  `--text-secondary`, directly under the wordmark — shown in the nav bar on pages with
  room (home/top of drawer, footer); condensed to icon + wordmark only in the compact
  mobile top bar.
- Same lockup (icon + wordmark [+ tagline]) is reused in: nav bar, hamburger drawer
  header, footer, and the browser tab favicon (icon only).

## Core Principles
- Warm, artisanal e-commerce feel — cream background, terracotta accents, real product
  photography doing the color work, not flat UI color blocks
- **Serif display type paired with sans-serif UI type** (see Typography) — this
  overrides v1's "no serif anywhere" rule, per the reference's editorial headline style
- Rounded cards, soft warm-toned shadows, generous white space
- Fully responsive: mobile-first (2-column grid, bottom tab bar) scaling up to desktop
  (horizontal nav, wider grid)
- Supports light mode (default) and dark mode, user-toggleable

## Color Tokens

### Light mode (default)
| Token | Value | Usage |
|---|---|---|
| `--bg` | `#FBF6EF` | Page background (cream) |
| `--surface` | `#FFFFFF` | Cards, sheets, nav bar |
| `--text-primary` | `#2B2118` | Headings, body text (warm near-black) |
| `--text-secondary` | `#8A7A6B` | Descriptions, meta text |
| `--border` | `#E8DFD2` | Card borders, dividers |
| `--accent` | `#C1592F` | Primary buttons, active states, links (terracotta) |
| `--accent-text` | `#FFFFFF` | Text on primary buttons |
| `--danger` | `#DC2626` | Remove/delete confirmations |
| `--star` | `#C1592F` | Rating stars, filled = terracotta |
| `--whatsapp` | `#25D366` | WhatsApp order button only — one brand-color exception |
| `--discount` | `#B8860B` | Strikethrough price + "X% off" badge (muted gold) |

### Dark mode
| Token | Value | Usage |
|---|---|---|
| `--bg` | `#1C1712` | Page background |
| `--surface` | `#2A231C` | Cards, sheets, nav bar |
| `--text-primary` | `#F5EDE3` | Headings, body text |
| `--text-secondary` | `#B8A992` | Descriptions, meta text |
| `--border` | `#3D342A` | Card borders, dividers |
| `--accent` | `#E08A5B` | Primary buttons, active states (lightened terracotta) |
| `--accent-text` | `#1C1712` | Text on primary buttons |
| `--danger` | `#EF4444` | Remove/delete confirmations |
| `--star` | `#E08A5B` | Rating stars |
| `--whatsapp` | `#25D366` | Unchanged — brand color doesn't shift with theme |
| `--discount` | `#D9A93A` | Lightened gold for dark-bg contrast |

Implementation unchanged from v1: Tailwind `class` dark-mode strategy, `dark` class on
`<html>`, preference read from `localStorage` pre-paint, mirrored to account settings
once logged in. Toggle lives on Account/Settings page.

## Typography

Two-font system:

- **Display / serif — Fraunces** (`@fontsource-variable/fraunces`, self-hosted variable
  font, uses its optical-size axis for crisp headline rendering). Used for: the
  "StoneCraft" wordmark, all page/section headings (h1–h3), product titles (on cards and
  the product detail page). Bold weight (600–700), normal-to-tight tracking.
- **Body / UI — Inter** (unchanged from v1, `@fontsource-variable/inter`). Used for:
  body copy, descriptions, buttons, nav links, prices, form labels/inputs, badges,
  admin panel (kept fully sans for density/legibility).
- Never mix serif into: buttons, prices, form fields, table/admin data — those stay
  Inter for clarity and consistency with dense UI.

## Spacing & Shape
- Card corner radius: 16–20px
- Button corner radius: fully pill-shaped (9999px)
- Card shadow: soft, warm-toned low-opacity (`rgba(43, 33, 24, 0.08)`), no hard borders
  as the primary separator
- Consistent 4px-based spacing scale (Tailwind default spacing)

## Core Components

**Primary button**: terracotta (`--accent`) pill, white text, bold (Inter), used for
"Add to Cart", "Checkout", "Confirm", form submits. Full-width on mobile sticky bars,
auto-width elsewhere.

**Secondary / outline button**: transparent background, `--text-primary` border and
text. Used for "Cancel", "Remove" (paired with a danger-colored confirm), and **Buy
Now** (sits next to the filled "Add to Cart" on product detail — outline so Add to Cart
stays the visually primary action).

**WhatsApp button**: its own pill variant — `--whatsapp` fill, white text, WhatsApp
glyph icon, label "Order via WhatsApp". Appears on Cart (next to "Proceed to Checkout")
and optionally product detail. Intentional brand-color exception to the terracotta
system, since recognizability matters more than palette purity here.

**Card**: white/surface background, rounded 16–20px, soft warm shadow, used for product
tiles, review entries, cart rows, admin table rows on mobile.

**Quantity stepper**: `− [count] +` pill control, used on product detail and cart rows.

**Size selector (chips)**: pill-shaped chips ("Small", "Medium", "Large"). Selecting a
chip navigates to the sibling product (same `groupSlug`, different `slug`).

**Material**: surfaced only as a filter chip in the shop filter sheet
(granite / marble / wood), not a per-product swatch.

**Rating stars**: filled = `--star` (terracotta), outline = unfilled, next to numeric
average and review count.

**Wishlist heart**: outline heart icon, top-right corner of product card. Fills solid
with a soft rose tint (not full `--danger` red) when saved. Requires login — signed-out
tap prompts login, same pattern as review submission.

**Discount price display**: `compareAtPrice` shown strikethrough in `--text-secondary`
next to the current price (bold, `--text-primary`), plus a small pill badge
`"−X% off"` using `--discount`. Shown whenever `compareAtPrice` is set and greater than
`price`. `X` is computed, never hardcoded: `round((compareAtPrice - price) / compareAtPrice * 100)`.

**Trust badge row** (Home page): icon + label, circular terracotta-tinted icon
background (`--accent` at ~12% opacity), label below in small bold Inter. Horizontal
scroll row on mobile, static row on desktop. Content: Handmade, Natural Materials, Food
Safe, Made with Love (adjust wording as needed).

**Bottom sheet / modal**: used for filters and destructive confirmations, slides up from
bottom on mobile, centered modal on desktop.

## Navigation

**Mobile**:
- Fixed bottom tab bar (unchanged composition): Home, Shop, Cart (item-count badge),
  Account. New static pages (About, Our Story, Shipping & Returns) live in the
  hamburger drawer and footer only, not the tab bar.
- Hamburger drawer (top-left): logo lockup at top, then Shop, About Us, Our Story,
  Shipping & Returns, Contact, Admin (if applicable), theme toggle.
- Top bar: logo/wordmark left, search icon, cart icon right.

**Desktop**:
- Full horizontal nav bar: logo left, primary links center (Home, Shop, Contact — kept
  short so the bar doesn't get crowded), search + cart + account icons right. About Us,
  Our Story, and Shipping & Returns are reached via the footer at desktop width, and via
  the footer or hamburger drawer on mobile — there's no desktop hamburger menu.
- No bottom tab bar; account dropdown includes Settings (theme toggle), Orders, Logout.

**Footer** (all breakpoints, expanded from v1): logo lockup + tagline + short blurb,
social icons (only if real accounts exist — omit otherwise), link columns (Shop
categories; Company: About Us, Our Story, Shipping & Returns, Privacy Policy, Terms,
Contact), copyright line, payment badge row (Visa/Mastercard/UPI/RuPay icons as static
images, not functional).

**Account/Settings page**: profile info, order history, light/dark mode toggle
(pill-shaped segmented control).

## Key Page Layouts

**Home**: hero (headline in Fraunces + subcopy + "Shop Now" CTA over/beside a product
photo), trust badge row, Best Sellers section (`featured: true` products), optional
"See It In Action" video/story teaser card.

**Shop/category page**: search bar with icon at top, category filter chips row,
2-column product grid on mobile (3–4 columns desktop). Each card: image, wishlist
heart, name (Fraunces), rating, price (+ discount badge if applicable). Filter button
opens bottom-sheet/modal with category chips, price range slider, material chips, sort
pills, star-rating filter.

**Product detail page** (`/products/:slug`): image gallery with wishlist heart overlay,
name (Fraunces), star rating + review count, price (+ strikethrough + discount badge if
applicable), size chips, small feature-icon row (100% Natural Stone / Handmade with
Care / Heavy & Durable / Easy to Clean — copy adjusted per product), quantity stepper,
"Add to Cart" (filled) + "Buy Now" (outline) side by side, description, reviews section
below the fold. Sticky bottom bar on mobile with price + Add to Cart.

**Reviews**: avatar (initials fallback), name, star rating, comment, relative
timestamp; submit form only for logged-in users.

**Cart**: item rows — thumbnail, name, size, price, quantity stepper, remove (opens
confirmation sheet). Order summary card (subtotal, shipping, discount, total).
Two CTAs: "Proceed to Checkout" (primary, terracotta) and "Order via WhatsApp"
(WhatsApp-green) stacked or side by side.

**Checkout**: Stripe **hosted Checkout** (redirect) — unchanged decision from v1,
reconfirmed in Segment 16. Cart page remains the extent of our custom checkout UI;
Stripe's own hosted page handles address/payment entry, in **INR**.

**WhatsApp order flow**: tapping "Order via WhatsApp" creates an `Order` record
(`status: 'pending'`, no `stripeSessionId`) from current cart contents, then redirects
to a `wa.me` deep link with a pre-filled message summarizing items, sizes, quantities,
and total — so the order is visible in `/admin/orders` for manual follow-up.

**About Us / Our Story / Shipping & Returns** (new, Segment 20): static content pages,
same card/typography system, Our Story includes a narrative + photo section. Placeholder
copy until real content is supplied, clearly flagged as such.

**Admin panel**: same visual language (surfaces, rounded cards, pill buttons) but
denser/table-oriented on desktop; card-list layout on mobile. Kept fully Inter (no
serif) for data density. Product form gains `featured` toggle and `compareAtPrice`
field (Segment 18).

## Open items carried into later segments
- Exact Fraunces optical-size/weight cuts to load (avoid pulling the full variable-font
  axis range if only 2–3 weights are used) — finalized when restyle work touches
  `index.css` (Segment 17)
- Icon set (lucide-react, already in use) covers the mortar/pestle glyph only if a
  suitable icon exists; otherwise a small custom inline SVG is hand-drawn to match the
  reference silhouette
- Real WhatsApp business number needed before the WhatsApp order flow can go live —
  placeholder/env var pattern (`WHATSAPP_NUMBER`) until supplied
- Real social account links needed before footer social icons are added — omitted until
  supplied, per CLAUDE.md
