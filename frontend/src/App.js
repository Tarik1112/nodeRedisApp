import React, { useEffect, useState } from 'react';
import ApiTimer from './components/ApiTimer';
import axios from 'axios';

function App() {
    return (
        <div className="App">
            <ApiTimer />
        </div>
    );
}

export default App;
