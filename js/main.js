'use strict'
// stopWatch and local storange global vars  
var gWatch;
var gMiliWatch;
var gSeconds = 0;
var gMinutes = 0;
var gMiliSeconds = 0;
var gStartTime = 0;
var gEndTime = 0;
var gGameTime;
var gPrevGameTime
    // game global consts
const MINE = '💣'
const FLAG = '🎌'
const EMTY = ' '
const LIVE = '❤️'
const HINTS = '💡'
    // game global vars
var gBoard = []

var gLevel = {
    SIZE: 4,
    MINES: 2,
    LIVES: 1,
    HINTS: 1,
    SAFES: 1
}

var gGame = {
    isOn: false,
    shownCount: 0,
    minesCount: 0,
    markedCount: 0,
    secsPassed: 0,
    firstClick: true,
    isHint: false,
    isSafe: false
}

function inIt() {
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard, '.board-container')
    gGame.isOn = true
}

function buildBoard(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 4,
                isShown: false,
                isMine: false,
                isMarked: false,
                location: {
                    i: i,
                    j: j
                }
            }
        }
    }
    addMINE(gLevel.MINES, board)
    addOrDelete(gLevel.LIVES, 'lives', LIVE)
    addOrDelete(gLevel.HINTS, 'hints', HINTS)
    setMinesNegsCount(board)
    return board;
}

function addMINE(howMany, board) {
    for (var i = 0; i < howMany; i++) {
        var locationMINE = {
            i: getRandomIntInclusive(0, board.length - 1),
            j: getRandomIntInclusive(0, board[0].length - 1)
        }
        if (board[locationMINE.i][locationMINE.j].minesAroundCount === 0 ||
            !board[locationMINE.i][locationMINE.j].minesAroundCount) {
            addMINE(1, board)
        } else {
            gGame.minesCount++
                board[locationMINE.i][locationMINE.j].isMine = true
        }
    }
}

function addOrDelete(howMany, selector, simbol) {
    var count = []
    for (var i = 0; i < howMany; i++) { count.push(simbol) }
    var elSelector = document.querySelector(`.${selector}`)
    elSelector.innerText = count
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var neighbors = checkNeighbors(board[i][j].location, board)
            board[i][j].minesAroundCount = neighbors
        }
    }
}

function showNeighbors(location, board) {
    for (var i = (location.i - 1); i < (location.i + 2) && i < board.length; i++) {
        if (i < 0 || i > board.length - 1) { continue }
        for (var j = (location.j - 1); j < (location.j + 2) && j < board[0].length; j++) {
            if (j > board[0].length - 1 || j < 0 ||
                i > board.length - 1 || i < 0) { continue }
            if (!board[i][j].isShown) {
                board[i][j].isShown = true
                renderCell(board[i][j].location, board[i][j].minesAroundCount, 'lightGray')
                if (board[i][j].minesAroundCount === 0) { renderCell(board[i][j].location, EMTY, 'lightGray') }
                if (board[i][j].isMine) {
                    renderCell(board[i][j].location, MINE, 'lightGray')
                }
                setTimeout(function() {
                    for (var i = (location.i - 1); i < (location.i + 2) && i < board.length; i++) {
                        if (i < 0 || i > board.length - 1) { continue }
                        for (var j = (location.j - 1); j < (location.j + 2) && j < board[0].length; j++) {
                            if (j > board[0].length - 1 || j < 0 ||
                                i > board.length - 1 || i < 0) { continue }

                            // if (board[i][j].minesAroundCount === 0) { renderCell(board[i][j].location, EMTY, 0) }
                            board[i][j].isShown = false
                            renderCell(board[i][j].location, EMTY, 'gray')
                            if (board[i][j].isMine) {
                                renderCell(board[i][j].location, EMTY, 'gray')

                            }
                        }
                    }
                }, 1000)
            }
        }
        gGame.isHint = false
    }
}

function checkNeighbors(location, board, elCell) {
    var neighborsMinesCount = 0
    for (var i = (location.i - 1); i < (location.i + 2) && i < board.length; i++) {
        if (i < 0 || i > board.length - 1) { continue }
        for (var j = (location.j - 1); j < (location.j + 2) && j < board[0].length; j++) {
            if (i === location.i && j === location.j || j > board[0].length - 1 || j < 0 ||
                i > board.length - 1 || i < 0) { continue }
            if (elCell) {
                if (board[i][j].isMine) { continue }
                if (board[i][j].isShown) { continue }
                board[i][j].isShown = true
                if (board[i][j].minesAroundCount !== 0) {
                    elCell.innerText = board[i][j].minesAroundCount
                }
                if (board[i][j].minesAroundCount === 0) { checkNeighbors(board[i][j].location, board, elCell) }
                if (board[i][j].minesAroundCount === 0) { board[i][j].minesAroundCount = EMTY }
                console.log(board[i][j].location);
                renderCell(board[i][j].location, board[i][j].minesAroundCount, 'lightGray')
                gGame.shownCount++

            }
            if (board[i][j].isMine) {
                neighborsMinesCount++
            }
        }
    }
    return neighborsMinesCount
}

