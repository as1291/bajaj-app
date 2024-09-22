import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [fileInput, setFileInput] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileInput(reader.result.split(',')[1]); // Get base64 part
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);

    try {
      const data = JSON.parse(jsonInput);
      if (!data || !data.data) {
        throw new Error('Invalid JSON format');
      }

      const payload = {
        data: data.data,
        file_b64: fileInput,
      };

      const res = await axios.post('http://localhost:5000/bfhl', payload);
      setResponse(res.data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>ABCD123</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="4"
          cols="50"
          value={jsonInput}
          onChange={handleJsonChange}
          placeholder='Enter JSON here, e.g., {"data": ["A", "C", "z"]}'
          required
        />
        <br />
        <input type="file" onChange={handleFileChange} />
        <br />
        <button type="submit">Submit</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {response && (
        <div>
          <h2>Response:</h2>
          <p>User ID: {response.user_id}</p>
          <p>Email: {response.email}</p>
          <p>Roll Number: {response.roll_number}</p>
          <p>Numbers: {JSON.stringify(response.numbers)}</p>
          <p>Alphabets: {JSON.stringify(response.alphabets)}</p>
          <p>Highest Lowercase Alphabet: {JSON.stringify(response.highest_lowercase_alphabet)}</p>
          <p>File Valid: {response.file_valid ? 'Yes' : 'No'}</p>
          <p>File MIME Type: {response.file_mime_type}</p>
          <p>File Size (KB): {response.file_size_kb}</p>
        </div>
      )}
    </div>
  );
}

export default App;
