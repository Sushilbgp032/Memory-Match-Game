const gameGrid = document.getElementById('gameGrid');
const movesCounter = document.getElementById('moves');
const timerEl = document.getElementById('timer');

let cardsArray = ['🍎','🍌','🍒','🍇','🍉','🥝','🍍','🍓'];
let cardColors = ['#ff6666','#ffd666','#ff66ff','#66ccff','#ff9966','#66ff66','#ffcc66','#ff99cc'];
let gameCards = [...cardsArray, ...cardsArray]; 
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let time = 0;
let timerInterval = null;
let matchedPairs = 0;

// Function to play beep sound
function playSound(frequency, duration=150) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = frequency;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration/1000);
}

// Shuffle array
function shuffle(array){
    for(let i=array.length-1;i>0;i--){
        let j = Math.floor(Math.random()*(i+1));
        [array[i],array[j]]=[array[j],array[i]];
    }
    return array;
}

// Initialize game
function initGame(){
    gameGrid.innerHTML='';
    gameCards = shuffle(gameCards);
    moves=0;
    time=0;
    matchedPairs=0;
    movesCounter.textContent = moves;
    timerEl.textContent='0:00';
    firstCard=null;
    secondCard=null;
    lockBoard=false;
    clearInterval(timerInterval);

    gameCards.forEach((item,index)=>{
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = item;
        card.innerHTML = `<div class="front"></div><div class="back" style="background:${cardColors[index%8]}">${item}</div>`;
        card.addEventListener('click', flipCard);
        gameGrid.appendChild(card);
    });
}

// Flip logic
function flipCard(){
    if(lockBoard) return;
    if(this===firstCard) return;

    this.classList.add('flip');
    playSound(600); // flip sound

    if(!firstCard){
        firstCard=this;
        if(moves===0) startTimer();
        return;
    }

    secondCard=this;
    lockBoard=true;
    moves++;
    movesCounter.textContent=moves;

    checkMatch();
}

// Check match
function checkMatch(){
    const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

    if(isMatch){
        firstCard.classList.add('match');
        secondCard.classList.add('match');
        matchedPairs++;
        playSound(900); // match sound
        resetFlip();
        if(matchedPairs===cardsArray.length){
            clearInterval(timerInterval);
            playSound(1200, 600); // winning sound
            setTimeout(()=>alert(`🎉 You won in ${moves} moves and ${formatTime(time)}! 🎉`),300);
        }
    } else {
        setTimeout(()=>{
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetFlip();
        },800);
    }
}

function resetFlip(){
    [firstCard,secondCard] = [null,null];
    lockBoard=false;
}

// Timer
function startTimer(){
    timerInterval = setInterval(()=>{
        time++;
        timerEl.textContent = formatTime(time);
    },1000);
}

function formatTime(sec){
    let m = Math.floor(sec/60);
    let s = sec%60;
    return `${m}:${s<10?'0'+s:s}`;
}

// Reset button
function resetGame(){
    initGame();
}

// Start game
initGame();
