# Siqola Exam - Copilot Instructions

## Repository Overview

This is a **Turborepo monorepo** both frontend and backend for an online exam platform.

### Key Information

- **Frontend**: Built with Next.js and TypeScript, located in the `apps/frontend` directory.
- **Backend**: Built with Node.js and Express, located in the `apps/backend` directory.
- **Shared Code**: Common utilities and types are located in the `packages` directory.
- **Package Manager**: pnpm
- **Monorepo Tool**: Turborepo
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Language**: The contents will mainly be in Indonesian, but code comments and documentation should be in English.

## Command Line Instructions

- Use turbo commands to manage the monorepo.
- Use pnpm as the package manager.

## Architecture Overview & Tech Stack

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeScript
- **UI Framework**: Tailwind CSS 4
- **Component Library**: Radix UI + Custom components
- **State Management**: React Query, Zustand
- **Animations**: Framer Motion
- **Forms**: Tanstack Form, Zod for validation
- **Icons**: Lucide Icons

## Coding Guidelines

### Layout

- Maintain good spacing and visual hierarchy — minimal clutter.
- Use flex or CSS grid for adaptive layouts.

### Design Style

- **Minimalist & flat interface**, inspired by Linear, Vercel, and Supabase — no skeuomorphism, no ornamental UI, but not too flat that it causes confussions in navigating.
- **Cyan-accented theme** (oklch(0.8 0.12 199)) using a single calm highlight color, with muted neutrals for the base.
- shadcn/ui is the default component library for layout, modals, inputs, menus, dialogs, and general structure.
- Smooth, subtle Framer Motion transitions:
  - Fade-ins for modals and overlays.
  - Slide transitions for page changes.
  - Hover effects on buttons and interactive elements.
- Rounded corners & soft shadows:
  - Border radius: 8px for cards and containers, 6px for buttons and inputs.
  - Soft shadows for depth without heaviness.
- Neutral, low-contrast backgrounds to maintain focus on exam content:
  - Light mode: off-white (#FAFAFA) or very light gray (#F5F5F5).
  - Dark mode: very dark gray (#121212) or charcoal (#1E1E1E).
  - Accent color used sparingly (buttons, active states, progress)
- Consistent spacing system (Tailwind defaults):
  - Layout padding: p-6
  - Inner card spacing: p-4
  - Component gaps: gap-4
  - No cramped UI; everything should breathe.
- Familiar & safe visual language similar to Google Classroom, Canvas, and Microsoft Teams:
  - Clear typography hierarchy: headings, subheadings, body text.
  - Standard iconography for actions (edit, delete, submit).
  - Intuitive navigation patterns (sidebar, top nav).
- Responsive-first:
  - Mobile: single-column layouts, collapsible menus.
  - Tablet: two-column layouts where appropriate.
  - Desktop: full multi-column layouts with sidebars.
- Accessibility-friendly:
  - High contrast for text.
  - Visible focus states using the cyan accent.
  - Keyboard navigation for all interactive elements.
- Calm, exam-safe interaction design:
  - No flashing, bouncing, or distracting animations.
  - No sudden layout shifts.
  - Smooth transitions that do not startle the user.
  - Alerts use color sparingly and intentionally

### Components

- Use shadcn components as the base for all UI elements.
- Create custom components only when necessary.
- Ensure components are reusable and maintainable.
- Use icons from Lucide Icons for consistency.
- For components that exclusive to a page, place them in that page's \_components folder.

### Code Quality

- Modular, reusable, and well-commented components.
- Accessible (ARIA-friendly) markup.
- Consistent component folder structure

### Other Enhancements

- Page transition animation (Framer Motion).
- Loading skeletons for charts and cards.

**Important**: Trust these instructions and avoid unnecessary exploration. Use Turborepo filtered commands when working on specific packages, and always run commands from the repository root unless specifically targeting a single package directory.
