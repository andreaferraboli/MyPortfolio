import Books from "./books.json" assert { type: "json" };
// let somma=0;
var categorie = new Map(),
  autori = new Map(),
  lingue = new Map();
Books.books.forEach((book) => {
  // somma+=book.pagine;
  // document.getElementById("myDropdown").innerHTML
  categorie.has(book.categoria)
    ? categorie.set(book.categoria, categorie.get(book.categoria) + 1)
    : categorie.set(book.categoria, 1);
  autori.has(book.autore)
    ? autori.set(book.autore, autori.get(book.autore) + 1)
    : autori.set(book.autore, 1);
  lingue.has(book.lingua)
    ? lingue.set(book.lingua, lingue.get(book.lingua) + 1)
    : lingue.set(book.lingua, 1);
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
for (let [key, value] of categorie) {
  document.getElementById("categoriesDropdown").innerHTML += `
  <div class="center">
    <input type="checkbox">
    <label class="container">${key} (${value})</label>
  </div>
  
    `;
}
for (let [key, value] of lingue) {
  document.getElementById("languagesDropdown").innerHTML += `
    <label class="container">${key} (${value})
                                <input type="checkbox" >
                                <span class="checkmark"></span>
                            </label>
    `;
}
for (let [key, value] of autori) {
  document.getElementById("authorsDropdown").innerHTML += `
    <label class="container">${key} (${value})
                                <input type="checkbox" >
                                <span class="checkmark"></span>
                            </label>
    `;
}
// console.log(somma);
{
  /* <div class="center h-40">
            <p>${book.descrizione}</p>
        </div> */
}
