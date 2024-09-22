const express = require('express');
const multer = require('multer');
const path = require('path');
const { Buffer } = require('buffer');

// Create the Express app
const app = express();

// Use JSON middleware to parse JSON requests
app.use(express.json({ limit: '50mb' })); // To handle large base64 file

// Utility function to extract numbers and alphabets
function extractNumbersAndAlphabets(inputArray) {
  const numbers = inputArray.filter(item => !isNaN(item));
  const alphabets = inputArray.filter(item => /^[a-zA-Z]$/.test(item));
  return { numbers, alphabets };
}

// Utility function to find the highest lowercase alphabet
function highestLowercaseAlphabet(alphabets) {
  const lowercaseAlphabets = alphabets.filter(char => char >= 'a' && char <= 'z');
  return lowercaseAlphabets.length > 0 ? [Math.max(...lowercaseAlphabets)] : [];
}

// Utility function to validate base64 file
function validateBase64File(base64String) {
  const mimeMatch = base64String.match(/^data:(.*?);base64,/);
  if (mimeMatch) {
    const mimeType = mimeMatch[1];
    const fileData = base64String.replace(/^data:.*;base64,/, '');
    const fileBuffer = Buffer.from(fileData, 'base64');
    const fileSizeKB = (fileBuffer.length / 1024).toFixed(2); // Convert bytes to KB
    
    return {
      validFile: true,
      mimeType,
      sizeKB: fileSizeKB,
    };
  }
  return {
    validFile: false,
    mimeType: null,
    sizeKB: null,
  };
}

// Endpoint: POST method
app.post('/bfhl', (req, res) => {
  const { data, file_b64 } = req.body;
  const userId = "john_doe_17091999";
  const email = "john@xyz.com";
  const rollNumber = "ABCD123";

  // Extract numbers and alphabets
  const { numbers, alphabets } = extractNumbersAndAlphabets(data);

  // Find highest lowercase alphabet
  const highestAlphabet = highestLowercaseAlphabet(alphabets);

  // Validate the base64 file
  const fileInfo = validateBase64File(file_b64);

  // Response object
  const response = {
    is_success: true,
    user_id: userId,
    email,
    roll_number: rollNumber,
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestAlphabet,
    file_valid: fileInfo.validFile,
    file_mime_type: fileInfo.mimeType,
    file_size_kb: fileInfo.sizeKB,
  };

  // Send the response
  res.json(response);
});

app.get('/bfhl', (req, res) => {
  // Hardcoded response
  const response = {
    operation_code: 1
  };

  // Send the response with HTTP status code 200
  res.status(200).json(response);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
