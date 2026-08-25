# Project: Handmade Mortar & Pestle Store — E-Commerce Website

## Overview
Build a responsive e-commerce website for a handmade mortar and pestle business, currently sold in-person only, going online for the first time. This is also a portfolio project — code quality and real-world practices matter as much as functionality. Website only, no mobile app.

## Tech Stack (MERN)
- Frontend: React (Vite), TypeScript preferred, Tailwind CSS
- Backend: Node.js + Express, TypeScript preferred
- Database: MongoDB via Mongoose, hosted on MongoDB Atlas
- Payments: Stripe (Checkout)
- Image storage: Cloudinary (never local filesystem — deploy targets have ephemeral disks)
- Email: Nodemailer or Resend (order receipts, contact form notifications)
- Auth: JWT in httpOnly cookies (not localStorage)

## Project Structure
```
project-root/
  client/
    src/
      components/
      pages/
      hooks/
      context/         (or store/ if using Zustand)
      services/         all API calls — never fetch directly in components
      utils/
  server/
    src/
      config/           DB connection, env loading
      models/
      controllers/
      routes/
      middleware/       auth, error handling, validation, upload
      services/          Stripe, Cloudinary, email
      utils/
  README.md
```

## Design/Theme
Clean, minimal, modern e-commerce UI (per uploaded reference) — adapted from a mobile app reference into a responsive website.
- Background: white / very light gray (#FAFAFA)
- Cards: rounded corners (16–20px), soft drop shadows, white surfaces
- Primary buttons: bold black, fully pill-shaped, white text (e.g. "Add to Cart", "Checkout")
- Typography: bold, clean sans-serif throughout — no serif
- Color: mostly monochrome UI chrome (black/white/gray); color comes from product photography and small swatch dots for variant selection, not from the interface itself
- Product grid: 2-column grid on mobile, rounded image thumbnails, name + price below
- Search: prominent search bar with icon at top of shop page
- Filters: modal/bottom-sheet with category chips, price range slider, sort options
- Product detail page: image gallery, name, rating, description, variant selector as chips/dots, quantity stepper, sticky bottom bar with price + "Add to Cart"
- Reviews: avatar, name, star rating, comment, timestamp
- Cart: item rows with thumbnail, name, price, quantity stepper, remove with confirmation
- Navigation: hamburger drawer + fixed bottom tab bar (Home, Shop, Cart, Account) on mobile; full horizontal nav bar on desktop, same visual language carried through
- Mobile-responsive from the first component built

## Data Models

User:
```
  name: String
  email: String, required, unique
  password: String  (bcrypt hashed)
  role: String, enum ['user','admin'], default 'user'
```

Product (each size is its own document, linked to siblings via groupSlug):
```
  name: String, required
  slug: String, required, unique   (for /products/:slug URLs)
  description: String
  material: String   (granite / marble / wood)
  category: String
  size: String, required
  price: Number, required
  stock: Number, default 0, required
  images: [String], required   (Cloudinary URLs, multiple angles)
  groupSlug: String, required   (shared across sizes of the same product — used for "also available in...")
  avgRating: Number, default 0
  numReviews: Number, default 0
  featured: Boolean, default false   (manually curated flag for the Best Sellers section)
  compareAtPrice: Number, optional   (pre-discount price; when set and greater than price, displays as discounted)
  timestamps: true
```

Review:
```
  product: ObjectId ref Product, required
  user: ObjectId ref User, required
  rating: Number, required, min 1, max 5
  comment: String, required
  timestamps: true
```

Order:
```
  user: ObjectId ref User   (null allowed for guest checkout)
  items: [{ product: ObjectId, size: String, quantity: Number, price: Number }]   (price snapshot at purchase time)
  shippingAddress: object
  total: Number
  status: String, enum ['pending','paid','shipped','delivered']
  stripeSessionId: String
  timestamps: true
```

ContactMessage:
```
  name: String, required
  email: String, required
  message: String, required
  read: Boolean, default false
  timestamps: true
```

## Features — MVP (build first)
- Product catalog: listing + category pages, 2-column mobile grid
- Individual product page (/products/:slug) — multi-image gallery, "also available in..." via groupSlug, description, reviews section
- Reviews: view on product page; logged-in users can submit
- Cart
- Checkout via Stripe (hosted Checkout — see payments note below)
- Order confirmation + email receipt
- Contact Us page (form → stored in DB + emailed to admin)
- Admin panel: add/edit/delete products, view orders, view contact messages
- Auth: register/login, guest checkout still allowed
- Hamburger menu + bottom nav bar (mobile), full nav bar (desktop)
- Fully responsive

## Features — Stretch (after MVP works end-to-end)
- Search + filters (material, size, price) — chip/slider filter UI per reference
- Wishlist
- "Verified purchase" gate on reviews
- Order status tracking
- Admin analytics (best sellers, revenue)
- Newsletter signup

## Payments note
Default is Stripe's hosted Checkout (redirect) for MVP — far less to build and maintain, still themeable. A fully custom multi-step checkout (address → shipping method → promo → payment method icons) would instead use Stripe's embedded Payment Element — bigger lift, only build this version if explicitly requested.

## Admin Auth
- Single User model with role field — not a separate admin system
- Login issues a JWT, set as httpOnly + secure + sameSite cookie
- Middleware chain on protected routes: protect (valid JWT) → isAdmin (role check)
- Frontend route guard on /admin/* for UX only — backend middleware is the actual security boundary

## Image Upload
- Admin form → Multer parses multipart upload on backend → upload buffer to Cloudinary → save returned URL(s) in Product.images
- Validate file type (images only) and cap file size in Multer config

## API Routes
```
GET    /api/products                      public (supports ?groupSlug=)
GET    /api/products/:slug                public
GET    /api/products/:slug/reviews        public
POST   /api/products/:slug/reviews        protect
POST   /api/admin/products                protect, isAdmin, multer
PUT    /api/admin/products/:id            protect, isAdmin
DELETE /api/admin/products/:id            protect, isAdmin
GET    /api/admin/orders                  protect, isAdmin
GET    /api/admin/contact-messages        protect, isAdmin
POST   /api/orders                        creates order + Stripe session
POST   /api/webhooks/stripe               Stripe webhook, confirms payment
POST   /api/contact                       public
POST   /api/auth/register
POST   /api/auth/login
```

## Security Requirements
- helmet for secure headers, configured cors (not wide open), express-rate-limit on auth and contact routes
- Passwords hashed with bcrypt, never stored plain
- Input validation on every route accepting data (Zod or express-validator) — never trust the frontend alone
- Centralized error-handling middleware, consistent error response shape
- Secrets in .env, commit .env.example instead, .env in .gitignore

## Testing
- Backend: Jest + Supertest on critical routes (auth, product CRUD, order creation, reviews)
- Frontend: React Testing Library on cart and checkout components
- Not aiming for 100% coverage — meaningful tests on critical paths

## Git Workflow
- Feature branches (feat/checkout-flow), not direct commits to main
- Conventional commit messages (feat:, fix:, refactor:)
- README with: what it does, tech stack, setup instructions, screenshots, live demo link

## Deployment / CI
- Frontend → Vercel; Backend → Render or Railway; DB → MongoDB Atlas
- GitHub Actions: run lint + tests on every push

## Build Order (detailed)
1. Scaffold client/ (Vite) and server/ (Express) with the folder structure above
2. Set up MongoDB Atlas, connect backend, configure env vars
3. Build Mongoose schemas (User, Product, Review, Order, ContactMessage)
4. Build auth: register/login, JWT cookie, protect/isAdmin middleware
5. Build product CRUD API (admin) + public product routes, including groupSlug lookup
6. Build image upload (Multer + Cloudinary)
7. Build reviews API (view + submit, update product avgRating/numReviews on write)
8. Build contact form API (store + email notify)
9. Build frontend shell: nav bar, hamburger menu, bottom tab bar (mobile), footer — applying the minimal/rounded-card/black-pill-button theme
10. Build frontend: product listing (grid) → detail page (gallery, variants, reviews) → cart → checkout
11. Build Contact Us page
12. Integrate Stripe (test mode) + webhook
13. Build admin dashboard UI (products, orders, contact messages)
14. Add tests on critical paths
15. Polish: loading/error states, responsive pass, SEO meta tags
16. Deploy + set up CI
17. Soft launch with real orders before wider release

# Redesign & Expansion Phase (Segments 16–20)

Visual direction is changing from the original monochrome UI-kit theme to a warm/earthy
theme, and scope is expanding with three new pages. The workflow rules (wait for
"start," pause at checkpoints, never auto-continue, update "Current segment" on
completion) apply here exactly as before.

## Schema addition
Add to Product in the Data Models section above:
- featured: Boolean, default false — manually curated flag for the Best Sellers section
- compareAtPrice: Number, optional — pre-discount price; when set and greater than
  price, the product displays as discounted

(Already merged into the Product model documented above.)

## Segment 16 — Design System Redesign
Reference: `./design/reference-v2.png` (cream background, terracotta/orange accents,
real product photography, branded wordmark — "StoneCraft" in the reference) —
replacing the current monochrome direction. Discuss this in detail before touching any
code, same process as Segment 1: describe what's changing versus the current
DESIGN.md, ask clarifying questions, then propose updated tokens — colors (hex),
typography including a wordmark/logo treatment, button style, card style, trust-badge
style, and discounted-price display (strikethrough + % off badge). No component code
yet. Once agreed, overwrite DESIGN.md with the new system.

### Segment 16 — Decisions (resolved)
- **Brand name: StoneCraft** — replaces "Mortar & Pestle Co." site-wide.
- **Currency: INR via Stripe.** Stripe stays the card-payment processor, priced in INR
  (not a switch to Razorpay/Cashfree).
- **WhatsApp ordering added alongside Stripe** (not a replacement). Cart page gets a
  second CTA, "Order via WhatsApp" (WhatsApp-brand-green button, the one intentional
  exception to the terracotta palette). On click: create an `Order` from the current
  cart with `status: 'pending'` and no `stripeSessionId`, then redirect to a `wa.me`
  deep link with items/sizes/quantities/total pre-filled as the message — so it's
  visible in `/admin/orders`. Requires a real business WhatsApp number before launch
  (`WHATSAPP_NUMBER` env var, placeholder until supplied).
- **Checkout stays Stripe hosted Checkout** — no custom multi-step flow, despite the
  reference mockup showing one.
- **Typography: two-font system** — Fraunces (serif) for the wordmark, headings, and
  product titles; Inter (sans, unchanged) for body/UI/buttons/prices/admin. This
  overrides Segment 1's original "no serif anywhere" rule.
- **Wishlist added** (scope addition beyond the original Segment 16–20 list, requested
  mid-Segment-16): heart icon on product cards, requires login, no dedicated
  "saved items" page scheduled yet — build the toggle + persistence only, revisit a
  full wishlist view later if requested.
- **Buy Now button added** to product detail, alongside Add to Cart (outline style,
  skips cart, goes straight to checkout).
- **Bottom tab bar composition unchanged**: Home, Shop, Cart, Account. New Segment 20
  pages (About Us, Our Story, Shipping & Returns) live in the hamburger drawer and
  footer only.

Full token values (colors, exact typography setup, component specs) are in DESIGN.md,
not duplicated here.

## Segment 17 — Restyle Existing Pages
Using the updated DESIGN.md, restyle every existing page and component (Home, Shop,
Product Detail, Cart, Login, Register, Account, Contact, Order Confirmation, 404,
Admin Dashboard) to match. Visual changes only — no functional changes. Check each
page against DESIGN.md before moving to the next.

## Segment 18 — Featured + Discount Pricing
Add featured and compareAtPrice to the Product schema (see above). Update the admin
product form to set both. Update product cards and the product detail page to show a
strikethrough compareAtPrice plus a computed % off badge whenever compareAtPrice is
set and higher than price. Before building this segment: confirm the payment
currency — if pricing is in INR, confirm Stripe is properly configured for INR, or
flag that a processor with better India support (Razorpay/Cashfree) may be needed
instead. Pricing display and payment currency must match.

## Segment 19 — Home: Trust Badges + Best Sellers
Add a trust badge row to the Home page (icon + label — e.g. Handmade, Natural
Materials, Food Safe, Made with Love, adjusted as fits). Add a Best Sellers section
querying products where featured is true, styled per DESIGN.md.

## Segment 20 — About Us, Our Story, Shipping & Returns
Build three new static pages: About Us, Our Story (narrative + photo), and Shipping &
Returns (policy info). Add routes and link all three from the nav/hamburger menu and
footer. Use placeholder copy, clearly flagged as needing real content before launch.
Only add footer social icons if real social accounts exist — omit them rather than
link to nothing.
