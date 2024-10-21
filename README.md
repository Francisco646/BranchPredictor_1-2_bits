# BranchPredictor_1-2_bits

This repository contains a JavaScript program that simulates two branch predictors: a 1 bit predictor and a 2 bit predictor. Both predictors read branch address outcomes from a file and calculates the prediction accuracy.

## Prerequisites
Make sure you have Node.js installed in your computer. To run the program, just go to the official Node.js website and download it into your machine.
## Getting Started
Now, make sure that you follow these steps so that you'll be able to run your code.

### 1. Clone the repository
First, download the files to your computer and unzip the folder. Then move these folder to the location you prefer to.

### 2. Prepare the input file
For this step, it is important to put the files at the same folder in which the program to execute is currently at. Each line will have a format like the following ones:

<Branch_Address1> <Correct_Value1>

<Branch_Address2> <Correct_Value2>

...

For example, these are the first four lines of one of the submitted text files:

48d1f9 T

48d237 N

48d244 N

48d248 T


### 3. Run the code
Open a command line interface, navigate to the directory where your JavaScript file is located, and run the following command: node <your-javascript-file-name>.js
Being <your-javascript-file-name> the name of the file to execute (either OneBit_BranchPredictor or TwoBit_BranchPredictor).
Please ensure that you enter in the src file inside the project to be able to execute the code.

### 4. View the results
After running the command, you will see the output in the terminal. The output will consist of:

- The branch history table containing the recorded branch outcomes.
- The prediction accuracy percentage.
- The count of correct predictions and total predictions.

#### Example Output (for both files)
Prediction Accuracy: 85.67%

Correct Predictions: 8567

Total Predictions: 10000


#### Adjustments and Improvements
- OneBit_BranchPredictor.js: You can modify ENTRY_BITS to change the size of the branch history table. Memory usage and prediction effectiveness will change depending on the selected value. Please note that the selected value will produce 2^N entries into the history register table, being N the selected number. For example, if you use 4, you will use a table of 2^4 = 16 entries.
- TwoBit_BranchPredictor.js: You can modify MAX_HISTORY_LENGTH and MAX_BRANCHES to change the size of stored history per branch and the size of stored branches, respectively. Changing MAX_HISTORY_LENGTH will not produce any impact on predictor accuracy, because it main function is to show a history of previous outcomes. If you modify MAX_BRANCHES, you will see a different number of branches inside the history table, and the accuracy result will be affected as in the first file; this time, the number of entries is directly affected by the selected number for MAX_BRANCHES: selecting 16 will make you to use a table of 16 entries.
