class Media {
  constructor(title) {
    this._title = title;
    this._isCheckedOut = false;
    this._ratings = [];
  }

  //GETTERS

  get title() {
    return this._title;
  }
  get isCheckedOut() {
    return this._isCheckedOut;
  }
  get ratings() {
    return this._ratings;
  }

  //METHODS

  addRating(rate) {
    this._ratings.push(rate);
  }

  toggleCheckOutStatus() {
    if (this._isCheckedOut) {
      this._isCheckedOut = false;
    } else {
      this._isCheckedOut = true;
    }
  }

  reducer(accumulator, currentValue) {
    return accumulator + currentValue;
  }

  getAverageRating() {
    return (
      this._ratings.reduce((currentSum, rating) => currentSum + rating, 0) /
      this._ratings.length
    );
  }
}

class Book extends Media {
  constructor(title, author, pages) {
    super(title);
    this._author = author;
    this._pages = pages;
  }

  //GETTERS

  get pages() {
    return this._pages;
  }
  get author() {
    return this._author;
  }
}

class CD extends Media {
  constructor(title, artist, songs) {
    super(title);
    this._artist = artist;
    this._songs = songs;
  }

  //GETTERS

  get artist() {
    return this._artist;
  }
  get songs() {
    return this._songs;
  }
}

class Movie extends Media {
  constructor(title, director, runTime) {
    super(title);
    this._director = director;
    this._runTime = runTime;
  }

  //GETTERS

  get director() {
    return this._director;
  }
  get runTime() {
    return this._runTime;
  }
}

const soul = [
  "Into The World",
  "Mellow",
  "Riha",
  "Edge of Desire",
  "This Town",
  "Be My Mistake",
  "Everything",
  "Falling In Love",
  "Baarishein",
  "Three Small Words",
  "Affection",
  "102",
  "Sweet",
  "Fallen",
  "Lost In You",
  "Dear Winter",
  "Turning Out",
  "You And Me",
  "You And I",
  "Summer Love",
  "Weak",
  "Summer Love",
  "Somebody Else",
  "The Scientist",
  "Can't Help Falling In Love",
  "Fly Me To The Moon",
  "Dekha Hazaron Dafa",
  "Breadcrumbs",
  "I Belong To You",
  "Demons",
  "You're All I Want",
];
const book1 = new Book("Harry Potter", "JK Rowling", 200);
const cD1 = new CD("Soul Symphonies", "Yogesh Pant", soul);
const dieHard = new Movie("Die Hard", "Anonymous", 120);

// cheching for add rating and average

book1.addRating(4);
book1.addRating(5);
cD1.addRating(5);
cD1.addRating(5);
dieHard.addRating(3);
dieHard.addRating(5);
console.log(book1.getAverageRating());
console.log(cD1.getAverageRating());
console.log(dieHard.getAverageRating());

//checking for toggleStatus

console.log(book1.isCheckedOut);
console.log(cD1.isCheckedOut);
console.log(dieHard.isCheckedOut);
book1.toggleCheckOutStatus();
cD1.toggleCheckOutStatus();
dieHard.toggleCheckOutStatus();
console.log(book1.isCheckedOut);
console.log(cD1.isCheckedOut);
console.log(dieHard.isCheckedOut);

//checking for overall objects

console.log(book1);
console.log(cD1);
console.log(dieHard);
