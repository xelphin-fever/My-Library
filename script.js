//VARIABLES
//LOG
let logBook = document.querySelector('#log-books-span');
let logRead = document.querySelector('#log-read-span');
let logNotRead = document.querySelector('#log-not-read-span');
let countBooks = 0;
let countRead = 0;
//DROPDOWN
const dropOptions = document.querySelectorAll('.dropdown-option');
//READ/NOT-READ BUTTONS
const readButtons = document.querySelectorAll('.btn-top-right');
let showRead = true;
let showNotRead =true;
//LIBRARY
let library = document.querySelector('#library');
let booksToggle =document.querySelectorAll('.label-book-toggle-switch');
let booksDelete =document.querySelectorAll('.book-btnDelete');
let myBooks = document.querySelectorAll('.div-book');
//FORM
const form = document.querySelector('#div-book-form');
const btnSubmit = document.querySelector('#btn-submit');
const checkRead = document.querySelector('#inp-book-read');
const divStars = document.querySelector('.div-form-book-stars');
const stars = document.querySelectorAll('.form-star ');
//ADD BUTTON
const btnAdd = document.querySelector('#btn-add');
//RATING FORM
const ratingForm = document.querySelector('#div-rating');
const ratingStars = document.querySelectorAll('.rating-star');
const ratingSubmit = document.querySelector('#rating-submit');
//
colorStars(stars);
colorStars(ratingStars);
//
let currentTitle="";
let currentAuthor="";
let currentHasRead=false;
let currentRating=0; //JUST CHANGED
let currentBook;
//LIBRARY
let myLibrary = [
];
//CURRENT INDEX
let myIndex=0;



//BOOK CONSTRUCTOR
function Book(index,title,author,read,rating) {
  this.index=index;
  this.title=title;
  this.author=author;
  this.read=read;
  this.rating=rating;
}

//ADD BOOK TO LIBRARY
function addBookToLibrary() {
  //Add Book to Array
  let newBook = new Book(myIndex,currentTitle,currentAuthor,currentHasRead,currentRating);
  myLibrary.push(newBook);
  //Add Book to HTML
  makeBook(newBook);
  //Update Log
  countBooks+=1;
  if (newBook.read==true){
    countRead+=1;
  }
  updateLog();
  console.log(myLibrary);
}

//DELETE BOOK
function deleteBook(){
  let position = event.target.getAttribute("data-delete");
  let book = document.querySelector(`[data-book='${position}']`);
  let library = document.querySelector('#library');
  console.log("gonna delete "+position);
  //Update Log
  countBooks-=1;
  if (myLibrary[Number(position)].read==true){
    countRead-=1;
  }
  updateLog();
  //Delete
  library.removeChild(book);
  delete myLibrary[Number(position)];
  
}


//CHANGE READ/UNREAD
function flipRead (myBook) {
  console.log("my book: ",myBook);
  if (myBook.read==true){
    myBook.read=false;
    myBook.rating=0;
    updateBook(myBook);
    countRead-=1;
  }
  else{
    myBook.read=true;
    askRating();
    countRead+=1;
  }
  console.log("did flip")
  updateLog();
  console.log("updated ",myLibrary)
}
//Toggle Clicked
function changeRead(event){
  let bookPosition=Number(event.target.getAttribute('data-toggle'));
  flipRead(myLibrary[bookPosition]);
  currentBook= myLibrary[bookPosition];
  console.log("changed read  of "+bookPosition+" to: ",myLibrary[Number(bookPosition)].read);
}
//If Unread -> Read: then ask Rating
let askedRating=1;
function askRating (){
  ratingForm.style.visibility="visible";
}
ratingSubmit.addEventListener("click",() =>{
  ratingForm.style.visibility="hidden";
  currentBook.rating=askedRating;
  updateBook(currentBook);
  console.log(myLibrary);
})



