### 1. ARCHITECTURE OVERVIEW

- **Routing structure**
  - **App Router root layout**
    - `app/layout.tsx`
      - Defines `RootLayout` wrapping all routes.
      - Sets `<html lang="en">` and `<body>` with font variables and base background/overflow.
      - Imports `./globals.css`.
    - `metadata` in `layout.tsx` defines title/description for `/`.
  - **Pages / routes**
    - `app/page.tsx`
      - Default route `/` (Home).
      - Contains the entire portfolio/landing layout (nav, hero-like copy, project column, waves background).
    - **Links to non-existent routes**
      - `ProjectsColumn` in `page.tsx` links to `/projects/project-1` … `/projects/project-5`, but there are no corresponding `app/projects/...` route files yet.
  - **Server vs Client components**
    - **Server components (by default)**
      - `app/layout.tsx` – server component; uses no client-only APIs directly.
      - `app/page.tsx` – server component; uses `next/image` but no hooks.
      - `components/ZGridBackground.tsx` – no `"use client"`, pure presentational.
    - **Client components**
      - `components/SoftRippleCursor.tsx`
        - Declared with `"use client"`.
        - Uses React hooks (`useState`, `useEffect`, `useRef`) and window event listeners.
      - Mounted by `RootLayout` so it is present on all pages for devices with fine pointers.
  - **Global providers and layout composition**
    - **Fonts**
      - `Geist` and `Geist_Mono` from `next/font/google` → CSS vars `--font-geist-sans`, `--font-geist-mono`.
      - `Roboto` from `next/font/google` → `--font-roboto`.
      - `monsieur` via `next/font/local` (`./fonts/MonsieurLaDoulaise-Regular.ttf`) → `--font-monsieur`.
    - **Body composition (high level)**
      - `<SoftRippleCursor />` (client, global custom cursor).
      - `<ZGridBackground />` (3D grid overlay).
      - `<div className="relative z-20">{children}</div>` – main page content layer.
      - Fixed bottom glow + wave-water layers as global background (`z-0`).

---

### 2. UI STRUCTURE

- **Main layout hierarchy**
  - **Global (from `RootLayout`)**
    - `body`:
      - Classes: `relative bg-white overflow-x-hidden` plus font-variable classes.
      - Children:
        - `SoftRippleCursor` (fixed positioned elements for custom cursor).
        - `ZGridBackground` (fixed full-screen 3D grid at `z-[15]`).
        - `div.relative.z-20` – all page content.
        - Bottom glow & waves container:
          - `div.pointer-events-none.fixed.inset-x-0.bottom-0.z-0.h-[300px].overflow-visible`
          - Contains `div` gradient glow + two `wave-water` layers for parallax-like water.
  - **Home page (`app/page.tsx`)**
    - `<main className="relative h-screen bg-[#F9F7F6] overflow-x-visible overflow-y-hidden px-6">`
      - **Grid overlay (local)**
        - `div.pointer-events-none.absolute.inset-0.z-[5].overflow-hidden.[perspective:1200px]`
        - Inner `div.zgrid-plane` (CSS-driven 3D grid, animated).
      - **Fixed nav**
        - `<nav className="fixed top-0 left-0 right-0 z-[60] px-6 pt-6 pb-0 pointer-events-auto">`
          - Branding (`Enchanted Sea` + animating star).
          - Horizontal list of anchor links to `#projects`, `#services`.
      - **Content section**
        - `<section className="relative z-10 pt-20">`
          - `div.grid.md:grid-cols-[768px_1fr].h-[calc(100vh-96px)]`
            - **Left column (`aside`)**
              - Copy about the studio; static, scroll-independent text.
            - **Right column**
              - Wrapper `div.relative.z-20.overflow-visible`
                - Inner scroll container:
                  - `div.-mt-[72px].h-[calc(100vh-96px+72px)].overflow-y-auto.overflow-x-visible.pr-13.pb-32.pt-[72px].no-scrollbar`
                  - Contains project list:
                    - `div.-mr-0`
                      - `<ProjectsColumn />`
      - **Bottom glow + wave background**
        - `div.pointer-events-none.fixed.inset-x-0.bottom-0.z-0.h-[60vh].overflow-hidden`
          - Gradient background `bg-gradient-to-t`.
          - Two `div.wave wave1` / `div.wave wave2` layers (note: CSS classes for these specific `.wave` elements are not in `globals.css`, only `.wave-water` is defined globally—these might be legacy/unimplemented).

