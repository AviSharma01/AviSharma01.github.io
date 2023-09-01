let globalBoards = [0, 1, 2, 3, 4, 5, 6, 7, 8];

let localBoards = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8], 
    [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8], 
    [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8]
];

let humanPlayer = 'X';
let comPlayer = 'O';

const emptyGlobalIndices = function(gloBoard) {
    return gloBoard.filter (s => s != 'X' && s != 'O' && s != 'Trial' && s != 'NA');
}
const emptyLocalIndices = function(openBoards, loBoards) {
    const emptySpots = [];
    for (let i = 0; i < openBoards.length; i++) {
        if (Array.isArray(loBoards[openBoards[i]])) {
            emptySpots.push(loBoards[openBoards[i]].map((sq, index) => (sq !== 'X' && sq != 'O' ? index : null)).filter(index => index !== null));
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
        else if (winning(loBoard[i], humanPlayer)){
            gloBoard[i] = 'X'
            score = score + positionScores[i] * 150
        }
        else if (allXorO(loBoard[i])) {
            gloBoard[i] = 'Trial'
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

const minimax = function(mo, loBoard, player, depth, alpha, beta, maxDepth) {
    let score = evalBoard(mo.gloIndex, loBoard)
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
            globalBoardsMinimax[i] = 'Trial'
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

    if (typeof globalBoardsMinimax[mo.loIndex] === 'number' || globalBoardsMinimax[mo.loIndex] === 'NA') {
        for (let j = 0; j < 9; j++) {
            if (typeof globalBoardsMinimax[j] === 'number') {
                globalBoardsMinimax[j] = 'NA'
            }
        }
    }
    
    if (globalBoardsMinimax[mo.loIndex] === 'NA') {
        globalBoardsMinimax[mo.loIndex] = mo.loIndex
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
                move.gloIndex = openBoardsMinimax[o]
                move.loIndex = emptySpotsInLoBoards[o][i]
                loBoard[move.gloIndex][move.loIndex] = 'X'
                let result = minimax(move, loBoard, comPlayer, depth+1, alpha, beta, maxDepth)
                loBoard[move.gloIndex][move.loIndex] = move.loIndex
                if (result.score > maxVal) {
                    maxVal = result.score
                    bestMove = {gloIndex: move.gloIndex, loIndex: move.loIndex, score: result.score}
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
                move.gloIndex = openBoardsMinimax[o]
                move.loIndex = emptySpotsInLoBoards[o][i]
                loBoard[move.gloIndex][move.loIndex] = 'O'
                let result = minimax(move, loBoard, humanPlayer, depth+1, alpha, beta, maxDepth)
                loBoard[move.gloIndex][move.loIndex] = move.loIndex
                if (result.score < minVal) {
                    minVal = result.score
                    bestMove = {gloIndex: move.gloIndex, loIndex: move.loIndex, score: result.score}
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

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const AIplayer = function() {
    if (turn % 2 != 0) {
        let emptySpotsInLoBoards = emptyLoIndices(openBoards, loBoards);
        // let moves = []
        let minimumScore = Infinity;
        let bestMove
        for (let o = 0; o < openBoards.length; o++) {
            for (let i = 0; i < emptySpotsInLoBoards[o].length; i++) {
                let move = {}
                move.gloIndex = openBoards[o]
                move.loIndex = emptySpotsInLoBoards[o][i]
                loBoards[move.gloIndex][move.loIndex] = 'O'
                let result;
                if (isMobile) {
                    result = minimax(move, loBoards, humanPlayer, 0, -Infinity, Infinity, 3)
                } else {
                    result = minimax(move, loBoards, humanPlayer, 0, -Infinity, Infinity, 6)
                }
                loBoards[move.gloIndex][move.loIndex] = move.loIndex
                // moves.push(move)
                if (result.score < minimumScore) {
                    minimumScore = result.score;
                    bestMove = {gloIndex: move.gloIndex, loIndex: move.loIndex, score: result.score};
                }
            }
        }
        result.textContent = ''
        let gloIndex = bestMove.gloIndex
        let loIndex = bestMove.loIndex
        loBoards[gloIndex][loIndex] = 'O'
        ttts[gloIndex].children[loIndex].textContent = 'O';
        ttts[gloIndex].children[loIndex].classList.add('markO')
        let lastMove = document.querySelector('#lastMove');;
        try {if (lastMove.id != null) {
            lastMove.id = '';
        }}catch{};
        ttts[gloIndex].children[loIndex].id = 'lastMove';
    
        cells.forEach(target =>
            target.classList.toggle('cell2'))

        let nextBoard = main.children[loIndex];
        cellChanges(nextBoard, gloIndex)
        gloBoardIndex(loIndex)
        
        turn++

        if (winningPosition(globalBoards, comPlayer) || winning(globalBoards, humanPlayer)){
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
        } else if (!gloBoard.some(item => typeof item === 'number')) {
            result.textContent = "Draw game!"
        }
    }
}