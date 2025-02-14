import React, { useState } from 'react';
import MathComponent from './MathJax';
import './App.css'; // Optional: For styling

function App() {

  return (
    <div className="App">
      <h1>React MathJax Example</h1>
      <MathComponent/>
    </div>
  );
}

export default App;