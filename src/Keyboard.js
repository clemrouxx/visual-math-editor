// Defines some constants for typing / keyboard control

// valid characters (including some that can have children) that can be typed directly
const DIRECT_INPUT = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-+=*,.'`<>/_^([|!?\";:&";
const ESCAPED_SYMBOLS = "%{"; // Will be automatically preceded by a backlash

const INVISIBLE_SYMBOLS = ["_","^","\\\\","&"];

// The following lists / dictionnaries determine the properties of the inserted node (regarding selection, cursor placement, deletion...)
const PARENT_SYMBOLS = ["_","^","\\sqrt","\\overline","\\underline","\\widehat","\\widetilde","\\overrightarrow","\\overleftarrow","\\overbrace","\\underbrace"];
const ACCENTS = ["\\acute","\\bar","\\breve","\\ddot","\\dot","\\grave","\\hat","\\tilde","\\vec"];
const STYLES = ["\\mathcal","\\mathbb","\\mathfrak","\\mathbf","\\mathsf"];
const DELIMITERS = {"(":")","[":"]","\\{":"\\}","\\vert":"\\vert","\\Vert":"\\Vert","\\langle":"\\rangle","\\lfloor":"\\rfloor","\\lceil":"\\rceil"};
const MODIFIERS = ["\\mathrm","\\text","\\textrm","\\textbf","\\textit"];
const FRAC_LIKE = ["\\frac"]; // Symbols that have strictly 2 children
const SUM_LIKE = ["\\sum","\\int"]; // Also strictly 2 children, but displayed differently as fractions
const LIM_LIKE = ["\\lim","\\iint","\\iiint","\\iiiint","\\oint"];
const ENVIRONMENTS_NAMES = ["matrix","pmatrix","bmatrix","Bmatrix","vmatrix","Vmatrix","cases","align"];
const ENVIRONMENTS = ENVIRONMENTS_NAMES.reduce((acc, name) => {
    acc[`\\begin{${name}}`] = `\\end{${name}}`;
    return acc;
  }, {});

const SHORTCUTS = {
  alp:"\\alpha",
  bet:"\\beta",
  gam:"\\gamma",
  Gam:"\\Gamma",
  del:"\\delta",
  Del:"\\Delta",
  eps:"\\epsilon",
  veps:"\\varepsilon",
  zeta:"\\zeta",
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

  ale:"\\aleph",

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
  Up:"\\Uparrow",
  Down:"\\Downarrow",
  maps:"\\mapsto",
  // diagonal arrows ?

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

  // Operations
  x:"\\times",
  div:"\\div",
  U:"\\cup",
  inter:"\\cap",
  ".":"\\cdot",
  "<=":"\\leq",
  ">=":"\\geq",
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
  mod:"\\vert",
  "|":"\\vert",
  norm:"\\Vert",
  "||":"\\Vert",

  // Sums...
  sum:"\\sum",
  int:"\\int",

  // Accents
  d:"\\dot",
  v:"\\vec",
  dd:"\\ddot",
  bar:"\\bar",
  hat:"\\hat",

  // Styles
  C:"\\mathcal",
  B:"\\mathbb",
  F:"\\mathfrak",
  b:"\\mathbf",


  fr:"\\frac",

  // Environments
  pma:"\\begin{pmatrix}"
};


export default {DIRECT_INPUT,ESCAPED_SYMBOLS,PARENT_SYMBOLS,ACCENTS,STYLES,DELIMITERS,MODIFIERS,FRAC_LIKE,SUM_LIKE,LIM_LIKE,ENVIRONMENTS,SHORTCUTS,INVISIBLE_SYMBOLS};

