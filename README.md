# NS Dal-uren

See at a glance whether you can travel on the off-peak (daltarief) fare with NS, the Dutch railway. The app shows your current tariff in real time and a live timeline of off-peak and peak windows for the days ahead.

Live: [offpeak.zthijs.dev](https://offpeak.zthijs.dev)

## Features

- Real time status that tells you whether you are in daltarief or spitstarief right now.
- A countdown that says how long is left to check in for the off-peak fare, or how long until it starts.
- An eight day timeline of off-peak and peak windows, with today highlighted.
- An info popover listing the exact time windows and every upcoming public holiday for this year and next.
- Public holidays counted as full off-peak days, fetched live from the Nager.Date API.

## How the tariff works

On working days the peak fare (spitstarief) applies during two windows:

- Morning peak from 06:30 to 09:00
- Afternoon peak from 16:00 to 18:30

Every other moment is off-peak (daltarief), as is the whole day on weekends and public holidays. A five minute grace period applies around each boundary, so you can still check in for the off-peak fare up to five minutes before the peak begins, and the off-peak fare returns five minutes before the peak ends.

## Tech stack

- [Next.js 16](https://nextjs.org) with the App Router and static export
- [React 19](https://react.dev)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Headless UI](https://headlessui.com) for the accessible popover
- [date-fns](https://date-fns.org) for date math, with the Dutch locale
- [SWR](https://swr.vercel.app) for fetching public holidays
- [TypeScript](https://www.typescriptlang.org)
- [Biome](https://biomejs.dev) for linting and formatting
- [Vitest](https://vitest.dev) with Testing Library for tests

## Getting started

Prerequisites: Node.js 20 or newer and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `pnpm dev` starts the development server.
- `pnpm build` produces a static export in the `out` directory.
- `pnpm start` serves a production build.
- `pnpm test` runs the test suite in watch mode.
- `pnpm test:run` runs the test suite once.
- `pnpm lint` checks the code with Biome.
- `pnpm format` formats the code with Biome.

## Project structure

```
src/
  app/         Next.js routes, layout, and metadata
  components/  UI components such as the timeline and info popover
  hooks/       Data and timing hooks
  lib/         Schedule logic, time helpers, and the fetcher
  assets/      Icons, fonts, and global styles
  constants/   Site metadata
```

The schedule logic lives in `src/lib/dal-schedule.ts`, which builds a gap free timeline of off-peak and peak windows. Public holidays come from `src/hooks/use-is-public-holiday.ts`.

## Deployment

The app is a fully static site. Running `pnpm build` writes the export to `out`, which can be hosted on any static host. Set `NEXT_PUBLIC_PAGES_URL` to your own domain to override the canonical URL used in the metadata.
