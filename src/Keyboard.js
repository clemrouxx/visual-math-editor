// Defines some constants for typing / keyboard control

// valid characters (including some that can have children) that can be typed directly
const DIRECT_INPUT = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-+=*,.'`<>/_^([|!?\";:&";
const ESCAPED_SYMBOLS = "%{$#\\"; // Will be automatically preceded by a backlash
const SIMPLE_REPLACEMENT = {"\\":"\\backslash"};

const INVISIBLE_SYMBOLS = ["_","^","\\\\","&"]; // Don't have classes attached

// The following lists / dictionnaries determine the propesrties of the inserted node (regarding selection, cursor placement, deletion...)
// Include the core and AMS commands
const PARENT_SYMBOLS = ["_","^","\\sqrt","\\overline","\\underline","\\widehat","\\widetilde","\\overrightarrow","\\overleftarrow","\\overleftrightarrow","\\underleftarrow","\\underrightarrow","\\underleftrightarrow","\\xleftarrow","\\xrightarrow","\\bra","\\ket","\\braket"];
const ACCENTS = ["\\vec","\\bar","\\dot","\\ddot","\\dddot","\\ddddot","\\hat","\\tilde","\\breve","\\acute","\\grave"];
const STYLES = ["\\mathcal","\\mathbb","\\mathfrak","\\mathbf","\\mathsf"];
const DELIMITERS = {"(":")","[":"]","\\{":"\\}","\\lvert":"\\rvert","\\lVert":"\\rVert","\\langle":"\\rangle","\\lfloor":"\\rfloor","\\lceil":"\\rceil"};
const MODIFIERS = ["\\mathrm","\\text","\\textrm","\\textbf","\\textit"];
const FRAC_LIKE = ["\\frac","\\overbrace","\\underbrace"]; // Symbols that have strictly 2 children (other than sum-like)
const SUM_LIKE = ["\\sum","\\int","\\bigcap","\\bigcup","\\bigodot","\\bigoplus","\\bigotimes","\\bigsqcup","\\biguplus","\\bigvee","\\bigwedge","\\coprod","\\prod"]; // Also strictly 2 children, but displayed differently as fractions
const LIM_LIKE = ["\\lim","\\iint","\\iiint","\\iiiint","\\oint","\\idotsint"];
const ENVIRONMENTS_NAMES = ["align","cases","matrix","pmatrix","bmatrix","Bmatrix","vmatrix","Vmatrix"];
var ENVIRONMENTS = ENVIRONMENTS_NAMES.reduce((acc, name) => {
    acc[`\\begin{${name}}`] = `\\end{${name}}`;
    return acc;
  }, {});
ENVIRONMENTS[`\\begin{array}{}`] = "\\end{array}";

const SHORTCUTS = {
  alp:"\\alpha",
  bet:"\\beta",
  gam:"\\gamma",
  Gam:"\\Gamma",
  del:"\\delta",
  Del:"\\Delta",
  eps:"\\epsilon",
  veps:"\\varepsilon",
  zet:"\\zeta",
  eta:"\\eta",
  the:"\\theta",
  vthe:"\\vartheta",
  The:"\\Theta",
  iot:"\\iota",
  kap:"\\kappa",
  vkap:"\\varkappa",
  lam:"\\lambda",
  Lam:"\\Lambda",
  mu:"\\mu",
  nu:"\\nu",
  xi:"\\xi",
  Xi:"\\Xi",
  pi:"\\pi",
  Pi:"\\Pi",
  rho:"\\rho",
  vrho:"\\varrho",
  sig:"\\sigma",
  Sig:"\\Sigma",
  tau:"\\tau",
  ups:"\\upsilon",
  Ups:"\\Upsilon",
  phi:"\\phi",
  vphi:"\\varphi",
  Phi:"\\Phi",
  chi:"\\chi",
  psi:"\\psi",
  Psi:"\\Psi",
  ome:"\\omega",
  Ome:"\\Omega",

  

  // Arrows
  left:"\\leftarrow",
  "<-":"\\leftarrow",
  right:"\\rightarrow",
  "->":"\\rightarrow",
  "<->":"\\leftrightarrow",
  up:"\\uparrow",
  down:"\\downarrow",
  Left:"\\Leftarrow",
  Right:"\\Rightarrow",
  "<=>":"\\Leftrightarrow",
  "<==>":"\\Longleftrightarrow",
  Up:"\\Uparrow",
  Down:"\\Downarrow",
  maps:"\\mapsto",

  // Misc symbols
  inf:"\\infty",
  all:"\\forall",
  Re:"\\Re",
  Im:"\\Im",
  nab:"\\nabla",
  ex:"\\exists",
  nex:"\\nexists",
  pd:"\\partial",
  empty:"\\varnothing",
  neg:"\\neg",
  "...":"\\cdots",
  tri:"\\triangle",
  ale:"\\aleph",
  sr:"\\sqrt",

  // Operations
  x:"\\times",
  div:"\\div",
  U:"\\cup",
  inter:"\\cap",
  ".":"\\cdot",
  "<=":"\\leq",
  ">=":"\\geq",
  "<<":"\\ll",
  ">>":"\\gg",
  in:"\\in",
  perp:"\\perp",
  notin:"\\notin",
  "!=":"\\neq",
  neq:"\\neq",
  sub:"\\subset",
  seq:"\\simeq",
  sim:"\\sim",
  app:"\\approx",
  and:"\\wedge",
  or:"\\vee",
  "o+":"\\oplus",
  ox:"\\otimes",
  box:"\\Box",
  xbox:"\\boxtimes",
  "===":"\\equiv",
  cong:"\\cong",  

  // delimiters
  avg:"\\langle",
  mod:"\\lvert",
  norm:"\\lVert",
  "||":"\\lVert",

  // Sums...
  sum:"\\sum",
  int:"\\int",
  fr:"\\frac",

  // Accents
  d:"\\dot",
  v:"\\vec",
  dd:"\\ddot",
  bar:"\\bar",
  hat:"\\hat",
  til:"\\tilde",

  // Styles
  C:"\\mathcal",
  B:"\\mathbb",
  F:"\\mathfrak",
  b:"\\mathbf",
  te:"\\text",
  

  // Named functions
  exp:"\\exp",
  log:"\\log",
  min:"\\min",
  max:"\\max",
  arg:"\\arg",
  sup:"\\sup",
  cos:"\\cos",
  sin:"\\sin",
  tan:"\\tan",
  acos:"\\arccos",
  asin:"\\arcsin",
  atan:"\\arctan",
  cot:"\\cot",
  sec:"\\sec",
  ch:"\\cosh",
  sh:"\\sinh",
  th:"\\tanh",
  ket:"\\ker",
  det:"\\det",
  deg:"\\deg",


  // Environments
  mat:"\\begin{pmatrix}",
  cas:"\\begin{cases}"
};


export default {DIRECT_INPUT,ESCAPED_SYMBOLS,SIMPLE_REPLACEMENT,PARENT_SYMBOLS,ACCENTS,STYLES,DELIMITERS,MODIFIERS,FRAC_LIKE,SUM_LIKE,LIM_LIKE,ENVIRONMENTS,SHORTCUTS,INVISIBLE_SYMBOLS};

