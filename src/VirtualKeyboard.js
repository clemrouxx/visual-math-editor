import { MathJax } from "better-react-mathjax";
import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import Keyboard from "./Keyboard";
import MathTree from "./MathTree";

const GREEK_LETTERS = ["\\alpha","\\beta","\\gamma","\\Gamma","\\delta","\\Delta","\\epsilon","\\varepsilon","\\zeta","\\eta","\\theta","\\vartheta","\\Theta","\\iota","\\kappa","\\varkappa","\\lambda","\\Lambda","\\mu","\\nu","\\xi","\\Xi","\\pi","\\Pi","\\rho","\\varrho","\\sigma","\\Sigma","\\tau","\\upsilon","\\Upsilon","\\phi","\\varphi","\\Phi","\\chi","\\psi","\\Psi","\\omega","\\Omega"];
const MISC = ["\\infty","\\partial","\\forall","\\exists","\\nexists","\\varnothing","\\ell","\\nabla","\\triangle","\\angle","\\square","\\hbar","\\Im","\\Re","\\bigstar","\\complement","\\therefore","\\because","\\dots"]
const ARROWS = ["\\rightarrow","\\mapsto","\\Rightarrow","\\leftarrow","\\Leftarrow","\\leftrightarrow","\\Leftrightarrow","\\Longleftrightarrow","\\rightleftharpoons","\\rightleftarrows","\\downarrow","\\Downarrow","\\uparrow","\\updownarrow","\\Updownarrow","\\Uparrow","\\nearrow","\\searrow","\\swarrow","\\nwarrow"];// To be completed...
// I should have a default and extended table for some of the categories
const ACCENTS = Keyboard.ACCENTS;

const ENVIRONMENT_NAMES = ["cases","pmatrix","bmatrix","Bmatrix","vmatrix","Vmatrix"];
const ENVIRONMENT_DISPLAY_INNER = ". & . \\\\ . & .";

const DELIMITERS = ["\\lvert","\\lVert","\\lfloor","\\lceil","\\langle"];

const BINARY_OPERATORS = ["\\times","\\div","\\cdot","\\circ","\\pm","\\mp","\\oplus","\\otimes","\\cap","\\cup","\\sqcap","\\sqcup","\\wedge","\\vee"];
const RELATIONS = ["\\equiv","\\cong","\\neq","\\sim","\\approx","\\propto","\\triangleq","\\ncong","\\perp","\\parallel","\\nparallel"];
const ORDER = ["\\leq","\\geq","\\ll","\\gg","\\subset","\\supset","\\subseteq","\\supseteq","\\in","\\ni","\\notin","\\lll","\\ggg","\\lesssim","\\gtrsim","\\nless","\\ngtr","\\nleq","\\ngeq","\\not\\subset","\\not\\supset","\\nsubseteq","\\nsupseteq","\\mid","\\nmid"];

const VARSIZE = ["\\sum","\\prod","\\int","\\iint","\\iiint","\\oint","\\bigcup","\\bigcap","\\bigoplus","\\bigotimes"];
const CONSTRUCTS = VARSIZE.concat("\\overbrace","\\underbrace","\\widehat","\\overrightarrow","\\ket","\\bra");

const NAMED_FUNCTIONS = ["\\exp","\\log","\\min","\\max","\\arg","\\lim","\\cos","\\sin","\\tan","\\arccos","\\arcsin","\\arctan","\\cosh","\\sinh","\\tanh","\\det","\\ker","\\inf","\\sup","\\deg","\\cot","\\sec"];

const VirtualKeyboard = ({ formulaEditorRef }) => {
  const reversedShortcuts = Object.fromEntries(Object.entries(Keyboard.SHORTCUTS).map(([key, value]) => [value, key]));
  const getShortcut = (symbol) => reversedShortcuts[symbol] ? `${reversedShortcuts[symbol]} [Space]` : undefined;
  return (
    <MathJax>
    <div className="virtual-keyboard">
      <FirstRow reference={formulaEditorRef} getShortcut={getShortcut} />
      <Category title="Greek letters" symbols={GREEK_LETTERS} getShortcut={getShortcut} reference={formulaEditorRef} className="wide-category"/>
      <Category title="Arrows" symbols={ARROWS} getShortcut={getShortcut} reference={formulaEditorRef} threasholdIndex={13}/>
      <Category title="Ordering relations" symbols={ORDER} getShortcut={getShortcut} reference={formulaEditorRef}/>
      <Category title="Binary operators" symbols={BINARY_OPERATORS} getShortcut={getShortcut} reference={formulaEditorRef}/>
      <Category title="Miscellaneous" symbols={MISC} getShortcut={getShortcut} reference={formulaEditorRef}/>
      <Category title="Equivalence relations" symbols={RELATIONS} getShortcut={getShortcut} reference={formulaEditorRef}/>
      <Category title="Other constructs" symbols={CONSTRUCTS} getShortcut={getShortcut} reference={formulaEditorRef} keyClassName="x-small-text larger-button"/>
      <Category title="Functions" symbols={NAMED_FUNCTIONS} getShortcut={getShortcut} reference={formulaEditorRef} threasholdIndex={15} className="wide-category"/>
      <Category title="Accents" symbols={ACCENTS} getShortcut={getShortcut} reference={formulaEditorRef}/>

      <div>
        <h3>Multiline environments</h3>
        <div className="key-row">
          {ENVIRONMENT_NAMES.map((name, index) => (
            <VirtualKey symbol={`\\begin{${name}}`} display={`\\begin{${name}}${ENVIRONMENT_DISPLAY_INNER}\\end{${name}}`} tooltip={getShortcut(`\\begin{${name}}`)} reference={formulaEditorRef} key={index} className="x-small-text larger-button"/>
          ))}
        </div>
      </div>
    </div>
    </MathJax>
  );
};

