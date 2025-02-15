const CURSOR = {iscursor:true};
const Symbol = (symbol) => {return {symbol:symbol}};
const Modifier = (command) => {return {command:command,children:[]}}

function getFormula(node){
    if (node.iscursor) return "\\color{red}|";

    var string = "";
    if (node.symbol) string += `\\cssId{math-${node.id}}{${node.symbol}}`;
    if (node.command) string += node.command;
    if (node.children){
      if (node.command || node.symbol) string += `{${node.children.map(getFormula).join("")}}`;
      else string += node.children.map(getFormula).join(""); // Just a simple grouping
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

function modifyChildren(node, func, stopModify=false){// Not inplace
  const newnode = {
    ...node,
  };
  if (node.children && !stopModify){
    newnode.children = [];
    let funcResult = func(node.children);
    var children = funcResult.children;
    stopModify = funcResult.stopModify;
    children.forEach((child)=>{
      if (!stopModify){
        let result = modifyChildren(child,func,stopModify);
        child = result.node;
        stopModify = result.stopModify;
      }
      newnode.children.push(child);
    })
  }
  return {node:newnode,stopModify};
}

function unselect(tree){
  return applyToAllNodes(tree,n => n.selected=false);
}

function setSelectedNode(tree,id){
  return applyToAllNodes(tree,(n)=>{n.selected=(n.id===id)});
}

function deleteSelectedNode(tree,replaceWithCursor){
  if (replaceWithCursor) return modifyChildren(tree,children => {return {children:children.map(child => child.selected ? CURSOR : child),stopModify:children.some((c=>c.selected))}}).node;
  else return modifyChildren(tree,children => {return {children:children.filter(child=>!child.selected),stopModify:children.some((c=>c.selected))}}).node;
}

function deleteNextToCursor(tree,direction){
  const index_shift = (direction==="right") ? 1 : -1;
  const deleter = (children) => {
    const index = children.findIndex(child => child.iscursor);
    var stopModify = false;
    if (index !== -1 && children[index+index_shift]){ // Found something to delete !
      children.splice(index+index_shift,1);
      stopModify = true;
    }
    return {children,stopModify};
  }
  return modifyChildren(tree,deleter).node;
}

function insertAtCursor(node,newnode){
  if (newnode.children){// I will then place the cursor as last child (maybe special case for fixed-children ?)
    newnode.children.push(CURSOR);
    var inserter = (children) => {return {children:children.map((child) => child.iscursor ? newnode : child),stopModify:children.some(child => child.iscursor)};};
  }
  else{
    var inserter = (children) => {
      const index = children.findIndex(child => child.iscursor);
      if (index !== -1) {
        children.splice(index, 0, newnode);
        console.log(children);
      }
      return {children,stopModify:index !== -1};}
  }
  var newtree =  modifyChildren(node,inserter).node;
  setUids(newtree);
  return newtree;
}

function removeCursor(tree){
  return modifyChildren(tree,children => {return {children:children.filter(child=>!(child.iscursor)),stopModify:children.some(c=>c.iscursor)}}).node;
}

function selectedToCursor(tree,side){ // Add cursor next to selected
  const index_shift = (side==="right") ? 1 : 0;
  const inserter = (children) => {
    const index = children.findIndex(child => child.selected);
    if (index !== -1) {
      children.splice(index+index_shift, 0, CURSOR);
    }
    return {children,stopModify:index!==-1};
  }
  let newtree =  modifyChildren(tree,inserter).node;
  return unselect(newtree);
}

function shiftCursor(tree,direction){
  var shift = direction==="right" ? 1 : -1;
  const cursorShifter = (children) => {
    const index = children.findIndex(child => child.iscursor);
    if (index !== -1){
      var nextnode = children[index+shift];
      if (nextnode){ // Still in the array
        if (nextnode.children){// We need to go down
          children.splice(index,1);
          nextnode.children.splice((shift===1)?0:nextnode.children.length,0,CURSOR);
        }
        else{// Just exchange CURSOR and nextnode
          [children[index],children[index+shift]] = [nextnode,CURSOR];
        }
      }
      else{
        // We need to go up...
      }
    }
    return {children,stopModify:index!==-1};
  };
  return modifyChildren(tree,cursorShifter).node;
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

export default {CURSOR,Symbol,Modifier,getFormula,applyToAllNodes,setUids,deleteSelectedNode,deleteNextToCursor,insertAtCursor,removeCursor,shiftCursor,setSelectedNode,selectedToCursor,unselect}