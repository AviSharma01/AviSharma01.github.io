let model;

async function loadModel() {
    try {
        model = await tf.loadLayersModel('https://avisharma01.github.io/models/uttt_model/model.json');
        console.log('Neural network model loaded successfully');
    } catch (error) {
        console.error('Failed to load the model:', error);
    }
}

let gameHistory = [];

function logGameState(globalBoards, localBoards, move) {
    let gameState = {
        globalBoards: JSON.parse(JSON.stringify(globalBoards)),
        localBoards: JSON.parse(JSON.stringify(localBoards)),
        move: move,
        player: move.player 
    };
    gameHistory.push(gameState);
    console.log('Game state logged:', gameState);
}

function saveGameHistoryToLocalStorage() {
    let existingData = JSON.parse(localStorage.getItem('utttGameHistory')) || [];
    existingData.push(gameHistory);
    localStorage.setItem('utttGameHistory', JSON.stringify(existingData));
    console.log('Game history saved to local storage');
    gameHistory = []; 
}

function exportGameHistory() {
    let data = localStorage.getItem('utttGameHistory');
    if (!data) {
        console.log('No game history to export');
        return;
    }
    let blob = new Blob([data], {type: 'application/json'});
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'uttt_game_history.json';
    a.click();
    console.log('Game history exported');
}

async function getNeuralNetworkMove(localBoards) {
    if (!model) {
        console.warn('Neural network model not loaded. Skipping NN prediction.');
        return null;
    }

    try {
        let boardTensor = tf.tensor(convertBoardToModelInput(localBoards)).expandDims();
        let moveProbabilities = await model.predict(boardTensor).array();
        console.log('Neural network move probabilities:', moveProbabilities[0]);
        return moveProbabilities[0];
    } catch (error) {
        console.error('Error in neural network prediction:', error);
        return null;
    }
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

loadModel();

console.log('AI player module loaded');

export { logGameState, saveGameHistoryToLocalStorage, exportGameHistory, getNeuralNetworkMove };