'use strict'
const MINE = '💣'
const FLAG = '🎌'
const EMTY = ' '
const LIVE = '❤️'
const HINTS = '💡'
var gBoard = []

var gLevel = {
    SIZE: 4,
    MINES: 2,
    LIVES: 1,
    HINTS: 1
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    firstClick: false,
    isHint: false
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
        board[locationMINE.i][locationMINE.j].isMine = true
    }
}

// function addLIVES(howMany) {
//     for (var i = 0; i < howMany; i++) {
//         var countLives = []
//         for (var i = 0; i < gLevel.LIVES; i++) {
//             countLives.push(LIVE)
//         }
//         var elLives = document.querySelector('.lives')
//         elLives.innerText = countLives
//     }
// }

function addOrDelete(howMany, selector, simbol) {
    // if (addOrDelete === 'add') {
    var count = []
    for (var i = 0; i < howMany; i++) { count.push(simbol) }
    var elSelector = document.querySelector(`.${selector}`)
    elSelector.innerText = count
        // } 
        // else if (addOrDelete === 'delete') {
        //     for (var i = 0; i < howMany; i++) {
        //         var count = []
        //         count.push(simbol)
        //         var elSelector = document.querySelector(`.${selector}`)
        //         elSelector.innerText = count
        //     }

    // }
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var neighbors = checkNeighbors(board[i][j].location, board)
            board[i][j].minesAroundCount = neighbors
        }
    }
}

function checkNeighbors(location, board, elCell) {
    var neighborsMinesCount = 0
    for (var i = (location.i - 1); i < (location.i + 2) && i < board.length; i++) {
        if (i < 0 || i > board.length - 1) { continue }
        for (var j = (location.j - 1); j < (location.j + 2) && j < board[0].length; j++) {
            if (i === location.i && j === location.j || j > board[0].length - 1 || j < 0 ||
                i > board.length - 1 || i < 0) { continue }
            if (gGame.isHint) {
                board[i][j].isShown = false
                if (board[i][j].minesAroundCount === 0) { board[i][j].minesAroundCount = EMTY }
                renderCell(board[i][j].location, board[i][j].minesAroundCount)
                if (board[i][j].isMine) {
                    renderCell(board[i][j].location, MINE)
                }
                setTimeout(function() {
                    checkNeighbors(location, board, elCell)
                    renderCell(board[i][j].location, EMTY)
                        // renderBoard(gBoard, '.board-container')
                }, 200);
                gGame.isHint = false
                continue
            }
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
                renderCell(board[i][j].location, board[i][j].minesAroundCount, 'gray')
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
    var location = getCellLocation(elCell.className);
    if (!gGame.isOn) {
        return
    }
    if (!gGame.firstClick) {
        gBoard[location.i][location.j].minesAroundCount = 0
        gGame.firstClick = true
        if (gBoard[location.i][location.j].isMine) {
            gBoard[location.i][location.j].isMine = false
            addMINE(1, gBoard)

        }
    }
    if (gGame.isHint) { checkNeighbors(location, gBoard, elCell) }
    if (gBoard[location.i][location.j].isMarked || gBoard[location.i][location.j].isShown) { return }
    gBoard[location.i][location.j].isShown = true
    if (gBoard[location.i][location.j].minesAroundCount === 0) {
        if (!gBoard[location.i][location.j].isMine) {
            checkNeighbors(location, gBoard, elCell)
        }
        gGame.shownCount++
    } else { gGame.shownCount++ }
    elCell.style.backgroundColor = 'gray'
    if (gBoard[location.i][location.j].minesAroundCount === 0) {
        renderCell(location, EMTY)
        console.log(gBoard);
    } else { renderCell(location, gBoard[location.i][location.j].minesAroundCount) }
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
                elCell.style.backgroundColor = 'aqua'
                gBoard[location.i][location.j].isShown = false
                renderCell(location, EMTY)
            }, 200)

        } else {
            elLives = document.querySelector('.lives')
            elLives.innerText = EMTY
            gGame.isOn = false
            var elSmiley = document.querySelector('.smiley')
            elSmiley.innerText = '🤯'
        }

    }
    console.log(gGame.shownCount);
    if (Math.pow(gLevel.SIZE, 2) - gGame.shownCount - gGame.markedCount === 0 ||
        Math.pow(gLevel.SIZE, 2) - gGame.shownCount === 0) {
        console.log('win');
        gGame.isOn = false
        var elSmiley = document.querySelector('.smiley')
        elSmiley.innerText = '😎'
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
    resetGame()
    gLevel.SIZE = size
    if (gLevel.SIZE === 4) { gLevel.HINTS = 1, gLevel.LIVES = 1, gLevel.MINES = 2 }
    if (gLevel.SIZE === 8) { gLevel.HINTS = 3, gLevel.LIVES = 3, gLevel.MINES = 12 }
    if (gLevel.SIZE === 12) { gLevel.HINTS = 6, gLevel.LIVES = 6, gLevel.MINES = 30 }
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard, '.board-container')
}

function resetGame() {
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gGame.firstClick = false
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = '😀'
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
        addOrDelete(gLevel.HINTS, 'hints', HINTS)
        gGame.isHint = true
        gLevel.HINTS--
    }
}