'use strict';
document.addEventListener('contextmenu', event => event.preventDefault());

const MINE = '&#9881';
const FLAG = '&#9873';
const PLAYER = '<i class="fas fa-smile"></i>';
const WINNER = '<i class="fas fa-grin-stars"></i>';
const LOSER = '<i class="fas fa-dizzy"></i>';

var gBoard;
var gState;
var gTime;
var gLevels = [
    { SIZE: 10, MINES: 20 },
    { SIZE: 15, MINES: 45 },
    { SIZE: 20, MINES: 80 }
]

var gTimerInterval;
var gCurrLevel = 0;

function initBoard() {
    // initialize LocalStorage if needed
    if (!localStorage.getItem("minesSweeperBestTimeEasy")) { localStorage.setItem("minesSweeperBestTimeEasy", "0") }
    if (!localStorage.getItem("minesSweeperBestTimeNormal")) { localStorage.setItem("minesSweeperBestTimeNormal", "0") }
    if (!localStorage.getItem("minesSweeperBestTimeHard")) { localStorage.setItem("minesSweeperBestTimeHard", "0") }
    if (!localStorage.getItem("minesSweeperBestTimeExpert")) { localStorage.setItem("minesSweeperBestTimeExpert", "0") }

    // reset gState
    resetGameState();
    // display empty board and wait for user click
    displayEmptyBoard();
    gBoard = buildBoard();
    document.querySelector('table').classList.remove('board-disabled');
    document.querySelector('.icon').innerHTML = PLAYER;
    getBestTime();

}

function startGame(i, j) {
    gState.isGameOn = true;
    addMines(i, j);
    renderCells();
    setTimer();
    document.querySelector('.timer').classList.remove('invisible');
    document.querySelector('.flags').classList.remove('invisible');
    document.querySelector('.flags span').innerHTML = gLevels[gCurrLevel].MINES;
}

function buildBoard() {
    let SIZE = gLevels[gCurrLevel].SIZE;
    let board = [];
    for (let i = 0; i < SIZE; i++) {
        board.push([]);
        for (let j = 0; j < SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board;
}

function addMines(clickedCellI, clickedCellJ) {
    // add mines
    let amountOfMinesOnBoard = gLevels[gCurrLevel].MINES;
    let SIZE = gLevels[gCurrLevel].SIZE;
    for (let i = 0; i < amountOfMinesOnBoard; i++) {
        let newMineI;
        let newMineJ;
        do {
            newMineI = getRandomInt(0, SIZE);
            newMineJ = getRandomInt(0, SIZE);
        } while (gBoard[newMineI][newMineJ].isMine ||
            (clickedCellI === newMineI && clickedCellJ === newMineJ));

        gBoard[newMineI][newMineJ].isMine = true;
    }

    // calculate neightbours
    let board = gBoard.map(function (arr) {
        return arr.slice();
    });
    setMinesNegsCount(board);
}

function checkGameOver(i, j) {

    if (gBoard[i][j].isMine) {
        gState.isGameOn = false;
        gameOver('lost');
        displayAll();

    } else if (areAllCellsOppened()) {
        gState.isGameOn = false;
        gameOver('won');
    }
}

function gameOver(result) {
    document.querySelector('.timer').classList.add('invisible');
    document.querySelector('.flags').classList.add('invisible');
    document.querySelector('table').classList.add('board-disabled');

    if (result === 'lost') {
        document.querySelector('.icon').innerHTML = LOSER;
        document.querySelector('.modal-title').innerHTML = 'GameOver';
        document.querySelector('.modal-body').innerHTML = 'Better luck next time';
    } else {
        document.querySelector('.icon').innerHTML = WINNER;
        document.querySelector('.modal-title').innerHTML = '!!! Victory !!!';
        let strModalBody = `<p>Your time is ${gTime} </p>`;
        if (getBestTime() > +gTime || getBestTime() === '0') {
            strModalBody += `<p>You set a new record !!!</p>`;
            setBestTime(gTime);
        } else {
            strModalBody += `<p>The best time is ${getBestTime()}</p>`;
        }
        document.querySelector('.modal-body').innerHTML = strModalBody;
    }

    $("#myModal").modal();
}
