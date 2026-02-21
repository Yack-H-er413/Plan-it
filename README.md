# Plan-it Frontend (UI-only)

This is a **pure UI** implementation of the hackathon mockups:
- Left sidebar: course library + (+) add course
- Main area: term columns (planner) + add-term + “no term” popup
- Right inspector: selected course editing (placeholder)

> No backend, no prereq logic, no drag/drop wiring, no persistence.  
> Buttons open/close UI, but do not change data.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Where to edit

- `app/page.tsx` – app entry
- `components/layout/*` – header/sidebar/inspector
- `components/planner/*` – planner columns & course cards
- `components/modals/*` – add course / add term / term required popup
