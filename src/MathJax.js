import React, { useEffect, useState, useRef } from "react";
import {MathJax,MathJaxContext} from "better-react-mathjax";
import MathTree from "./MathTree";
import Keyboard from "./Keyboard";

const mathjaxconfig = {
    loader: { load: ["[tex]/html","output/chtml"] },
    tex: {
      packages: { "[+]": ["html"] },
    },
    options: {
      enableMenu : false,
      renderActions: {
        assistiveMml: [], // Prevents additional MathML rendering
      },
    },
    output: {
      renderer: "chtml", // Force CHTML instead of SVG
    },
  };

const MathComponent = () => {
    const [editMode,setEditMode] = useState("cursor"); // "none"|"selection"|"cursor"
    const [mathTree,setMathTree] = useState({isroot:true,children:[MathTree.CURSOR]});
    const [formula,setFormula] = useState("");
    const [command,setCommand] = useState("");
    const [focused,setFocused] = useState(true);
    const ref = useRef(null);

    const addSymbol = (symbol,rawtext=false) => { // Called after a key press/command entered/on-screen key press
        const newnode = MathTree.getNode(symbol,rawtext);
        if (editMode==="cursor"){
            if (Keyboard.ACCENTS.includes(symbol) || Keyboard.STYLES.includes(symbol)){
                setMathTree(MathTree.adoptNodeBeforeCursor(mathTree,newnode));
            }
            else setMathTree(MathTree.insertAtCursor(mathTree,newnode));
        }
        else if (editMode==="selection"){
            if (Keyboard.ACCENTS.includes(symbol) || Keyboard.STYLES.includes(symbol)){
                setMathTree(MathTree.adoptSelectedNode(mathTree,newnode));
            }
            else{
                setMathTree(MathTree.replaceSelectedNode(mathTree,newnode));
                setEditMode("cursor");
            }
        }
    }

    const copyToClipboard = async () => {
        const latex = MathTree.getFormula(mathTree,false);
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
        // We need to go up the tree until we find an element with id 'math-...'
        
        setFocused(true);
        var element = event.target;
        while (!element.id || element.id.split("-")[0]!=="math") element = element.parentElement;
        var id = parseInt(element.id.split("-").pop());
        var newtree = MathTree.removeCursor(mathTree);
        newtree = MathTree.setSelectedNode(newtree,id);
        setEditMode("selection");
        setMathTree(newtree);
    };

    const handleKeyDown = (event) => {
        // We need to check if we are in a "raw text" area and in cursor mode
        // I take this opportunity to check if the parent is a multiline environment
        var isParentMultiline = false;
        if (editMode==="cursor"){
            const parent = MathTree.findCursorParent(mathTree);
            if (parent.ismultiline) isParentMultiline=true;
            if (parent.parseastext && event.key.length===1){
                event.preventDefault();
                addSymbol(event.key,true);
                return;
            }
        }

        if (command===""){// Not writing a command
            if (Keyboard.DIRECT_INPUT.includes(event.key))// Can be directly included
            {
                event.preventDefault();
                addSymbol(event.key);
            }
            else if (Keyboard.ESCAPED_SYMBOLS.includes(event.key)){
                event.preventDefault();
                addSymbol("\\"+event.key);
            }
            else if (event.key==="\\") {
                event.preventDefault();
                setCommand("\\");
            }
            else if (editMode==="cursor"){
                switch (event.key){
                    case "Tab":
                        event.preventDefault();
                        if (isParentMultiline) addSymbol("&");
                        else setMathTree(MathTree.shiftCursor(mathTree,"right"));
                        break;
                    case "Enter":
                        if (isParentMultiline){
                            event.preventDefault();
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
                    case "Backspace":
                        event.preventDefault();
                        setMathTree(MathTree.deleteNextToCursor(mathTree,"left"));
                        break;
                    case "Delete":
                        event.preventDefault();
                        setMathTree(MathTree.deleteNextToCursor(mathTree,"right"));
                        break;
                    case " ": // Space
                        event.preventDefault();
                        setMathTree(MathTree.applyReplacementShortcut(mathTree));
                        break;
                }
            }
            else if (editMode==="selection"){
                switch (event.key){
                    case "Delete":
                    case "Backspace":
                        event.preventDefault();
                        setMathTree(MathTree.deleteSelectedNode(mathTree,true));
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
            if (/^[a-zA-Z\\\{\}]$/.test(event.key)){
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
        setFormula(MathTree.getFormula(mathTree,true));
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
            if (ref.current && ref.current.contains(event.target)) focus()
            else unfocus();
        };
        document.addEventListener("click", handleFocusClick);
        return () => document.removeEventListener("click", handleFocusClick);
    }, [focused,mathTree,editMode]);

  return (
      <div className={`formula-editor ${focused ? "focused" : "unfocused"}`} ref={ref}>
        <MathJaxContext config={mathjaxconfig}>
            <MathJax>{"\\[ " + formula + " \\]"}</MathJax>
        </MathJaxContext>
        <span>{command}</span>
        <button
            onClick={(e) => {
            e.stopPropagation();
            copyToClipboard(); // Copy message to clipboard
            }}
        >
            Copy LaTeX to clipboard
        </button>
      </div>
  );
};

export default MathComponent;

