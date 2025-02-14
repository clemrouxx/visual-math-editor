import React, { useEffect, useState } from "react";
import MathJax from "react-mathjax";
import MathTree from "./MathTree";
import Keyboard from "./Keyboard";

const MathComponent = () => {
    const [editMode,setEditMode] = useState("cursor"); // "none"|"selection"|"cursor"
    var exampleTree = {class:"group",children:[
        {class:"symbol",symbol:"E"},
        {class:"symbol",symbol:"="},
        {class:"symbol",symbol:"m"},
        {class:"cursor"},
        {class:"symbol",symbol:"c"},
        {class:"symbol",symbol:"2"}
        ]};
    MathTree.setUids(exampleTree); // Need to be done if a new element is added
    const [mathTree,setMathTree] = useState(exampleTree);
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
            let newnode = {class:"symbol",symbol : event.key};
            if (editMode==="cursor")
            {
                var newtree = MathTree.insertAtCursor(mathTree,newnode);
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
        setFormula(MathTree.getFormula(mathTree))
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
