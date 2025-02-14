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

function deleteSelectedNode(node){
  return modifyChildren(node,children => children.filter(child=>!child.selected))
}

function insertAtCursor(node,newnode){
  const inserter = (children) => {
    const index = children.findIndex(child => child.class === "cursor");
    if (index !== -1) {
      children.splice(index, 0, newnode);
    }
    return children;}
  return modifyChildren(node,inserter);
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

export default {getFormula,applyToAllNodes,setUids,deleteSelectedNode,insertAtCursor}