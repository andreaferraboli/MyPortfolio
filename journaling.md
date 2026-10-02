
## 2026-10-02 - Restyling del portfolio con componenti 21st.dev
- Ridisegnati index.html e books.html: tema chiaro/scuro, Big Shoulders Display + Newsreader, token in palette.css, topbar sticky al posto della sidebar.
- Componenti 21st.dev portati in HTML/CSS/JS vanilla: Portfolio Hero (@waleedkibhen), Timeline (@shadcnui-blocks/timeline-01), Logo Marquee (@ddoemonn), Book 3D (@designali-in). Sito sempre statico, nessun build.
- Rimossi animation.css (3099 righe, 5 animazioni su 79 usate), Bootstrap 3, jQuery, slick, scrollify, script esterni rotti. Nuovo js/site.js; cloud.js senza jQuery.
- Loghi copiati in img/logos/ (12 su 20 hotlink Wikimedia davano 400/429). Form contatti ora apre il client mail; video di sfondo lazy e saltato su mobile (-14.6 MB).
- Books: pannello filtri con contatori, Discard ripristina tutti i libri.
- Verifica: python3 -m http.server + Chrome headless a 1440/390/360, nessun errore console, nessuno scroll orizzontale, 76 libri caricati, filtro Psicologia+Tony Robbins = 13 come da JSON.
- Aperti: telefono testo/link diversi (1379 vs 1378), CV mancante, carriera 2028-2032 al futuro, tag UA morto senza consenso, avatar 3 MB da comprimere, 6 immagini non piu usate.

## 2026-10-02 - Pubblicazione su GitHub Pages via Actions
- Aggiunto .github/workflows/pages.yml: a ogni push su main pubblica la cartella 'my personal website' su GitHub Pages (checkout, configure-pages, upload-pages-artifact, deploy-pages).
- Pages attivato via API con build_type=workflow, URL https://andreaferraboli.github.io/MyPortfolio/.
- Verifica: run del workflow su main e curl dell'URL pubblico (index, books.html, books.json).
