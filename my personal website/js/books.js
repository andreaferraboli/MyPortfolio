//create array of books
import Books from "./books.json" assert {type: "json"};
export {queryBooks}
//create filter list
var categories = new Map(),
    authors = new Map(),
    languages = new Map();

//main
showBooks(Books.books);
createFilter(Books.books);
showFilter(categories, "categories");
showFilter(authors, "authors");
showFilter(languages, "languages");

//functions
function addFilter(map, param) {
    map.has(param)
        ? map.set(param, map.get(param) + 1)
        : map.set(param, 1);
}

function showBooks(arrayBooks) {
    arrayBooks.forEach((book) => {
        let div_book = `
    <div class="card">
      <div class="photo">
      <img src="${book.copertina}">
      </div>
      <div class="description">
        <div class="center h-30">
            <h2>${book.titolo}</h2>
        </div>
        <div class="left h-10">
            <h1><span class="span">Autore:</span> ${book.autore}</h1>
        </div>
        <div class="left h-10">
            <h1><span class="span">Anno: </span>${book.anno}</h1>
        </div>
        <div class="left h-10">
            <h1><span class="span">Numero pagine: </span>${book.pagine}</h1>
        </div>
        <div class="left h-10">
            <h1><span class="span">Categoria: </span>${book.categoria}</h1>
        </div>
        <div class="left h-10">
            <h1><span class="span">Lingua: </span>${book.lingua}</h1>
        </div>
        
        <div class="center h-20">
        <a target="_blank" class="link" href="${book.link}">Scopri di più!</a>
        <a target="_blank" class="amazon" href="${book.amazon}">Compra</a>
        </div>
      </div>
    </div>
    `;
        let section = document.getElementById("section-books");
        section.innerHTML += div_book;

    });
}

function createFilter(arrayBooks) {
    arrayBooks.forEach((book) => {
        addFilter(categories, book.categoria);
        addFilter(authors, book.autore);
        addFilter(languages, book.lingua);
    });
}

function showFilter(filterList, idFilter) {
    for (let [key, value] of filterList) {
        let id = "input_" + idFilter + "_" + key.replace(/ /g, "_");
        document.getElementById(idFilter + "Dropdown").innerHTML += `
    <div class="container center">
      <div class="input_box">
          <input id="${id}" class="input_user" type="checkbox">
      </div>
      <div class="input_text">
        <label>${key}</label>
      </div>
      <div class="input_info">
        <label>(${value})</label>
      </div>
    </div>
    `;
    }
}

function queryBooks(categoriesInput, authorsInput, languagesInput) {
    let outputBooks =[];
    Books.books.forEach((book) => {
        if (categoriesInput.has(book.categoria) || authorsInput.has(book.autore) || languagesInput.has(book.lingua))
            outputBooks.push(book)
    })
    return outputBooks;
}

// console.log(somma);
{
    /* <div class="center h-40">
              <p>${book.descrizione}</p>
          </div> */
}