- **Reusable components and where they are used**
  - **`ProjectsColumn` (inner component in `page.tsx`)**
    - Not exported; used only in `Home`.
    - Renders a vertical list of project cards.
    - Each card:
      - `<a>` link wrapping:
        - Outer `div` card with border, background, hover shadow.
        - Inner `div.absolute.inset-0.overflow-hidden` with `<Image>` filling the card.
        - Label row with title and right-aligned label.
  - **`SoftRippleCursor`**
    - Used only in `RootLayout`, but affects the entire UI globally on pointer-capable devices.
  - **`ZGridBackground`**
    - Used only in `RootLayout` as a global 3D grid effect behind content.

- **Components controlling scrolling, overflow, shadows, z-index**
  - **Global / layout-level**
    - `body`:
      - `overflow-x-hidden` → clamps horizontal overflow globally.
    - Bottom global wave container in `layout.tsx`:
      - `overflow-visible` with fixed positioning and `z-0`.
  - **Home page**
    - `<main>`:
      - `h-screen`, `overflow-y-hidden`, `overflow-x-visible`:
        - Entire viewport height; top-level vertical scroll is disabled; vertical scroll is delegated to inner container on the right.
    - Right-hand scroll area:
      - `overflow-y-auto`, `overflow-x-visible`, `no-scrollbar`.
      - This is the primary scroll container for the project list.
    - Z-index stacking:
      - `ZGridBackground`: `z-[15]`, fixed.
      - Grid overlay in `page.tsx`: `z-[5]`, absolute.
      - Section content: `z-10`.
      - Projects right column wrapper: `z-20`.
      - Global bottom glow/waves: `z-0`.
      - Nav: `z-[60]`, fixed, highest among content layers.
      - Cursor elements:
        - Ring: `z-[9999]`, dot: `z-[10000]`, ripples: `z-[9998]` → topmost overall.
    - Shadows:
      - Project cards use a custom Tailwind arbitrary shadow on hover: `hover:shadow-[0_0_60px_rgba(37,99,235,0.45)]`.
      - Hover text shadows on nav links and brand name using `[text-shadow:...]`.

---

### 3. STYLING SYSTEM

- **Global CSS files and what they affect**
  - `app/globals.css`
    - Imports Tailwind v4 via `@import "tailwindcss";`.
    - Defines CSS custom properties:
      - `--background`, `--foreground` on `:root`, with dark-mode variants (`@media (prefers-color-scheme: dark)`).
    - `@theme inline` block:
      - Hooks CSS vars into Tailwind semantic tokens:
        - `--color-background`, `--color-foreground`.
        - `--font-sans`, `--font-mono`, `--font-display`, `--font-roboto`.
    - `body`:
      - Background and text color from `--background` / `--foreground`.
    - Animation / effect styles:
      - `@keyframes slow-spin` + `.animate-slow-spin` – used on the star in the nav brand.
      - `.wave-water`, `.wave-water--back`, `.wave-water--front`, `@keyframes waterDriftBack`, `@keyframes waterDriftFront` – used by bottom global wave layers in `layout.tsx`.
      - Accessibility: `@media (prefers-reduced-motion: reduce)` disables `waterDrift` animations.
      - `@keyframes softRipple` – used by `SoftRippleCursor` click ripples.
      - `.zgrid-plane` + `@keyframes zgridMove` – 3D grid background used in `ZGridBackground` and the extra grid in `page.tsx`.
      - `.no-scrollbar` – hides scrollbars while preserving scrolling.
    - Cursor behavior:
      - Media queries:
        - `(hover: hover) and (pointer: fine)`:
          - Hide native cursor globally (`html, body` and, in a later block, also `a`, `button`, form elements, `[role="button"]` etc.) and enforce `cursor: none !important`.
        - `(hover: none), (pointer: coarse)`:
          - Keep normal cursor (`cursor: auto` for `html, body`).
      - These combine with the `SoftRippleCursor` component to form the custom cursor system.

