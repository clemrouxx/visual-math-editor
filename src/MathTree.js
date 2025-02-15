const CURSOR = {iscursor:true};
const Symbol = (symbol) => {return {symbol:symbol}};
const Modifier = (command) => {return {command:command,children:[]}}

function getFormula(node){
    if (node.iscursor) return "\\color{red}|";
    
    var string = "";
    if (node.symbol) string += `\\cssId{math-${node.id}}{${node.symbol}}`;    
    if (node.children){
        string += "{"+node.children.map(getFormula).join("")+"}";
    }
    if (node.selected) string = `\\color{red}{${string}}`;
    return string;
}

function applyToAllNodes(node, func) {// Not inplace
  const newnode = {
    ...node,
  };
  if (node.children) newnode.children = node.children.map(child => applyToAllNodes(child, func));
  func(newnode);
  return newnode;
}


function modifyChildren(node, func){// Not inplace
  const newnode = {
    ...node,
  };
  if (node.children) newnode.children = func(node.children).map(child => modifyChildren(child,func));
  return newnode;
}

function unselect(tree){
  return applyToAllNodes(tree,n => n.selected=false);
}

function deleteSelectedNode(tree,replaceWithCursor){
  if (replaceWithCursor) return modifyChildren(tree,children => children.map(child => child.selected ? CURSOR : child));
  else return modifyChildren(tree,children => children.filter(child=>!child.selected));
}

function insertAtCursor(node,newnode){
  if (newnode.children){// I will then place the cursor as last child (maybe special case for fixed-children ?)
    newnode.children.push(CURSOR);
    var inserter = (children) => children.map((child) => child.iscursor ? newnode : child);
  }
  else{
    var inserter = (children) => {
      const index = children.findIndex(child => child.iscursor);
      if (index !== -1) {
        children.splice(index, 0, newnode);
      }
      return children;}
  }
  var newtree =  modifyChildren(node,inserter);
  setUids(newtree);
  return newtree;
}

function removeCursor(tree){
  return modifyChildren(tree,children => children.filter(child=>!(child.iscursor)))
}

function selectedToCursor(tree,side){ // Add cursor next to selected
  const inserter = (children) => {
    const index = children.findIndex(child => child.selected);
    const index_shift = (side==="right") ? 1 : 0;
    if (index !== -1) {
      children.splice(index+index_shift, 0, CURSOR);
    }
    return children;
  }
  let newtree =  modifyChildren(tree,inserter);
  return unselect(newtree);
}

function setSelectedNode(tree,id){
  return applyToAllNodes(tree,(n)=>{n.selected=(n.id===id)});
}

function setUids(node,nextUid=0){// Inplace
  if (node.symbol){ // clickable
    node.id = nextUid;
    nextUid++;
  }
  if (node.children){
    node.children.forEach(childnode => {
      nextUid = setUids(childnode,nextUid);
    });
  }
  return nextUid;
}

export default {CURSOR,Symbol,getFormula,applyToAllNodes,setUids,deleteSelectedNode,insertAtCursor,removeCursor,setSelectedNode,selectedToCursor,unselect}