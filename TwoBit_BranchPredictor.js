// Enabling file reading
const fs = require('fs');

// States
const STATES = {
    STRONGLY_NOT_TAKEN: 0,
    WEAKLY_NOT_TAKEN: 1,
    WEAKLY_TAKEN: 2,
    STRONGLY_TAKEN: 3
};

// Parameters
const MAX_HISTORY_LENGTH = 16;
const MAX_BRANCHES = 16;
const branchQueue = [];              // Keep history of used addresses
const statesHistoryTable = {};          // Addresses and their histories stored here

// Read the introduced file
fs.readFile('gcc-10K.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    processFile(data);
});

// Function to predict outcome based on last branch outcome
function predictResult(branchAddress){
    if(!statesHistoryTable[branchAddress] || statesHistoryTable[branchAddress].length === 0) {
        return 0;
    } else {
        const lastState = statesHistoryTable[branchAddress][0];
        return lastState > STATES.WEAKLY_NOT_TAKEN ? 1 : 0;
    }
}

// Function to predict state based on last branch outcome
function getState(branchAddress){
    if (!statesHistoryTable[branchAddress] || statesHistoryTable[branchAddress].length === 0) {
        return STATES.WEAKLY_NOT_TAKEN;
    } else {
        return statesHistoryTable[branchAddress][0];
    }
}

// Function to update the branch history table
function update(branchAddress, stateToInsert, actualValue) {

    if (actualValue === 1) {
        if (stateToInsert < STATES.STRONGLY_TAKEN) {
            stateToInsert++;
        }
    } else {
        if (stateToInsert > STATES.STRONGLY_NOT_TAKEN) {
            stateToInsert--;
        }
    }

    if (!statesHistoryTable[branchAddress]) {
        statesHistoryTable[branchAddress] = [];
        branchQueue.push(branchAddress);
        statesHistoryTable[branchAddress].unshift(STATES.WEAKLY_NOT_TAKEN);

        // Oldest address in the history table will be removed
        if (branchQueue.length > MAX_BRANCHES) {
            const oldestBranch = branchQueue.shift();
            delete statesHistoryTable[oldestBranch];
        }
    } else {
        statesHistoryTable[branchAddress].unshift(stateToInsert);
    }

    if (statesHistoryTable[branchAddress].length > MAX_HISTORY_LENGTH) {
        statesHistoryTable[branchAddress].pop();
    }
}

// Function that manages the predictor. Processes the file.
function processFile(data){
    const lines = data.trim().split('\n');
    let correctPredictions = 0;
    let totalPredictions = 0;

    for (let line of lines) {
        const [branchAddress, correctValue] = line.trim().split(' ');
        const parsedBranchAddress = parseInt(branchAddress, 16);

        const actualResult = (correctValue === "T") ? 1 : 0;
        const predictedResult = predictResult(parsedBranchAddress);

        if (actualResult === predictedResult) {
            correctPredictions++;
        }

        const stateToInsert = getState(parsedBranchAddress);
        update(parsedBranchAddress, stateToInsert, actualResult);
        totalPredictions++;
    }

    const accuracy = (correctPredictions / totalPredictions) * 100;
    console.log(`Prediction Accuracy: ${accuracy.toFixed(2)}%`);
    console.log(`Correct Predictions: ${correctPredictions}`)
    console.log(`Total Predictions: ${totalPredictions}`);
}