- **Tailwind config customizations**
  - Using Tailwind v4-style `@tailwindcss/postcss` plugin and inline theme:
    - `postcss.config.mjs`:
      - Exports `config` with `"@tailwindcss/postcss"` as a plugin.
    - No separate `tailwind.config` file; theme is declared via `@theme inline` in `globals.css`.
    - Tailwind utility classes are used extensively in components (layout, colors, typography, custom arbitrary values).

- **Fonts and how they are loaded**
  - `next/font/google`:
    - `Geist` (sans) and `Geist_Mono` (mono).
    - `Roboto` with weights `400`, `500`, `700`, subset `"latin"`.
  - `next/font/local`:
    - `MonsieurLaDoulaise-Regular.ttf` as `monsieur`.
  - All fonts are loaded at the layout level and attached as CSS variables (via `.variable` classes) on `body`.
  - `@theme inline` maps these CSS vars to Tailwind font tokens, allowing classes like `font-display` and `font-roboto`.

- **Animation / effect systems**
  - **Custom cursor system**
    - CSS:
      - `softRipple` keyframes; pointer-based cursor hiding; `cursor: none !important` overrides on interactive elements.
    - Component:
      - `SoftRippleCursor` uses JS-driven positioning plus CSS animations.
  - **3D grid / z-plane**
    - CSS:
      - `.zgrid-plane` with perspective, rotation, animated background position (`zgridMove`).
    - Components:
      - `ZGridBackground` (global).
      - Additional 3D grid wrapper in `page.tsx` around `zgrid-plane`.
  - **Water / wave system**
    - CSS:
      - `.wave-water`, `.wave-water--back`, `.wave-water--front` with radial gradients, masks, blurs, and drift animations.
    - Components:
      - Global bottom container in `layout.tsx`.
      - Additional bottom container in `page.tsx` uses `.wave wave1` / `.wave wave2` (CSS for `.wave` not present in `globals.css`—may be unimplemented).
  - **Subtle text/hover effects**
    - Arbitrary `[text-shadow:...]` classes for interactive glow on nav links and brand.

---

### 4. STATE & INTERACTIVITY

- **Components using `"use client"`**
  - `components/SoftRippleCursor.tsx`
    - Only explicit client component in the codebase.
- **Local state and hooks**
  - `SoftRippleCursor`
    - `useRef`:
      - `ringRef`, `dotRef` for DOM elements.
      - `mouse`, `pos` for tracking current and smoothed cursor positions.
      - `raf` to store `requestAnimationFrame` ID.
    - `useState`:
      - `isFinePointer` – whether device uses a fine pointer and hover.
      - `isHoveringInteractive` – tracks when hovering interactive elements (affects behavior but not currently changing styles directly in this code).
      - `isDown` – mouse button state.
      - `ripples` – array of active ripple effects with id/x/y.
    - `useEffect`:
      - Media query setup for `(hover: hover) and (pointer: fine)`; updates `isFinePointer`.
      - Pointer listeners:
        - `mousemove` – updates `mouse` and snap-aligns `dotRef`.
        - `mousedown` – sets `isDown`, spawns a ripple at click coordinates, schedules removal after 650ms.
        - `mouseup` – clears `isDown`.
        - `mouseover` – inspects `e.target.closest()` against interactive selectors to update `isHoveringInteractive`.
        - Animation loop: `requestAnimationFrame` tick smoothing ring position and updating `ringRef` transform.
      - Cleanup removes all listeners and cancels `raf`.
    - Returns `null` when `!isFinePointer` → custom cursor not rendered for touch/coarse devices.
