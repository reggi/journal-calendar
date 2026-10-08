# Journal Calendar

I've been journaling for 8 years, and this monthly calendar layout has stuck
with me since early on. I used to generate it with a complex Google Docs script
that handled the dates and weekdays from a single year. This site replaces that
setup with a simple year input and print-ready calendars for my 5 × 8.25-inch
journals.

Built with vanilla HTML, CSS, JavaScript, and Vite; no backend or external
services.

## Development

Use Node.js 20.19+ or 22.12+ (Node.js 24 is supported).

```sh
npm install
npm run dev
```

Open the local address Vite prints. `npm test` runs the date and validation tests.
`npm run build` creates the static website in `dist/`; `npm run preview` serves
that build locally. Deploy `dist/` to any static hosting service.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` runs the tests and builds the
website on pull requests and pushes to `main`. Pushes to `main` also upload
`dist/` and deploy it to GitHub Pages. You can deploy manually by running the
workflow on `main` from the repository's **Actions** tab.

In the GitHub repository, go to **Settings → Pages → Build and deployment**
and set **Source** to **GitHub Actions**. Then push the workflow to `main`.

The deployment build gets `SITE_URL` from GitHub Pages automatically, so asset
paths, the canonical URL, and social-card URLs work for repository subpaths,
user/organization sites, and configured custom domains. No manual `SITE_URL`
setting is needed for this workflow. Pull requests only test and build; they
cannot deploy the site.

## Using and printing

The year defaults to your current local year. Whole Gregorian years from 1 to
9999 are supported, including leap years. Invalid entries show an error and
disable printing until corrected.

Use **Print calendar** and choose:

- US Letter (8.5 × 11 inches), portrait.
- 100% scale / actual size, not fit to page.
- No additional print-dialog margins; the website already includes the
  calendar's upper-left spacing.
- Headers and footers off.

Each month prints on its own sheet, with dotted day rows, weekday labels, and
blank writing space. Choose **Save as PDF** in the browser's print dialog to
save the year instead of printing it.
The page title suggests `journal-calendar-<yyyy>.pdf` as the filename (for
example, `journal-calendar-2026.pdf`), though some browsers or system print
dialogs may use a different default.

**Add cutting guides** enables two gray dashed lines: one to the right and one
below the calendar. Both lines stay at the same position on every page,
accommodating a 31-day month. Shorter months leave blank space above the bottom
line, so every trimmed sheet has the same dimensions. The lines extend across
the paper and sit outside the calendar; there are no top or left cutting lines.
The right padding and the bottom padding below December's 31-day table both
match the left margin: 17.25 points (approximately 0.24 inches).
The resulting piece is approximately 4.71 × 7.63 inches, including the original
top and left margins, to fit inside a 5 × 8.25-inch journal.

Physical placement also depends on your printer's printable area and browser
settings. The website cannot override printer hardware margins.

## Social sharing

The site includes a 1200 × 630 PNG social card, Open Graph metadata, and a
large-image Twitter/X card. The image is `public/social-card.png`; its editable
design is `public/social-card.svg`. The handwritten plans on the card are
illustrative only; the generated calendars keep their writing spaces blank.

Set `SITE_URL` to the final public website URL when building:

```sh
SITE_URL=https://your-domain.example npm run build
```

This writes absolute image URLs, the page URL, and a canonical link into the
built HTML, so crawlers do not need to run JavaScript. URLs with a subdirectory
are supported; Vite also uses that path for the site's assets. You can instead
set `SITE_URL` in a local `.env.local` file.

Without `SITE_URL`, local development still works with a relative image path,
but the build warns that the public URL is needed for reliable sharing previews.
Rebuild with the real URL before deployment. Social platforms may cache previews
and can take time to pick up changes.