function cellClicked(elCell) {
    debugger
    var location = getCellLocation(elCell.className);
    if (!gGame.isOn) { return }
    if (gGame.firstClick) {
        Clock()
        if (gBoard[location.i][location.j].isMine) {
            gBoard[location.i][location.j].isMine = false
            addMINE(1, gBoard)
        }
        gBoard[location.i][location.j].minesAroundCount = 0
        gGame.firstClick = false
    }
    if (gGame.isHint) {
        showNeighbors(location, gBoard, elCell)
        return
    }
    if (gBoard[location.i][location.j].isMarked || gBoard[location.i][location.j].isShown) { return }
    gBoard[location.i][location.j].isShown = true
    if (gBoard[location.i][location.j].minesAroundCount === 0) {
        if (!gBoard[location.i][location.j].isMine) {
            checkNeighbors(location, gBoard, elCell)
        }
        gGame.shownCount++
    } else { gGame.shownCount++ }
    elCell.style.backgroundColor = 'rgba(104, 99, 126, 0.616)'
    if (gBoard[location.i][location.j].minesAroundCount === 0) {
        renderCell(location, EMTY)
        console.log(gBoard);
    } else { renderCell(location, gBoard[location.i][location.j].minesAroundCount) }
    if (!gBoard[location.i][location.j].isMine) {
        console.log((Math.pow(gLevel.SIZE, 2) - gGame.shownCount - gGame.markedCount));
        console.log(Math.pow(gLevel.SIZE, 2) - gGame.shownCount - gGame.minesCount);
        if ((Math.pow(gLevel.SIZE, 2) - gGame.shownCount - gGame.markedCount) === 0 ||
            (Math.pow(gLevel.SIZE, 2) - gGame.shownCount - gGame.minesCount) <= 0) {
            gEndTime = Date.now()
            gGameTime = gEndTime - gStartTime;
            if (!localStorage.getItem('bestScore') || gGameTime < localStorage.getItem('bestTime')) {
                var elClock = document.querySelector('.clock')
                localStorage.setItem('bestScore', elClock.innerText)
                localStorage.setItem('bestTime', gGameTime)
                var elBestScore = document.querySelector('.bestScore')
                elBestScore.innerText = localStorage.getItem('bestScore')
            }
            console.log('win');
            gGame.isOn = false
            var elSmiley = document.querySelector('.smiley')
            elSmiley.innerText = '😎'
            localStorage.setItem('prevTime', gGameTime)
            var elPrevScore = document.querySelector('.prevScore')
            elPrevScore.innerText = localStorage.getItem('prevScore')

        }
    }
    if (gBoard[location.i][location.j].isMine) {
        renderCell(location, MINE)
        if (gLevel.LIVES - 1 > 0) {
            gLevel.LIVES--
                var countLives = []
            for (var i = 0; i < gLevel.LIVES; i++) {
                countLives.push(LIVE)
            }
            var elLives = document.querySelector('.lives')
            elLives.innerText = countLives
            setTimeout(function() {
                elCell.style.backgroundColor = 'gray'
                gBoard[location.i][location.j].isShown = false
                renderCell(location, EMTY)
            }, 500)

        } else {
            gEndTime = Date.now()
            gGameTime = gEndTime - gStartTime;
            var elClock = document.querySelector('.clock')
            localStorage.setItem('prevScore', elClock.innerText)
            for (var i = 0; i < gLevel.SIZE; i++) {
                for (var j = 0; j < gLevel.SIZE; j++) {
                    if (gBoard[i][j].isMine) {
                        renderCell(gBoard[i][j].location, MINE)
                    }
                }
            }
            elLives = document.querySelector('.lives')
            elLives.innerText = EMTY
            elCell.style.backgroundColor = 'red'
            gGame.isOn = false
            var elSmiley = document.querySelector('.smiley')
            elSmiley.innerText = '🤯'
            localStorage.setItem('prevTime', gGameTime)
            var elPrevScore = document.querySelector('.prevScore')
            elPrevScore.innerText = localStorage.getItem('prevScore')

        }

    }

}

function getCellLocation(className) {
    var cellLocation = className.substring(9, 14)
    var cellNumLocation = cellLocation.split('-')
    var location = {
        i: +cellNumLocation[0],
        j: +cellNumLocation[1]
    }
    return location;
}

