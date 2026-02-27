# Cursor Rules (Project Operating Guide)

> This file defines mandatory editing constraints.
> Cursor must read this file before making structural changes.
> If a request conflicts with these rules, explain why before proceeding.

This repo is a Next.js (App Router) + TypeScript + Tailwind CSS site.
Cursor should follow these rules when analyzing or editing code.

## 1) Default behavior
- Prefer **minimal diffs**. Do the smallest change that solves the issue.
- Do **not** refactor unrelated code.
- Do **not** rename files, move folders, or change routing unless explicitly requested.
- If multiple solutions exist, present the **safest** one first.

## 2) Tech constraints
- Use **Tailwind utility classes** by default for styling.
- Use `globals.css` only for:
  - keyframes/animations
  - reusable utility classes (e.g., `.no-scrollbar`)
  - very small cross-browser fixes
- Avoid adding new dependencies unless explicitly asked.
- Keep TypeScript types correct (no `any` unless unavoidable—then explain why).

## 3) Next.js App Router rules
- Prefer **Server Components** by default.
- Only use `"use client"` when needed (event handlers, hooks, browser APIs).
- Don’t import client components into server components unless required.
- Keep `app/layout.tsx` clean: global fonts, providers, global UI effects only.

## 4) Styling / UI integrity rules
- Preserve existing layout and spacing unless asked to redesign.
- Be careful with:
  - `overflow: hidden/auto`
  - shadows/glows clipping
  - z-index and stacking contexts
  - scroll containers and hidden scrollbars
- If you change overflow/scroll behavior, verify:
  - shadows do not clip
  - scroll still works on desktop + mobile
  - no “hover reveals scrollbar gutter” artifacts

## 5) Animation & effects rules
- Custom cursor / ripple effects should:
  - respect `prefers-reduced-motion`
  - avoid expensive layout thrashing (prefer transforms)
  - not break pointer/hover/focus states
- Background effects (grid overlays, gradients) must not intercept clicks:
  - use `pointer-events: none` where appropriate

## 6) Accessibility expectations
- All interactive elements must have visible `:focus-visible` states.
- Don’t remove outlines without providing a replacement.
- Ensure color contrast remains acceptable.
- Support keyboard navigation.

## 7) Performance expectations
- Avoid unnecessary client-side rendering.
- Don’t increase bundle size without reason.
- Use `next/image` correctly:
  - set `sizes`
  - avoid `priority` except for above-the-fold
- Prefer CSS for simple effects; avoid heavy JS when unnecessary.

## 8) Output format requirements (when you respond)
When making changes:
- Provide a **file-by-file diff** (or exact code blocks per file).
- Explain what changed and why (brief).
- Note any tradeoffs and how to roll back.

## 9) Safety checks before finalizing a change
Before concluding, sanity-check:
- build passes (no obvious TS/ESLint errors)
- no broken imports
- no layout shift on major breakpoints
- no new scroll/overflow clipping