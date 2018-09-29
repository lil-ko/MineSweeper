var leftButtonDown = false;
var rightButtonDown = false;

$(document).on('mousedown', '.cell', function (e) {
    if (e.which === 1) {
        leftButtonDown = true;
    } else if (e.which === 3) {
        rightButtonDown = true;
    }
    checkAreaAroundCell($(this));
});

$(document).on('mouseup', 'body', function (e) {
    if (e.which === 1) {
        leftButtonDown = false;
    } else if (e.which === 3) {
        rightButtonDown = false;
    }
});

function checkAreaAroundCell(cell) {
    if (leftButtonDown && rightButtonDown) {
        let location = getLocation(cell);
        let i = location[0];
        let j = location[1];

        if (!gBoard[i][j].isShown) return;
        let flagsAroundCell = countFlagsAroundCell(i, j);
        if (flagsAroundCell === gBoard[i][j].minesAroundCount) {
            openNeighbours(i, j);
        }
    }
}

function getLocation(cell) {
    let locatioClass = cell.attr('class').split(' ')[1];
    let i = +locatioClass.split('-')[1];
    let j = +locatioClass.split('-')[2];
    return [i, j];
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

