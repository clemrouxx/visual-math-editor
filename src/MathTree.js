import Keyboard from "./Keyboard";

const CURSOR = {iscursor:true,symbol:"|"};
const PLACEHOLDER = {isplaceholder:true,symbol:"\\square"}
const LETTERPLACEHOLDER = {isplaceholder:true,symbol:"x"}
const DEFAULT_TREE = {isroot:true,nodeletion:true,children:[CURSOR]};

const Symbol = (symbol) => {return {symbol}};
const ParentSymbol = (symbol,addplaceholder=false) => {return {symbol,children:addplaceholder?[PLACEHOLDER]:[],nodeletionfromright:true}};
const LimLike = (symbol,addplaceholder=false) => {return {symbol,children:[],childrenaredown:true,implodes:true}};
const Accent = (symbol,addplaceholder=false) => {return {symbol,children:addplaceholder?[LETTERPLACEHOLDER]:[],hassinglechild:true}}
const Delimiter = (symbol,addplaceholder=false) => {return {leftsymbol:symbol,rightsymbol:Keyboard.DELIMITERS[symbol],children:addplaceholder?[PLACEHOLDER]:[],adptative:true}};
const Modifier = (symbol,addplaceholder=false) => {return {symbol,children:[],ismodifier:true,parseastext:true,implodes:true}};
const FracLike = (symbol,addplaceholder=false) => {
  var childrenstring = "{§0}{§1}";
  var verticalorientation = "down";
  if (Keyboard.SUM_LIKE.includes(symbol)) {childrenstring = "_{§0}^{§1}"; verticalorientation="up";}
  else if (symbol === "\\underbrace") childrenstring = "{§0}_{§1}";
  else if (symbol === "\\overbrace") {childrenstring = "{§0}^{§1}"; verticalorientation="up";}
  else if (symbol === "\\sqrt") childrenstring = "[§0]{§1}";
  return {symbol,verticalorientation,children:[{children:addplaceholder?[PLACEHOLDER]:[],nodeletion:true},{children:addplaceholder?[PLACEHOLDER]:[],nodeletion:true}],hasstrictlytwochildren:true,implodes:true,childrenstring}
};
const Environment = (symbol,addplaceholder=false) => {return {leftsymbol:symbol,rightsymbol:Keyboard.ENVIRONMENTS[symbol],children:[],ismultiline:true,nodeletionfromright:true,implodes:true}};

function getNode(symbol,rawtext=false,addplaceholder=false){
  if (rawtext) return Symbol(symbol);
  else if (Keyboard.PARENT_SYMBOLS.includes(symbol)) return ParentSymbol(symbol,addplaceholder);
  else if (Keyboard.ACCENTS.includes(symbol) || Keyboard.STYLES.includes(symbol)) return Accent(symbol,addplaceholder);
  else if (symbol in Keyboard.DELIMITERS) return Delimiter(symbol,addplaceholder);
  else if (Keyboard.MODIFIERS.includes(symbol)) return Modifier(symbol,addplaceholder);
  else if (Keyboard.FRAC_LIKE.includes(symbol) || Keyboard.SUM_LIKE.includes(symbol)) return FracLike(symbol,addplaceholder);
  else if (Keyboard.LIM_LIKE.includes(symbol)) return LimLike(symbol,addplaceholder);
  else if (symbol in Keyboard.ENVIRONMENTS) return Environment(symbol,addplaceholder);
  return Symbol(symbol);
}

function isValidRawText(node){
  if (node.children) return false;
  if (node.symbol.length>1) return false;
  return true;
}

function getFormula(node,forEditor){
    if (node.iscursor) return forEditor ? `\\class{math-cursor}{${node.symbol}}` : "";

    var string =  "";
    if (node.symbol) string += node.symbol;
    else if (node.leftsymbol){
      if (node.adptative) string += "\\left ";
      string += node.leftsymbol;
    }

    if (node.parseastext){
      let inside = node.children.map(c=>(c.iscursor && !forEditor)?"":c.symbol).join("");
      string += `{${inside}}`;
    }
    else if (node.hasstrictlytwochildren){
      string += node.childrenstring.replace("§0",getFormula(node.children[0],forEditor)).replace("§1",getFormula(node.children[1],forEditor))
    }
    else if (node.children){
      if (node.symbol){
        if (node.childrenaredown) string += "_";// For limits...
        string += `{${node.children.map(c=>getFormula(c,forEditor)).join("")}}`;
      }
      else string += node.children.map(c=>getFormula(c,forEditor)).join(""); // Just a simple grouping
    }
    if (node.rightsymbol){
      if (node.adptative) string += "\\right ";
      string += node.rightsymbol;
    }

    // Surrounding commands for classes & ids
    const invisible = Keyboard.INVISIBLE_SYMBOLS.includes(node.symbol);
    if (forEditor && !node.isroot && !invisible) string = `\\class{math-node}{\\cssId{math-${node.id}}{${string}}}`;
    if (node.selected && forEditor) string = `\\class{math-selected}{${string}}`;
    else if (node.isplaceholder) string = `\\class{math-placeholder}{${string}}`;
    return string;
}

