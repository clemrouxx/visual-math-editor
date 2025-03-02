import { MathJax } from "better-react-mathjax";
import React, { Children } from "react";
import { Tooltip } from "react-tooltip";
import Keyboard from "./Keyboard";
import MathTree from "./MathTree";

const COMMON_SYMBOLS = ["^","_"];
const GREEK_LETTERS = ["\\alpha","\\beta","\\gamma","\\Gamma","\\delta","\\Delta","\\epsilon","\\varepsilon","\\zeta","\\eta","\\theta","\\vartheta","\\Theta","\\iota","\\kappa","\\varkappa","\\lambda","\\Lambda","\\mu","\\nu","\\xi","\\Xi","\\pi","\\Pi","\\rho","\\varrho","\\sigma","\\Sigma","\\tau","\\upsilon","\\Upsilon","\\phi","\\varphi","\\Phi","\\chi","\\psi","\\Psi","\\omega","\\Omega"];
const MISC = ["\\exists","\\nexists","\\forall","\\aleph","\\hbar","\\ell","\\partial","\\Re","\\Im","\\imath","\\jmath","\\top","\\infty","\\nabla","\\cdots","\\emptyset","\\varnothing","\\square"];
const ARROWS = ["\\rightarrow","\\mapsto","\\Rightarrow","\\leftarrow","\\Leftarrow","\\leftrightarrow","\\Leftrightarrow","\\rightleftharpoons","\\rightleftarrows","\\downarrow","\\Downarrow","\\uparrow","\\Uparrow","\\updownarrow","\\Updownarrow","\\nearrow","\\searrow","\\swarrow","\\nwarrow",];// To be completed...
// I should have a default and extended table for some of the categories
const ACCENTS = Keyboard.ACCENTS;

const VirtualKeyboard = ({ formulaEditorRef }) => {
  const reversedShortcuts = Object.fromEntries(Object.entries(Keyboard.SHORTCUTS).map(([key, value]) => [value, key]));
  const getShortcut = (symbol) => reversedShortcuts[symbol] ? `(${reversedShortcuts[symbol]})` : undefined;
  return (
    <MathJax>
    <div className="virtual-keyboard">
      <FirstRow reference={formulaEditorRef} getShortcut={getShortcut} />
      <SimpleCategory title="Greek letters" symbols={GREEK_LETTERS} getShortcut={getShortcut} reference={formulaEditorRef}/>
      <SimpleCategory title="Miscellaneous" symbols={MISC} getShortcut={getShortcut} reference={formulaEditorRef}/>
      <SimpleCategory title="Arrows" symbols={ARROWS} getShortcut={getShortcut} reference={formulaEditorRef}/>
      <div>
        <h3>Accents</h3>
        <div className="key-row">
          {ACCENTS.map((symbol, index) => (
            <SymbolVirtualKey symbol={symbol} tooltip={getShortcut(symbol)} reference={formulaEditorRef} key={index}/>
          ))}
        </div>
      </div>
    </div>
    </MathJax>
  );
};

const FirstRow = ({reference,getShortcut}) => {
  return (
    <div>
      <h3>Common constructs</h3>
      <div className="key-row">
        <NodeVirtualKey uniqueName="squared" display="\square^2" node={{symbol:"^",children:[{symbol:"2"}]}} reference={reference}/>
        <VirtualKey symbol="^" display="A^\square" tooltip="(^)"  reference={reference}/>
        <VirtualKey symbol="_" display="A_\square" tooltip="(_)"  reference={reference}/>
        <SymbolVirtualKey symbol="\frac" tooltip={getShortcut("\\frac")} reference={reference} className="x-small-text"/>
        <SymbolVirtualKey symbol="\sqrt" tooltip={getShortcut("\\sqrt")} reference={reference} className="small-text"/>
        <NodeVirtualKey uniqueName="squared" display={MathTree.getFormula(MathTree.FracLike("\\sqrt",true))} node={MathTree.FracLike("\\sqrt")} reference={reference} className="small-text"/>
      </div>
      <h3>Styles</h3>
      <div className="key-row">
        <VirtualKey symbol="\mathbf" display="\mathbf{A}" tooltip={getShortcut("\\mathbf")} reference={reference} />
        <VirtualKey symbol="\mathcal" display="\mathcal{A}" tooltip={getShortcut("\\mathcal")} reference={reference} />
        <VirtualKey symbol="\mathbb" display="\mathbb{A}" tooltip={getShortcut("\\mathbb")} reference={reference} />
        <VirtualKey symbol="\mathfrak" display="\mathfrak{A}" tooltip={getShortcut("\\mathfrak")} reference={reference} />
        <VirtualKey symbol="\mathsf" display="\mathsf{A}" tooltip={getShortcut("\\mathsf")} reference={reference} />
        <VirtualKey symbol="\text" display="\text{Tt}" tooltip={getShortcut("\\text")} reference={reference} />
      </div>
    </div>
  );
}

const SimpleCategory = ({title,symbols,getShortcut,reference}) => {
  return (<div>
    <h3>{title}</h3>
    <div className="key-row">
      {symbols.map((symbol, index) => (
        <SimpleSymbolVirtualKey symbol={symbol} tooltip={getShortcut(symbol)} reference={reference} key={index}/>
      ))}
    </div>
  </div>)
}

const NodeVirtualKey = ({uniqueName,node,display,tooltip,reference,className}) => {
  return (
    <div>
      <button data-tooltip-id={uniqueName} data-tooltip-content={tooltip} className={className} onClick={() => reference.current?.addNode(node)}>
            {`\\[${display} \\]`}
        </button>
        {tooltip && <Tooltip id={uniqueName} />}
    </div>
  );
}

const VirtualKey = ({symbol,display,tooltip,reference,className}) => {
  const tooltipId = symbol.replace(" ","__").replace("\\","--");// Necessary replacement to have a valid (but still unique) id
  return (
    <div>
      <button data-tooltip-id={tooltipId} data-tooltip-content={tooltip} className={className} onClick={() => reference.current?.addSymbol(symbol)}>
            {`\\[${display} \\]`}
        </button>
        {tooltip && <Tooltip id={tooltipId} />}
    </div>
  );
}

const SimpleSymbolVirtualKey = ({symbol,tooltip,reference}) => {
  return (
    <VirtualKey symbol={symbol} display={symbol} tooltip={tooltip} reference={reference} />
  );
}

const SymbolVirtualKey = ({symbol,tooltip,reference,className}) => {
  const formula = MathTree.getFormula(MathTree.getNode(symbol,false,true));
  return (
    <VirtualKey symbol={symbol} display={formula} tooltip={tooltip} reference={reference} className={className}/>
  );
}

export default VirtualKeyboard;
