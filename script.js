
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
        this.line = this.containerDiv.querySelector('.line');
        this.readIcon = this.containerDiv.querySelector('img');
        this.readIcon.style.display = 'none';

        if(this.readOrNot === 'readYes') {
            this.readIcon.style.display = 'block'
            this.line.style.marginRight = '33px'; 
        } else {
            this.readIcon.style.display = 'none';
            this.line.style.marginRight = '15px';

        }
        



        this.delete.addEventListener('click', deleteCard);
        this.editing.addEventListener('click', editCard);
        this.cardRead.addEventListener('click', cardRead);
        
        bookStatistics()
        this.toLocalStorage();
        

    }    

      

    htmlMarkup() {
        return `
        <div class='upper'>
            <div class='bookTitle'>${this.title}</div>
            <div class='smallText'>By ${this.author}</div>
            <div class='bookTotalpage smallText'>${this.page} pages</div>
        </div>
        <div class='line'></div>

        <img class='readIconInCard' src='images/totalRead.svg' alt='green check mark'>
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
        this.readOrNot = readOrNot.checked;
        console.log(this.readOrNot)
        this.bookRead();

        // }
        //update the data stored in the object;
        this.title = title.value;
        this.author = author.value;
        this.page = Number(page.value);

        //update the HTML Values
        this.bookTitle.textContent = title.value;
        this.bookAuthor.textContent = 'By ' + author.value;
        this.bookpage.textContent = Number(page.value) + ' pages';
        this.cardRead.className = `icons ${this.readOrNot}`


        this.toLocalStorage();
    }


    bookRead() {        
        console.log(this.readIcon)
        if(this.readOrNot === 'readYes') {
            this.readOrNot = 'readNo';
            this.readIcon.style.display = 'none'
            this.line.style.marginRight = '15px';
            readCount--
            bookStatistics()
            return this.cardRead.className = 'icons readNo';
        } else if(this.readOrNot === 'readNo'){
            this.readOrNot = 'readYes';
            this.line.style.marginRight = '30px';
            this.readIcon.style.display = 'block';
            readCount++
            bookStatistics()
            return this.cardRead.className = 'icons readYes'; 
        }
        this.toLocalStorage();
    }

    toLocalStorage() {
        localStorage.setItem('books', JSON.stringify(myLibrary))
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
    myLibrary[e.path[2].dataset.index].bookRead();
}

//store the card that is being edited
let beingEdit = null;
// brings back the form information to allow editing
function editCard(e) {
    this.editCardInfo = myLibrary[e.path[2].dataset.index];
    
    title.value = this.editCardInfo.title;
    author.value = this.editCardInfo.author;
    page.value = this.editCardInfo.page;
    console.log(this.editCardInfo.readOrNot)
    readOrNot.checked = this.editCardInfo.readOrNot === 'readYes' ? true : false;

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
    } else {
            let book = new Book(title.value, author.value, page.value, readOrNot.checked);
            myLibrary.push(book);
         
            readOrNot.checked = false;
        
      

    }
 
    //resets afterwards
    title.value = '';
    author.value = '';
    page.value = '';
    readOrNot.checked = false;

   


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
    this.toLocalStorage();
    
}

/*           bookStats          */
bookStatistics(); // run it once first
function bookStatistics() {
    totalBooks.textContent =  cards.length;
    totalPages.textContent = pages; 
    totalRead.textContent = readCount;
}







