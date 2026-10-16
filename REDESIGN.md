# Landing page redesign

`app/page.tsx` composes the five content sections. `SiteHeader` and `SiteFooter`
live in the root layout; reusable UI is in `src/components/landing`. Visual
tokens and responsive layouts are in `app/landing.css`.

The installation section owns its selected frequency. Both install methods and
the mascot demo consume that state. `src/lib/installation.ts` is the single
source for schedules, shell checks, and the agent setup document served at
`/agent-setup/prompt.md?frequency=daily`. The same hook renderer is used on
existing user profiles. No installed hook is changed by moving the slider.

Totals and avatars come from the public API, cached for an hour. Avatars are
actual participants from the last three daily leaderboards. On API failures,
the total shows an unavailable state and the avatar row can be omitted.

App screenshots and published blog posts are still content placeholders.
`src/lib/testimonials.ts` contains four attributed public testimonial excerpts
from the research chat, each with its original source URL. `CommunitySection`
uses `TestimonialMarquee` and `TestimonialCard` to repeat them in a continuous
right-to-left loop. Compact cards use a red/orange gradient along the top border and source-platform marks and colors; the entire card
links to the original post or review (App Store exposes only the app listing).
Three authors have source-verified profile images in `public/testimonials`;
the App Store reviewer has no public photo and uses an initials fallback.
The repeated copy is hidden from assistive technology.
Scrolling continues on hover, with no pause control. It suspends off screen and in hidden tabs;
keyboard focus and reduced motion expose a stationary, scrollable row.
Optimized mascot sprite sheets are derived from the existing artwork.

## Browser signup configuration

The new web flow uses a separate GitHub OAuth application so the existing
native application's callback remains untouched. Register the web application
with this authorization callback:

`https://gitpushups.com/auth/callback`

Configure these bindings/secrets on **gitpushups-api** before deploying:

- `GITHUB_WEB_CLIENT_ID`: the web OAuth application's public client ID.
- `GITHUB_WEB_CLIENT_SECRET`: its secret, managed as a Worker secret.
- `GITHUB_WEB_REDIRECT_URI`: optional; defaults to the callback above.

The website fetches public configuration from `GET /auth/web`. It generates
state and an S256 PKCE challenge in a ten-minute HttpOnly cookie. Its callback
validates state and exchanges the code server-to-server through `POST /auth/web`.
The API verifies the GitHub identity, creates or reuses the existing account,
and issues a seven-day signed session. The website stores it in a Secure,
HttpOnly, SameSite=Lax, host-only cookie. GitHub access tokens are not placed in
the browser session. Signout is a same-origin POST that clears browser cookies;
already-issued signed tokens expire after seven days. Mobile sessions are not
overwritten. Existing account deletion continues to work through the app.

For local signup tests, use a separate development OAuth app and local API with
`GITHUB_WEB_REDIRECT_URI=http://localhost:3000/auth/callback`. Set
`GITPUSHUPS_API_URL=http://localhost:8787` in the website's `.env.local`. Visit
that exact localhost origin (not 127.0.0.1). Do not change production OAuth
settings to test locally. No secrets belong in `NEXT_PUBLIC_*` variables.

Deploy the API additions before the website. Until configured, signup shows a
clear unavailable message. No deployment or live GitHub authorization is part
of this local implementation.

## Checks

- Website: `npm run test:landing`, `npm run test:proxy`, `npm run check`.
- API: `npm run test:web-auth` (Node 22.13+ for the existing SQLite test adapter).
- Browser: responsive layout, all six slider values, keyboard controls, copy,
  installation method tabs, platform tabs, signup error and supporting pages.

The current Next 14 build completes and TypeScript passes, but its built-in
lint runner reports incompatible ESLint 9 options. Direct ESLint 9 checks on
the changed TypeScript/TSX files pass with image-optimization warnings only.
The new API route passes a targeted type check; the API's existing whole-project
type errors in legacy handlers remain outside this redesign. Website and API
tests run without production credentials or writes to production data.

The hero leads with the commit-blocking headline and includes the live animated
total in the supporting copy. A separate `HeroAnimationSlot` reserves the right
column for upcoming artwork; it is hidden at mobile widths of 600px and below.
Viewport-relative minimum heights leave a glimpse of the installation section,
while content can expand on short screens without clipping.

Active community uses equal-width desktop columns: a testimonial marquee and
a `CommunityUpdateCard`, stacked on mobile. Pass `latestUpdate` with a title and
post URL when a post is available; the current placeholder links to `/blog`.
The gradient strip has rounded ends above the square card top corners.

Installation defaults to the agent prompt, with a neighboring Git hook tab. Both use the selected frequency. The tab list supports arrow, Home, and End keys. Locally served Claude, Cursor, GitHub Copilot, Devin, and Codex brand SVGs are attributed in `public/agents/SOURCES.md`.

Training preview: the After character uses five transparent, two-frame GIFs in `public/mascot/training`, keyed by schedule ID. Daily raises a fist from in front of the chest into a biceps flex. All GIFs loop at 450/750 ms; reduced-motion visitors receive the matching still WebP through a picture source. Before retains its green animation. Source frames and export details are in `../output/training-poses-v1`.

The installation panel measures its natural content with ResizeObserver and eases its height over 550 ms when tabs or content change. Instructions do not scroll vertically inside the panel. The preview is aligned at the top on desktop; on mobile it sits between the heading and tabs so tab changes expand beneath it. Reduced-motion preferences disable the transition.

Why this works includes a transparent left-facing notebook mascot on the right. The WebP is `public/mascot/why-it-works.webp`; the source PNG and built-in generation prompt are in `../output/why-character-v1`.
