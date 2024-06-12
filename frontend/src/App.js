import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [data, setData] = useState('');
    const [error, setError] = useState(null);
    const [users, setUsers] = useState({});

    useEffect(() => {
        fetchUsers()
    }, []);

    const fetchUsers = async () => {
      try {
        console.log('Fetching users...');
        const response = await axios.get('http://localhost:3000/users');
        console.log('Users fetched:', response.data);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    return (
        <div className="App">
            <header className="App-header">
                <p>Redis Value: {data}</p>
                {error && <p>Error: {error}</p>}
                <button onClick={fetch}> CLICK method</button>
            </header>
        </div>
    );
}

export default App;