const FirstRow = ({reference,getShortcut}) => {
  const PLACEHOLDER_STRING = "\\class{math-placeholder}{\\square}"
  return (
    <div className="first-row">
      <h3>Common constructs</h3>
      <div className="key-row">
        <NodeVirtualKey uniqueName="squared" display={`${PLACEHOLDER_STRING}^2`} node={{symbol:"^",children:[{symbol:"2"}]}} reference={reference}/>
        <VirtualKey symbol="^" display={`A^${PLACEHOLDER_STRING}`} tooltip="^"  reference={reference}/>
        <VirtualKey symbol="_" display={`A_${PLACEHOLDER_STRING}`} tooltip="_ (Underscore)"  reference={reference}/>
        <SymbolVirtualKey symbol="\frac" tooltip={getShortcut("\\frac")} reference={reference} className="x-small-text"/>
        <SymbolVirtualKey symbol="\sqrt" tooltip={getShortcut("\\sqrt")} reference={reference} className="small-text"/>
        <NodeVirtualKey uniqueName="squared" display={MathTree.getFormula(MathTree.FracLike("\\sqrt",true))} node={MathTree.FracLike("\\sqrt")} reference={reference} className="small-text"/>
        </div>
        <div className="key-row">
        {DELIMITERS.map((symbol, index) => (
          <SymbolVirtualKey symbol={symbol} tooltip={getShortcut(symbol)} reference={reference} key={index}/>
        ))}
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


const Category = ({title,symbols,getShortcut,reference,threasholdIndex,className,keyClassName}) => {
  const [showAll,setShowAll] = useState(false);

  return (<div className={className}>
    <h3>{title}</h3>
    <div className={"key-row "}>
      {symbols.map((symbol, index) => (
        <SymbolVirtualKey symbol={symbol} tooltip={getShortcut(symbol)} reference={reference} key={index} className={(threasholdIndex && index>threasholdIndex && !showAll ?"hidden":"") + " "+keyClassName}/>
      ))}
    </div>
    {threasholdIndex && <button className="drawer-handle" onMouseDown={(e) => e.preventDefault()} onClick={()=>{setShowAll(!showAll)}}>{showAll?"Show less":"Show all"}</button>}
  </div>)
}

const NodeVirtualKey = ({uniqueName,node,display,tooltip,reference,className}) => {
  return (
    <div>
      <button onMouseDown={(e) => e.preventDefault()} data-tooltip-id={uniqueName} data-tooltip-content={tooltip} className={className} onClick={() => reference.current?.addNode(node)}>
            {`\\[${display} \\]`}
        </button>
        {tooltip && <Tooltip id={uniqueName} />}
    </div>
  );
}

const VirtualKey = ({symbol,display,tooltip,reference,className}) => {
  const tooltipId = symbol.replace(" ","__").replace("\\","--");// Necessary replacement to have a valid (but still unique) id
  return (
      <button onMouseDown={(e) => e.preventDefault()} data-tooltip-id={tooltipId} data-tooltip-content={tooltip} className={className} onClick={() => reference.current?.addSymbol(symbol)}>
            {`\\[${display} \\]`} {tooltip && <Tooltip id={tooltipId} />}
      </button>
  );
}

const SymbolVirtualKey = ({symbol,tooltip,reference,className}) => {
  const formula = MathTree.getFormula(MathTree.getNode(symbol,false,true));
  return (
    <VirtualKey symbol={symbol} display={formula} tooltip={tooltip} reference={reference} className={className}/>
  );
}

export default VirtualKeyboard;