- **Global state or hooks**
  - No global state management libraries or custom hooks found.
  - No shared context providers beyond font/layout from `RootLayout`.
- **Event listeners affecting layout or cursor behavior**
  - `window.matchMedia` to detect pointer capabilities.
  - Global `window` event listeners in `SoftRippleCursor`:
    - Affect cursor visuals and ripple positions but do not adjust layout directly.
  - CSS media queries:
    - Determine when to hide/show native cursor.
  - No scroll event listeners; scrolling is purely CSS-driven.

---

### 5. PERFORMANCE CONSIDERATIONS

- **Heavy components / logic**
  - `SoftRippleCursor`
    - Runs a continuous `requestAnimationFrame` loop for ring position (every frame).
    - Attaches global `mousemove`, `mousedown`, `mouseup`, `mouseover` listeners.
    - On click, creates and animates additional ripple elements with CSS animations.
    - Scope is limited to fine-pointer devices only, but still the most “expensive” component.
  - Animated backgrounds:
    - `.zgrid-plane` background animation (`zgridMove`) is continuous.
    - `waterDriftBack` and `waterDriftFront` animations on large gradient backgrounds run continuously.
    - All use CSS animations and GPU-friendly transforms; generally performant but visually heavy.
- **Client bundle size**
  - Client-executed code:
    - `SoftRippleCursor` only, plus whatever Next.js pulls into client for `page.tsx` UI.
    - No large third-party UI libraries (only core `next`, `react`, `react-dom` and Tailwind).
    - Custom logic is relatively small; bundle size impact mainly from cursor and core framework.
- **Image usage patterns**
  - `next/image` is used for project cards:
    - `fill` layout, `quality={100}`, `sizes="550px"`.
    - High quality and full-card coverage; could be bandwidth-heavy depending on actual images.
  - Static `imageSrc` paths (`/lm1.png`, `/prism.jpg`, `/kizo_b.png`, `"/.png"` for last two).
  - No `priority` flags; images will lazy load in viewport by default.
- **Potential hydration risks**
  - `SoftRippleCursor`:
    - Server-rendered markup vs client dynamic behavior:
      - The component returns `null` on server (no `window`) and also on client if `isFinePointer` calculates `false`.
      - On devices with fine pointers, it renders a fragment with fixed-position elements after hydration.
      - Pattern is typical for cursor components; low hydration mismatch risk since rendering is gated by client-only state and the server markup for it is empty.
  - CSS-only animations (z-grid, waves):
    - No dynamic class toggling; safe for hydration.
  - Links to undefined routes:
    - `/projects/...` links will navigate to 404, but this is a routing/content issue, not a hydration issue.

---

### 6. DEPENDENCY MAP

- **External libraries and where they are used**
  - **Core**
    - `next` (v16.1.6)
      - App Router with `app/` directory.
      - `next/font/google`, `next/font/local` for fonts in `layout.tsx`.
      - `next/image` in `page.tsx`.
    - `react` (v19.2.3)
      - Components across the app; hooks in `SoftRippleCursor`.
    - `react-dom` (v19.2.3)
      - Used by Next under the hood; not imported directly here.
  - **Styling / tooling**
    - `tailwindcss` (v4.2.1)
      - Utility classes throughout components.
      - Inline theme config in `globals.css`.
    - `@tailwindcss/postcss`
      - Configured as PostCSS plugin in `postcss.config.mjs`.
    - `postcss`
      - Underpins Tailwind v4 processing, configured in `postcss.config.mjs`.
  - **TypeScript / lint / formatting**
    - `typescript`, `@types/react`, `@types/react-dom`, `@types/node`.
    - `eslint`, `eslint-config-next`.
    - `prettier`, `prettier-plugin-tailwindcss`.
  - **Usage distribution**
    - `layout.tsx`:
      - `next/font/google`, `next/font/local`, `SoftRippleCursor`, `ZGridBackground`, `Metadata` type.
    - `page.tsx`:
      - `next/image`.
    - `SoftRippleCursor.tsx`:
      - `react` hooks.
    - CSS / PostCSS:
      - Tailwind utilities and custom CSS; no other CSS frameworks.

