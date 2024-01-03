const fs = require('fs');
const path = require('path');

// Function to extract chords with their positions
function extractChordsWithPositions(chordsLine) {
    let chordsWithPositions = [];
    let currentPosition = 0;

    chordsLine.split(/\s+/).forEach(chord => {
        if (isValidChord(chord)) { // Check if it's a valid chord
            let index = chordsLine.indexOf(chord, currentPosition);
            chordsWithPositions.push({ chord, position: index });
            currentPosition = index + chord.length;
        }
    });

    return chordsWithPositions;
}

// Function to check if a string is a valid chord
function isValidChord(chord) {
    // Implement your logic to determine if 'chord' is a valid chord
    // For example, you could check if it matches a certain pattern,
    // or if it's in a predefined list of chords
    return chord.length > 0 && !chord.startsWith(' '); // Simple example
}

// Function to process the lines and rearrange chords and lyrics
function processLines(lines) {
    let result = '';
    let chordsLine = '';

    lines.forEach((line, index) => {
        if (index % 2 === 0) {
            // Even index, potential chord line
            chordsLine = line;
        } else {
            // Odd index, lyrics line
            let processedLine = line;
            if (chordsLine.trim() !== '') {
                let chordsWithPositions = extractChordsWithPositions(chordsLine);
                let offset = 0;

                chordsWithPositions.forEach(({ chord, position }) => {
                    if (position + offset <= processedLine.length) {
                        processedLine = processedLine.slice(0, position + offset) + `(${chord})` + processedLine.slice(position + offset);
                        offset += chord.length + 2; // Length of chord plus parentheses
                    }
                });
            }
            result += processedLine + '\n';
        }
    });

    return result;
}

// Function to read and process the file
function processFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }

        const lines = data.split('\n');
        // Filter out empty lines
        const nonEmptyLines = lines.filter(line => line.trim() !== '');
        const processedText = processLines(nonEmptyLines);

        const outputFilePath = path.join(__dirname, 'output.txt');

        fs.writeFile(outputFilePath, processedText, (writeErr) => {
            if (writeErr) {
                console.error('Error writing to the output file:', writeErr);
            } else {
                console.log('Successfully written to the output file:', outputFilePath);
            }
        });

        console.log(processedText);
    });
}

// Replace 'input.txt' with your file path
const filePath = path.join(__dirname, 'input.txt');
processFile(filePath);