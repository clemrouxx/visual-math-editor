import Keyboard from "./Keyboard";

const CURSOR = {iscursor:true};
const Symbol = (symbol) => {return {symbol:symbol}};
const ParentSymbol = (symbol) => {return {symbol:symbol,children:[],nodeletionfromright:true}};
const Accent = (symbol) => {return {symbol:symbol,children:[],hassinglechild:true}}
const Delimiter = (symbol) => {return {leftsymbol:symbol,rightsymbol:Keyboard.DELIMITERS[symbol],children:[]}};

function getNode(symbol){
  if (Keyboard.PARENT_SYMBOLS.includes(symbol)) return ParentSymbol(symbol);
  else if (Keyboard.ACCENTS.includes(symbol)) return Accent(symbol);
  else if (symbol in Keyboard.DELIMITERS) return Delimiter(symbol);
  return Symbol(symbol);
}

function getFormula(node){
    if (node.iscursor) return "\\class{math_cursor}|";

    var string =  "";
    if (!node.isroot) string += `\\cssId{math-${node.id}}{`;
    if (node.symbol) string += node.symbol;
    else if (node.leftsymbol) string += node.leftsymbol;
    if (node.children){
      if (node.symbol) string += `{${node.children.map(getFormula).join("")}}`;
      else string += node.children.map(getFormula).join(""); // Just a simple grouping
    }
    if (node.rightsymbol) string += node.rightsymbol;
    if (!node.isroot) string += "}";
    if (node.selected) string = `\\class{math_selected}{${string}}`;
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

function findCursorParent(node){
  if (node.children){
    var isCursorParent = false;
    var toReturn = false;
    node.children.forEach((child)=>{
      if (child.iscursor) isCursorParent=true;
      if (child.children) {
        var result = findCursorParent(child);
        if (result) toReturn = result;
      }
    });
    if (isCursorParent) return node;
    if (toReturn) return toReturn;
  }
  return false;
}

function findSelectedNode(node){
  if (node.selected) return node;
  if (node.children){
    var results = node.children.map(findSelectedNode).filter(r=>r);
    if (results.length>0) return results[0];
  }
  return false;
}

function unselect(tree){
  return applyToAllNodes(tree,n => n.selected=false);
}

function setSelectedNode(tree,id){
  return applyToAllNodes(tree,(n)=>{n.selected=(n.id===id)});
}

function deleteSelectedNode(tree,replaceWithCursor){
  return deleteNode(tree,findSelectedNode(tree).id,"selection",replaceWithCursor);
}

function deleteNode(tree,id,deletionMode="selection",replaceWithCursor=false){ // Deletion mode : "selection"|"cursor"
  console.log(id,tree);
  const deleter = (children) => {
    var stopModify = false;
    const index = children.findIndex(child => child.id === id);
    if (index !== -1){
      const nodeToDelete = children[index];
      if (!nodeToDelete.children || (nodeToDelete.hassinglechild && deletionMode==="cursor")){
        children.splice(index,1);
      }
      else { // We will make it "explode" (ie leave its children).
        children.splice(index,1,...nodeToDelete.children);
      }
      if (replaceWithCursor) children.splice(index,0,CURSOR);
      stopModify = true;
    }
    return {children,stopModify};
  }
  return modifyChildren(tree,deleter).node;
}

function replaceSelectedNode(tree,node){ // Replaces the selected node with 'node', and places the cursor just after.
  const replacer = (children) => {
    const index = children.findIndex(child => child.selected);
    if (index !== -1) children.splice(index,1,node,CURSOR);
    return {children,stopModify:index!==-1};
  }
  return modifyChildren(tree,replacer).node;
}

function replaceNode(tree,id,node){
  return applyToAllNodes(tree, n => {
    if (n.id === id) {
      Object.assign(n, node); // Mutate node directly
    }
  });
}

function deleteNextToCursor(tree,direction){
  const index_shift = (direction==="right") ? 1 : -1;
  const cursorParent = findCursorParent(tree);
  const index = cursorParent.children.findIndex(child => child.iscursor);
  const toDelete = cursorParent.children[index+index_shift];
  if (toDelete){ // Found something to delete !
    // Specific case for when the node has children, and only a symbol on the left (no 'rightsymbol') : do nothing if going left !
    if (direction==="left" && toDelete.nodeletionfromright) return tree; // Should we then "enter" and delete the last child then ?
    return deleteNode(tree,toDelete.id,"cursor");
  }
  else if (index+index_shift === -1){// Allow deleting parent when going to the left. (deletion 'from inside')
    return deleteNode(tree,cursorParent.id,"cursor",false);// The cursor will already be placed as for any other child
  }
  else if (index+index_shift === cursorParent.children.length && cursorParent.nodeletionfromright){// Idem to the right
    return deleteNode(tree,cursorParent.id,"cursor",false);
  }
  return tree;
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
      }
      return {children,stopModify:index !== -1};}
  }
  var newtree =  modifyChildren(node,inserter).node;
  setUids(newtree);
  return newtree;
}

