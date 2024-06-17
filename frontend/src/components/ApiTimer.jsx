// src/ApiTimer.js

import React, { useState } from 'react';
import axios from 'axios';

const ApiTimer = () => {
  const [responseTime, setResponseTime] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const callApi = async () => {
    const startTime = performance.now();

    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1'); // Replace with your API URL
      const endTime = performance.now();
      setResponseTime(endTime - startTime);
      setData(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>API Response Timer</h1>
      <button onClick={callApi}>Call API</button>
      {responseTime && <p>Response Time: {responseTime.toFixed(2)} ms</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default ApiTimer;
