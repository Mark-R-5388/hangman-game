// require('@babel/polyfill')
import '@babel/polyfill'
// import HangMan from './hangman'
import getPuzzle from './requests'

const puzzleEl = document.querySelector('#puzzle')
const guessesEl = document.querySelector('#guesses')
let game1

// Key Click Event
window.addEventListener('keypress', (e) => {
  const guess = String.fromCharCode(e.charCode)
  game1.makeGuess(guess)
  render()
})

//render function
const render = () => {
  puzzleEl.innerHTML = ''
  guessesEl.textContent = game1.statusMessage

  game1.puzzle.split('').forEach((letter) => {
    const spanEl = document.createElement('span')
    spanEl.textContent = letter
    puzzleEl.appendChild(spanEl)
  })
}

//start game
const startGame = async () => {
  const puzzle = await getPuzzle('2')

  game1 = new HangMan(puzzle, 5)

  render()
}

// Constructor Function
export class HangMan {
  constructor(word, remainingGuesses) {
    this.word = word.toLowerCase().split('')
    this.remainingGuesses = remainingGuesses
    this.guessedLetters = []
    this.status = 'playing'
  }
  // Status Method
  calculateStatus() {
    const finished = this.word.every(
      (letter) => this.guessedLetters.includes(letter) || letter === ' '
    )
    //Status if failed
    if (this.remainingGuesses === 0) {
      this.status = 'failed'
    } else if (finished) {
      this.status = 'finished'
    } else {
      this.status = 'playing'
    }
  }

  //Status Message
  get statusMessage() {
    if (this.status === 'playing') {
      return `Guesses left: ${this.remainingGuesses}`
    } else if (this.status === 'failed') {
      return `Nice try! The word was "${this.word.join('')}"`
    } else {
      return 'Great Work! You guessed the word!'
    }
  }

  // Puzzle Reveal
  get puzzle() {
    let puzzle = ''

    this.word.forEach((letter) => {
      if (this.guessedLetters.includes(letter) || letter === ' ') {
        puzzle += letter
      } else {
        puzzle += '*'
      }
    })
    return puzzle
  }

  // Guess Handler
  makeGuess(guess) {
    guess = guess.toLowerCase()
    const isUnique = !this.guessedLetters.includes(guess)
    const isBadGuess = !this.word.includes(guess)

    if (this.status !== 'playing') {
      return
    }

    //Is the Letter Unique
    if (isUnique) {
      this.guessedLetters.push(guess)
    }

    //Is the letter a badguess and unique
    if (isUnique && isBadGuess) {
      this.remainingGuesses--
    }

    this.calculateStatus()
  }
}

document.querySelector('#reset').addEventListener('click', startGame)

startGame()
