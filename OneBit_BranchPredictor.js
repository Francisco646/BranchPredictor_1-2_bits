// Enabling file reading
const fs = require('fs');

// Parameters
let branchHistoryTable = []
const ENTRY_BITS = 4
const TABLE_SIZE = Math.pow(2, ENTRY_BITS)

// Read the introduced file
fs.readFile('gcc-10K.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    processFile(data);
});

// Function to make predictions based on last branch outcome
function predictResult(branchAddress){
    // Get the first row that contains the specified branch address, if present
    const entry = branchHistoryTable.find(entry => entry.address === branchAddress);

    if(entry === undefined) {
        return 0;               // Predict not taken by default
    } else {
        return entry.state      // Return the last outcome in the table for that specific branch
    }
}

// Function to update the branch history table
function update(branchAddress, actualValue) {
    branchHistoryTable.unshift({ address: branchAddress, state: actualValue })

    if(branchHistoryTable.length > TABLE_SIZE){
        branchHistoryTable.pop();
    }
}

// Function that manages the predictor. Processes the file.
function processFile(data){
    const lines = data.trim().split('\n');
    let correctPredictions = 0;
    let totalPredictions = 0;

    for(let line of lines){
        const [branchAddress, correctValue] = line.trim().split(' ');
        const parsedBranchAddress = parseInt(branchAddress, 16)

        const actualResult = (correctValue === "T") ? 1 : 0;
        const predictedResult = predictResult(parsedBranchAddress);

        if(actualResult === predictedResult){
            correctPredictions++;
        }

        update(parsedBranchAddress, actualResult);
        totalPredictions++;
    }

    console.log(branchHistoryTable)

    const accuracy = (correctPredictions / totalPredictions) * 100;
    console.log(`Prediction Accuracy: ${accuracy.toFixed(2)}%`);
    console.log(`Correct Predictions: ${correctPredictions}`)
    console.log(`Total Predictions: ${totalPredictions}`);
}