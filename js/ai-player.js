let model;

// Load the model when the page loads
async function loadModel() {
    try {
        model = await tf.loadLayersModel('https://avisharma01.github.io/models/uttt_model/model.json');
        console.log('Neural network model loaded successfully');
    } catch (error) {
        console.error('Failed to load the model:', error);
    }
}
loadModel();

// Game history for data collection
let gameHistory = [];

function logGameState(globalBoards, localBoards, move) {
    let gameState = {
        globalBoards: JSON.parse(JSON.stringify(globalBoards)),
        localBoards: JSON.parse(JSON.stringify(localBoards)),
        move: move,
        player: turn % 2 === 0 ? 'X' : 'O'
    };
    gameHistory.push(gameState);
}

function convertBoardToModelInput(localBoards) {
    let input = new Array(9).fill(0).map(() => new Array(9).fill(0).map(() => new Array(3).fill(0)));
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (localBoards[i][j] === 'X') {
                input[i][j][0] = 1;
            } else if (localBoards[i][j] === 'O') {
                input[i][j][1] = 1;
            } else {
                input[i][j][2] = 1;
            }
        }
    }
    return input;
}

function saveGameHistoryToLocalStorage() {
    let existingData = JSON.parse(localStorage.getItem('utttGameHistory')) || [];
    existingData.push(gameHistory);
    localStorage.setItem('utttGameHistory', JSON.stringify(existingData));
    gameHistory = [];
}

function exportGameHistory() {
    let data = localStorage.getItem('utttGameHistory');
    let blob = new Blob([data], {type: 'application/json'});
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'uttt_game_history.json';
    a.click();
}

async function getNeuralNetworkMove(localBoards) {
    if (!model) {
        console.warn('Neural network model not loaded. Skipping NN prediction.');
        return null;
    }

    try {
        let boardTensor = tf.tensor(convertBoardToModelInput(localBoards)).expandDims();
        let moveProbabilities = await model.predict(boardTensor).array();
        return moveProbabilities[0];
    } catch (error) {
        console.error('Error in neural network prediction:', error);
        return null;
    }
}

// Export functions to be used in script.js
window.logGameState = logGameState;
window.saveGameHistoryToLocalStorage = saveGameHistoryToLocalStorage;
window.exportGameHistory = exportGameHistory;
window.getNeuralNetworkMove = getNeuralNetworkMove;