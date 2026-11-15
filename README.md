# Michael Fourie — portfolio and websites page

Static site hosted on GitHub Pages (auto-deploys from `main`) at https://michaelfourie.co.za.

## Pages
- `index.html` — portfolio, styled by `portfolio-handmade.css`, behaviour in `script.js`
- `websites.html` — service page for business websites, styled by `websites.css`
- `assets/` — images, CV, favicons, web manifest
- `robots.txt`, `sitemap.xml`

## Stack
Plain HTML, CSS and vanilla JavaScript. No build step. Fonts (Fraunces, Inter, Caveat) from Google Fonts.

## Working on it
Serve the folder with any static server (for example `python -m http.server`) and open `index.html`.
Bump the `?v=N` query on a stylesheet or script link when it changes so browsers fetch the new file.
