import React, { useEffect, useState } from "react";
import MathJax from "react-mathjax";
import MathTree from "./MathTree";
import Keyboard from "./Keyboard";

const MathComponent = () => {
    const [editMode,setEditMode] = useState("cursor"); // "none"|"selection"|"cursor"|"command"
    const [mathTree,setMathTree] = useState({isroot:true,children:[MathTree.CURSOR]});
    const [formula,setFormula] = useState("");
    const [command,setCommand] = useState("");

    const handleClick =  (event) => {
        event.preventDefault();
        var id = parseInt(event.target.parentElement.id.split("-").pop());
        var newtree = MathTree.removeCursor(mathTree);
        newtree = MathTree.setSelectedNode(newtree,id);
        setEditMode("selection");
        setMathTree(newtree);
    };

    const handleKeyDown = (event) => {
        if (editMode=="cursor"){ 
            if (Keyboard.DIRECT_INPUT.includes(event.key))// Can be directly included
            {
                var newtree = MathTree.insertAtCursor(mathTree,MathTree.Symbol(event.key));
                setMathTree(newtree);
            }
            switch (event.key){
                case "ArrowRight":
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
                case "_":
                    setMathTree(MathTree.insertAtCursor(mathTree,MathTree.Modifier(event.key)));
                    break;
                case "\\":
                    setEditMode("command");
                    setCommand("\\");
                    break;
            }
        }
        else if (editMode==="selection"){ // "special" keys in selection mode
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
        else if (editMode==="command"){
            console.log(event.key);
            if (/^[a-zA-Z]$/.test(event.key)){
                setCommand(command+event.key); // letter
            }
            else if (event.key==="Enter"){
                setMathTree(MathTree.insertAtCursor(mathTree,MathTree.Symbol(command)));
                setCommand("");
                setEditMode("cursor");
            } 
        }
    }

    const addListeners = () => {
        // Ensure MathJax renders first
        setTimeout(() => {
            document.querySelectorAll(".mjx-mi, .mjx-mn, .mjx-mo").forEach((el) => {
                el.addEventListener("click",handleClick);
            });
        }, 500); // Small delay to allow rendering

        // Keyboard handling
        window.addEventListener("keydown", handleKeyDown);
    };

    const removeListener = () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.querySelectorAll(".mjx-mi, .mjx-mn, .mjx-mo").forEach((el) => {
            el.removeEventListener("click",handleClick); // Remove listeners on unmount
        });
    };

    useEffect(() => { // Change in math tree (equation)
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
            <MathJax.Node formula={formula} />
        </MathJax.Provider>
        <span>{command}</span>
      </div>
  );
};

export default MathComponent;
