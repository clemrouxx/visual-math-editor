import { MathJax } from "better-react-mathjax";
import React from "react";
import { Tooltip } from "react-tooltip";
import Keyboard from "./Keyboard";

const VirtualKeyboard = ({ formulaEditorRef }) => {
  const reversedShortcuts = Object.fromEntries(Object.entries(Keyboard.SHORTCUTS).map(([key, value]) => [value, key]));
  const symblist = ["\\alpha","\\beta","\\gamma"];
  return (
    <MathJax>
    <div className="virtual-keyboard">
        
            {symblist.map((symbol, index) => (
              <VirtualKey symbol={symbol} tooltip={reversedShortcuts[symbol]} reference={formulaEditorRef} key={index}/>
            ))}

    </div>
    </MathJax>
  );
};

const VirtualKey = ({symbol,tooltip,reference}) => {
  const tooltipId = symbol.replace(" ","__").replace("\\","--");// Necessary replacement to have a valid (but still unique) id
  return (
    <div>
      <button data-tooltip-id={tooltipId} data-tooltip-content={tooltip} onClick={() => reference.current?.addSymbol(symbol)}>
            {`\\[${symbol} \\]`}
        </button>
        <Tooltip id={tooltipId} />
    </div>
  );
}

export default VirtualKeyboard;
