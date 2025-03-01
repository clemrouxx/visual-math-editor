import { MathJax } from "better-react-mathjax";
import React from "react";
import { Tooltip } from "react-tooltip";
import Keyboard from "./Keyboard";
import MathTree from "./MathTree";

const COMMON_SYMBOLS = ["^","_"];
const GREEK_LETTERS = ["\\alpha","\\beta","\\gamma","\\Gamma","\\delta","\\Delta","\\epsilon","\\varepsilon","\\zeta","\\eta","\\theta","\\vartheta","\\Theta","\\iota","\\kappa","\\varkappa","\\lambda","\\Lambda","\\mu","\\nu","\\xi","\\Xi","\\pi","\\Pi","\\rho","\\varrho","\\sigma","\\Sigma","\\tau","\\upsilon","\\Upsilon","\\phi","\\varphi","\\Phi","\\chi","\\psi","\\Psi","\\omega","\\Omega"];
const LETTER_LIKE_SYMBOLS = ["\\exists","\\forall","\\aleph","\\hbar","\\ell","\\partial","\\Re","\\Im","\\jmath"];

const VirtualKeyboard = ({ formulaEditorRef }) => {
  const reversedShortcuts = Object.fromEntries(Object.entries(Keyboard.SHORTCUTS).map(([key, value]) => [value, key]));
  const getTooltip = (symbol) => reversedShortcuts[symbol] ? `[${reversedShortcuts[symbol]}]` : undefined;
  return (
    <MathJax>
    <div className="virtual-keyboard">
      <h3>Common symbols</h3>
        <div className="key-row">
          {COMMON_SYMBOLS.map((symbol, index) => (
            <SymbolVirtualKey symbol={symbol} tooltip={getTooltip(symbol)} reference={formulaEditorRef} key={index}/>
          ))}
      </div>
      <h3>Greek letters</h3>
      <div className="key-row">
        {GREEK_LETTERS.map((symbol, index) => (
          <SimpleSymbolVirtualKey symbol={symbol} tooltip={getTooltip(symbol)} reference={formulaEditorRef} key={index}/>
        ))}
      </div>
      <h3>Letter-like symbols</h3>
      <div className="key-row">
        {LETTER_LIKE_SYMBOLS.map((symbol, index) => (
          <SimpleSymbolVirtualKey symbol={symbol} tooltip={getTooltip(symbol)} reference={formulaEditorRef} key={index}/>
        ))}
      </div>
    </div>
    </MathJax>
  );
};

const SimpleSymbolVirtualKey = ({symbol,tooltip,reference}) => {
  const tooltipId = symbol.replace(" ","__").replace("\\","--");// Necessary replacement to have a valid (but still unique) id
  return (
    <div>
      <button data-tooltip-id={tooltipId} data-tooltip-content={tooltip} onClick={() => reference.current?.addSymbol(symbol)}>
            {`\\[${symbol} \\]`}
        </button>
        {tooltip && <Tooltip id={tooltipId} />}
    </div>
  );
}

const SymbolVirtualKey = ({symbol,tooltip,reference}) => {
  const tooltipId = symbol.replace(" ","__").replace("\\","--");// Necessary replacement to have a valid (but still unique) id
  const formula = MathTree.getFormula(MathTree.getNode(symbol,false,true));
  return (
    <div>
      <button data-tooltip-id={tooltipId} data-tooltip-content={tooltip} onClick={() => reference.current?.addSymbol(symbol)}>
            {`\\[${formula} \\]`}
        </button>
        {tooltip && <Tooltip id={tooltipId} />}
    </div>
  );
}

export default VirtualKeyboard;
