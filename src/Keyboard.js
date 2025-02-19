// Defines some constants for typing / keyboard control

// valid characters (including some that can have children, then also in PARENT_SYMBOLS) that can be typed directly
const DIRECT_INPUT = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-+=*,.'<>/_^(";
const PARENT_SYMBOLS = ["_","^","\\sqrt","\\overline","\\underline","\\widehat","\\widetilde","\\overrightarrow","\\overleftarrow","\\overbrace","\\underbrace"];
const ACCENTS = ["\\acute","\\bar","\\breve","\\ddot","\\dot","\\grave","\\hat","\\tilde","\\vec"];
const DELIMITERS = {"(":")"};

export default {DIRECT_INPUT,PARENT_SYMBOLS,ACCENTS,DELIMITERS};