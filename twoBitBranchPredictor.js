// Enabling file reading
const fs = require('fs');

const STATES = {
    STRONGLY_NOT_TAKEN: 0,
    WEAKLY_NOT_TAKEN: 1,
    WEAKLY_TAKEN: 2,
    STRONGLY_TAKEN: 3
};

// Parameters
let branchHistoryTable = [];
let statesHistoryTable = {};
const ENTRY_BITS = 3;
const TABLE_SIZE = Math.pow(2, ENTRY_BITS);

// Read the introduced file
fs.readFile('gcc-10K.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    processFile(data);
});

// Function to make predictions based on last branch outcome
function predictResult(branchAddress) {
    if (!(branchAddress in statesHistoryTable)) {
        return 0; // Predict not taken if branch address not present
    } else {
        return statesHistoryTable[branchAddress] > 1 ? 1 : 0; // Use the latest state in history
    }
}

// Function to update the branch history table
function update(branchAddress, actualValue) {
    if (!(branchAddress in statesHistoryTable)) {
        branchHistoryTable.unshift(branchAddress);
        statesHistoryTable[branchAddress] = STATES.WEAKLY_NOT_TAKEN; // Initialize the state
    } else {
        let stateToInsert = statesHistoryTable[branchAddress];
        if (actualValue === 1) {
            if (stateToInsert < STATES.STRONGLY_TAKEN) {
                stateToInsert++;
            }
        } else {
            if (stateToInsert > STATES.STRONGLY_NOT_TAKEN) {
                stateToInsert--;
            }
        }
        statesHistoryTable[branchAddress] = stateToInsert; // Update the state
    }

    // Ensure that the history table only retains a limited number of entries
    if (branchHistoryTable.length > TABLE_SIZE) {
        const removedAddress = branchHistoryTable.pop(); // Remove the oldest entry
        delete statesHistoryTable[removedAddress]; // Clean up the state table as well
    }
}

// Function that manages the predictor. Processes the file.
function processFile(data) {
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

        update(parsedBranchAddress, actualResult);
        totalPredictions++;
    }

    const accuracy = (correctPredictions / totalPredictions) * 100;
    console.log(`Prediction Accuracy: ${accuracy.toFixed(2)}%`);
    console.log(`Correct Predictions: ${correctPredictions}`);
    console.log(`Total Predictions: ${totalPredictions}`);
}