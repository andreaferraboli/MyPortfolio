
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

## 2026-10-12 - Effetto wow sul portfolio con asset Higgsfield
- Asset generati con Higgsfield CLI in img/hf/: video hero 5s 1080p (Kling 3.0 pro, 677 KB), arte hero e tre immagini di sezione (GPT Image 2.5), og-cover 1200x630. 24 crediti spesi, 82 residui.
- Hero a tutto schermo con video, aurora, grana, spotlight sul cursore, nome che si decodifica, ruoli in sequenza, bottoni magnetici con bordo animato. Card immagine con parallasse su About, Skills, My Books e books.html.
- Reveal allo scroll, timeline che si riempie, contatori delle skill, barra di progresso, card certificazioni in vetro con tilt 3D, meta Open Graph e Twitter, canonical.
- Nuovo css/fx.css; toccati index.html, books.html, css/palette.css, css/style.css, css/books.css, js/site.js, js/books.js. Nessuna libreria esterna.
- Spunti 21st.dev adattati in vanilla: PrismaHero (@rahil1202), Scramble Text e Aurora (@kevingirelli), Tilt Card (@tom_ui), Spotlight (@ibelick), Magnetic Button (@mohammadshehadeh), Moving Border (@phucbm), Parallax Image (@pulkitxm), Scroll Progress (@cnippet-dev), Number Ticker (@danielpetho).
- Video saltato sotto 768px, con reduced-motion e save-data; tutti gli asset img/hf opzionali (provato senza cartella: fallback a gradiente).
- Verifica: http.server + Chromium headless a 1440 e 390, chiaro e scuro, nessun errore console, nessuno scroll orizzontale, 76 libri, filtro Psicologia+Tony Robbins = 13, Discard torna a 76.
- Aperti: in tema chiaro il vetro delle certificazioni resta bianco per i loghi; non fatta passata 21st-ui-review separata ne prova su telefono vero; restano i punti aperti del 2026-10-02.
