let globalBoards = [0, 1, 2, 3, 4, 5, 6, 7, 8]

let localBoards = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8], 
    [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8], 
    [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8]
];

let comPlayer = 'O';
let humanPlayer = 'X';

const emptyGlobalIndices = function(globalBoards) {
    return globalBoards.filter (s => s != 'X' && s != 'O' && s != 'T' && s != 'NA');
}
const emptyLocalIndices = function(openBoards, localBoards) {
    const emptySpots = [];
    for (let i = 0; i < openBoards.length; i++) {
        if (Array.isArray(localBoards[openBoards[i]])) {
            emptySpots.push(localBoards[openBoards[i]].map((sq, index) => (sq !== 'X' && sq != 'O' ? index : null)).filter(index => index !== null));
        } else {
            emptySpots.push([]);
        }
    }
    return emptySpots;
}


const winningPosition = function(board, player) {
    if (
        ((board[0] == player && board[1] == player && board[2] == player) ||
        (board[0] == player && board[4] == player && board[8] == player) ||
        (board[0] == player && board[3] == player && board[6] == player) ||
        (board[1] == player && board[4] == player && board[7] == player) ||
        (board[2] == player && board[5] == player && board[8] == player) ||
        (board[2] == player && board[4] == player && board[6] == player) ||
        (board[3] == player && board[4] == player && board[5] == player) ||
        (board[6] == player && board[7] == player && board[8] == player)) 
    ) {
        return true;
    } else {
        return false;
    }
}

const allXorO = function(board) {
    if (Array.isArray(board)) {
        return board.every((cell) => cell === 'O' || cell === 'X');
    }
  }


const minimax = function(mo, loBoard, player, depth, alpha, beta, maxDepth) {
    let score = evalBoard(mo.globalIndex, loBoard)
    if (depth == maxDepth) {
        return {score: score};
    }

    let globalBoardsMinimax = [];
    for (let i = 0; i < 9; i++) {
        if (winningPosition(loBoard[i], comPlayer)){
            globalBoardsMinimax[i] = 'O'
        }
        else if (winningPosition(loBoard[i], humanPlayer)){
            globalBoardsMinimax[i] = 'X'
        }
        else if (allXorO(loBoard[i])) {
            globalBoardsMinimax[i] = 'T'
        } else {
            globalBoardsMinimax[i] = i
        }
    }

    // The goal is to make the AI (comPlayer) win
    if (winningPosition(globalBoardsMinimax, comPlayer)){
        return {score: score + depth};
    }
    else if (winningPosition(globalBoardsMinimax, humanPlayer)){
        return {score: score - depth};
    }

    if (typeof globalBoardsMinimax[mo.localIndex] === 'number' || globalBoardsMinimax[mo.localIndex] === 'NA') {
        for (let j = 0; j < 9; j++) {
            if (typeof globalBoardsMinimax[j] === 'number') {
                globalBoardsMinimax[j] = 'NA'
            }
        }
    }
    
    if (globalBoardsMinimax[mo.localIndex] === 'NA') {
        globalBoardsMinimax[mo.localIndex] = mo.localIndex
    }
    let openBoardsMinimax = emptyGlobalIndices(globalBoardsMinimax)
    if (openBoardsMinimax.length == 0) {
        return {score: score};
    }
    let emptySpotsInLoBoards = emptyLocalIndices(openBoardsMinimax, loBoard);

    if (player == humanPlayer) {
        let maxVal = -Infinity;
        let bestMove
        for (let o = 0; o < openBoardsMinimax.length; o++) {
            for (let i = 0; i < emptySpotsInLoBoards[o].length; i++) {
                let move = {}
                move.globalIndex = openBoardsMinimax[o]
                move.localIndex = emptySpotsInLoBoards[o][i]
                loBoard[move.globalIndex][move.localIndex] = 'X'
                let result = minimax(move, loBoard, comPlayer, depth+1, alpha, beta, maxDepth)
                loBoard[move.globalIndex][move.localIndex] = move.localIndex
                if (result.score > maxVal) {
                    maxVal = result.score
                    bestMove = {globalIndex: move.globalIndex, localIndex: move.localIndex, score: result.score}
                }
                alpha = Math.max(alpha, maxVal);
                if(beta <= alpha){
                    break;
                }
            }
        }
        return bestMove
    } else {
        let minVal = Infinity;
        let bestMove
        for (let o = 0; o < openBoardsMinimax.length; o++) {
            for (let i = 0; i < emptySpotsInLoBoards[o].length; i++) {
                let move = {}
                move.globalIndex = openBoardsMinimax[o]
                move.localIndex = emptySpotsInLoBoards[o][i]
                loBoard[move.globalIndex][move.localIndex] = 'O'
                let result = minimax(move, loBoard, humanPlayer, depth+1, alpha, beta, maxDepth)
                loBoard[move.globalIndex][move.localIndex] = move.localIndex
                if (result.score < minVal) {
                    minVal = result.score
                    bestMove = {globalIndex: move.globalIndex, localIndex: move.localIndex, score: result.score}
                }
                beta = Math.min(beta, minVal);
                if(beta <= alpha){
                    break;
                }
            }
        }
        return bestMove
    }
}

