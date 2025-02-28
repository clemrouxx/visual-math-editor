import React, {useState,useEffect,useRef} from 'react';
import MathComponent from './MathJax';
import './App.css';
import { MathJaxContext } from 'better-react-mathjax';

function App() {

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [darkMode, setDarkMode] = useState(prefersDark);
  const formulaEditor = useRef();

  
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

  
    useEffect(() => {
      document.body.classList.toggle("dark", darkMode);
    }, [darkMode]);

  return (
    <div className="App">
      <MathJaxContext config={config}>
      <div class="menu">
      <button onClick={() => setDarkMode(!darkMode)}>
        Toggle Dark Mode
      </button>
      </div>
      <div class="centeredcontent">
        <h1>Visual Math Editor</h1>
        <MathComponent ref={formulaEditor}/>
        <button onClick={() => formulaEditor.current?.addSymbol("\\#")}>
        Call Child Function from Parent
        </button>
      </div>
      </MathJaxContext>
    </div>
  );
}

export default App;