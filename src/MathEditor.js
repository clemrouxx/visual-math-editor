import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from "react";
import {MathJax} from "better-react-mathjax";
import MathTree from "./MathTree";
import MathKeyboard from "./MathKeyboard";
import MathNodes from "./MathNodes";
import { useUndoRedo } from "./UndoRedo";

const MathEditor = forwardRef((props,ref) => {
    const [editMode,setEditMode] = useState("cursor"); // "none"|"selection"|"cursor"
    const [mathTree,setMathTree] = useState(MathNodes.DEFAULT_TREE);
    const [formula,setFormula] = useState("");
    const [command,setCommand] = useState("");
    const [focused,setFocused] = useState(true);
    const domRef = useRef(null);
    const { setNewState, undo, redo } = useUndoRedo(MathNodes.DEFAULT_TREE);

    useImperativeHandle(ref, () => ({ // Functions that can be called by an 'outside' element, VirtualKeyboard for example
        addSymbol,addNode
    }));

    const changeMathTree = (newtree) => { // 'Real' changes (ie not just cursor movement or selection) to the math tree. Relevant for the undo-redo functionnality
        setNewState(structuredClone(newtree));
        setMathTree(newtree);
    }

    const isCursorInModifier = () => {
        if (editMode!=="cursor") return false;
        return MathTree.findCursorParent(mathTree).node.ismodifier;
    }

    const addSymbol = (symbol,rawtext=false) => { // Called after a key press/command entered/on-screen key press
        const newnode = MathNodes.getNode(symbol,rawtext);
        addNode(newnode);
    }

    const addNode = (node,copyBefore=false) => {
        var newnode = {};
        if (copyBefore) newnode = structuredClone(node);
        else newnode = node;
        if (editMode==="cursor"){
            if (isCursorInModifier() && !MathNodes.isValidRawText(newnode)) return; // Block adding this node
            if (MathNodes.ACCENTS.includes(newnode.symbol) || MathNodes.STYLES.includes(newnode.symbol)){
                changeMathTree(MathTree.adoptNodeBeforeCursor(mathTree,newnode));
            }
            else changeMathTree(MathTree.insertAtCursor(mathTree,newnode));
        }
        else if (editMode==="selection"){
            if (MathNodes.ACCENTS.includes(newnode.symbol) || MathNodes.STYLES.includes(newnode.symbol)){
                changeMathTree(MathTree.adoptSelectedNode(mathTree,newnode));
            }
            else{
                const selection = MathTree.findSelectedNode(mathTree);
                if (MathTree.canReplace(selection.node,newnode)){
                    changeMathTree(MathTree.replaceAndAdopt(mathTree,selection.path,newnode,true));
                    setEditMode("cursor");
                }
                
            }
        }
    };

    const copyToClipboard = async () => {
        const latex = MathNodes.getFormula(mathTree,false);
        try {
            await navigator.clipboard.writeText(latex);
            console.log("Copied to clipboard:", latex);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleClick =  (event) => {
        event.preventDefault();
        event.stopPropagation();// Avoids problems with focusing
        
        setFocused(true);
        var element = event.target; // We need to go up the tree until we find an element with id 'math-...'
        while (!element.id || element.id.split("-")[0]!=="math") element = element.parentElement;
        var id = parseInt(element.id.split("-").pop());
        var newtree = MathTree.removeCursor(mathTree);
        newtree = MathTree.setSelectedNode(newtree,id);
        setEditMode("selection");
        setMathTree(newtree);
    };

    const handleKeyDown = (event) => {
        // We need to check if we are in a "raw text" area and in cursor mode
        // I also keep a copy of the parent
        //console.log(event);
        var parentCopy = {};
        var cursorPath = [];
        if (editMode==="cursor"){
            const result = MathTree.findCursorParent(mathTree);
            const parent = result.node;
            cursorPath = result.path;
            parentCopy = {...parent};
            if (parent.parseastext && event.key.length===1){
                event.preventDefault();
                addSymbol(event.key,true);
                return;
            }
        }

        if (command===""){// Not writing a command
            if (event.ctrlKey){ // All control-based shortcuts
                if (event.key==="i"){
                    event.preventDefault();
                    setCommand("\\");
                }
                else if (event.key==="z"){
                    const undoResult = undo();
                    if (undoResult) setMathTree(undoResult);
                }
                else if (event.key==="y"){
                    const redoResult = redo();
                    if (redoResult) setMathTree(redoResult);
                }
                else if (event.key==="u"){
                    event.preventDefault();
                    addSymbol("^");
                }
                else if (event.key==="d"){
                    event.preventDefault();
                    addSymbol("_");
                }
                else if (event.key==="c" && editMode==="selection"){
                    const selectedNode = MathTree.unselect(MathTree.findSelectedNode(mathTree).node);
                    const string = JSON.stringify(selectedNode);
                    navigator.clipboard.writeText(string);
                }
                else if (event.key==="x" && editMode==="selection"){
                    const selection = MathTree.findSelectedNode(mathTree);
                    const string = JSON.stringify(MathTree.unselect(selection.node));
                    navigator.clipboard.writeText(string);
                    setEditMode("cursor");
                    changeMathTree(MathTree.deleteSelectedNode(mathTree,true));
                }
                else if (event.key==="v"){
                    navigator.clipboard.readText().then((string)=>{
                        if ([...string].length===1){
                            addSymbol(string);
                        }
                        else{
                            try{
                                let json = JSON.parse(string);
                                addNode(json);
                            }
                            catch{
                                return;// Invalid JSON input
                            }
                        }
                    })
                }
            }
            else if (MathKeyboard.DIRECT_INPUT.includes(event.key))// Can be directly included
            {
                event.preventDefault();
                addSymbol(event.key);
            }
            else if (event.key in MathKeyboard.SIMPLE_REPLACEMENT){
                event.preventDefault();
                addSymbol(MathKeyboard.SIMPLE_REPLACEMENT[event.key]);
            }
            else if (MathKeyboard.ESCAPED_SYMBOLS.includes(event.key)){
                event.preventDefault();
                addSymbol("\\"+event.key);
            }
            else if (editMode==="cursor"){
                switch (event.key){
                    case "Tab":
                        event.preventDefault();
                        if (parentCopy.ismultiline) addSymbol("&");
                        else setMathTree(MathTree.shiftCursor(mathTree,"right"));
                        break;
                    case "Enter":
                        if (parentCopy.ismultiline){
                            event.preventDefault();
                            addSymbol("\\\\");
                        }
                        else if (parentCopy.isroot){//AutoAlign
                            changeMathTree(MathTree.alignAll(mathTree));
                            addSymbol("\\\\");
                        }
                        break;
                    case "ArrowRight":
                    case "Tab":
                        event.preventDefault();
                        setMathTree(MathTree.shiftCursor(mathTree,"right"));
                        break;
                    case "ArrowLeft":
                        event.preventDefault();
                        setMathTree(MathTree.shiftCursor(mathTree,"left"));
                        break;
                    case "ArrowDown":
                        event.preventDefault();
                        if (cursorPath.length>=1){ // In a frac-like sub-element. We need to go up two levels
                            var path = cursorPath.slice(0,-1);
                            const grandParent = MathTree.pathToNode(mathTree,path);
                            if ((cursorPath.at(-1)===0 && grandParent.verticalorientation==="down") || (cursorPath.at(-1)===1 && grandParent.verticalorientation==="up")){
                                path.push(1-cursorPath.at(-1));// Switch to the "down" part
                                var newtree = MathTree.removeCursor(mathTree);
                                newtree = MathTree.pushCursorAtPath(newtree,path);
                                setMathTree(newtree);
                            }
                        }
                        break;
                    case "ArrowUp":
                        // Essentially the same as "ArrowDown"
                        event.preventDefault();
                        if (cursorPath.length>=1){
                            var path = cursorPath.slice(0,-1);
                            const grandParent = MathTree.pathToNode(mathTree,path);
                            if ((cursorPath.at(-1)===0 && grandParent.verticalorientation==="up") || (cursorPath.at(-1)===1 && grandParent.verticalorientation==="down")){
                                path.push(1-cursorPath.at(-1));// Switch to the "up" part
                                var newtree = MathTree.removeCursor(mathTree);
                                newtree = MathTree.pushCursorAtPath(newtree,path);
                                setMathTree(newtree);
                            }
                        }
                        break;
                    case "Backspace":
                        event.preventDefault();
                        var deletionResult = MathTree.deleteNextToCursor(mathTree,"left");
                        if (deletionResult) changeMathTree(deletionResult);
                        break;
                    case "Delete":
                        event.preventDefault();
                        var deletionResult = MathTree.deleteNextToCursor(mathTree,"right");
                        if (deletionResult) changeMathTree(deletionResult);
                        break;
                    case " ": // Space
                        event.preventDefault();
                        let replacementResult = MathTree.applyReplacementShortcut(mathTree);
                        if (replacementResult.symbol){
                            setMathTree(replacementResult.tree);
                            addSymbol(replacementResult.symbol);
                        }
                        break;
                    default:
                        if (Object.values(MathNodes.DELIMITERS).includes(event.key)){
                            if (parentCopy.rightsymbol===event.key && parentCopy.children[parentCopy.children.length-1].iscursor){
                                // Close the delimiter
                                setMathTree(MathTree.shiftCursor(mathTree,"right"));
                            }
                        }
                        break;
                }
            }
            else if (editMode==="selection"){
                switch (event.key){
                    case "Delete":
                    case "Backspace":
                        event.preventDefault();
                        changeMathTree(MathTree.deleteSelectedNode(mathTree,true));
                        setEditMode("cursor");
                        break;
                    case "ArrowRight":
                        event.preventDefault();
                        setMathTree(MathTree.selectedToCursor(mathTree,"right"));
                        setEditMode("cursor");
                        break;
                    case "ArrowLeft":
                        event.preventDefault();
                        setMathTree(MathTree.selectedToCursor(mathTree,"left"));
                        setEditMode("cursor");
                        break;
                }
            }
        }
        else{ // Writing a command
            if (/^[a-zA-Z\\{}]$/.test(event.key)){
                event.preventDefault();
                setCommand(command+event.key);
            }
            else if (event.key==="Enter" || event.key===" "){
                event.preventDefault();
                addSymbol(command);
                setCommand("");
            } 
        }
    }

    const addListeners = () => {
        // Ensure MathJax renders first
        setTimeout(() => {
            document.querySelectorAll(".math-node").forEach((el) => {
                el.addEventListener("click",handleClick);
            });
        }, 500); // Small delay to allow rendering. TODO : change this

        // Keyboard handling
        window.addEventListener("keydown", handleKeyDown);
    };

    const removeListeners = () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.querySelectorAll(".mjx-char").forEach((el) => {
            el.removeEventListener("click",handleClick); // Remove listeners on unmount
        });
    };

    useEffect(() => { // Times where I need to change the listeners...
        addListeners();
        return () => removeListeners();
    }, [mathTree,command,focused]);

    useEffect(() => {
        //console.log(mathTree,MathTree.getFormula(mathTree,true));
        setFormula(MathNodes.getFormula(mathTree,true));
    }, [mathTree]);

    const focus = () => {
        if (!focused) { // Prevent redundant updates
            if (editMode==="cursor") setMathTree(MathTree.appendCursor(mathTree));
            setFocused(true);
        }
    }

    const unfocus = () => {
        if (focused) { // Prevent redundant updates
            setMathTree(MathTree.unselect(MathTree.removeCursor(mathTree)));
            setFocused(false);
        }
    };

    useEffect(() => {
        const handleFocusClick = (event) => {
            if (domRef.current && domRef.current.contains(event.target)) focus()
            //else unfocus(); Removed for now, until proven useful
        };
        document.addEventListener("click", handleFocusClick);
        return () => document.removeEventListener("click", handleFocusClick);
    }, [focused,mathTree,editMode]);

  return (
      <div className={`formula-editor ${focused ? "focused" : "unfocused"}`} ref={domRef}>
        <MathJax key={formula} className="math-display">{`\\[ ${formula} \\]`}</MathJax>
        <div>
            <button className="formula-copy"
                onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(); // Copy message to clipboard
                }}
            >
                Copy LaTeX <br/> to clipboard
            </button>
            <div>{command}</div>
        </div>
        
      </div>
  );
});

export default MathEditor;