const evalBoard = function(current, loBoard) {
    const allWinningCombos = [[0,1,2],[0,4,8],[0,3,6],[1,4,7],[2,5,8],[2,4,6],[3,4,5],[6,7,8]];
    const positionScores = [0.3, 0.2, 0.3, 0.2, 0.4, 0.2, 0.3, 0.2, 0.3];
    const localBoardWeightings = [1.35, 1, 1.35, 1, 1.7, 1, 1.35, 1, 1.35];
    function rowScore(boardArr) {
        let oCount = 0;
        let xCount = 0;
        let numCount = 0;
        for (let i = 0; i < boardArr.length; i++) {
          if (boardArr[i] === 'O') {
            oCount++;
          }
          else if (boardArr[i] === 'X') {
            xCount++;
          }
          else {
            numCount++;
          }
        }
       
        if (oCount === 3) {
            return -12
        }
        if (oCount === 2 && numCount === 1) {
            return -6
        }
        if (xCount === 2 && numCount === 1) {
            return 6
        }
        if (xCount === 2 && oCount === 1) {
            return -9
        }
        if (xCount === 3) {
            return 12
        }
        if (oCount === 2 && xCount === 1) {
            return 9
        }
        else {
            return 0
        }
    }

    let score = 0
    let gloBoard = [];
   
    for (let i = 0; i < 9; i++) {
        if (winningPosition(loBoard[i], comPlayer)){
            gloBoard[i] = 'O'
            score = score - positionScores[i] * 150
        }
        else if (winningPosition(loBoard[i], humanPlayer)){
            gloBoard[i] = 'X'
            score = score + positionScores[i] * 150
        }
        else if (allXorO(loBoard[i])) {
            gloBoard[i] = 'T'
        } else {
            gloBoard[i] = i
        }
    }

    if (winningPosition(gloBoard, comPlayer)){
        score = score - 50000
     }
       else if (winningPosition(gloBoard, humanPlayer)){
        score = score + 50000 
    }

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if(loBoard[i][j] == comPlayer) {
                if (i == current) {
                    score = score - positionScores[j] * 1.5 * localBoardWeightings[i]
                } else {
                    score = score - positionScores[j] * localBoardWeightings[i]
                }
            } else if (loBoard[i][j] == humanPlayer) {
                if (i == current) {
                    score = score + positionScores[j] * 1.5 * localBoardWeightings[i]
                } else {
                    score = score + positionScores[j] * localBoardWeightings[i]
                }
            }
        }

        let RawScores = new Set();
        for (let combo of allWinningCombos) {
            let loArr = [loBoard[i][combo[0]], loBoard[i][combo[1]], loBoard[i][combo[2]]];
            let rowScoreVal = rowScore(loArr);
            if (!RawScores.has(rowScoreVal)) {
                if ((combo[0] === 0 && combo[1] === 4 && combo[2] === 8) || (combo[0] === 2 && combo[1] === 4 && combo[2] === 6)) {
                    if (rowScoreVal === 6 || rowScoreVal === -6) {
                        if (i === current) {
                            score += rowScoreVal * 1.8 * localBoardWeightings[i];
                        } else {
                            score += rowScoreVal * 1.2 * localBoardWeightings[i];
                        }
                    }
                } else {
                    if (i === current) {
                        score += rowScoreVal * 1.5 * localBoardWeightings[i];
                    } else {
                        score += rowScoreVal * localBoardWeightings[i];
                    }
                }
                RawScores.add(rowScoreVal);
            }
        }
    }
    
    let rawScores = new Set();
    for (let combo of allWinningCombos) {
        let gloArr = [gloBoard[combo[0]], gloBoard[combo[1]], gloBoard[combo[2]]];
        let rowScoreVal = rowScore(gloArr);
        if (!rawScores.has(rowScoreVal)) {
            if ((combo[0] === 0 && combo[1] === 4 && combo[2] === 8) || (combo[0] === 2 && combo[1] === 4 && combo[2] === 6)) {
                if (rowScoreVal === 6 || rowScoreVal === -6) {
                    score += rowScoreVal * 180;
                }
            } else {
                score += rowScoreVal * 150;
            }
            rawScores.add(rowScoreVal);
        }
    }
    return score
}

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const AIplayer = function() {
    if (turn % 2 != 0) {
        let emptySpotsInLoBoards = emptyLocalIndices(openBoards, localBoards);
        // let moves = []
        let minimumScore = Infinity;
        let bestMove
        for (let o = 0; o < openBoards.length; o++) {
            for (let i = 0; i < emptySpotsInLoBoards[o].length; i++) {
                let move = {}
                move.globalIndex = openBoards[o]
                move.localIndex = emptySpotsInLoBoards[o][i]
                localBoards[move.globalIndex][move.localIndex] = 'O'
                let result;
                if (isMobile) {
                    result = minimax(move, localBoards, humanPlayer, 0, -Infinity, Infinity, 4)
                } else {
                    result = minimax(move, localBoards, humanPlayer, 0, -Infinity, Infinity, 6)
                }
                localBoards[move.globalIndex][move.localIndex] = move.localIndex
                
                if (result.score < minimumScore) {
                    minimumScore = result.score;
                    bestMove = {globalIndex: move.globalIndex, localIndex: move.localIndex, score: result.score};
                }
            }
        }
        result.textContent = ''
        let globalIndex = bestMove.globalIndex
        let localIndex = bestMove.localIndex
        localBoards[globalIndex][localIndex] = 'O'
        aiTTT[globalIndex].children[localIndex].textContent = 'O';
        aiTTT[globalIndex].children[localIndex].classList.add('markO')
        let lastMove = document.querySelector('#lastMove');;
        try {if (lastMove.id != null) {
            lastMove.id = '';
        }}catch{};
        aiTTT[globalIndex].children[localIndex].id = 'lastMove';
    
        cells.forEach(target =>
            target.classList.toggle('cell2'))

        let nextBoard = main.children[localIndex];
        cellChanges(nextBoard, globalIndex)
        globalBoardIndex(localIndex)
        
        turn++

        if (winningPosition(globalBoards, comPlayer) || winningPosition(globalBoards, humanPlayer)){
            for (let i = 0; i < main.children.length; i++) {
                if (typeof globalBoards[i] == 'number') {
                    for (let j = 0; j < 9; j++) {
                        if (!main.children[i].children[j].classList.contains('markX') && !main.children[i].children[j].classList.contains('markO')) {
                            main.children[i].children[j].classList.add('cellNA');  
                        }
                    }
                }
            }
            if (winningPosition(globalBoards, comPlayer)) {
                result.textContent = "Player O wins!"
            } else if (winningPosition(globalBoards, humanPlayer)){
                result.textContent = "Player X wins!"
            } 
        } else if (!globalBoards.some(item => typeof item === 'number')) {
            result.textContent = "Draw game!"
        }
    }
}

