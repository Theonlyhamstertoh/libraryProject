
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

// the book card constructor
let bookCount = 0; 
class Book {
    constructor(title, author, page, readOrNot) {

        this.title = title;
        this.author = author;
        this.page = page;
        if(readOrNot === true) {
            this.readOrNot = 'readYes'; 
        } else {
            this.readOrNot = 'readNo'
        }
        this.count = bookCount;
        bookCount++; //the book order to be able to sort newest or oldest


        //the html Markup to quickly create the cards without using createElement() 1000 times...
        this.htmlMarkup = `
            <div data-index='${this.count}' class='bookCards'>
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
                </div>
            </div>`
        this.card = document.createRange().createContextualFragment(this.htmlMarkup);
        library.appendChild(this.card);

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



//create and add book to library
function addBookToLibrary() {
    let book = new Book(title.value, author.value, page.value, readOrNot.checked);
    myLibrary.push(book);
    console.log(cards)
    console.log(myLibrary)
}


//delete book from DOM and library
function deleteCard(e) {
    //remove from DOM 
    library.removeChild(e.path[2]);

    //remove from myLibrary array
    const targetIndex = e.path[2].dataset.index
    myLibrary.splice(targetIndex, 1)
    
}




let currentElem = null;
library.addEventListener('mouseover', (e) => {
    console.log(true, 'related', e.relatedTarget.className, 'target', e.target.className)
    e.target.style.background = 'pink'


}, true)


    


library.addEventListener('mouseout', (e) => {
    e.target.style.background = ''
    console.log(false,'target', e.target.className,  'related', e.relatedTarget.className, )
}, false)

// detects if any card is on hover mode or not and show icons
for(let i = 0; i < cards.length; i++) {

    cards[i].addEventListener('mouseenter', (e) => {
        console.log('yes')
        e.target.querySelector('.cardPopUp').style.display = 'block'
    })

    cards[i].addEventListener('mouseleave', (e) => {
        console.log('no')
        e.target.querySelector('.cardPopUp').style.display = 'none';
    })
}

const removeCard = document.querySelectorAll('.delete');
for(let i = 0; i < removeCard.length; i++) {
    removeCard[i].addEventListener('click', deleteCard);

}

