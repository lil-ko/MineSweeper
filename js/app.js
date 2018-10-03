'use strict';
document.addEventListener('contextmenu', event => event.preventDefault());

var gBoard;
var gState;
var gTime;
var gLevels = [
    { SIZE: 10, MINES: 20 },
    { SIZE: 15, MINES: 45 },
    { SIZE: 20, MINES: 80 }
]
var themes = [
    { NAME: 'Classic Nerd', CSS: 'css/classic.css' },
    { NAME: 'Upgraded Nerd (under consrtuction)', CSS: 'css/win10.css' },
    { NAME: 'Young Leprechaun', CSS: 'css/leprechaun.css' }
];

var gTimerInterval;
var gCurrLevel;

function initBoard() {
    // initialize LocalStorage if needed
    if (!localStorage.getItem("minesSweeperBestTimeEasy")) { localStorage.setItem("minesSweeperBestTimeEasy", "0") }
    if (!localStorage.getItem("minesSweeperBestTimeNormal")) { localStorage.setItem("minesSweeperBestTimeNormal", "0") }
    if (!localStorage.getItem("minesSweeperBestTimeHard")) { localStorage.setItem("minesSweeperBestTimeHard", "0") }
    if (!localStorage.getItem("minesSweeperTheme")) { localStorage.setItem("minesSweeperTheme", "1") }
    if (!localStorage.getItem("minesSweeperLevel")) {
        localStorage.setItem("minesSweeperLevel", "0")
        gCurrLevel = 0;
    } else { gCurrLevel = +localStorage.getItem("minesSweeperLevel"); }

    // reset gState
    resetGameState();
    // display empty board and wait for user click
    displayEmptyBoard();
    gBoard = buildBoard();
    document.querySelector('table').classList.remove('board-disabled');
    document.querySelector('.flags-value').innerHTML = ' ' + gLevels[gCurrLevel].MINES;
    setTimer();

    //reset emoji
    $('#emoji').removeClass();
    $('#emoji').addClass('face-smile');

    // set theme
    changeTheme(localStorage.getItem("minesSweeperTheme"));
}

function startGame(i, j) {
    gState.isGameOn = true;
    addMines(i, j);
    renderCells();
    setTimer();
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
        let elCell = document.querySelector(`.cell-${i}-${j}`);
        elCell.classList.add('mine-hit');
        gameOver('lost');
        displayAll();

    } else if (areAllCellsOppened()) {
        gState.isGameOn = false;
        gameOver('won');
    }
}

function gameOver(result) {
    document.querySelector('table').classList.add('board-disabled');
    openGameOverModal(result);

}
