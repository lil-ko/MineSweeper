
function resetGameState() {
    gState = {
        isGameOn: false,
        shownCount: 0,
        markedCount: 0
    }
}

function displayEmptyBoard() {
    let boardSize = gLevels[gCurrLevel].SIZE;
    let elTable = document.querySelector('tbody');
    let strHTML = '';
    for (let i = 0; i < boardSize; i++) {
        strHTML += '<tr>';
        for (let j = 0; j < boardSize; j++) {
            let className = `cell cell-${i}-${j} flipped`;
            //strHTML += `<td class="${className}" onmouseup="cellClicked(event, ${i}, ${j})"> </td>`;
            strHTML += `<td class="${className}"> </td>`;
       
        }
        strHTML += '</tr>';
    }
    elTable.innerHTML = strHTML;
}

function renderCells() {
    let boardSize = gLevels[gCurrLevel].SIZE;
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            renderCell(i, j)
        }
    }
}

function renderCell(i, j) {
    let elCell = document.querySelector(`.cell-${i}-${j}`);
    if (gBoard[i][j].isShown) {
        if (gBoard[i][j].isMine) {
            elCell.innerHTML = MINE;
        } else if (gBoard[i][j].minesAroundCount > 0) {
            colorNum(elCell, i, j);
        } else {
            elCell.innerHTML = '';
        }
        elCell.classList.remove('flipped');
    } else {
        if (gBoard[i][j].isMarked) {
            elCell.innerHTML = FLAG;
        } else if (!gBoard[i][j].isMarked) {
            elCell.innerHTML = '';
        }
    }
}

function setMinesNegsCount(board) {
    let SIZE = gLevels[gCurrLevel].SIZE;
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            board[i][j].minesAroundCount = getMinesAroundCount(board, i, j);
        }
    }
}

function colorNum(elCell, i, j) {
    switch (gBoard[i][j].minesAroundCount) {
        case 1:
            elCell.setAttribute("style", "color: blue;")
            break;
        case 2:
            elCell.setAttribute("style", "color: green;")
            break;
        case 3:
            elCell.setAttribute("style", "color: red;")
            break;
        case 4:
            elCell.setAttribute("style", "color: purple;")
            break;
        case 5:
            elCell.setAttribute("style", "color: darkblue;")
            break;
        case 6:
            elCell.setAttribute("style", "color: brown;")
            break;
        case 7:
            elCell.setAttribute("style", "color: aqua;")
            break;
        case 8:
            elCell.setAttribute("style", "color: white;")
            break;

        default:
            break;
    }
    elCell.innerHTML = gBoard[i][j].minesAroundCount;
}

function getMinesAroundCount(board, idx, jdx) {
    let count = 0;

    for (let i = idx - 1; i <= idx + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (let j = jdx - 1; j <= jdx + 1; j++) {
            if (j < 0 || j >= board.length) continue;
            if (i === idx && j === jdx) continue;

            if (board[i][j].isMine) count++;
        }
    }
    return count;
}

function changeLevel(level) {
    gCurrLevel = level;
    initBoard();
}

function expandShown(i, j) {
    // exit condition
    if (gBoard[i][j].minesAroundCount !== 0) {
        return;
    }

    for (let idx = i - 1; idx <= i + 1; idx++) {
        if (idx < 0 || idx >= gBoard.length) continue;
        for (let jdx = j - 1; jdx <= j + 1; jdx++) {
            if (jdx < 0 || jdx >= gBoard.length) continue;
            if (idx === i && jdx === j) continue;
            if (gBoard[idx][jdx].isShown) continue;
            // open cell and check all it's neighbours
            gState.shownCount++;
            gBoard[idx][jdx].isShown = true;
            renderCell(idx, jdx);
            expandShown(idx, jdx);
        }
    }
    return;
}

function areAllCellsOppened() {
    let boardSize = gLevels[gCurrLevel].SIZE * gLevels[gCurrLevel].SIZE;
    if (gState.shownCount === (boardSize - gLevels[gCurrLevel].MINES)) {
        return true;
    }
    return false;
}

function displayAll() {
    let boardSize = gLevels[gCurrLevel].SIZE;

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (!gBoard[i][j].isShown) {
                gBoard[i][j].isShown = true;
                renderCell(i, j)
            }
        }
    }
}

function setTimer() {
    clearInterval(gTimerInterval);
    let startTime = new Date().getTime() / 1000;
    gTimerInterval = setInterval(function () {
        if (!gState.isGameOn) {
            clearInterval(gTimerInterval);
        }
        let currTime = new Date().getTime() / 1000;
        gTime = (currTime - startTime).toFixed(0);
        document.querySelector('.timer span').innerHTML = gTime;
    }, 10);
}

function getBestTime() {
    let bestTime;
    switch (gCurrLevel) {
        case 0:
            bestTime = localStorage.getItem("minesSweeperBestTimeEasy");
            break;
        case 1:
            bestTime = localStorage.getItem("minesSweeperBestTimeNormal");
            break;
        case 2:
            bestTime = localStorage.getItem("minesSweeperBestTimeHard");
            break;
        case 3:
            bestTime = localStorage.getItem("minesSweeperBestTimeExpert");
            break;
        default:
            bestTime = 0;
            break;
    }
    return bestTime;
}

function setBestTime(bestTime) {
    switch (gCurrLevel) {
        case 0:
            localStorage.setItem("minesSweeperBestTimeEasy", bestTime);
            break;
        case 1:
            localStorage.setItem("minesSweeperBestTimeNormal", bestTime);
            break;
        case 2:
            localStorage.setItem("minesSweeperBestTimeHard", bestTime);
            break;
        case 3:
            localStorage.setItem("minesSweeperBestTimeExpert", bestTime);
            break;
        default:
            bestTime = 0;
            break;
    }
    return bestTime;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