// MATH TREE MANIPULATION

// Basic & general manipulations

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

function pathToNode(node,indices){// Recursively loops along the indices n and gets the n(th) children every time. Returns the node at the end.
  if (indices.length===0) return node;
  return pathToNode(node.children[indices[0]],indices.slice(1));
}

function deleteNode(node,path,deletionMode="selection",replaceWithCursor=false){ // Deletion mode : "selection"|"cursor".
  var newnode = {...node};
  if (path.length===1){ // We need to delete one of its children
    const nodeToDelete = newnode.children[path[0]];
    if (!nodeToDelete.children || (nodeToDelete.hassinglechild && deletionMode==="cursor") || nodeToDelete.implodes){ // Implode
      newnode.children.splice(path[0],1);
    }
    else { // We will make it "explode" (ie leave its children).
      newnode.children.splice(path[0],1,...nodeToDelete.children);
    }
    if (replaceWithCursor) newnode.children.splice(path[0],0,CURSOR);
    return newnode;
  }
  // Else : do recursion
  newnode.children[path[0]] = deleteNode(newnode.children[path[0]],path.slice(1));// Change the child recursively
  return newnode;
}


function replaceNode(tree,id,node){
  return applyToAllNodes(tree, n => {
    if (n.id === id) {
      Object.assign(n, node); // Mutate node directly
    }
  });
}

