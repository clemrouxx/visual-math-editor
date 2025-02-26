import React from 'react';
import MathComponent from './MathJax';
import './App.css';
import { MathJaxContext } from 'better-react-mathjax';

function App() {
  const config = {
      loader: { load: ["[tex]/html","output/chtml"] },
      tex: {
        packages: { "[+]": ["html"] },
      },
      options: {
        enableMenu : false,
        renderActions: {
          assistiveMml: [], // Prevents additional MathML rendering
        },
      },
      output: {
        renderer: "chtml", // Force CHTML instead of SVG
      },
    };

  return (
    <div className="App">
      <MathJaxContext config={config}>
        <h1>Visual Math Editor</h1>
        <MathComponent/>
      </MathJaxContext>
    </div>
  );
}

export default App;