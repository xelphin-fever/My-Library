// VARIABLES
// LOG
const logBook = document.querySelector('#log-books-span');
const logRead = document.querySelector('#log-read-span');
const logNotRead = document.querySelector('#log-not-read-span');
let countBooks = 0;
let countRead = 0;
// DROPDOWN
const dropOptions = document.querySelectorAll('.dropdown-option');
// READ/NOT-READ BUTTONS
const readButtons = document.querySelectorAll('.btn-top-right');
let showRead = true;
let showNotRead = true;
// LIBRARY
const library = document.querySelector('#library');
// FORM
const form = document.querySelector('#div-book-form');
const checkRead = document.querySelector('#inp-book-read');
const divStars = document.querySelector('.div-form-book-stars');
const stars = document.querySelectorAll('.form-star ');
// ADD BUTTON
const btnAdd = document.querySelector('#btn-add');
// RATING FORM
const ratingForm = document.querySelector('#div-rating');
const ratingStars = document.querySelectorAll('.rating-star');
const ratingSubmit = document.querySelector('#rating-submit');

let currentTitle = '';
let currentAuthor = '';
let currentHasRead = false;
let currentRating = 0; // JUST CHANGED
let currentBook;
// LIBRARY
const myLibrary = [];
// CURRENT INDEX
let myIndex = 0;

// LOCAL STORAGE ??????
/*
if(!localStorage.getItem('localLibrary')) {
  populateStorage();
} else {
  setBooks();
}
function populateStorage() {
  localStorage.setItem('localLibrary', JSON.stringify(myLibrary));
  setBooks();
}
function setBooks() {
  let jsonString = localStorage.getItem("localLibrary");
  myLibrary = JSON.parse(jsonString);
  console.log(myLibrary);
  printAllBooks();
}

myLibrary.onchange = populateStorage;

function printAllBooks (){
  for (let i in myLibrary){
    let newBook = new Book(myIndex,myLibrary[i].
      title,myLibrary[i].author,myLibrary[i].read,myLibrary[i].rating);
    myIndex+=1;
  }
}
*/

// BOOK CONSTRUCTOR
function Book(index, title, author, read, rating) {
  this.index = index;
  this.title = title;
  this.author = author;
  this.read = read;
  this.rating = rating;
}

// UPDATE LOG
function updateLog() {
  logBook.textContent = countBooks.toString();
  logRead.textContent = countRead.toString();
  logNotRead.textContent = (countBooks - countRead).toString();
}

// DELETE BOOK
function deleteBook(event) {
  const position = event.target.getAttribute('data-delete');
  const book = document.querySelector(`[data-book='${position}']`);
  const libraryReSelect = document.querySelector('#library');
  console.log(`gonna delete ${position}`);
  // Update Log
  countBooks -= 1;
  if (myLibrary[Number(position)].read === true) {
    countRead -= 1;
  }
  updateLog();
  // Delete
  libraryReSelect.removeChild(book);
  delete myLibrary[Number(position)];
}

// UPDATE SINGLE BOOK
function updateBook(book) {
  const position = book.index.toString();
  console.log(`updating single book: ${position}`);
  const readText = document.querySelector(`[data-read='${position}']`);
  const divStarsBook = document.querySelector(`[data-divStars='${position}']`);
  if (book.read === false) {
    // Read -> UnRead
    readText.textContent = '(Not Read)';
    divStarsBook.textContent = '';
  } else {
    // UnRead -> Read
    readText.textContent = '(Read)';
    for (let i = 0; i < book.rating; i += 1) {
      const aStar = document.createElement('i');
      aStar.classList.add('fa');
      aStar.classList.add('fa-star');
      aStar.classList.add('fa-2x');
      aStar.style.color = 'rgb(143, 104, 54)';
      divStarsBook.appendChild(aStar);
    }
  }
}

// If Unread -> Read: then ask Rating
let askedRating = 1;
function askRating() {
  ratingForm.style.visibility = 'visible';
}
ratingSubmit.addEventListener('click', () => {
  ratingForm.style.visibility = 'hidden';
  currentBook.rating = askedRating;
  updateBook(currentBook);
  console.log(myLibrary);
});

