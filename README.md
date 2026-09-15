# MMCup · Team HQ

A single-page app for the internal MMCup competition: a 3D globe with mystery markers.
Click a marker (or a set of coordinates in the side panel) to fly there and discover
which team is based at that location, along with a gently roasting description.

Live: https://mmcup-hq.nitocode.com

## Stack

- Vue 3 (Composition API, `<script setup>`) + TypeScript, built with Vite
- Tailwind CSS v4
- [cobe](https://cobe.vercel.app/) for the WebGL globe
- vue-i18n for the English / French toggle

## Teams and logos

A team is placed on the globe only when it has a logo. Drop the image in
`public/logos/` and point the `logo` field of that team in `src/data/teams.ts` at it.
Teams left without a logo stay in the roster but are not rendered anywhere.

## Guide dog mode

The header toggle labelled "Chien guide" / "Guide dog" swaps the WebGL globe for a
static, scrollable list of headquarters and disables every animation and transition.
Revealing a location expands it in place instead of opening a dialog. The choice is
kept in `localStorage` and starts enabled when the system asks for reduced motion.

Outside that mode there is no shortcut to the next location: each headquarters has to
be found on the globe or in the coordinates panel.

## How marker clicks work

cobe renders to a canvas and has no DOM events for markers. The app mirrors cobe's
marker projection in `src/composables/useGlobe.ts`: every frame it rotates each
marker's 3D position by the current `phi` / `theta`, converts it to canvas pixels
and moves an absolutely-positioned `<button>` on top of it. Markers on the far side
are hidden, so only what you can see is clickable. The "Mystery Coordinates" panel
offers the same reveal for anyone who prefers a list: it animates the globe to the
location and opens the team card.

## Development

```bash
npm install
npm run dev
```

`npm run build` type-checks with `vue-tsc` and produces `dist/`.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds the app and
publishes `dist/` with GitHub Pages (repository settings, Pages, Source:
**GitHub Actions**). The site is served from the custom domain in `public/CNAME`,
so the Vite `base` is `/`. Reverting to the `github.io` URL means deleting that file
and setting `base` back to `/mmcup-team-hq/`.

To publish manually without Actions:

```bash
npm run deploy
```

This builds and pushes `dist/` to the `gh-pages` branch (set Pages source to that
branch if you use this route).
