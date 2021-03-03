
const title = document.getElementById('title')
const author = document.getElementById('author')
const page = document.getElementById('page')
const readOrNot = document.getElementById('readOrNot')
const image = document.getElementById('image');
const submitBookInfo = document.getElementById('submitBookInfo');
const library = document.querySelector('.library');
const cards = document.getElementsByClassName('bookCards');
const cardPopUp = document.querySelector('.cardPopUp');

//form variables
const formButton = document.querySelector('.formButton');
const form = document.querySelector('.form')
const closeForm = document.querySelector('.close');

//bookStats
const bookStats = document.querySelector('.bookStats');
const totalBooks = document.getElementById('totalBooks');
const totalPages = document.getElementById('totalPages');
const totalRead = document.getElementById('totalRead');

/*                 FORMS                */

// closes pop up form
closeForm.addEventListener('click', () => {
    form.classList.remove('fadeIn');
    form.classList.add('fadeOut');

    // when fadeOut ends, it removes the class
    form.addEventListener('animationend', () => {form.classList.remove('fadeOut')})
});

// opens pop up form
formButton.addEventListener('click', () => {
    title.value = '';
    author.value = '';
    page.value = '';
    readOrNot.checked = false;
    if(form.classList.contains('fadeOut')) { 
        form.classList.remove('fadeOut')
    }
    form.classList.add('fadeIn')

});

// adds the form information and convert to a bookCard
submitBookInfo.addEventListener('click', addBookToLibrary)




/*                 Book and Library                */

//book array library
let myLibrary =[];


let pages = 0;
let bookCount = 0; 
let readCount = 0;
// the book card constructor
class Book {
    constructor(title, author, page, readOrNot) {

        this.title = title;
        this.author = author;
        this.page = Number(page);
        if(readOrNot === true) {
            this.readOrNot = 'readYes'; 
            readCount++;
        } else {
            this.readOrNot = 'readNo'
        }
        this.count = bookCount;
        pages += parseInt(this.page);
        bookCount++; //the book order to be able to sort newest or oldest

        this.containerDiv = document.createElement('div');
        this.containerDiv.dataset.index = this.count;
        this.containerDiv.classList.add('bookCards');
        //the html Markup to quickly create the cards without using createElement() 1000 times...
        this.newCard = document.createRange().createContextualFragment(this.htmlMarkup());

    
        //shows icons or unshow
        this.containerDiv.addEventListener('mouseenter', (e) => {
            e.target.querySelector('.cardPopUp').style.display = 'block';
            
        })
    
        this.containerDiv.addEventListener('mouseleave', (e) => {
            e.target.querySelector('.cardPopUp').style.display = 'none';
        })
       


        //appends first the container which allows me to add a EventListener
        library.appendChild(this.containerDiv);
        //then append the htmlMarkUp into the container
        this.containerDiv.appendChild(this.newCard)
        //query select the icon from the container then add event listener so that all dynamically created cards have it.


        this.containerDiv.appendChild(this.newCard)
        this.delete = this.containerDiv.querySelector('.icons.delete');
        this.editing = this.containerDiv.querySelector('.icons.edit');
        this.cardRead = this.containerDiv.querySelector(`.icons.${this.readOrNot}`);
     
        


        //query select the icon from the container then add event listener so that all dynamically created cards have it.
        this.delete.addEventListener('click', deleteCard);
        this.editing.addEventListener('click', editCard);
        this.cardRead.addEventListener('click', cardRead);
        
        bookStatistics()
    }    

      

    htmlMarkup() {
        return `
        <div class='upper'>
            <div class='bookTitle'>${this.title}</div>
            <div class='smallText'>By ${this.author}</div>
            <div class='bookTotalpage smallText'>${this.page} pages</div>
        </div>
        <div class='line'></div>
    
        <!-- icon popup on bookCard hover -->
        <div class='cardPopUp'>
            <input type='image' class='icons ${this.readOrNot}' src='images/book.svg'>
            <input type='image' class='icons edit' src='images/edit.svg'>
            <input type='image' class='icons delete' src='images/x.svg'>
        </div>`
    }

