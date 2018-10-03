function openStatsModal() {
    let strHtml = `Beginners Best Time: ${localStorage.getItem("minesSweeperBestTimeEasy")}<br>
    Intermediate Best Time: ${localStorage.getItem("minesSweeperBestTimeNormal")}<br>
    Advanced Best Time: ${localStorage.getItem("minesSweeperBestTimeHard")}`;
    document.querySelector('.stats-modal-body').innerHTML = strHtml;

    $('#statsModal').modal();
}

function openLevelsModal() {
    $(`.levels-modal-body div:nth-child(${gCurrLevel + 1})`).css('font-weight', 'bold');
    $('#levelsModal').modal();
}

function openThemesModal() {
    let strHtml = '';
    for (let i = 0; i < themes.length; i++) {
        strHtml += `<div onclick="changeTheme(${i})" data-dismiss="modal">${themes[i].NAME}</div>`;
    }
    document.querySelector('.themes-modal-body').innerHTML = strHtml;
    // highlight current theme
    let currThemeIdx = +localStorage.getItem("minesSweeperTheme");
    $(`.themes-modal-body div:nth-child(${currThemeIdx + 1})`).css('font-weight', 'bold');

    $('#themesModal').modal();
}

function openGameOverModal(result) {
    if (result === 'lost') {
        $('#emoji').removeClass();
        $('#emoji').addClass('face-lost');

        document.querySelector('.game-over-modal-title').innerHTML = 'GameOver';
        document.querySelector('.game-over-modal-body').innerHTML = 'Better luck next time';
    } else {
        $('#emoji').removeClass();
        $('#emoji').addClass('face-won');

        document.querySelector('.game-over-modal-title').innerHTML = '!!! Victory !!!';
        let strHtml = `<p>Your time is ${gTime} </p>`;
        if (getBestTime() > +gTime || getBestTime() === '0') {
            strHtml += `<p>You set a new record !!!</p>`;
            setBestTime(gTime);
        } else {
            strHtml += `<p>The best time is ${getBestTime()}</p>`;
        }
        document.querySelector('.game-over-modal-body').innerHTML = strHtml;
    }

    $("#gameOverModal").modal();
}

function changeTheme(themeIdx) {
    localStorage.setItem("minesSweeperTheme", themeIdx)
    document.querySelector('#theme').setAttribute('href', themes[themeIdx].CSS);
}