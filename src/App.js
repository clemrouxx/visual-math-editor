import React, {useState,useEffect,useRef} from 'react';
import './App.css';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import VirtualKeyboard from './VirtualKeyboard';
import MathEditor from './MathEditor';

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
      <div className="menu">
        <button onClick={() => setDarkMode(!darkMode)} onMouseDown={(e) => e.preventDefault()}>
          Toggle Dark Mode
        </button>
        <a href='https://github.com/clemrouxx/visual-math-editor'>Info</a>
      </div>
      <div className="centeredcontent">
        <h1><MathJax>{`\\[ \\sqrt{\\text{isual}} \\text{ } \\mathcal{M}\\text{ath } \\mathbb{E}\\text{ditor} \\]`}</MathJax></h1>
        <MathEditor ref={formulaEditor}/>
        <VirtualKeyboard formulaEditorRef={formulaEditor} />
      </div>
      </MathJaxContext>
    </div>
  );
}

export default App;