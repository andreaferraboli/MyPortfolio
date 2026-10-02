/* books.html: loads js/books.json, renders the library and the filters.
   Filters combine with OR, as before: a book is shown if it matches any ticked
   category, author or language. With nothing ticked, every book is shown. */
(function () {
    "use strict";

    var grid = document.getElementById("section-books");
    var count = document.getElementById("books-count");
    var badge = document.getElementById("filters-badge");
    var form = document.getElementById("filters-form");
    var library = [];

    var GROUPS = [
        {key: "categoria", id: "categories", el: "categoriesDropdown"},
        {key: "autore", id: "authors", el: "authorsDropdown"},
        {key: "lingua", id: "languages", el: "languagesDropdown"}
    ];

    function esc(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function shuffle(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = array[i];
            array[i] = array[j];
            array[j] = tmp;
        }
        return array;
    }

    function bookCard(book) {
        return (
            '<article class="book-card">' +
            '<div class="book book--sm" aria-hidden="true"><span class="book__body">' +
            '<span class="book__back"></span><span class="book__pages"></span>' +
            '<span class="book__cover"><img src="' + esc(book.copertina) + '" alt="" loading="lazy" decoding="async"></span>' +
            "</span></div>" +
            '<div class="book-card__body">' +
            '<h2 class="book-card__title">' + esc(book.titolo) + "</h2>" +
            '<p class="book-card__author"><span class="visually-hidden">Autore: </span>' + esc(book.autore) + "</p>" +
            '<dl class="book-card__meta">' +
            "<div><dt>Anno</dt><dd>" + esc(book.anno) + "</dd></div>" +
            "<div><dt>Numero pagine</dt><dd>" + esc(book.pagine) + "</dd></div>" +
            "<div><dt>Categoria</dt><dd>" + esc(book.categoria) + "</dd></div>" +
            "<div><dt>Lingua</dt><dd>" + esc(book.lingua) + "</dd></div>" +
            "</dl>" +
            '<div class="book-card__actions">' +
            '<a class="btn btn--sm" href="' + esc(book.link) + '" target="_blank" rel="noopener">Scopri di più!</a>' +
            '<a class="btn btn--sm btn--ghost" href="' + esc(book.amazon) + '" target="_blank" rel="noopener">Compra</a>' +
            "</div></div></article>"
        );
    }

    function showBooks(books) {
        shuffle(books);
        grid.innerHTML = books.map(bookCard).join("");
        count.textContent = books.length === library.length
            ? library.length + " libri"
            : books.length + " libri su " + library.length;
    }

    function countBy(books, key) {
        var map = new Map();
        books.forEach(function (book) {
            map.set(book[key], (map.get(book[key]) || 0) + 1);
        });
        return new Map(Array.from(map.entries()).sort(function (a, b) {
            return String(a[0]).localeCompare(String(b[0]), "it");
        }));
    }

    function showFilter(map, group) {
        var html = "";
        var i = 0;
        map.forEach(function (n, value) {
            var id = "input_" + group.id + "_" + i++;
            html +=
                '<label class="check" for="' + id + '">' +
                '<input type="checkbox" class="input_user" id="' + id + '" name="' + group.key + '" value="' + esc(value) + '">' +
                '<span class="check__label">' + esc(value) + "</span>" +
                '<span class="check__count">' + n + "</span>" +
                "</label>";
        });
        document.getElementById(group.el).innerHTML = html;
    }

    function selected() {
        var out = {};
        GROUPS.forEach(function (g) {
            out[g.key] = Array.from(form.querySelectorAll('input[name="' + g.key + '"]:checked')).map(function (i) {
                return i.value;
            });
        });
        return out;
    }

    function filterResults() {
        var sel = selected();
        var total = sel.categoria.length + sel.autore.length + sel.lingua.length;
        badge.hidden = total === 0;
        badge.textContent = total;
        if (total === 0) {
            showBooks(library.slice());
            return;
        }
        showBooks(library.filter(function (book) {
            return sel.categoria.indexOf(book.categoria) > -1 ||
                sel.autore.indexOf(book.autore) > -1 ||
                sel.lingua.indexOf(book.lingua) > -1;
        }));
    }

    function discardFilter() {
        form.reset();
        filterResults();
    }

    // on small screens the filter panel starts closed
    if (window.matchMedia("(max-width: 900px)").matches) {
        document.getElementById("filters").removeAttribute("open");
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        filterResults();
        if (window.matchMedia("(max-width: 900px)").matches) {
            document.getElementById("filters").removeAttribute("open");
            grid.scrollIntoView({behavior: "smooth", block: "start"});
        }
    });
    document.getElementById("discard_button").addEventListener("click", discardFilter);

    fetch("./js/books.json")
        .then(function (response) {
            if (!response.ok) throw new Error("HTTP " + response.status);
            return response.json();
        })
        .then(function (data) {
            library = data.books || [];
            GROUPS.forEach(function (g) {
                showFilter(countBy(library, g.key), g);
            });
            showBooks(library.slice());
        })
        .catch(function (error) {
            console.error("Error fetching the JSON:", error);
            grid.innerHTML =
                '<p class="book-grid__error">Non riesco a caricare l\'elenco dei libri. ' +
                "Se hai aperto il file direttamente dal disco, aprilo tramite un server web " +
                "(per esempio <code>python3 -m http.server</code>) e ricarica la pagina.</p>";
        });
})();