function difficulty(size) {
    gLevel.SIZE = size
    checkSize()
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard, '.board-container')
    resetGame()
    resetClock()
}

function resetGame() {
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gGame.minesCount = 0
    gGame.firstClick = true
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = '😀'
    checkSize()
    resetClock()
    inIt()
}

function rightButton(event) {
    if (!gGame.isOn) { return }
    var location = getCellLocation(event.target.className);
    if (event.button === 2) {
        if (gBoard[location.i][location.j].isMarked) {
            gBoard[location.i][location.j].isMarked = false
            renderCell(location, EMTY)
            return
        }
        gBoard[location.i][location.j].isMarked = true
        gGame.markedCount++
            renderCell(location, FLAG, 0)
    }
}

function hint() {
    if (gLevel.HINTS > 0) {
        gLevel.HINTS--
            gGame.isHint = true
        addOrDelete(gLevel.HINTS, 'hints', HINTS)
    }
}

function doubleClicked(elDoubleClicked) {
    if (!gGame.isOn) { return }
    console.log(elDoubleClicked);

    if (gBoard[location.i][location.j].isMarked) {
        gBoard[location.i][location.j].isMarked = false
        renderCell(location, EMTY)
        return
    }
    gBoard[location.i][location.j].isMarked = true
    gGame.markedCount++
        renderCell(location, FLAG, 0)
}

function checkSize() {
    if (gLevel.SIZE === 4) { gLevel.HINTS = 1, gLevel.LIVES = 1, gLevel.SAFES = 1, gLevel.MINES = 2 }
    if (gLevel.SIZE === 8) { gLevel.HINTS = 3, gLevel.LIVES = 3, gLevel.SAFES = 3, gLevel.MINES = 12 }
    if (gLevel.SIZE === 12) { gLevel.HINTS = 6, gLevel.LIVES = 6, gLevel.SAFES = 5, gLevel.MINES = 30 }
    return gLevel.SIZE
}

function Clock() {

    gSeconds = 0;
    gMinutes = 0;
    gMiliSeconds = 0;
    gStartTime = Date.now()
    gWatch = window.setInterval(stopWatch, 1000)
    gMiliWatch = window.setInterval(gMiliSecondsWatch, 10)
    var elBestScore = document.querySelector('.bestScore')
    if (elBestScore) { elBestScore.innerText = localStorage.getItem('bestScore') }
    localStorage.setItem('prevTime', gGameTime)
    var elPrevScore = document.querySelector('.prevScore')
    elPrevScore.innerText = localStorage.getItem('prevScore')


    function gMiliSecondsWatch() {
        if (gMiliSeconds === '000') gMiliSeconds = 0
        gMiliSeconds = gMiliSeconds + 10;
        if (gMiliSeconds / 1000 === 1) { gMiliSeconds = 0 }
        if (!gGame.isOn) { return }
        var elMiliSec = document.querySelector('.miliSec')
        elMiliSec.innerText = gMiliSeconds;
    }

    function stopWatch() {
        gSeconds++;
        if (gSeconds / 60 === 1) {
            gSeconds = 0;
            gMinutes++
        }
        if (gMinutes / 60 === 1) { gMinutes = 0 }
        if (gSeconds < 10) { gSeconds = "0" + gSeconds; }
        if (!gGame.isOn) { return; }
        var elMin = document.querySelector('.min')
        elMin.innerText = gMinutes
        var elSec = document.querySelector('.sec')
        elSec.innerText = gSeconds;

    }
}

function safeClicked() {
    if (gLevel.SAFES > 0) {
        gLevel.SAFES--
            for (var i = 0; i < gLevel.SIZE; i++) {
                for (var j = 0; j < gLevel.SIZE; j++) {
                    if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                        if (gBoard[i][j].minesAroundCount === 0) {
                            renderCell(gBoard[i][j].location, EMTY, 'lightGray')
                            gBoard[i][j].isShown = true
                            shownCount++
                        } else {
                            renderCell(gBoard[i][j].location, gBoard[i][j].minesAroundCount, 'lightGray')
                            gBoard[i][j].isShown = true
                            shownCount++
                        }
                        return
                    }
                }
            }
    }
}

function resetClock() {
    window.clearInterval(gWatch)
    window.clearInterval(gMiliWatch)
    gWatch;
    gSeconds = '0' + 0;
    gMinutes = '0' + 0;
    gMiliSeconds = '000';
    var elMin = document.querySelector('.min')
    elMin.innerText = gMinutes
    var elSec = document.querySelector('.sec')
    elSec.innerText = gSeconds;
    var elMiliSec = document.querySelector('.miliSec')
    elMiliSec.innerText = gMiliSeconds;
}