function alignAll(tree){ // Puts the whole tree (minus the root) in an align environment
  const alignNode = getNode("\\begin{align}");
  alignNode.children = tree.children.flatMap(n => (n.symbol==="="?[getNode("&"),n]:[n])); // Put '&' in front of any '='
  console.log(alignNode)
  tree.children = [alignNode];
  return tree;
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

// Cursor

function removeCursor(tree){
  return modifyChildren(tree,children => {return {children:children.filter(child=>!(child.iscursor)),stopModify:children.some(c=>c.iscursor)}}).node;
}

function appendCursor(tree){
  tree.children.push(CURSOR);
  return tree;
}

function findCursorParent(node){
  if (node.children){
    var isCursorParent = false;
    var toReturn = false;
    var cursorIndex = -1;
    node.children.forEach((child,index)=>{
      if (child.iscursor) {
        isCursorParent=true;
        cursorIndex = index;
      }
      if (child.children) {
        var result = findCursorParent(child);
        if (result){
          toReturn = result;
          toReturn.path.unshift(index);
        }
      }
    });
    if (isCursorParent) return {node,path:[],cursorIndex};
    if (toReturn) return toReturn;
  }
  return false;
}


function putCursorAtPath(tree,path){// CURSOR will be pushed as a child of the node reached following the path
  if (path.length===0) {tree.children.push(CURSOR); return tree;}
  tree.children[path[0]] = putCursorAtPath(tree.children[path[0]],path.slice(1));
  return tree;
}

function deleteNextToCursor(tree,direction){
  const index_shift = (direction==="right") ? 1 : -1;
  const cursorParentResults = findCursorParent(tree);
  const cursorParent = cursorParentResults.node;
  var path = cursorParentResults.path;
  const index = cursorParentResults.cursorIndex;
  const toDelete = cursorParent.children[index+index_shift];
  if (toDelete){ // Found something to delete !
    path.push(index+index_shift);
    // Specific case for when the node has children, and only a symbol on the left (no 'rightsymbol') : do nothing if going left !
    if (direction==="left" && toDelete.nodeletionfromright){ // Then we should "enter" (if the node has children), and delete nothing for now
      if (toDelete.children) {
        cursorParent.children.splice(index,1); // Remove cursor
        toDelete.children.push(CURSOR);
      }
      return tree; 
    }
    else if (toDelete.ismodifier){// Then we need to enter the modifier (depends on how many children it has)
      let nchildren = toDelete.children.length;
      if (nchildren<=1) return deleteNode(tree,path,"cursor"); // We empty the modifier, so we delete it completely.
      else{
        // Start by removing the cursor
        cursorParent.children.splice(index,1);
        // Then delete the node and replace it with the cursor
        let childToDeleteIndex = (direction==="right") ? 0 : toDelete.children.length-1;
        path.push(childToDeleteIndex);
        return deleteNode(tree,path,"cursor",true);
      }
    }
    return deleteNode(tree,path,"cursor");
  }
  else if (!cursorParent.nodeletion && (index+index_shift === -1 || (index+index_shift === cursorParent.children.length && !cursorParent.nodeletionfromright)) && !(cursorParent.ismodifier && cursorParent.children.length>1)){// deletion 'from inside' of cursorParent.
    if (cursorParent.implodes) return deleteNode(tree,path,"cursor",true);
    else return deleteNode(tree,path,"cursor",false);// The cursor will already be placed as for any other child (if explosion only)
  }
  return tree;
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
      if (newnode.hasstrictlytwochildren){
        let results0 = recursiveShiftCursor(node.children[0],shift);
        let results1 = recursiveShiftCursor(node.children[1],shift);
        newnode.children = [results0.node,results1.node];
        if ((shift===-1 && results0.justFoundCursor) || (shift===1 && results1.justFoundCursor)) return {node:newnode,justFoundCursor:true};// Send the cursor another level up
        else if (shift===1 && results0.justFoundCursor) newnode.children[1].children.splice(0,0,CURSOR);// Move cursor from up to down
        else if (shift === -1 && results1.justFoundCursor) newnode.children[0].children.push(CURSOR); // From down to up
        else return {node:newnode,justFoundCursor:false};
      }
      else{
        node.children.forEach(child => {
          let results = recursiveShiftCursor(child,shift);
          if (shift===-1 && results.justFoundCursor) newnode.children.push(CURSOR);
          newnode.children.push(results.node);
          if (shift===1 && results.justFoundCursor) newnode.children.push(CURSOR);
        });
      }
    }
    else{ // CURSOR is a direct child of newnode
      var nextnode = newnode.children[index+shift];
      if (nextnode){ // Simple case : we don't leave this branch
        if (nextnode.hasstrictlytwochildren){ // Special case, we need to go down 2 levels
          newnode.children.splice(index,1); // Remove the cursor
          if (shift === 1) nextnode.children[0].children.splice(0,0,CURSOR);
          else nextnode.children[1].children.splice(nextnode.children[0].children.length,0,CURSOR);
        }
        else if (nextnode.children && !nextnode.hassinglechild){// We need to go down the tree, and insert the cursor as a new leaf.
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

function insertAtCursor(node,newnode){
  if (newnode.children){// I will then place the cursor as last child
    if (newnode.hasstrictlytwochildren) newnode.children[0].children.push(CURSOR);
    else newnode.children.push(CURSOR);
    var inserter = (children) => {return {children:children.map((child) => child.iscursor ? newnode : child),stopModify:children.some(child => child.iscursor)};};
  }
  else{
    // eslint-disable-next-line
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

function applyReplacementShortcut(tree){
  var cursorParent = findCursorParent(tree).node;
  const index = cursorParent.children.findIndex(c=>c.iscursor);
  var s = "";
  const maxlength = 6;
  for (var i=1;i<=maxlength;i++){ // First, find the longest possible string
    if (index-i<0 || !cursorParent.children[index-i].symbol || cursorParent.children[index-i].symbol.length !== 1) break;
    s = cursorParent.children[index-i].symbol + s;
  }
  // Then, we look in priority at the longest sequences
  const slen = s.length;
  for (var j=0;j<=slen-1;j++){
    let splitstring = s.slice(j);
    if (splitstring in Keyboard.SHORTCUTS){
      cursorParent.children.splice(index-slen+j,slen-j); // Remove the "used" nodes
      return {tree,symbol:Keyboard.SHORTCUTS[splitstring]};
    }
  }
  return {tree,symbol:undefined};
}

// Selection

function unselect(tree){
  return applyToAllNodes(tree,n => n.selected=false);
}

function setSelectedNode(tree,id){
  return applyToAllNodes(tree,(n)=>{n.selected=(n.id===id)});
}

function deleteSelectedNode(tree,replaceWithCursor){
  return deleteNode(tree,findSelectedNode(tree).path,"selection",replaceWithCursor);
}

function findSelectedNode(node){
  if (node.selected) return {node,path:[]};
  if (node.children){
    for (var index=0;index<node.children.length;index++){
      var res = findSelectedNode(node.children[index]);
      if (res){
        res.path.unshift(index);
        return res;
      }
    }
  }
  return false;
}

function replaceSelectedNode(tree,node,transferChildren=true){ // Replaces the selected node with 'node', and places the cursor just after. Keep the same children.
  const replacer = (children) => {
    const index = children.findIndex(child => child.selected);
    if (index !== -1){
      if (transferChildren) node.children = children[index].children;
      children.splice(index,1,node,CURSOR);
    }
    return {children,stopModify:index!==-1};
  }
  return modifyChildren(tree,replacer).node;
}

function adoptSelectedNode(tree,newnode){
  var selectedNode = findSelectedNode(tree).node;
  newnode.children=[selectedNode];
  console.log(tree,selectedNode.id);
  var newtree = replaceNode(tree,selectedNode.id,newnode);
  console.log(newtree);
  setUids(newtree);
  
  return newtree;
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



export default {CURSOR,DEFAULT_TREE,FracLike,getNode,isValidRawText,pathToNode,putCursorAtPath,getFormula,applyToAllNodes,setUids,deleteSelectedNode,replaceSelectedNode,deleteNextToCursor,insertAtCursor,adoptNodeBeforeCursor,adoptSelectedNode,removeCursor,appendCursor,shiftCursor,setSelectedNode,selectedToCursor,unselect,findCursorParent,applyReplacementShortcut,alignAll}