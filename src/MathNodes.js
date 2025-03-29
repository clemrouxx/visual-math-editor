// Defines useful lists / constants / simple functions regarding math nodes, and trnasforming symbols into nodes and nodes into LaTeX

// The following lists / dictionnaries determine the propesrties of the inserted node (regarding selection, cursor placement, deletion...)
// Includes the core and AMS commands (as well as a few commands from the physics package)
const PARENT_SYMBOLS = ["_","^","\\sqrt","\\overline","\\underline","\\widehat","\\widetilde","\\overrightarrow","\\overleftarrow","\\overleftrightarrow","\\underleftarrow","\\underrightarrow","\\underleftrightarrow","\\xleftarrow","\\xrightarrow","\\bra","\\ket","\\Bra","\\Ket","\\abs","\\norm","\\order"];
const ACCENTS = ["\\vec","\\bar","\\dot","\\ddot","\\dddot","\\ddddot","\\hat","\\check","\\tilde","\\breve","\\acute","\\grave","\\mathring"];
const STYLES = ["\\mathcal","\\mathbb","\\mathfrak","\\mathbf","\\mathsf"];
const DELIMITERS = {"(":")","[":"]","\\{":"\\}","\\lvert":"\\rvert","\\lVert":"\\rVert","\\langle":"\\rangle","\\lfloor":"\\rfloor","\\lceil":"\\rceil","\\ulcorner":"\\urcorner","\\llcorner":"\\lrcorner"};
const MODIFIERS = ["\\mathrm","\\text","\\textrm","\\textbf","\\textit"];
const FRAC_LIKE = ["\\frac","\\overbrace","\\underbrace","\\overset","\\underset","\\dv","\\pdv","\\fdv","\\braket","\\ketbra","\\dyad"]; // Symbols that have strictly 2 children (other than sum-like)
const SUM_LIKE = ["\\sum","\\int","\\bigcap","\\bigcup","\\bigodot","\\bigoplus","\\bigotimes","\\bigsqcup","\\biguplus","\\bigvee","\\bigwedge","\\coprod","\\prod"]; // Also strictly 2 children, but displayed differently as fractions
const LIM_LIKE = ["\\lim","\\iint","\\iiint","\\iiiint","\\oint","\\idotsint"];
const ENVIRONMENTS_NAMES = ["align","cases","matrix","pmatrix","bmatrix","Bmatrix","vmatrix","Vmatrix"];
var ENVIRONMENTS = ENVIRONMENTS_NAMES.reduce((acc, name) => {
    acc[`\\begin{${name}}`] = `\\end{${name}}`;
    return acc;
  }, {});
ENVIRONMENTS[`\\begin{array}{}`] = "\\end{array}";

const INVISIBLE_SYMBOLS = ["_","^","\\\\","&","\\hline"]; // Don't have classes attached. Unfortunately seems necessary for hline

const CURSOR = {iscursor:true,symbol:"|"};
const PLACEHOLDER = {isplaceholder:true,symbol:"\\square"}
const SMALLLETTERPLACEHOLDER = {isplaceholder:true,symbol:"x"}
const BIGLETTERPLACEHOLDER = {isplaceholder:true,symbol:"A"}

const DEFAULT_TREE = {isroot:true,nodeletion:true,children:[CURSOR]};

// Functions that act like node constructors
const Symbol = (symbol) => {return {symbol}};
const ParentSymbol = (symbol,addplaceholder=false) => {return {symbol,children:addplaceholder?[PLACEHOLDER]:[],nodeletionfromright:true}};
const LimLike = (symbol,addplaceholder=false) => {return {symbol,children:[],childrenaredown:true,implodes:true}};
const Accent = (symbol,addplaceholder=false) => {return {symbol,children:addplaceholder?[SMALLLETTERPLACEHOLDER]:[],hassinglechild:true}}
const Style = (symbol,addplaceholder=false) => {return {symbol,children:addplaceholder?[BIGLETTERPLACEHOLDER]:[],hassinglechild:true,implodes:true}}
const Delimiter = (symbol,addplaceholder=false) => {return {leftsymbol:symbol,rightsymbol:DELIMITERS[symbol],children:addplaceholder?[PLACEHOLDER]:[],adptative:true}};
const Modifier = (symbol,addplaceholder=false) => {return {symbol,children:[],ismodifier:true,parseastext:true,implodes:true}};
const FracLike = (symbol,addplaceholder=false) => {
  var childrenstring = "{§0}{§1}";
  var verticalorientation = "down";
  if (SUM_LIKE.includes(symbol)) {childrenstring = "_{§0}^{§1}"; verticalorientation="up";}
  else if (symbol === "\\underbrace") childrenstring = "{§0}_{§1}";
  else if (symbol === "\\overbrace") {childrenstring = "{§0}^{§1}"; verticalorientation="up";}
  else if (symbol === "\\sqrt") childrenstring = "[§0]{§1}";
  else if (symbol==="\\underset") verticalorientation="up";
  return {symbol,verticalorientation,children:[{children:addplaceholder?[PLACEHOLDER]:[],nodeletion:true},{children:addplaceholder?[PLACEHOLDER]:[],nodeletion:true}],hasstrictlytwochildren:true,implodes:true,childrenstring}
};
const Environment = (symbol,addplaceholder=false) => {return {leftsymbol:symbol,rightsymbol:ENVIRONMENTS[symbol],children:[],ismultiline:true,nodeletionfromright:true,implodes:true,colparams:""}};

