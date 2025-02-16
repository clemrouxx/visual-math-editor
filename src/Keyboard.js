// Defines some constants for typing / keyboard control

// characters to be included as-is (as pure symbols) in LaTeX when typed
const DIRECT_INPUT = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-+=*,.'<>/";

const PARENT_SYMBOLS = ["_","^","\\sqrt","\\overline","\\underline","\\widehat","\\widetilde","\\overrightarrow","\\overleftarrow","\\overbrace","\\underbrace"];
const ACCENTS = ["\\acute","\\bar","\\breve","\\ddot","\\dot","\\grave","\\hat","\\tilde","\\vec"];

export default {DIRECT_INPUT,PARENT_SYMBOLS,ACCENTS};