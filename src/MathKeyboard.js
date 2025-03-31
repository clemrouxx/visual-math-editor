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
  "=>":"\\Rightarrow",
  "<=>":"\\Leftrightarrow",
  "<==>":"\\Longleftrightarrow",
  Up:"\\Uparrow",
  Down:"\\Downarrow",
  map:"\\mapsto",
  "-->":"\\xrightarrow",

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
  "...":"\\dots",
  tri:"\\triangle",
  ale:"\\aleph",
  sr:"\\sqrt",
  not:"\\not",
  hbar:"\\hbar",
  grad:"\\grad",
  div:"\\div",
  curl:"\\curl",
  lapl:"\\laplacian",
  ll:"\\ell",
  dd:"\\dd",
  squ:"\\square",
  tfr:"\\therefore",

  // Operations, binaries
  x:"\\times",
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
  subeq:"\\subseteq",
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
  prop:"\\propto",
  "+-":"\\pm",
  "pm":"\\pm",
  "-+":"\\mp",
  "mp":"\\mp",
  circ:"\\circ",
  "//":"\\parallel",
  "=tri":"\\triangleq",
  "<sim":"\\lesssim",
  ">sim":"\\gtrsim",
  copr:"\\amalg",
  "=!":"\\stackrel{!}{=}",
  "=?":"\\stackrel{?}{=}",

  // delimiters
  avg:"\\langle",
  abs:"\\lvert",
  "|":"\\lvert",
  mod:"\\lvert",
  "||":"\\lVert",
  norm:"\\lVert",

  // Accents
  dot:"\\dot",
  v:"\\vec",
  ddot:"\\ddot",
  bar:"\\bar",
  hat:"\\hat",
  til:"\\tilde",
  uv:"\\vu",
  ring:"\\mathring",

  // Styles
  C:"\\mathcal",
  B:"\\mathbb",
  F:"\\mathfrak",
  b:"\\mathbf",
  S:"\\mathsf",
  te:"\\text",
  
  // Named functions
  exp:"\\exp",
  log:"\\log",
  ln:"\\ln",
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
  Tr:"\\Tr",
  tr:"\\tr",
  lim:"\\lim",

  // Environments
  mat:"\\begin{pmatrix}",
  cas:"\\begin{cases}",
  arr:"\\begin{array}",
  "--":"\\hline",

  // Constructions
  sum:"\\sum",
  prod:"\\prod",
  int:"\\int",
  fr:"\\frac",
  over:"\\overset",
  dv:"\\dv",
  pdv:"\\pdv",
  ket:"\\ket",
  bra:"\\bra",
  brk:"\\braket",
  kbr:"\\ketbra",
  mel:"\\mel**",

  // Named nodes
  sq:"squared",
  inv:"inverse",
  T:"transpose",
  dag:"updagger",
};


export default {DIRECT_INPUT,ESCAPED_SYMBOLS,TEXTMODE_ESCAPED_SYMBOLS,SIMPLE_REPLACEMENT,SHORTCUTS};