//UPDATE SINGLE BOOK
function updateBook(currentBook){
  let position= currentBook.index.toString();
  console.log("updating single book: "+position)
  let readText = document.querySelector(`[data-read='${position}']`);
  let divStars = document.querySelector(`[data-divStars='${position}']`);
  if (currentBook.read==false){
    //Read -> UnRead
    readText.textContent ="(Not Read)";
    divStars.textContent = "";
  }
  else {
    //UnRead -> Read
    readText.textContent ="(Read)";
    for (let i=0;i<currentBook.rating;i++){
      let aStar=document.createElement('i');
      aStar.classList.add('fa');
      aStar.classList.add('fa-star');
      aStar.classList.add('fa-2x');
      aStar.style.color="rgb(143, 104, 54)";
      divStars.appendChild(aStar);
    }
  }
}


//ADD BOOK BUTTON
btnAdd.addEventListener('click',event => {
  form.style.visibility="visible";
  divStars.style.display="block";
});


//SUBMIT BOOK FORM
form.addEventListener("submit", function(event) {
  event.preventDefault(); //stop from submition
  currentTitle = document.forms["myForm"]["title"].value;
  currentAuthor = document.forms["myForm"]["author"].value;
  currentHasRead = document.forms["myForm"]["read"].checked;
  console.log("book: "+currentTitle+" "+currentAuthor+" "+currentHasRead);
  form.style.visibility="hidden";
  form.reset();
  addBookToLibrary()
})

//SHOW/NOT-SHOW STARS IN BOOK FORM
checkRead.addEventListener("click", function(event){
  let isChecked= document.forms["myForm"]["read"].checked;
  if (isChecked){
    divStars.style.display="block";
  }
  else {
    divStars.style.display="none";
    currentRating=0;
  }
});


//STARS COLOR FUNCTIONALITY
function colorStars (myStars){
  myStars.forEach((star) => {
    star.style.color="gray";
    star.addEventListener('click', function(e) {
      currentRating= Number(e.target.getAttribute('data-star'));
      askedRating=currentRating;
      myStars.forEach((colorStar)=> {
        if (Number(colorStar.getAttribute('data-star'))<=currentRating){
          colorStar.style.color="rgb(143, 104, 54)";
        }
        else {
          colorStar.style.color="white";
        }
      })
    });
  });
}


//UPDATE LOG
function updateLog(){
  logBook.textContent=countBooks.toString();
  logRead.textContent=countRead.toString();
  logNotRead.textContent=(countBooks-countRead).toString();
}

//DROPDOWN (ORDER)
dropOptions.forEach((option) => {
  option.addEventListener('click', () => {
    let orderType = option.getAttribute("data-drop");
    orderBooks(orderType);
  });
});
function orderBooks (orderType){
  console.log("ordering books by: "+orderType);
  let usingLibrary=myLibrary.slice();
  if (orderType=="title" || orderType=="author"){
    usingLibrary= usingLibrary.sort((a,b)=> a[orderType].localeCompare(b[orderType])).slice();
  }
  for (let i in usingLibrary){
    let book =usingLibrary[i];
    let divBook = document.querySelector(`[data-book='${book.index.toString()}']`);
    if (orderType=="date"){
      divBook.style.order =`${book.index}`;
      console.log("book index ",book.index);
    }
    else if (orderType=="rating"){
      divBook.style.order =`${5-book.rating}`;
    }
    else if (orderType=="author" ||orderType=="title"){
      divBook.style.order =`${i}`;
    }
  }
}


//SHOW READ/NOT-READ BOOKS
readButtons.forEach((button) => {
  button.addEventListener("click", () => {
    let typeButton= button.getAttribute("data-read");
    console.log("type button: ",typeButton)
    for (let i in myLibrary){
      let book = myLibrary[i];
      let divBook = document.querySelector(`[data-book='${book.index.toString()}']`);
      if (typeButton=="read"){
        if (book.read==true){
          if (showRead==true){
            divBook.style.display="none";
          }
          else {
            divBook.style.display="flex";
          }
        }
      }
      else{
        if (book.read==false){
          if (showNotRead==true){
            divBook.style.display="none";
          }
          else {
            divBook.style.display="flex";
          }
        }
      }
    }
    showRead= !showRead;
    showNotRead= !showNotRead;
  })
})




