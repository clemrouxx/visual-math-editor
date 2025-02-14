const CURSOR = {class:"cursor"};

function getFormula(node){
    if (node.selected) return `\\color{red}{${node.symbol}}`;
    if (node.class === "symbol") return `\\cssId{math-${node.id}}{${node.symbol}}`;
    else if (node.class === "cursor") return "\\color{red}|";
    else if (node.children){
        return node.children.map(getFormula).join("");
    }
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
  const inserter = (children) => {
    const index = children.findIndex(child => child.class === "cursor");
    if (index !== -1) {
      children.splice(index, 0, newnode);
    }
    return children;}
  let newtree =  modifyChildren(node,inserter);
  setUids(newtree);
  return newtree;
}

function removeCursor(tree){
  return modifyChildren(tree,children => children.filter(child=>!(child.class=="cursor")))
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
  if (node.class === "symbol"){ // clickable
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

export default {getFormula,applyToAllNodes,setUids,deleteSelectedNode,insertAtCursor,removeCursor,setSelectedNode,selectedToCursor,unselect}