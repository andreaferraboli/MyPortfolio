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
        <div class="h-10">
            <h2>${book.titolo}</h2>
        </div>
        <div class="h-10">
            <h4>${book.autore}</h4>
        </div>
        <div class="h-10">
            <h1>${book.anno}</h1>
        </div>
        <div class="h-50">
            <p>${book.descrizione}</p>
        </div>
        <div class="h-20">
        <button href="${book.link}">Add to Cart</button>
            <button>Wishlist</button>
        </div>
      </div>
    </div>
    `;
  let section = document.getElementById("section-books");
  section.innerHTML += div_book;
});
