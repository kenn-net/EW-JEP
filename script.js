var you;
var yourScore=0;
var opponent;
var opponentScore=0;

var choices = ["rock", "paper", "scissors"];
var discardedCards = [];
var yourCard;
var opponentCard;

// Create a deck of 45 cards with 15 of each choice
var deck = [];
for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 15; j++) {
        deck.push(choices[i]);
    }
}

// Shuffle the deck
deck.sort(() => Math.random() - 0.5);

// Select 15 random cards from the deck for the playing phase
var playingCards = deck.slice(0, 15);


// Deal 5 cards to each player
var yourHand = playingCards.slice(0, 5);
var opponentHand = playingCards.slice(5, 10);

// Bale rock beats scissors, scissors beat paper, paper beats rock ayun
var game_rules = {
    "rock": "scissors",
    "scissors": "paper",
    "paper": "rock"
}

window.onload = function(){
    for (let i = 0; i<3; i++){
        let choice = document.createElement("img");
        choice.id = choices[i];
        choice.src = choices[i] + ".png";
        choice.addEventListener("click", selectChoice);
        document.getElementById("choices").append(choice);
    }

    // Display the deck
    displayDeck();
    updateStatusBar();

    // Get the button element
    var discardReplaceButton = document.getElementById("discard-replace");

    // Add an event listener to the button
    discardReplaceButton.addEventListener("click", discardAndReplace);

    // Enable the button
    discardReplaceButton.disabled = false;
}

function selectChoice(){
    // Check if there are cards left to play
    if (yourHand.length > 0 && opponentHand.length > 0) {
        // Get the player's choice
        yourCard = this.id; // Player clicks on an image element with the id of the chosen card

        // Check if the chosen card is in the player's hand
        if (!yourHand.includes(yourCard)) {
            alert("You can't play that card. It's not in your hand.");
            return;
        }
        // Remove the chosen card from the player's hand
        var index = yourHand.indexOf(yourCard);
        if (index > -1) {
            yourHand.splice(index, 1);
            discardedCards.push(yourCard); // Add the discarded card to the discardedCards array
        }

        // Play the next card from the opponent's hand
        opponentCard = opponentHand.shift();
        discardedCards.push(opponentCard); // Add the discarded card to the discardedCards array

        document.getElementById("your-choice").src = yourCard + ".png";
        document.getElementById("opponent-choice").src = opponentCard + ".png";

        // check winner
        if (yourCard === opponentCard) {
            // It's a tie, no score change
        } else if (game_rules[yourCard] === opponentCard) {
            yourScore += 1;
        } else {
            opponentScore += 1;
        }

        document.getElementById("your-score").innerText = yourScore;
        document.getElementById("opponent-score").innerText = opponentScore;
    } else {
        // No more cards to play
        alert("The game is over!");
    }
    displayDeck()
    updateStatusBar();
    checkWinner();
}

function displayDeck() {
    // Clear the current deck display
    var deckElement = document.getElementById("deck");
    var yourDeckElement = document.getElementById("your-deck");
    var opponentDeckElement = document.getElementById("opponent-deck");
    while (deckElement.firstChild) {
        deckElement.removeChild(deckElement.firstChild);
    }
    while (yourDeckElement.firstChild) {
        yourDeckElement.removeChild(yourDeckElement.firstChild);
    }
    while (opponentDeckElement.firstChild) {
        opponentDeckElement.removeChild(opponentDeckElement.firstChild);
    }

    // Create a new array of remaining cards
    var remainingCards = [...playingCards]; // Copy the playingCards array

    // Remove the discarded cards from the remainingCards array
    for (let i = 0; i < discardedCards.length; i++) {
        let index = remainingCards.indexOf(discardedCards[i]);
        if (index > -1) {
            remainingCards.splice(index, 1);
        }
    }

    // Sort the remaining cards
    remainingCards.sort();

    // Display each card in the sorted deck
    for (let i = 0; i < remainingCards.length; i++) {
        let card = document.createElement("img");
        card.src = remainingCards[i] + ".png";
        deckElement.append(card);
    }

    // Display each card in your deck
    for (let i = 0; i < yourHand.length; i++) {
        let card = document.createElement("img");
        card.src = yourHand[i] + ".png";
        yourDeckElement.append(card);
    }

    // Display each card in opponent's deck
    for (let i = 0; i < opponentHand.length; i++) {
        let card = document.createElement("img");
        card.src = opponentHand[i] + ".png";
        opponentDeckElement.append(card);
    }
}

function updateStatusBar() {
    var statusBar = document.getElementById("status-bar");

    // Create a new array of remaining cards
    var remainingCards = [...playingCards]; // Copy the playingCards array

    // Remove the discarded cards from the remainingCards array
    for (let i = 0; i < discardedCards.length; i++) {
        let index = remainingCards.indexOf(discardedCards[i]);
        if (index > -1) {
            remainingCards.splice(index, 1);
        }
    }

    // Count the number of each card type in the remainingCards array
    var rockCount = remainingCards.filter(card => card === "rock").length;
    var paperCount = remainingCards.filter(card => card === "paper").length;
    var scissorsCount = remainingCards.filter(card => card === "scissors").length;

    // Update the status bar
    statusBar.textContent = "Rock: " + rockCount + ", Paper: " + paperCount + ", Scissors: " + scissorsCount;
}

function discardAndReplace() {
    // Create a new array of remaining cards
    var remainingCards = [...playingCards]; // Copy the playingCards array

    // Remove the discarded cards from the remainingCards array
    for (let i = 0; i < discardedCards.length; i++) {
        let index = remainingCards.indexOf(discardedCards[i]);
        if (index > -1) {
            remainingCards.splice(index, 1);
        }
    }

     // Check if there are enough cards left in the deck
     if (remainingCards.length >= 5) {
        // Discard the current hand
        discardedCards.push(...yourHand);
        yourHand = [];

        // Create a new array of remaining cards excluding the opponent's hand
        var remainingCardsExcludingOpponent = remainingCards.filter(card => !opponentHand.includes(card));

        // Shuffle the remaining cards
        remainingCardsExcludingOpponent.sort(() => Math.random() - 0.5);

        // Draw 5 new cards from the deck
        yourHand = remainingCardsExcludingOpponent.slice(0, 5);

        // Remove the new hand cards from the remaining cards
        remainingCards = remainingCards.filter(card => !yourHand.includes(card));

        // Update the display
        displayDeck();
        updateStatusBar();
    } else {
        // No more cards to play
        alert("The game is over!");
    }
}

function checkWinner() {
    // No more cards to play
    if (yourHand.length === 0 && opponentHand.length === 0) {
        if (yourScore > opponentScore) {
            alert("Congratulations! You won the game! Pogchamp");
        } else if (yourScore < opponentScore) {
            alert("Oh no! You lost the game. Skill issue bro. gitgud.");
        } else {
            alert("The game is a tie!");
        }
    }
}