// -------------------------------------- All main functions are above ---------------------------------------------//

const main = document.querySelector('.main-content');
const aiTTT = document.querySelectorAll('.TTT');
const cells = document.querySelectorAll('.cell');
let cell2s = document.querySelectorAll('.cell2');
let cellNAs = document.querySelectorAll('cellNA');
let markXs = document.querySelectorAll('.markX');
let markOs = document.querySelectorAll('.markO');
let turn = 0;
let globalIndex;
let localIndex;
const result = document.querySelector('#result');


const globalBoardIndex = function(nextBoardIndex) {
    for (let i = 0; i < 9; i++) {
        if (winningPosition(localBoards[i], comPlayer)){
            globalBoards[i] = 'O'
        }
        else if (winningPosition(localBoards[i], humanPlayer)){
            globalBoards[i] = 'X'
        }
        else if (allXorO(localBoards[i])) {
            globalBoards[i] = 'T'
        } else if (typeof globalBoards[i] == 'number') {
            globalBoards[i] = 'NA'
        }
    }
    if (globalBoards[nextBoardIndex] !== 'NA') {
        for (let i = 0; i < 9; i++) {
            if (globalBoards[i] == 'NA') {
                globalBoards[i] = i
            }
        }
    } else {
        globalBoards[nextBoardIndex] = nextBoardIndex
    }
}
let openBoards = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let lastBoards = [...openBoards]
const cellChanges = function (nextBoard, index) {
    for (let i = 0; i < main.children.length; i++) {
        markXs = document.querySelectorAll('markX');
        markOs = document.querySelectorAll('markO');
        if (main.children[i] != nextBoard && (!main.children[i].firstElementChild.classList.contains('cellW') && !main.children[i].firstElementChild.classList.contains('cell2W'))) {
            for (let j = 0; j < 9; j++) {
                if (!main.children[i].children[j].classList.contains('markX') && !main.children[i].children[j].classList.contains('markO')) {
                    main.children[i].children[j].classList.add('cellNA');  
                }
            }   
        } else {
            for (let j = 0; j < 9; j++) {
                main.children[i].children[j].classList.remove('cellNA');
            }  
        }
    }
    if (winningPosition(localBoards[index], humanPlayer)){
        globalBoards[index] = 'X';
        for (let i = 0; i < 9; i++) {
            aiTTT[index].children[i].classList.add('cellW')
            aiTTT[index].children[i].classList.remove('cellNA')
        }
    }
    if (winningPosition(localBoards[index], comPlayer)){
        globalBoards[index] = 'O';
        for (let i = 0; i < 9; i++) {
            aiTTT[index].children[i].classList.add('cell2W')
            aiTTT[index].children[i].classList.remove('cellNA')
        }
    }
    if (nextBoard.firstElementChild.classList.contains('cellW') || nextBoard.firstElementChild.classList.contains('cell2W') || allXorO(nextBoard)) {
        cellNAs = document.querySelectorAll('.cellNA');
        for (let cellNA of cellNAs) {
            cellNA.classList.remove('cellNA')
        }
    }
}

