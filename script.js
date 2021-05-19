//declare global variables
let card1 = null;
let card2 = null;
let currentCard = null;
let score = 0;
let pairedCards = 0;
let clickingLocked = false;
const images = [ 
  // array containing image urls
  'https://cdn.nba.com/headshots/nba/latest/1040x760/1629029.png',
  'https://cdn.nba.com/headshots/nba/latest/1040x760/201142.png',
  'https://cdn.nba.com/headshots/nba/latest/1040x760/202695.png',
  'https://cdn.nba.com/headshots/nba/latest/1040x760/201935.png',
  'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png',
  'https://cdn.nba.com/headshots/nba/latest/1040x760/203076.png',
  'https://cdn.nba.com/headshots/nba/latest/1040x760/203507.png',
  'https://cdn.nba.com/headshots/nba/latest/1040x760/202710.png',
  'https://cdn.nba.com/headshots/nba/latest/1040x760/203954.png',
  'https://cdn.nba.com/headshots/nba/latest/1040x760/1628369.png',
  'https://cdn.nba.com/headshots/nba/latest/1040x760/203081.png',
  'https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png',
  'https://cdn.nba.com/headshots/nba/latest/1040x760/1629029.png',
  'https://cdn.nba.com/headshots/nba/latest/1040x760/201142.png',
  'https://cdn.nba.com/headshots/nba/latest/1040x760/202695.png',
  'https://cdn.nba.com/headshots/nba/latest/1040x760/201935.png',
  'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png',
  'https://cdn.nba.com/headshots/nba/latest/1040x760/203076.png',
  'https://cdn.nba.com/headshots/nba/latest/1040x760/203507.png',
  'https://cdn.nba.com/headshots/nba/latest/1040x760/202710.png',
  'https://cdn.nba.com/headshots/nba/latest/1040x760/203954.png',
  'https://cdn.nba.com/headshots/nba/latest/1040x760/1628369.png',
  'https://cdn.nba.com/headshots/nba/latest/1040x760/203081.png',
  'https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png'
];

// cache selectors
const gameContainer = document.getElementById("game");
const startGameContainer = document.querySelector("#start-game-container");
const endGameContainer = document.querySelector("#end-game-container")
const startGameBtn = document.querySelector("#start-game");
const restartGameBtn = document.querySelector("#restart-game");
const bestScore = document.querySelector("#best-score");
const gameResult = document.querySelector("#game-result");
const currentScore = document.querySelector("#current-score");

// event listeners
startGameBtn.addEventListener("click", startNewGame);
restartGameBtn.addEventListener("click", restartGame);


// start a new game
function startNewGame() {

  // hide start game button and instructions
  startGameContainer.style.display = 'none';

  // get current best score from local storage
  getBestScore = localStorage.getItem("bestScore") || 0;
  // display current best score
  bestScore.innerText =  `Best Score: ${getBestScore}`;
  currentScore.innerText = `Current Score: ${score}`;
 
  // shuffle array - based on an algorithm called Fisher Yates
  function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }

    return array;
  }

  // shuffle images array
  let shuffledImages = shuffle(images);

  // create a new div for each image in images array
  function createDivsForImages(imagesArray) {
    for (let image of imagesArray) {
      // create a new div
      const newDiv = document.createElement("div");

      // give it a class attribute for the value we are looping over
      newDiv.classList.add(image);

      // call handleCardClick when a div is clicked
      newDiv.addEventListener("click", handleCardClick);

      // append each div to the game container
      gameContainer.append(newDiv);
    }
  }

  // create divs
  createDivsForImages(shuffledImages);

  playMusic();
}

// event handler for clicking on cards
function handleCardClick(e) {
 
  // lock clicking if clickingLocked is true
  if(clickingLocked) {
    return;
  }

  // can't flip an already flipped card
  if (e.target.classList.contains('flipped')) {
    return;
  }

  // set currentCard as the clicked target
  currentCard = e.target;
 
  // set currentCard's background image as the target image url
  currentCard.style.backgroundImage = `url(${currentCard.className})`

  // if card1 and/or card2 has not been selected yet
  if (!card1 || !card2) {

    // track flipped cards by adding new class
    currentCard.classList.add('flipped');

    // set card1
    card1 = card1 || currentCard;
    // set card2
    card2 = card1 === currentCard ? null : currentCard;
  }

  // if card1 and card2 are both selected
  if (card1 && card2) {

    // after 2 cards are selected, lock further clicking
    clickingLocked = true;
    score += 1;
    currentScore.innerText = `Current Score: ${score}`;

    // if both cards are the same
    if (card1.className === card2.className) {

      // increment paired cards by 2
      pairedCards += 2;

      // remove event listeners from those 2 cards;
      card1.removeEventListener("click", handleCardClick);
      card2.removeEventListener("click", handleCardClick);

      // clear card selections
      card1 = null;
      card2 = null;

      // unlock clicking to continue playing
      clickingLocked = false;

      // if cards aren't the same
    } else {
      setTimeout(function() { 

        // no match - flip cards back
        card1.style.backgroundImage = "";
        card2.style.backgroundImage = "";

        // no match - remove flipped class 
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");

        // clear card selections
        card1 = null;
        card2 = null;

        // unlock clicking to continue playing
        clickingLocked = false;
      
      }, 1000);
    }
  }

  callGame();
}

// end game and keep track of score
function callGame() {
  // if all cards are matched
  if (pairedCards === images.length) {
    // get best score from local storage
    getBestScore = JSON.parse(localStorage.getItem("bestScore", score))

    // if score is better than the best score saved in local storage:
    if (score < getBestScore || !getBestScore) {
      // save score as new best score 
      localStorage.setItem("bestScore", score);
      // display game result message
      gameResult.innerText = `Congratulations. New Best Score!!! 
      New Best Score: ${score}`;

      // if score is worse than the best score saved in local storage:
      } else {
        // display game result message
        gameResult.innerText = `You've won the game! Your score is: ${score}`;
      }
    
    // unhide game result container
    endGameContainer.style.display = 'block';
  }
}

// restart game 
function restartGame() {
  // reset score and paired cards to 0
  score = 0;
  pairedCards = 0;

  // hide previous game's results 
  endGameContainer.style.display = 'none';

  // clear out game container
  gameContainer.innerHTML = ""

  // start a new game
  startNewGame();
}

function playMusic() {
  const audioObj = new Audio('https://www.youtube.com/watch?v=bhpV9hqQG7I');
  audioObj.play();
}