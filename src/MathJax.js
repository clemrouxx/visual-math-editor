import React, { useEffect, useState } from "react";
import MathJax from "react-mathjax";
import MathTree from "./MathTree";
import Keyboard from "./Keyboard";

const MathComponent = () => {
    const [editMode,setEditMode] = useState("cursor"); // "none"|"selection"|"cursor"
    const [mathTree,setMathTree] = useState({children:[MathTree.CURSOR]});
    const [formula,setFormula] = useState("");

    const handleClick =  (event) => {
        event.preventDefault();
        var id = parseInt(event.target.parentElement.id.split("-").pop());
        var newtree = MathTree.removeCursor(mathTree);
        newtree = MathTree.setSelectedNode(newtree,id);
        console.log(newtree);
        setEditMode("selection");
        setMathTree(newtree);
    };

    const handleKeyDown = (event) => {
        event.preventDefault();
        console.log(event);

        if (Keyboard.DIRECT_INPUT.includes(event.key)){ // Can be directly included
            if (editMode==="cursor")
            {
                var newtree = MathTree.insertAtCursor(mathTree,MathTree.Symbol(event.key));
                setMathTree(newtree);
            }
            // else if ... replace
        }
        else if (editMode==="selection"){ // "special" keys in selection mode
            switch (event.key){
                case "Delete":
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

    useEffect(() => { // Change in math tree (equation)
        console.log(mathTree);
        setFormula(MathTree.getFormula(mathTree));
        console.log(formula);
        // Ensure MathJax renders first
        setTimeout(() => {
            document.querySelectorAll(".mjx-mi, .mjx-mn, .mjx-mo").forEach((el) => {
                el.addEventListener("click",handleClick);
            });
        }, 500); // Small delay to allow rendering

        // Keyboard handling
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.querySelectorAll(".mjx-mi, .mjx-mn, .mjx-mo").forEach((el) => {
                el.removeEventListener("click",handleClick); // Remove listeners on unmount
            });
        }
    }, [mathTree]);

  return (
    
      <div>
        <MathJax.Provider>
            <MathJax.Node formula={formula} />
        </MathJax.Provider>
      </div>
  );
};

export default MathComponent;
