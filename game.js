const canvas = document.querySelector("#game");
const game = canvas.getContext('2d');  // x y y
const btnUp = document.querySelector("#btnUp");
const btnLeft = document.querySelector("#btnLeft");
const btnRight = document.querySelector("#btnRight");
const btnDown = document.querySelector("#btnDown");
const spanLives = document.querySelector("#lives");
const spanTime = document.querySelector("#time");
const spanRecord = document.querySelector("#record");
const pResult = document.querySelector("#result");




const playerPosition={
    x: undefined,
    y:undefined
}

const giftPosition = {
    x:undefined,
    y:undefined
}

let enemyPositions=[];

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

window.addEventListener('load',setCanvasSize);
window.addEventListener('resize', setCanvasSize);


function setCanvasSize(){
    if(window.innerHeight > window.innerWidth){
        canvasSize = window.innerWidth * 0.7;
    }else{
        canvasSize = window.innerHeight * 0.7
    }

    canvasSize = Number( canvasSize.toFixed(0));

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height',canvasSize);

    elementsSize = canvasSize / 10;

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}


function startGame(){ 
    game.font = elementsSize + 'px Verdana';
    game.textAlign = 'end';

    const map = maps[level];

    if(!map){
        gameWin();
        return;
    }

    if(!timeStart){
        timeStart = Date.now();
        timeInterval = setInterval(showTime,100);
        showRecord();
    }


    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row=> row.trim().split(''));

    showLives();
    enemyPositions=[];

    game.clearRect(0,0,canvasSize,canvasSize);

    mapRowCols.forEach((row, x)=> {
        row.forEach((col, y)=>{
            const emoji =  emojis[col];
            const posX = elementsSize * (y+1);
            const posY = elementsSize * (x+1);

            if(col=='O'){
                if(!playerPosition.x && !playerPosition.y){
                    playerPosition.x =posX;
                    playerPosition.y = posY;
                }
            }  else if(col=='I'){
                giftPosition.x = posX;
                giftPosition.y = posY;
            }  else if(col=='X'){
                enemyPositions.push({
                    x: posX,
                    y: posY 
                })
            }    
            game.fillText(emoji, posX, posY);
        })
    });
    movePlayer();
}

function movePlayer(){
    const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftCollision = giftCollisionX && giftCollisionY
    console.log({giftCollisionX,giftCollisionY,giftCollision})

    if(giftCollision){
      levelWin();
    }

    const enemyCollision = enemyPositions.find(enemy =>{
       const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
       const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
       return enemyCollisionX && enemyCollisionY;
    });

    if(enemyCollision){
       levelFail();
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);

}

function levelWin(){
    console.log('Subiste de nivel');
    level++;
}

function levelFail(){
    lives--;   

    if(lives <= 0){
        level = 0;
        lives = 3;
        timeStart = undefined;
    }

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function gameWin(){
    console.log("Terminaste el juego");
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;

    if(recordTime){   
        if(recordTime >= playerTime){
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = 'Superaste el record';
        }else{
            pResult.innerHTML ="lo siento, no superaste el records";
        }
    }
    else{
        localStorage.setItem('record_time',playerTime);
        pResult.innerHTML ="Primera vez? Muy bien, pero ahora trata de superar el record";
    }
}

function showLives(){
   const heartsArray =  Array(lives).fill(emojis['HEART'])
   spanLives.innerHTML="";
   heartsArray.forEach(heart=>{
     spanLives.append(heart);
   })
  
}

function showTime(){
    spanTime.innerHTML = Date.now() - timeStart;

}

function showRecord(){
    spanRecord.innerHTML = localStorage.getItem('record_time');

}

window.addEventListener('keydown', moveByKeys);

btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);


function moveByKeys(event){
    if(event.key == 'ArrowUp') moveUp();
    else if(event.key == 'ArrowLeft') moveLeft();
    else if(event.key == 'ArrowRight') moveRight();
    else if(event.key == 'ArrowDown') moveDown();
}
function moveUp(){
    if( (playerPosition.y - elementsSize)< elementsSize){
       console.log("out");
    }else{
        playerPosition.y-=elementsSize;
    }
    console.log({playerPosition,giftPosition,elementsSize});
    startGame();
}

function moveLeft(){
    if( (playerPosition.x - elementsSize)< elementsSize){
        console.log("out");
     }else{
         playerPosition.x-=elementsSize;
     }
    startGame();
}

function moveRight(){
    if( (playerPosition.x + elementsSize)> canvasSize){
        console.log("out");
     }else{
         playerPosition.x+=elementsSize;
     }
  
     console.log({playerPosition,elementsSize});
    startGame();
}
function moveDown(){
    if( (playerPosition.y + elementsSize)>canvasSize){
        console.log("out");
     }else{
         playerPosition.y+=elementsSize;
     }
    startGame();
}