    edit() {
        this.bookTitle = this.containerDiv.querySelector('.bookTitle')
        this.bookAuthor = this.containerDiv.querySelector('.smallText')
        this.bookpage = this.containerDiv.querySelector('.bookTotalpage.smallText')


        if(this.readOrNot === true) {
            this.readOrNot = 'readYes'; 
            readCount++;
        } else {
            this.readOrNot = 'readNo'
        }

        //update the data stored in the object;
        this.title = title.value;
        this.author = author.value;
        this.page = Number(page.value);

        //update the HTML Values
        this.bookTitle.textContent = title.value;
        this.bookAuthor.textContent = author.value;
        this.bookpage.textContent = Number(page.value) + ' pages';
        console.log(this.bookTitle)
        // this.containerDiv.innerHTML = this.htmlMarkup();
    }

}

//template book cards
myLibrary.push(
    new Book('The Obstacle is the Way', 'Ryan Holiday', '201', false),
    new Book('AntiFragile', 'Nassim Nicholas Taleb', '518', false),
    new Book('Outliers', 'Malcolm Gladwell', '250', true),
    new Book('Tools of Titan', 'Tim Ferriss', '618', true),
    new Book('Meditation', 'Marcus Aurelius', '190', true),
    new Book('Ego Is The Enemy', 'Ryan Holiday', '256', true))
  

//changes the books actually read count
function cardRead(e) {
    console.log(e.target.className)
    if(e.target.className === 'icons readYes') {
        console.log('readNO')
        readCount--;
        bookStatistics()
        return e.target.className = 'icons readNo';
    } else if(e.target.className === 'icons readNo'){
        console.log('READYES')
        readCount++
        bookStatistics()
        return e.target.className = 'icons readYes'; 
    }
}

//store the card that is being edited
let beingEdit = null;
// brings back the form information to allow editing
function editCard(e) {
    this.editCardInfo = myLibrary[e.path[2].dataset.index];
    title.value = this.editCardInfo.title;
    author.value = this.editCardInfo.author;
    page.value = this.editCardInfo.page;
    readOrNot.checked = this.editCardInfo.readOrNot;
    submitBookInfo.value = 'edit book';
    beingEdit = this.editCardInfo;
    form.classList.add('fadeIn')

}



//create and add book to library
function addBookToLibrary() {
    if(title.value === '' || author.value === '' || page.value==='') {
        alert('please input all values')
        return;
    }

    if(beingEdit !== null) {
        beingEdit.edit();
        beingEdit = null;

        //form added to close 
        form.classList.remove('fadeIn');
        form.classList.add('fadeOut');
        form.addEventListener('animationend', () => {form.classList.remove('fadeOut')})
        title.value = '';
        author.value = '';
        page.value = '';
        readOrNot.checked = false;
    } else {
            let book = new Book(title.value, author.value, page.value, readOrNot.checked);
            myLibrary.push(book);
            title.value = '';
            author.value = '';
            page.value = '';
            readOrNot.checked = false;
        
      

    }
       

    
    

   


}


//delete book from DOM and library
function deleteCard(e) {
    //get the targetIndex
    const targetIndex = e.path[2];

    //remove from DOM 
    library.removeChild(targetIndex);

    //remove from myLibrary array
    myLibrary.filter((el, i) => {
        if(i === Number(targetIndex.dataset.index)) {
            pages -= parseInt(el.page);
            if(el.readOrNot === 'readYes') {return readCount--}
            return myLibrary[i] = null;
        } 
    }); 
    bookStatistics()

    
}

/*           bookStats          */
bookStatistics(); // run it once first
function bookStatistics() {
    totalBooks.textContent =  cards.length;
    totalPages.textContent = pages; 
    totalRead.textContent = readCount;
}







