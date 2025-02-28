import { MathJax } from "better-react-mathjax";
import React from "react";

const VirtualKeyboard = ({ formulaEditorRef }) => {
  return (
    <div class="virtual-keyboard">
        <MathJax>
        <button onClick={() => formulaEditorRef.current?.addSymbol("\\alpha")}>
            {"\\[\\alpha \\]"}
        </button>
        </MathJax>
    </div>
    
  );
};

export default VirtualKeyboard;