//ADD BOOK TO HTML
function makeBook(thisBook) {
  let textTitle= thisBook.title;
  let textAuthor= thisBook.author;
  let hasRead =thisBook.read;
  let stars =thisBook.rating;

  //Div Book
  let book = document.createElement('div');
  book.classList.add('div-book');
  book.setAttribute('data-book', myIndex.toString());
  book.style.display="flex";
  book.style.order=`${myIndex.toString()}`;
  console.log("data-book: ",book.getAttribute('data-book')); 

  //Div Title Author
  let divTitleAuthor= document.createElement('div');
  divTitleAuthor.classList.add('div-book-title-author');
  //Title
  let divTitle= document.createElement('div');
  let bookTitle= document.createElement('h2');
  bookTitle.classList.add('book-title');
  bookTitle.textContent=textTitle;
  divTitle.appendChild(bookTitle);
  divTitleAuthor.appendChild(divTitle);
  //Author
  let divAuthor = document.createElement('div');
  let bookAuthor= document.createElement('h2');
  bookAuthor.classList.add('book-author');
  bookAuthor.textContent=textAuthor;
  divAuthor.appendChild(bookAuthor);
  divTitleAuthor.appendChild(divAuthor);

  //Div Read Stars
  let divReadStars= document.createElement('div');
  divReadStars.classList.add('div-book-read-stars');
  //Read
  let divRead= document.createElement('div');
  let bookRead= document.createElement('h2');
  bookRead.setAttribute("data-read",myIndex.toString());
  let divStars= document.createElement('div');
  divStars.setAttribute("data-divStars",myIndex.toString());
  if (hasRead){
    bookRead.textContent = "(Read)";
    //Stars
    for (let i=0;i<stars;i++){
      let aStar=document.createElement('i');
      aStar.classList.add('fa');
      aStar.classList.add('fa-star');
      aStar.classList.add('fa-2x');
      aStar.style.color="rgb(143, 104, 54)";
      divStars.appendChild(aStar);
    }
  }
  else {
    bookRead.textContent ="(Not Read)";
  }
  divRead.appendChild(bookRead);
  divReadStars.appendChild(divStars);
  divReadStars.appendChild(divRead);
  divReadStars.insertBefore(divRead, divReadStars.firstChild);

  //Delete Button
  let divDelete = document.createElement('div');
  divDelete.classList.add('div-book-btnDelete');
  let btnDelete = document.createElement('button');
  btnDelete.classList.add('book-btnDelete');
  btnDelete.textContent ="X"
  btnDelete.setAttribute('data-delete', myIndex.toString());
  btnDelete.addEventListener('click',deleteBook);
  divDelete.appendChild(btnDelete);

  //Toggle Button
  let divToggle = document.createElement('div');
  divToggle.classList.add('div-book-toggle');
  let labelToggle = document.createElement('label');
  labelToggle.classList.add('label-book-toggle-switch');
  let inputToggle = document.createElement('input');
  inputToggle.setAttribute("type","checkbox");
  if (hasRead){
    inputToggle.checked=true;
  }
  else {
    inputToggle.checked=false;
  }
  let spanToggle = document.createElement('span');
  spanToggle.classList.add('slider');
  spanToggle.classList.add('round');
  spanToggle.setAttribute('data-toggle', myIndex.toString());
  spanToggle.addEventListener('click',changeRead);
  labelToggle.appendChild(inputToggle);
  labelToggle.appendChild(spanToggle);
  divToggle.appendChild(labelToggle);

  //
  //Append to Book Div
  book.appendChild(divTitleAuthor);
  book.appendChild(divReadStars);
  book.appendChild(divDelete);
  book.appendChild(divToggle);

  //Append Book to Library
  myIndex+=1;
  library.appendChild(book);

  //Update
  myBooks = document.querySelectorAll('.div-book');

}

