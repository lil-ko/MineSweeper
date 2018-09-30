var isLeftBtnDown = false;
var isRightBtnDown = false;
var isBothBtnsEvent = false;
var cellLocaton;

$(document).on('mousedown', 'body', function (e) {
    if (e.which === 1) {
        isLeftBtnDown = true;
    } else if (e.which === 3) {
        isRightBtnDown = true;
    }
    checkBothMouseBtnsDown();
});

$(document).on('mousedown', '.cell', function (e) {
    if (e.which === 1) {
        isLeftBtnDown = true;
    } else if (e.which === 3) {
        isRightBtnDown = true;
        toggleFlag($(this).attr('class'));
    }
    if (checkBothMouseBtnsDown()) {
        cellLocaton = getLocation($(this).attr('class'));
        highlightAreaAroundCell(cellLocaton);
    }
});

$(document).on('mouseup', 'body', function (e) {
    if (e.which === 1) {
        isLeftBtnDown = false;
    } else if (e.which === 3) {
        isRightBtnDown = false;
    }
    checkBothMouseBtnsDown();
});

// !!!
$(document).on('mouseup', '.cell', function (e) {
    cellLocaton = getLocation($(this).attr('class'));
    if (e.which === 1) {
        isLeftBtnDown = false;
        if (!isBothBtnsEvent) {
            openCell(cellLocaton);
        } else {
            openAreaAroundCell(cellLocaton)
        }
    } else if (e.which === 3) {
        isRightBtnDown = false;
    }
    removeHighlightFromArea(cellLocaton);
});

$(document).on('mouseenter', '.cell', function () {
    if (isLeftBtnDown) {
        $(this).addClass('mousedown-hover');
        if (isCellFlipped($(this).attr('class'))) {
            $(this).removeClass('flipped');
        }
    }
    if (checkBothMouseBtnsDown()) {
        cellLocaton = getLocation($(this).attr('class'));
        highlightAreaAroundCell(cellLocaton);
    }
});

$(document).on('mouseleave', '.cell', function () {
    if (isLeftBtnDown && !isBothBtnsEvent) {
        $(this).removeClass('mousedown-hover');
        if (isCellFlipped($(this).attr('class'))) {
            $(this).addClass('flipped');
        }
    }
    cellLocaton = getLocation($(this).attr('class'));
    removeHighlightFromArea(cellLocaton);
});

function openCell(location) {
    let i = location[0];
    let j = location[1];

    if (!gState.isGameOn) {
        startGame(i, j);
    }
    if (gBoard[i][j].isMarked) return;
    if (!gBoard[i][j].isShown) {
        gState.shownCount++;
        gBoard[i][j].isShown = true;
        // Show all empty
        expandShown(i, j);
        checkGameOver(i, j);
        renderCell(i, j);
    }
}

function toggleFlag(cellClassList) {
    if (getLocation(cellClassList)) {
        let location = getLocation(cellClassList);
        let i = location[0];
        let j = location[1];
        if (!gBoard[i][j].isMarked && !gBoard[i][j].isShown) {
            gBoard[i][j].isMarked = true;
            gState.markedCount++;
        } else if (gBoard[i][j].isMarked) {
            gBoard[i][j].isMarked = false;
            gState.markedCount--;
        }
        let flagsLeft = gLevels[gCurrLevel].MINES - gState.markedCount;
        document.querySelector('.flags span').innerHTML = flagsLeft;
        renderCell(i, j);
    }    
}

function highlightAreaAroundCell(cellLocaton) {
    let idx = cellLocaton[0];
    let jdx = cellLocaton[1];
    for (let i = idx - 1; i <= idx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (let j = jdx - 1; j <= jdx + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            if (i === idx && j === jdx) continue;
            if (gBoard[i][j].isMarked) continue;
            
            let table = $("table tbody")[0];
            let cell = table.rows[i].cells[j];
            cell.classList.add('mousedown-hover');
            if (!gBoard[i][j].isShown) {
                cell.classList.remove('flipped');
            }
        }
    }
}

function removeHighlightFromArea(cellLocaton) {
    let idx = cellLocaton[0];
    let jdx = cellLocaton[1];
    for (let i = idx - 1; i <= idx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (let j = jdx - 1; j <= jdx + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            if (i === idx && j === jdx) continue;

            let table = $("table tbody")[0];
            let cell = table.rows[i].cells[j];
            cell.classList.remove('mousedown-hover');
            if (!gBoard[i][j].isShown) {
                cell.classList.add('flipped');
            }
        }
    }
}

function checkBothMouseBtnsDown() {
    if (isLeftBtnDown && isRightBtnDown) isBothBtnsEvent = true;
    if (!isLeftBtnDown && !isRightBtnDown) isBothBtnsEvent = false;
    return isBothBtnsEvent;
}

function getLocation(cell) {
    if (cell.includes('cell')) {
        let locatioClass = cell.split(' ')[1];
        let i = +locatioClass.split('-')[1];
        let j = +locatioClass.split('-')[2];
        return [i, j];
    }
    return false;
}

function openAreaAroundCell(location) {
    let i = location[0];
    let j = location[1];

    if (!gBoard[i][j].isShown) return;
    let flagsAroundCell = countFlagsAroundCell(i, j);
    if (flagsAroundCell === gBoard[i][j].minesAroundCount) {
        openNeighbours(i, j);
    }
}

function countFlagsAroundCell(idx, jdx) {
    let flagCount = 0;

    for (let i = idx - 1; i <= idx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (let j = jdx - 1; j <= jdx + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            if (i === idx && j === jdx) continue;

            if (gBoard[i][j].isMarked) flagCount++;
        }
    }
    return flagCount;
}

function openNeighbours(idx, jdx) {
    for (let i = idx - 1; i <= idx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (let j = jdx - 1; j <= jdx + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            if (i === idx && j === jdx) continue;
            if (gBoard[i][j].isMarked) continue;

            if (!gBoard[i][j].isShown) {
                gState.shownCount++;
                gBoard[i][j].isShown = true;

                renderCell(i, j);
                checkGameOver(i, j);
                if (!gState.isGameOn) return;
                expandShown(i, j);
            }
        }
    }
}
 
function isCellFlipped(cellClassList) {
    let location = getLocation(cellClassList);
    let i = location[0];
    let j = location[1];
    if (gBoard[i][j].isShown) return false;
    return true;
}
