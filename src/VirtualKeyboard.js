import { MathJax } from "better-react-mathjax";
import React from "react";
import { Tooltip } from "react-tooltip";
import Keyboard from "./Keyboard";

const GREEK_LETTERS = ["\\alpha","\\beta","\\gamma","\\Gamma","\\delta","\\Delta","\\epsilon","\\varepsilon","\\zeta","\\eta","\\theta","\\vartheta","\\Theta","\\iota","\\kappa","\\varkappa","\\lambda","\\Lambda","\\mu","\\nu","\\xi","\\Xi","\\pi","\\Pi","\\rho","\\varrho","\\sigma","\\Sigma","\\tau","\\upsilon","\\Upsilon","\\phi","\\varphi","\\Phi","\\chi","\\psi","\\Psi","\\omega","\\Omega"];

const VirtualKeyboard = ({ formulaEditorRef }) => {
  const reversedShortcuts = Object.fromEntries(Object.entries(Keyboard.SHORTCUTS).map(([key, value]) => [value, key]));
  return (
    <MathJax>
    <div className="virtual-keyboard">
      <h3>Greek letters</h3>
      <div className="key-row">
              {GREEK_LETTERS.map((symbol, index) => (
                <SymbolVirtualKey symbol={symbol} tooltip={`[${reversedShortcuts[symbol]}]`} reference={formulaEditorRef} key={index}/>
              ))}
      </div>
    </div>
    </MathJax>
  );
};

const SymbolVirtualKey = ({symbol,tooltip,reference}) => {
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