// Automatically create node for a given symbol
function getNode(symbol,rawtext=false,addplaceholder=false){
  if (rawtext) return Symbol(symbol);
  else if (PARENT_SYMBOLS.includes(symbol)) return ParentSymbol(symbol,addplaceholder);
  else if (ACCENTS.includes(symbol)) return Accent(symbol,addplaceholder);
  else if (STYLES.includes(symbol)) return Style(symbol,addplaceholder);
  else if (symbol in DELIMITERS) return Delimiter(symbol,addplaceholder);
  else if (MODIFIERS.includes(symbol)) return Modifier(symbol,addplaceholder);
  else if (FRAC_LIKE.includes(symbol) || SUM_LIKE.includes(symbol)) return FracLike(symbol,addplaceholder);
  else if (LIM_LIKE.includes(symbol)) return LimLike(symbol,addplaceholder);
  else if (symbol in ENVIRONMENTS) return Environment(symbol,addplaceholder);
  else if (symbol in NAMED_NODES) return structuredClone(NAMED_NODES[symbol]);
  return Symbol(symbol);
}

const NAMED_NODES = {
  squared:{...getNode("^"),children:[{symbol:"2"}]},
  nsqrt: FracLike("\\sqrt"),// Like sqrt, but with an additionnal argument (in [...]).
  inverse: {...getNode("^"),children:[{symbol:"-"},{symbol:"1"}]},
  transpose: {...getNode("^"),children:[{symbol:"\\top"}]},
  updagger: {...getNode("^"),children:[{symbol:"\\dagger"}]},
  "=?" : {...getNode("\\overset"),children:[{symbol:"?"},{symbol:"="}]},
  "=!" : {...getNode("\\overset"),children:[{symbol:"!"},{symbol:"="}]},
}

// LaTeX formula
function getFormula(node,forEditor){
    if (node.iscursor) return forEditor ? `\\class{math-cursor}{${node.symbol}}` : "";

    var string =  "";
    
    // First / main symbol
    if (node.symbol) string += node.symbol + " ";
    else if (node.leftsymbol){
      if (node.adptative) string += "\\left";
      if (node.colparams) string += node.leftsymbol.replace("{}",`{${node.colparams}}`);
      else string += node.leftsymbol;
      string += " ";
    }

    // Now we consider the node children
    if (node.parseastext){// Raw text
      let inside = node.children.map(c=>(c.iscursor && !forEditor)?"":c.symbol).join("");
      string += `{${inside}}`;
    }
    // In all other cases, there is recursion
    else if (node.hasstrictlytwochildren){
      string += node.childrenstring.replace("§0",getFormula(node.children[0],forEditor)).replace("§1",getFormula(node.children[1],forEditor))
    }
    else if (node.children){
      if (node.symbol){
        if (node.childrenaredown) string += "_";// For limits...
        string += `{${node.children.map(c=>getFormula(c,forEditor)).join("")}}`;
      }
      else string += node.children.map(c=>getFormula(c,forEditor)).join(""); // Just a simple grouping
    }

    // Second symbol if it exists (ex closing delimiter)
    if (node.rightsymbol){
      if (node.adptative) string += "\\right ";
      string += node.rightsymbol;
      string += " "; // Ensures good separation
    }

    // Surrounding commands for classes & ids
    const isinvisible = INVISIBLE_SYMBOLS.includes(node.symbol);
    if (forEditor && !node.isroot && !isinvisible) string = `\\class{math-node}{\\cssId{math-${node.id}}{${string}}}`;
    if (node.selected && forEditor) string = `\\class{math-selected}{${string}}`;
    else if (node.isplaceholder) string = `\\class{math-placeholder}{${string}}`;
    return string;
}

function isValidRawText(node){
    if (node.children) return false;
    if (node.symbol.length>1) return false;
    return true;
}

function nChildren(node){ // Number of 'real' children
  if (!node.children) return undefined;
  if (node.children.some(c=>c.iscursor)) return node.children.length-1;
  return node.children.length;
}

function insertCursorInNode(node){// Insert cursor at the "right place", assuming this node will be added to the math tree
  if (!node.children) return false; // Cannot insert cursor
  const nchildren = nChildren(node);
  var newnode = {...node};
  if (nchildren===0) {
    newnode.children = [CURSOR];
    return newnode;
  }
  for (var i=0;i<nchildren;i++){
    const modifiedNode = insertCursorInNode(node.children[i]); // Recursivity
    if (modifiedNode){// Success
      newnode.children[i] = modifiedNode;
      return newnode;
    }
  }
  // No success
  return false;
}
  

export default {DEFAULT_TREE,CURSOR,getNode,getFormula,isValidRawText,FracLike,nChildren,insertCursorInNode,NAMED_NODES,PARENT_SYMBOLS,ACCENTS,STYLES,DELIMITERS,MODIFIERS,FRAC_LIKE,LIM_LIKE,SUM_LIKE};