// Toggle Clicked
function changeRead(event) {
  const bookPosition = Number(event.target.getAttribute('data-toggle'));
  const myBook = myLibrary[bookPosition];
  // flipRead
  console.log('my book: ', myBook);
  if (myBook.read === true) {
    myBook.read = false;
    myBook.rating = 0;
    updateBook(myBook);
    countRead -= 1;
  } else {
    myBook.read = true;
    askRating();
    countRead += 1;
  }
  console.log('did flip');
  updateLog();
  console.log('updated ', myLibrary);
  //
  currentBook = myLibrary[bookPosition];
  console.log(`changed read  of  ${bookPosition} to: ${myLibrary[Number(bookPosition)].read}`);
}

// SHOW FORM
btnAdd.addEventListener('click', () => {
  form.style.visibility = 'visible';
  form.classList.add('bubble');
  divStars.style.display = 'block';
});

// SHOW/NOT-SHOW STARS IN BOOK FORM
checkRead.addEventListener('click', () => {
  const isChecked = document.forms.myForm.read.checked;
  if (isChecked) {
    divStars.style.display = 'block';
  } else {
    divStars.style.display = 'none';
    currentRating = 0;
  }
});

// STARS COLOR FUNCTIONALITY
function colorStars(myStars) {
  const arrayStars = [...myStars];
  arrayStars.map((star) => {
    const newStar = star;
    newStar.style.color = '#d0ada7';
    newStar.addEventListener('click', (e) => {
      currentRating = Number(e.target.getAttribute('data-star'));
      askedRating = currentRating;
      arrayStars.map((colorStar) => {
        const newColorStar = colorStar;
        if (Number(colorStar.getAttribute('data-star')) <= currentRating) {
          newColorStar.style.color = '#aa723d';
        } else {
          newColorStar.style.color = 'white';
        }
        return newColorStar;
      });
    });
    return newStar;
  });
}
//
colorStars(stars);
colorStars(ratingStars);
//

// DROPDOWN (ORDER)
function orderBooks(orderType) {
  console.log(`ordering books by: ${orderType}`);
  let usingLibrary = myLibrary.slice();
  if (orderType === 'title' || orderType === 'author') {
    usingLibrary = usingLibrary.sort((a, b) => a[orderType].localeCompare(b[orderType])).slice();
  }
  let i = 0;
  usingLibrary.forEach((book) => {
    if (book !== undefined) {
      console.log(i);
      const divBook = document.querySelector(`[data-book='${book.index.toString()}']`);
      if (orderType === 'date') {
        divBook.style.order = `${book.index}`;
        console.log('book index ', book.index);
      } else if (orderType === 'rating') {
        divBook.style.order = `${5 - book.rating}`;
      } else if (orderType === 'author' || orderType === 'title') {
        divBook.style.order = `${i}`;
      }
      i += 1;
    }
  });
}
dropOptions.forEach((option) => {
  option.addEventListener('click', () => {
    const orderType = option.getAttribute('data-drop');
    orderBooks(orderType);
  });
});

// SHOW READ/NOT-READ BOOKS
const arrayReadButtons = [...readButtons];
arrayReadButtons.map((button) => {
  const newBtn = button;
  button.addEventListener('click', () => {
    const typeButton = button.getAttribute('data-read');
    console.log('type button: ', typeButton);
    myLibrary.forEach((book) => {
      if (book !== undefined) {
        const divBook = document.querySelector(`[data-book='${book.index.toString()}']`);
        if (typeButton === 'read') {
          if (book.read === true) {
            if (showRead === true) {
              divBook.style.display = 'none';
              newBtn.style.backgroundColor = '#e8d6cb';
              newBtn.style.color = '#ad6a6c';
            } else {
              divBook.style.display = 'flex';
              newBtn.style.backgroundColor = '#ad6a6c';
              newBtn.style.color = '#e8d6cb';
            }
          }
        } else if (book.read === false) {
          if (showNotRead === true) {
            divBook.style.display = 'none';
            newBtn.style.backgroundColor = '#e8d6cb';
            newBtn.style.color = '#ad6a6c';
          } else {
            divBook.style.display = 'flex';
            newBtn.style.backgroundColor = '#ad6a6c';
            newBtn.style.color = '#e8d6cb';
          }
        }
      }
    });
    showRead = !showRead;
    showNotRead = !showNotRead;
  });
  return newBtn;
});

