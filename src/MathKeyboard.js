// Defines some constants for typing / keyboard control

// valid characters (including some that can have children) that can be typed directly
const DIRECT_INPUT = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-+=*,.'`<>/_^([|!?\";:";
const ESCAPED_SYMBOLS = "%{$#"; // Will be automatically preceded by a backlash
const TEXTMODE_ESCAPED_SYMBOLS = "${}";
const SIMPLE_REPLACEMENT = {"\\":"\\backslash"};

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
  not:"\\not",
  hbar:"\\hbar",

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
  ker:"\\ker",
  det:"\\det",
  deg:"\\deg",


  // Environments
  mat:"\\begin{pmatrix}",
  cas:"\\begin{cases}",

  // Constructions
  ket:"\\ket",
  bra:"\\bra",

  // Named nodes
  sq:"squared",
  inv:"inverse",
  T:"transpose",
  dag:"updagger",
};


export default {DIRECT_INPUT,ESCAPED_SYMBOLS,TEXTMODE_ESCAPED_SYMBOLS,SIMPLE_REPLACEMENT,SHORTCUTS};

