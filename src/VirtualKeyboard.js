import { MathJax } from "better-react-mathjax";
import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import MathKeyboard from "./MathKeyboard";
import MathNodes from "./MathNodes";

const GREEK_LETTERS = ["\\alpha","\\beta","\\gamma","\\Gamma","\\delta","\\Delta","\\epsilon","\\varepsilon","\\zeta","\\eta","\\theta","\\vartheta","\\Theta","\\iota","\\kappa","\\varkappa","\\lambda","\\Lambda","\\mu","\\nu","\\xi","\\Xi","\\pi","\\Pi","\\rho","\\varrho","\\sigma","\\Sigma","\\tau","\\upsilon","\\Upsilon","\\phi","\\varphi","\\Phi","\\chi","\\psi","\\Psi","\\omega","\\Omega"];
const MISC = ["\\infty","\\partial","\\forall","\\exists","\\nexists","\\varnothing","\\ell","\\nabla","\\triangle","\\square","\\hbar","\\Im","\\Re","\\complement","\\dagger","\\top","\\therefore","\\dots","\\because","\\vdots","\\ddots","\\ddagger","\\_","\\bigstar","\\emptyset","\\imath","\\jmath","\\sharp","\\flat","\\natural","\\diagdown","\\diagup","\\diamond","\\Diamond","\\Finv","\\Game","\\hslash","\\mho","\\prime","\\surd","\\wp","\\angle","\\measuredangle","\\sphericalangle","\\triangledown","\\vartriangle","\\blacklozenge","\\blacksquare","\\blacktriangle","\\blacktriangledown","\\backprime","\\circledS","\\circledR","\\digamma","\\neg","\\eth","\\S","\\checkmark","\\maltese"];
const ARROWS = ["\\rightarrow","\\mapsto","\\Rightarrow","\\leftarrow","\\Leftarrow","\\leftrightarrow","\\Leftrightarrow","\\Longleftrightarrow","\\rightleftarrows","\\downarrow","\\Downarrow","\\uparrow","\\updownarrow","\\Updownarrow","\\xrightarrow","\\xleftarrow","\\Uparrow","\\longleftarrow","\\Longleftarrow","\\longleftrightarrow","\\longmapsto","\\longrightarrow","\\Longrightarrow","\\nearrow","\\searrow","\\swarrow","\\nwarrow","\\rightharpoondown","\\leftharpoondown","\\rightharpoonup","\\leftharpoonup","\\circlearrowleft","\\circlearrowright","\\curvearrowleft","\\curvearrowright","\\dashleftarrow","\\dashrightarrow","\\downdownarrows","\\upuparrows","\\leftleftarrows","\\rightrightarrows","\\leftrightarrows","\\rightleftarrows","\\leftarrowtail","\\rightarrowtail","\\rightsquigarrow","\\leftrightsquigarrow","\\Lleftarrow","\\Rrightarrow","\\looparrowleft","\\looparrowright","\\Lsh","\\Rsh","\\twoheadleftarrow","\\twoheadrightarrow","\\nLeftarrow","\\nRightarrow","\\nLeftrightarrow","\\nleftarrow","\\nrightarrow","\\nleftrightarrow","\\rightleftharpoons","\\leftrightharpoons","\\downharpoonleft","\\downharpoonright","\\upharpoonleft","\\upharpoonright"];
// I should have a default and extended table for some of the categories
const ACCENTS = MathNodes.ACCENTS;

const ENVIRONMENT_NAMES = ["cases","pmatrix","bmatrix","Bmatrix","vmatrix","Vmatrix"];
const ENVIRONMENT_DISPLAY_INNER = ". & . \\\\ . & .";

const DELIMITERS = ["\\lvert","\\lVert","\\lfloor","\\lceil","\\langle"];

