# CPC graphics hub

A dependency-free static graphics library, proposed brand kit, typography guide, and format studio for CPC New Haven. No deployment has been made yet.

## Run

```sh
npm run dev
npm run check
npm run build
```

Open http://127.0.0.1:4173. Netlify can import this repository using the included `netlify.toml` (`npm run build`, publish `dist`). No frontend credentials are needed.

## Typography

- Nine pairings in three visual directions: `public/pairings.json` is the source.
- Live specimens and studio presets in the hub.
- Printable guide: `/typography-guide.html` (Print / Save as PDF).
- Text guide: `docs/typography-guide.md`.
- Regenerate both guides with `node scripts/guide.mjs` after changing pairings.
- Recommended proposal: Libre Baskerville headings + Open Sans body. CPC has not adopted this proposal yet.
- Google Fonts are loaded remotely with fallbacks. These are web fonts, not universally installed web-safe fonts. The guide distinguishes anecdotal community recommendations from exact-pair recommendations.
- Canva availability is supported by public guides/catalog references; confirm fonts and weights inside the CPC workspace.

## Google Cloud bucket

`storage.config.json` holds non-secret bucket settings. The proposed bucket name is `cpc-newhaven-graphics`, with Standard storage in `us-east1`, uniform bucket-level access and seven-day soft delete. **The bucket has not been created until a successful CLI run is recorded.**

Authenticate with the CPC account that can administer the existing CPC Website project:

```sh
gcloud auth login
# Inspect the existing CPC bucket to identify its project number.
gcloud storage buckets describe gs://cpc-public-website --account=YOUR_CPC_ACCOUNT
# Resolve the returned project number to its project ID.
gcloud projects describe PROJECT_NUMBER --account=YOUR_CPC_ACCOUNT
```

Set `project` to the verified CPC project ID and `account` to the authenticated CPC address in `storage.config.json`. Do not use the unrelated default AHOY project. Bucket names are globally unique; if this name is taken, choose a new CPC-specific name.

```sh
npm run bucket:create
npm run bucket:public
```

The second command enables public read/list on this new graphics bucket and GET/HEAD CORS for browser catalogs. Uploads still require authentication. Every object in this bucket is public: use it for final public graphics only. Keep working files and private materials outside `exports/`.

## Canva → shared library

Export from Canva into the relevant folder:

```text
exports/
  brand/logos/              # final logo files
  brand/guides/             # approved brand/typography guides
  print/bulletins/
  print/posters/
  digital/web/
  digital/foyer/
  social/square/            # 1080 × 1080
  social/portrait/          # 1080 × 1350
  social/stories/           # 1080 × 1920
  campaigns/YYYY-event/
```

Folders are object-name prefixes in the bucket. PNG/JPG/WebP/GIF/SVG/PDF files are supported. Filenames should describe the use and date, such as `2026-11-welcome-instagram-portrait.png`.

```sh
npm run assets:sync
# Or continuously watch while exporting from Canva:
npm run assets:watch
```

Sync uploads files with content hashes, merges the shared catalog, and publishes `catalog.json` last. Existing remote entries and files are preserved; local deletion does not delete remote assets. Changed originals get new URLs. Catalog caching is 60 seconds; the hub refreshes every minute. Watch mode requires the terminal to stay running; it is not a hosted automation or direct Canva integration. Use one publishing machine at a time because the shared catalog is a read/merge/write operation.

After the first sync, `public/config.js` points to the bucket catalog. Commit that configuration and deploy the frontend once. Subsequent graphics syncs update the library without another Netlify deployment. Alternatively set Netlify build variables `CPC_CATALOG_URL` and `CPC_BUCKET`.

Browser **Add graphics** imports are local IndexedDB previews, not authenticated cloud uploads. Use the CLI for the shared public library. Categories derive from the top-level `print/` and `social/` folder; other files use Digital & web.

## Export studio

Seven presets cover social, foyer, web, US Letter, and 11 × 17 in. PNG print presets have 300 PPI pixel dimensions; PNG metadata may still be interpreted differently by layout software. Set the physical dimensions explicitly and use Canva PDF Print for production print work. Confirm bleed and CMYK conversion with your printer. The font choice is saved in the current browser.

## Verification

`npm run check` checks JS syntax; `npm run build` verifies required files and prepares `dist/`. Browser QA should cover font presets, format changes, PNG download, local imports and persistence, empty/search states, and the printable guide. Live bucket/Netlify verification requires their respective credentials and successful provisioning/deployment.
