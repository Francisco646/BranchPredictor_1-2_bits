// Enabling file reading
const fs = require('fs');

// Parameters
let branchHistoryTable = []
let statesHistoryTable = []
const ENTRY_BITS = 3
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
    let index = branchHistoryTable.indexOf(branchAddress)
    if(index === -1) {
        return 0;                           // Predict taken if branch address not present
    } else {
        return statesHistoryTable[index]    // Predict the state of the position where branch address found
    }
}

// Function to update the branch history table
function update(branchAddress, actualValue) {

    branchHistoryTable.unshift(branchAddress)
    statesHistoryTable.unshift(actualValue)

    if(branchHistoryTable.length > TABLE_SIZE){
        branchHistoryTable.pop();
        statesHistoryTable.pop();
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

        /*
        if(parsedBranchAddress === 4719809){
            console.log(`Predicted: ${predictedResult}`, `Actual result: ${actualResult}`, `Correct Value: ${correctValue}`)
            console.log("-------------------------")  // To separate each result pair in the output file.
        }
        */

        if(actualResult === predictedResult){
            correctPredictions++;
        }

        update(parsedBranchAddress, actualResult);
        totalPredictions++;
    }

    //console.log(branchHistoryTable)
    //console.log(statesHistoryTable)

    const accuracy = (correctPredictions / totalPredictions) * 100;
    console.log(`Prediction Accuracy: ${accuracy.toFixed(2)}%`);
    console.log(`Correct Predictions: ${correctPredictions}`)
    console.log(`Total Predictions: ${totalPredictions}`);
}