const BINARY_OPERATORS = ["\\times","\\div","\\cdot","\\circ","\\pm","\\mp","\\oplus","\\otimes","\\cap","\\cup","\\sqcap","\\sqcup","\\wedge","\\vee","\\amalg","\\ast","\\bigcirc","\\bigtriangledown","\\bigtriangleup","\\bullet","\\odot","\\ominus","\\oslash","\\star","\\triangleleft","\\triangleright","\\uplus","\\wr","\\barwedge","\\doublebarwedge","\\veebar","\\boxdot","\\boxminus","\\boxplus","\\boxtimes","\\Cap","\\Cup","\\circledast","\\circledcirc","\\circleddash","\\curlyvee","\\curlywedge","\\divideontimes","\\dotplus","\\intercal","\\leftthreetimes","\\rightthreetimes","\\ltimes","\\rtimes","\\smallsetminus"];
const RELATIONS = ["\\neq","\\equiv","\\not\\equiv","\\cong","\\ncong","\\sim","\\nsim","\\approx","\\propto","\\triangleq","\\perp","\\parallel","\\nparallel","\\asymp","\\bowtie","\\doteq","\\frown","\\smile","\\simeq","\\not\\simeq","\\approxeq","\\backsim","\\backsimeq","\\between","\\bumpeq","\\Bumpeq","\\circeq","\\doteqdot","\\eqcirc","\\fallingdotseq","\\risingdotseq","\\pitchfork","\\shortparallel","\\nshortparallel","\\smallfrown","\\smallsmile","\\thickapprox","\\thicksim","\\varpropto"];
const ORDER = ["\\leq","\\geq","\\ll","\\gg","\\subset","\\supset","\\subseteq","\\supseteq","\\in","\\ni","\\notin","\\lesssim","\\gtrsim","\\mid","\\nmid","\\nless","\\ngtr","\\nleq","\\ngeq","\\nsubseteq","\\nsupseteq","\\lll","\\ggg","\\lhd","\\rhd","\\triangleleft","\\triangleright","\\unlhd","\\unrhd","\\prec","\\succ","\\preceq","\\succeq","\\sqsubset","\\sqsupset","\\sqsubseteq","\\sqsupseteq","\\dashv","\\vdash","\\leqq","\\geqq","\\leqslant","\\geqslant","\\lessapprox","\\gtrapprox","\\lessdot","\\gtrdot","\\eqslantless","\\eqslantgtr","\\precsim","\\succsim","\\precapprox","\\succapprox","\\Subset","\\Supset","\\subseteqq","\\supseteqq","\\preccurlyeq","\\succcurlyeq","\\curlyeqprec","\\curlyeqsucc","\\blacktriangleleft","\\blacktriangleright","\\trianglelefteq","\\trianglerighteq","\\lessgtr","\\lesseqgtr","\\gtreqless","\\gtrless","\\models","\\Vdash","\\vDash","\\Vvdash","\\precnapprox","\\succnapprox","\\precnsim","\\succnsim","\\lnapprox","\\gnapprox","\\lnsim","\\gnsim","\\lneq","\\gneq","\\lneqq","\\gneqq","\\subsetneq","\\supsetneq","\\subsetneqq","\\supsetneqq"];

const CONSTRUCTS = ["\\sum","\\prod","\\int","\\iint","\\iiint","\\oint","\\bigcup","\\bigcap","\\bigoplus","\\bigotimes","\\overbrace","\\underbrace","\\widehat","\\overrightarrow","\\ket","\\bra","\\bigwedge","\\bigvee","\\bigodot","\\biguplus","\\iiiint","\\idotsint","\\widetilde","\\overleftarrow","\\overline","\\underline","\\overleftrightarrow","\\underleftrightarrow","\\underleftarrow","\\underrightarrow","\\ulcorner","\\llcorner"];

const NAMED_FUNCTIONS = ["\\exp","\\log","\\min","\\max","\\arg","\\lim","\\cos","\\sin","\\tan","\\arccos","\\arcsin","\\arctan","\\cosh","\\sinh","\\tanh","\\det","\\ker","\\inf","\\sup","\\deg","\\cot","\\sec","\\csc","\\dim","\\gcd","\\hom","\\lg","\\liminf","\\limsup","\\Pr","\\sup","\\injlim","\\projlim","\\varinjlim","\\varprojlim","\\varliminf","\\varlimsup"];