---

### 7. RISK AREAS

- **Files likely to cause layout clipping (overflow issues)**
  - `app/layout.tsx`
    - `body` has `overflow-x-hidden`:
      - Any wide/fixed/translated elements might be clipped horizontally if they extend beyond viewport and rely on visible overflow.
    - Bottom global glow/wave container:
      - `overflow-visible` and `fixed` at bottom; combined with `body` overflow rules could create complex clipping at edges on certain viewport sizes.
  - `app/page.tsx`
    - `<main>` uses `overflow-y-hidden`:
      - If inner scroll container (right column) fails to size correctly, content could become inaccessible (no vertical scroll).
    - Project column wrapper:
      - `overflow-visible` and large `shadow`/hover expansions; might interact with `body` `overflow-x-hidden` and card `pr-13` to cause subtle clipping on very small screens.

- **Scroll-related logic**
  - All scroll behavior is CSS-based:
    - Right column scroll container is the only element with `overflow-y-auto`.
    - `no-scrollbar` hides scrollbars:
      - Potential UX risk: users may not realize the right column is scrollable.
    - `main` deliberately blocks page-level vertical scroll.
  - There are no JS scroll listeners; all scroll issues will be related to height calculations or overflow configs:
    - `h-[calc(100vh-96px)]` and `h-[calc(100vh-96px+72px)]` depend on consistent nav/offset heights.

- **z-index stacking contexts**
  - Multiple layers with custom `z` values:
    - Cursor:
      - `z-[10000]` / `z-[9999]` / `z-[9998]` – highest, but safe.
    - Nav: `z-[60]` fixed top.
    - Global grid: `z-[15]` fixed full-screen.
    - Section content: `z-10`, right column wrapper `z-20`.
    - Bottom waves: `z-0`.
  - Risks:
    - Adding new overlays/modals/tooltips without carefully choosing `z-index` may accidentally render behind the grid or nav.
    - `ZGridBackground` and the extra z-grid in `page.tsx` both use `zgrid-plane`; stacking plus perspective should be reviewed if additional 3D effects are introduced.

- **Custom cursor conflicts**
  - Cursor hiding:
    - Global CSS sets `cursor: none !important` on `html, body` and most interactive elements for fine-pointer devices.
    - If `SoftRippleCursor` fails to mount (e.g., runtime error), users may have no visible cursor.
  - Event listeners:
    - Global `window` listeners for `mousemove`, `mousedown`, `mouseup`, `mouseover`:
      - If `SoftRippleCursor` is accidentally mounted multiple times (e.g., future code changes), duplicate listeners could be added, affecting performance.
  - Integration with other interactive UIs:
    - Any future components that rely on custom cursor styles, drag-and-drop, or custom pointer CSS may conflict with the enforced `cursor: none !important`.
    - `isHoveringInteractive` state is computed but not yet used to change the cursor visuals; future enhancements should ensure this doesn’t introduce reflow-heavy behavior.

---

### High-Level SYSTEM MAP (Condensed)

- **App Shell**
  - `RootLayout` (server): fonts, `globals.css`, custom cursor, 3D grid, global bottom waves, wraps all routes.
- **Routes**
  - `/` → `Home` (server): fixed nav, left static copy, right scrollable projects, local z-grid overlay, local bottom glow/waves.
  - Future `/projects/*` implied but not implemented.
- **Effects / Systems**
  - Custom cursor (`SoftRippleCursor` + `softRipple` + cursor-hiding CSS).
  - 3D z-plane grid (`ZGridBackground` + `.zgrid-plane`).
  - Water/wave backgrounds (`wave-water*` + bottom containers).
- **Styling**
  - Tailwind v4 utilities + inline theme mapping font vars.
  - `globals.css` defines core animations, cursor behavior, grid/wave visuals, and scrollbar hiding.
- **Interactivity / State**
  - Only `SoftRippleCursor` uses React state/effects; rest of UI is largely static with anchor navigation and CSS-only animations.