for (let cell of cells) {
    cell.addEventListener('click', function() {
        if (cell.className === 'markX' || cell.className === 'markO') {
            return;
        }
        lastMove = document.querySelector('#lastMove');;
            try {if (lastMove.id != null) {
                lastMove.id = '';
            }}catch{};
            cell.id = 'lastMove';

        let targetBoard = cell.parentElement;
        for (let i = 0; i < main.children.length; i++) {
            if (main.children[i] === targetBoard) {
                globalIndex = i;
            } 
        }
        for (let i = 0; i < targetBoard.children.length; i++) {
            if (targetBoard.children[i] === cell) {
                localIndex = i;
            }
        }

        turn++

        if (turn % 2 != 0) {
            localBoards[globalIndex][localIndex] = 'X';
            cell.textContent = 'X';
            cell.classList.add('markX')
            cells.forEach(target =>
                target.classList.toggle('cell2'))
        }
        else {
            localBoards[globalIndex][localIndex] = 'O'
            cell.textContent = 'O';
            cell.classList.add('markO')
            cells.forEach(target =>
                target.classList.toggle('cell2'))
        }
        let nextBoard = main.children[localIndex];
        
        cellChanges(nextBoard, globalIndex)
        globalBoardIndex(localIndex)

        lastBoards = [...openBoards]
        if (turn % 2 != 0) {
            console.log(humanPlayer, evalBoard(lastBoards, localBoards))
        } else {
            console.log(comPlayer, evalBoard(lastBoards, localBoards))
        }
        openBoards = emptyGlobalIndices(globalBoards)

        if (winningPosition(globalBoards, comPlayer) || winningPosition(globalBoards, humanPlayer)){
            for (let i = 0; i < main.children.length; i++) {
                if (typeof globalBoards[i] == 'number') {
                    for (let j = 0; j < 9; j++) {
                        if (!main.children[i].children[j].classList.contains('markX') && !main.children[i].children[j].classList.contains('markO')) {
                            main.children[i].children[j].classList.add('cellNA');  
                        }
                    }
                }
            }
            if (winningPosition(globalBoards, comPlayer)) {
                result.textContent = "Player O wins!"
            } else if (winningPosition(globalBoards, humanPlayer)){
                result.textContent = "Player X wins!"
            }
        } else if (!globalBoards.some(item => typeof item === 'number')) {
            result.textContent = "Draw game!"
        } else {
            result.textContent = 'Minimax analyzing moves..'
            setTimeout(() => {
                AIplayer() 
            }, 0);
        }
    })
    
};

const instructionBtn = document.querySelector('#instruction-btn')
const instruction = document.querySelector('#instruction')
const instructionClose = document.querySelector('#instruction-close')
instructionBtn.addEventListener('click', function() {
    instruction.style.display = "flex"
    instructionClose.style.display = "flex"
})
instructionClose.addEventListener('click', function() {
    instruction.style.display = "none"
    instructionClose.style.display = "none"
})