const VirtualKeyboard = ({ formulaEditorRef }) => {
  const reversedShortcuts = Object.fromEntries(Object.entries(MathKeyboard.SHORTCUTS).map(([key, value]) => [value, key]));
  const getShortcut = (symbol) => reversedShortcuts[symbol] ? `${reversedShortcuts[symbol]} [Space]` : undefined;
  return (
    <MathJax>
    <div className="virtual-keyboard">
      <FirstRow reference={formulaEditorRef} getShortcut={getShortcut} />
      <Category title="Greek letters" symbols={GREEK_LETTERS} getShortcut={getShortcut} reference={formulaEditorRef} className="wide-category"/>
      <Category title="Miscellaneous" symbols={MISC} getShortcut={getShortcut} reference={formulaEditorRef} threasholdIndex={17}/>
      <MultilineCategory getShortcut={getShortcut} reference={formulaEditorRef}/>
      <Category title="Arrows" symbols={ARROWS} getShortcut={getShortcut} reference={formulaEditorRef} threasholdIndex={14}/>
      <Category title="Binary 'equivalence' relations" symbols={RELATIONS} getShortcut={getShortcut} reference={formulaEditorRef} threasholdIndex={12}/>
      <Category title="Binary 'ordering' relations" symbols={ORDER} getShortcut={getShortcut} reference={formulaEditorRef} threasholdIndex={16}/>
      <Category title="Binary operators" symbols={BINARY_OPERATORS} getShortcut={getShortcut} reference={formulaEditorRef} threasholdIndex={13}/>
      <Category title="Other constructs" symbols={CONSTRUCTS} getShortcut={getShortcut} reference={formulaEditorRef} threasholdIndex={15} keyClassName="x-small-text larger-button"/>
      <Category title="Functions & similar" symbols={NAMED_FUNCTIONS} getShortcut={getShortcut} reference={formulaEditorRef} threasholdIndex={15} className="wide-category"/>
      <Category title="Accents" symbols={ACCENTS} getShortcut={getShortcut} reference={formulaEditorRef}/>
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
        <NodeVirtualKey nodeName="squared" tooltip={getShortcut("squared")} display={`${PLACEHOLDER_STRING}^2`} reference={reference}/>
        <VirtualKey symbol="^" display={`A^${PLACEHOLDER_STRING}`} tooltip="Ctrl+u OR ^"  reference={reference}/>
        <VirtualKey symbol="_" display={`A_${PLACEHOLDER_STRING}`} tooltip="Ctrl+d OR _"  reference={reference}/>
        <SymbolVirtualKey symbol="\frac" tooltip={getShortcut("\\frac")} reference={reference} className="x-small-text"/>
        <SymbolVirtualKey symbol="\sqrt" tooltip={getShortcut("\\sqrt")} reference={reference} className="small-text"/>
        <NodeVirtualKey nodeName="nsqrt" tooltip={getShortcut("nsqrt")} display={MathNodes.getFormula(MathNodes.FracLike("\\sqrt",true))}  reference={reference} className="small-text"/>
        <VirtualKey symbol="\not" display={`/`} tooltip={getShortcut("\\not")}  reference={reference}/>
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

const MultilineCategory =  ({reference,getShortcut}) => {
  return (
  <div>
    <h3>Multiline environments</h3>
    <div className="key-row">
    <VirtualKey symbol={`\\begin{array}{}`} display={`\\begin{array}{}${ENVIRONMENT_DISPLAY_INNER}\\end{array}`} tooltip={getShortcut(`\\begin{array}`)} reference={reference} className="x-small-text larger-button"/>
      {ENVIRONMENT_NAMES.map((name, index) => (
        <VirtualKey symbol={`\\begin{${name}}`} display={`\\begin{${name}}${ENVIRONMENT_DISPLAY_INNER}\\end{${name}}`} tooltip={getShortcut(`\\begin{${name}}`)} reference={reference} key={index} className="x-small-text larger-button"/>
      ))}
    </div>
  </div>);
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

const NodeVirtualKey = ({nodeName,display,tooltip,reference,className}) => {
  return (
    <div>
      <button onMouseDown={(e) => e.preventDefault()} data-tooltip-id={nodeName} data-tooltip-content={tooltip} className={className} onClick={() => reference.current?.addNode(MathNodes.NAMED_NODES[nodeName],true)}>
            {`\\[${display} \\]`}
        </button>
        {tooltip && <Tooltip id={nodeName} />}
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
  const formula = MathNodes.getFormula(MathNodes.getNode(symbol,false,true));
  return (
    <VirtualKey symbol={symbol} display={formula} tooltip={tooltip} reference={reference} className={className}/>
  );
}

export default VirtualKeyboard;
