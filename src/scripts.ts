let moveCount = 0;
let points = 0;
let previousCard: number;
// ID for comparing cards
let currentlySelectedCardValue: string;

const cards = document.querySelectorAll<HTMLDivElement>(".js-cards");
const startButton = document.querySelector<HTMLButtonElement>(".js-button-start")
const cardContainer = document.querySelector<HTMLDivElement>(".cardContainer");
const endButton = document.querySelector<HTMLButtonElement>(".js-button-end")
const timer = document.querySelector<HTMLTimeElement>(".js-timer")
const showPoints = document.querySelector<HTMLTitleElement>(".js-points")
const moves = document.querySelector<HTMLDivElement>(".js-nav-moves")

let intervalId: NodeJS.Timer;
const initializeGame = () => {
    // ---General reset ---//
    const arrayOfCards: string[] = ["A", "A", "K", "K", "Q", "Q"];
    const cardCount = arrayOfCards.length;
    moveCount = 0;
    points = 0;
    moves.style.color = ""
    showPoints.innerHTML = `${points}/3 points`;
    moves.firstElementChild.innerHTML = `Moves: ${moveCount}/10`;
    // ----------- TIMER ------------->
    let startTime = Date.now();
    let minutes = 0;
    intervalId = setInterval(()=>{
        let seconds = Math.floor((Date.now()-startTime)/1000);
        if(seconds >= 60){
            minutes += 1;
            startTime += 60000;
        }
        let printSeconds = "";
        let printMinutes = "";
        if(seconds < 10){
            printSeconds = `0${seconds}`
        }else{
            printSeconds = `${seconds}`;
        }
        if(minutes < 10){
            printMinutes = `0${minutes}`
        }
        else{
            printMinutes = `${minutes}`;
        }
        timer.innerHTML = `${printMinutes}:${printSeconds}`
    }, 100)
    
    // --------- game container display property ------- //
    cardContainer.style.display = "flex";
    startButton.parentElement.style.display = "none";
    endButton.parentElement.style.display = "none";
    // ------------------ card shuffling ---------------- //
    for(let i=0; i<cardCount; i++){
        cards[i].firstElementChild.innerHTML = "";
        let randomCardIndex = Math.floor(Math.random()*arrayOfCards.length)
        let randomCard = arrayOfCards[randomCardIndex];
        cards[i].setAttribute("id", randomCard)
        arrayOfCards.splice(randomCardIndex, 1)
        // cards color reset
        cards[i].style.backgroundColor = "";
        cards[i].style.boxShadow = "";
    }
}
// ------- EVENT listeners for START and END buttons ----- //
startButton.addEventListener("click", initializeGame);
endButton.addEventListener("click", initializeGame);

// ----- EVENT listener for card related events -------- //

for(let i=0; i<cards.length; i++){
    cards[i].addEventListener("click", () => handleCardClick(i));
}
const handleCardClick = (i: number) => {
    console.log(`This card : ${i}`)
    console.log(`Previous card : ${previousCard}`)
    // ---------------- Handle selecting the same card twice -------- //
    if(cards[i] === cards[previousCard])return;
    // ------------ Handle selecting the first card on each turn ------------- //
    if(moveCount % 2 === 0){
            previousCard = i;
            currentlySelectedCardValue = cards[i].getAttribute("id");
            cards[i].firstElementChild.innerHTML = cards[i].getAttribute("id");
            cards[i].style.backgroundColor = "#55555aac";
            cards[i].style.boxShadow = "5px 5px 10px #646467";
            moveCount += 1;
    // ------------ Handle selecting the second card on each turn ------------- //      
    // --- If cards 1 and 2 are not the same, show value and after timeout reset values to "" --- //  
    }
    else{
        if(cards[i].getAttribute("id") !== currentlySelectedCardValue){
            cards[i].firstElementChild.innerHTML = cards[i].getAttribute("id");
            cards[i].style.backgroundColor = "#55555aac";
            cards[i].style.boxShadow = "5px 5px 10px #646467";
            currentlySelectedCardValue = "";
            // Hack for not letting to click next card while timeout is in progress
            for(let i=0; i<cards.length; i++){
                cards[i].style.pointerEvents = "none"
            }
            setTimeout(() => {
                cards[i].firstElementChild.innerHTML = "";
                cards[i].style.backgroundColor = "";
                cards[i].style.boxShadow = "";
                cards[previousCard].firstElementChild.innerHTML = "";
                cards[previousCard].style.backgroundColor = "";
                cards[previousCard].style.boxShadow = "";
                for(let i=0; i<cards.length; i++){
                    cards[i].style.pointerEvents = "auto"
                }
                //previousCard has previous value and 'same card selecting' handler works incorrectly without reset
                previousCard = 99;
            }, 600)
            // ------ If cards 1 and 2 are the same, show value and add point "" ------- //   
        }
        else{
            cards[i].firstElementChild.innerHTML = cards[i].getAttribute("id");
            cards[i].style.backgroundColor = "#55555aac";
            cards[i].style.boxShadow = "5px 5px 10px #646467";
            points += 1;
            showPoints.innerHTML = `${points}/3 points`;
        }
        moveCount += 1;
    }
    // ---------------------- Show move count ---------------------- //
    moves.firstElementChild.innerHTML = `Moves: ${moveCount}/10`;
    // ---------------------- Warn about move count ---------------------- //
    if(moveCount===6){
        moves.style.color = "red"
    }
    // -------------------- WIN case --------------------- //  
    if(points === 3){
        setTimeout(() => {
            cardContainer.style.display = "none";
            endButton.parentElement.style.display = "flex";
            endButton.innerHTML = `You finished the game in ${moveCount} moves and ${timer.innerHTML}! Try again?`
        }, 600)
        clearInterval(intervalId);
    }
    // -------------------- LOST case --------------------- //  
    else if(moveCount === 10){
        setTimeout(() => {
            cardContainer.style.display = "none";
            endButton.parentElement.style.display = "flex";
            endButton.innerHTML = `You lost! You got ${showPoints.innerHTML} in ${timer.innerHTML} . Try again?`
        }, 600)
        clearInterval(intervalId);
    }
}


