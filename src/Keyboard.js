// Defines some constants for typing / keyboard control

// valid characters (including some that can have children) that can be typed directly
const DIRECT_INPUT = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-+=*,.'`<>/_^([|!?\";:";
const ESCAPED_SYMBOLS = "%{"; // Will be automatically preceded by a backlash

// The following lists / dictionnaries determine the properties of the inserted node (regarding selection, cursor placement, deletion...)
const PARENT_SYMBOLS = ["_","^","\\sqrt","\\overline","\\underline","\\widehat","\\widetilde","\\overrightarrow","\\overleftarrow","\\overbrace","\\underbrace"];
const ACCENTS = ["\\acute","\\bar","\\breve","\\ddot","\\dot","\\grave","\\hat","\\tilde","\\vec"];
const STYLES = ["\\mathcal","\\mathbb","\\mathfrak","\\mathbf","\\mathsf"];
const DELIMITERS = {"(":")","[":"]","\\{":"\\}","\\vert":"\\vert","\\Vert":"\\Vert","\\langle":"\\rangle","\\lfloor":"\\rfloor","\\lceil":"\\rceil"};
const MODIFIERS = ["\\mathrm","\\text"];
const FRAC_LIKE = ["\\frac"]; // Symbols that have strictly 2 children

// Probably other constants defining shortcuts

export default {DIRECT_INPUT,ESCAPED_SYMBOLS,PARENT_SYMBOLS,ACCENTS,STYLES,DELIMITERS,MODIFIERS,FRAC_LIKE};