// ADD BOOK TO HTML
function makeBook(thisBook) {
  const textTitle = thisBook.title;
  const textAuthor = thisBook.author;
  const hasRead = thisBook.read;
  const starsCreated = thisBook.rating;

  // Div Book
  const book = document.createElement('div');
  book.classList.add('div-book');
  book.setAttribute('data-book', myIndex.toString());
  book.style.display = 'flex';
  book.style.order = `${myIndex.toString()}`;
  console.log('data-book: ', book.getAttribute('data-book'));

  // Div Title Author
  const divTitleAuthor = document.createElement('div');
  divTitleAuthor.classList.add('div-book-title-author');
  // Title
  const divTitle = document.createElement('div');
  const bookTitle = document.createElement('h2');
  bookTitle.classList.add('book-title');
  bookTitle.textContent = textTitle;
  divTitle.appendChild(bookTitle);
  divTitleAuthor.appendChild(divTitle);
  // Author
  const divAuthor = document.createElement('div');
  const bookAuthor = document.createElement('h2');
  bookAuthor.classList.add('book-author');
  bookAuthor.textContent = textAuthor;
  divAuthor.appendChild(bookAuthor);
  divTitleAuthor.appendChild(divAuthor);

  // Div Read Stars
  const divReadStars = document.createElement('div');
  divReadStars.classList.add('div-book-read-stars');
  // Read
  const divRead = document.createElement('div');
  const bookRead = document.createElement('h2');
  bookRead.setAttribute('data-read', myIndex.toString());
  const divStarsCreate = document.createElement('div');
  divStarsCreate.setAttribute('data-divStars', myIndex.toString());
  if (hasRead) {
    bookRead.textContent = '(Read)';
    // Stars
    for (let i = 0; i < starsCreated; i += 1) {
      const aStar = document.createElement('i');
      aStar.classList.add('fa');
      aStar.classList.add('fa-star');
      aStar.classList.add('fa-2x');
      aStar.style.color = '#aa723d';
      divStarsCreate.appendChild(aStar);
    }
  } else {
    bookRead.textContent = '(Not Read)';
  }
  divRead.appendChild(bookRead);
  divReadStars.appendChild(divStarsCreate);
  divReadStars.appendChild(divRead);
  divReadStars.insertBefore(divRead, divReadStars.firstChild);

  // Delete Button
  const divDelete = document.createElement('div');
  divDelete.classList.add('div-book-btnDelete');
  const btnDelete = document.createElement('button');
  btnDelete.classList.add('book-btnDelete');
  btnDelete.textContent = 'X';
  btnDelete.setAttribute('data-delete', myIndex.toString());
  btnDelete.addEventListener('click', deleteBook);
  divDelete.appendChild(btnDelete);

  // Toggle Button
  const divToggle = document.createElement('div');
  divToggle.classList.add('div-book-toggle');
  const labelToggle = document.createElement('label');
  labelToggle.classList.add('label-book-toggle-switch');
  const inputToggle = document.createElement('input');
  inputToggle.setAttribute('type', 'checkbox');
  if (hasRead) {
    inputToggle.checked = true;
  } else {
    inputToggle.checked = false;
  }
  const spanToggle = document.createElement('span');
  spanToggle.classList.add('slider');
  spanToggle.classList.add('round');
  spanToggle.setAttribute('data-toggle', myIndex.toString());
  spanToggle.addEventListener('click', changeRead);
  labelToggle.appendChild(inputToggle);
  labelToggle.appendChild(spanToggle);
  divToggle.appendChild(labelToggle);

  //
  // Append to Book Div
  book.appendChild(divTitleAuthor);
  book.appendChild(divReadStars);
  book.appendChild(divDelete);
  book.appendChild(divToggle);

  // Append Book to Library
  myIndex += 1;
  library.appendChild(book);
}

// ADD BOOK TO LIBRARY
function addBookToLibrary() {
  // Add Book to Array
  const newBook = new Book(myIndex, currentTitle, currentAuthor, currentHasRead, currentRating);
  myLibrary.push(newBook);
  // Add Book to HTML
  makeBook(newBook);
  // Update Log
  countBooks += 1;
  if (newBook.read === true) {
    countRead += 1;
  }
  updateLog();
  console.log(myLibrary);
}

// SUBMIT BOOK FORM
form.addEventListener('submit', (event) => {
  event.preventDefault(); // stop from submition
  currentTitle = document.forms.myForm.title.value;
  currentAuthor = document.forms.myForm.author.value;
  currentHasRead = document.forms.myForm.read.checked;
  console.log(`book: ${currentTitle} ${currentAuthor} ${currentHasRead}`);
  form.style.visibility = 'hidden';
  form.reset();
  form.classList.remove('bubble');
  addBookToLibrary();
});