function adoptNodeBeforeCursor(tree,newnode){ // Add an accent or modifier on the node before the cursor
  const modifier = children => {
    const index = children.findIndex(child => child.iscursor);
    if (index >= 1) {
      var previousnode = children[index-1];
      newnode.children = [previousnode];
      children.splice(index-1, 1, newnode);
    }
    return {children,stopModify:index !== -1};
  }
  var newtree = modifyChildren(tree,modifier).node;
  setUids(newtree);
  return newtree;
}

function adoptSelectedNode(tree,newnode){
  var selectedNode = findSelectedNode(tree);
  newnode.children=[selectedNode];
  console.log(tree,selectedNode.id);
  var newtree = replaceNode(tree,selectedNode.id,newnode);
  console.log(newtree);
  setUids(newtree);
  
  return newtree;
}

function removeCursor(tree){
  return modifyChildren(tree,children => {return {children:children.filter(child=>!(child.iscursor)),stopModify:children.some(c=>c.iscursor)}}).node;
}

function selectedToCursor(tree,side){ // Add cursor next to selected, and unselect
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

function recursiveShiftCursor(node,shift) {
  // node is NOT cursor
  const newnode = { // Make copy
    ...node,
  };
  if (node.children){
    const index = node.children.findIndex(child => child.iscursor);// Looking for the cursor
    if (index===-1){// Not found among direct children. recursion.
      newnode.children = [];
      node.children.forEach(child => {
        let results = recursiveShiftCursor(child,shift);
        if (shift===-1 && results.justFoundCursor) newnode.children.push(CURSOR);
        newnode.children.push(results.node);
        if (shift===1 && results.justFoundCursor) newnode.children.push(CURSOR);
      });
    }
    else{
      var nextnode = newnode.children[index+shift];
      if (nextnode){ // Simple case : we don't leave this branch
        if (nextnode.children && !nextnode.hassinglechild){// We need to go down the tree, and insert the cursor as a new leaf
          newnode.children.splice(index,1); // Remove the cursor
          nextnode.children.splice((shift===1)?0:nextnode.children.length,0,CURSOR);
        }
        else{// Just exchange CURSOR and nextnode
          [newnode.children[index],newnode.children[index+shift]] = [nextnode,CURSOR];
        }
      }
      else{ // We need to go up the tree. We do that by returning a flag saying we just found the cursor
        if (!node.isroot) newnode.children.splice(index,1); // Remove the cursor (except if we are the root node)
        return {node:newnode,justFoundCursor:true};
      }
    }
  }
  return {node:newnode,justFoundCursor:false};
}

function shiftCursor(tree,direction){
  return recursiveShiftCursor(tree,direction==="right"?1:-1).node;
}

function setUids(node,nextUid=0){// Inplace
  // Let's just give ids to all nodes
  node.id = nextUid;
  nextUid++;
  if (node.children){
    node.children.forEach(childnode => {
      nextUid = setUids(childnode,nextUid);
    });
  }
  return nextUid;
}

export default {CURSOR,getNode,getFormula,applyToAllNodes,setUids,deleteSelectedNode,replaceSelectedNode,deleteNextToCursor,insertAtCursor,adoptNodeBeforeCursor,adoptSelectedNode,removeCursor,shiftCursor,setSelectedNode,selectedToCursor,unselect}