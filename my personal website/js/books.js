import Books from "./books.json" assert { type: "json" };
console.log(Books);
Books.books.forEach((book) => {
  console.log(book);
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
        <button><a target="_blank" href="${book.link}"></a>Scopri di più!</button>
        <button><a target="_blank" href="${book.amazon}"></a>Compra</button>
        </div>
      </div>
    </div>
    `;
  let section = document.getElementById("section-books");
  section.innerHTML += div_book;
});
{/* <div class="center h-40">
            <p>${book.descrizione}</p>
        </div> */}