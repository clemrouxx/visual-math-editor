import React, { useEffect, useState } from "react";
import MathJax from "react-mathjax";
import MathTree from "./MathTree";
import Keyboard from "./Keyboard";

const MathComponent = () => {
    const [editMode,setEditMode] = useState("cursor"); // "none"|"selection"|"cursor"
    const [mathTree,setMathTree] = useState({isroot:true,children:[MathTree.CURSOR]});
    const [formula,setFormula] = useState("");
    const [command,setCommand] = useState("");

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

    const handleClick =  (event) => {
        event.preventDefault();
        // We need to go up the tree until we find an element with id 'math-...'
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
        if (editMode==="cursor"){
            const parent = MathTree.findCursorParent(mathTree);
            if (parent.parseastext && event.key.length===1){
                addSymbol(event.key,true);
                return;
            }
        }

        if (command===""){// Not writing a command
            if (Keyboard.DIRECT_INPUT.includes(event.key))// Can be directly included
            {
                addSymbol(event.key);
            }
            else if (Keyboard.ESCAPED_SYMBOLS.includes(event.key)){
                addSymbol("\\"+event.key);
            }
            else if (event.key==="\\") setCommand("\\");
            else if (editMode==="cursor"){
                switch (event.key){
                    case "ArrowRight":
                    case "Tab":
                        setMathTree(MathTree.shiftCursor(mathTree,"right"));
                        break;
                    case "ArrowLeft":
                        setMathTree(MathTree.shiftCursor(mathTree,"left"));
                        break;
                    case "Backspace":
                        setMathTree(MathTree.deleteNextToCursor(mathTree,"left"));
                        break;
                    case "Delete":
                        setMathTree(MathTree.deleteNextToCursor(mathTree,"right"));
                        break;
                }
            }
            else if (editMode==="selection"){
                switch (event.key){
                    case "Delete":
                    case "Backspace":
                        setMathTree(MathTree.deleteSelectedNode(mathTree,true));
                        setEditMode("cursor");
                        break;
                    case "ArrowRight":
                        setMathTree(MathTree.selectedToCursor(mathTree,"right"));
                        setEditMode("cursor");
                        break;
                    case "ArrowLeft":
                        setMathTree(MathTree.selectedToCursor(mathTree,"left"));
                        setEditMode("cursor");
                        break;
                }
            }
        }
        else{ // Writing a command
            if (/^[a-zA-Z\\\{\}]$/.test(event.key)){
                setCommand(command+event.key);
            }
            else if (event.key==="Enter"){
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

    const removeListener = () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.querySelectorAll(".mjx-char").forEach((el) => {
            el.removeEventListener("click",handleClick); // Remove listeners on unmount
        });
    };

    useEffect(() => { // Times where I need to change the listeners...
        console.log(mathTree);
        setFormula(MathTree.getFormula(mathTree));
        addListeners();
        return () => {
            removeListener();
        }
    }, [mathTree,command]);

  return (
      <div>
        <MathJax.Provider>
            <MathJax.Node formula={formula} inline={false}/>
        </MathJax.Provider>
        <span>{command}</span><br/>
        <span>{editMode}</span>
      </div>
  );
};

export default MathComponent;
