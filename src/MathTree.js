import Keyboard from "./Keyboard";

const CURSOR = {iscursor:true,symbol:"|"};
const PLACEHOLDER = {isplaceholder:true,symbol:"\\square"}
const SMALLLETTERPLACEHOLDER = {isplaceholder:true,symbol:"x"}
const BIGLETTERPLACEHOLDER = {isplaceholder:true,symbol:"A"}
const DEFAULT_TREE = {isroot:true,nodeletion:true,children:[CURSOR]};

const Symbol = (symbol) => {return {symbol}};
const ParentSymbol = (symbol,addplaceholder=false) => {return {symbol,children:addplaceholder?[PLACEHOLDER]:[],nodeletionfromright:true}};
const LimLike = (symbol,addplaceholder=false) => {return {symbol,children:[],childrenaredown:true,implodes:true}};
const Accent = (symbol,addplaceholder=false) => {return {symbol,children:addplaceholder?[SMALLLETTERPLACEHOLDER]:[],hassinglechild:true}}
const Style = (symbol,addplaceholder=false) => {return {symbol,children:addplaceholder?[BIGLETTERPLACEHOLDER]:[],hassinglechild:true,implodes:true}}
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
  else if (Keyboard.ACCENTS.includes(symbol)) return Accent(symbol,addplaceholder);
  else if (Keyboard.STYLES.includes(symbol)) return Style(symbol,addplaceholder);
  else if (symbol in Keyboard.DELIMITERS) return Delimiter(symbol,addplaceholder);
  else if (Keyboard.MODIFIERS.includes(symbol)) return Modifier(symbol,addplaceholder);
  else if (Keyboard.FRAC_LIKE.includes(symbol) || Keyboard.SUM_LIKE.includes(symbol)) return FracLike(symbol,addplaceholder);
  else if (Keyboard.LIM_LIKE.includes(symbol)) return LimLike(symbol,addplaceholder);
  else if (symbol in Keyboard.ENVIRONMENTS) return Environment(symbol,addplaceholder);
  return Symbol(symbol);
}

function insertCursorInNode(node){// Insert cursor at the "right place", assuming this node will be added to the math tree
  if (!node.children) return false; // Cannot insert cursor
  const nchildren = nChildren(node);
  var newnode = {...node};
  if (nchildren===0) {
    newnode.children = [CURSOR];
    return newnode;
  }
  for (var i=0;i<nchildren;i++){
    const modifiedNode = insertCursorInNode(node.children[i]); // Recursivity
    if (modifiedNode){// Success
      newnode.children[i] = modifiedNode;
      return newnode;
    }
  }
  // No success
  return false;
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

function pathToNode(tree,path){// Recursively loops along the indices n and gets the n(th) children every time. Returns the node at the end.
  if (path.length===0) return tree;
  return pathToNode(tree.children[path[0]],path.slice(1));
}

function nChildren(node){ // Number of 'real' children
  if (!node.children) return undefined;
  if (node.children.some(c=>c.iscursor)) return node.children.length-1;
  return node.children.length;
}

function deleteNode(tree,path,deletionMode="selection",replaceWithCursor=false){ // Deletion mode : "selection"|"cursor".
  var newnode = {...tree};
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
  // We need to check if we have emptied a modifier or a node that has a single child :
  var modifiedNode = deleteNode(newnode.children[path[0]],path.slice(1),deletionMode,replaceWithCursor);
  if (nChildren(modifiedNode)===0 && (modifiedNode.ismodifier || modifiedNode.hassinglechild)){
    newnode.children.splice(path[0],1); // Delete that node
    if (replaceWithCursor || deletionMode==="cursor") newnode.children.splice(path[0],0,CURSOR);
  }
  else newnode.children[path[0]] = modifiedNode;
  return newnode;
}

function insertAtPath(tree,path,node,replace=false){
  var newnode = {...tree};
  if (path.length===1){
    newnode.children.splice(path[0],replace?1:0,node);
  }
  else newnode.children[path[0]] = insertAtPath(newnode.children[path[0]],path.slice(1),node,replace);
  return newnode;
}

function adoptAtPath(tree,path,parent){// The target node is replaced by the node 'parent', which adopts the previously present node.
  var previousnode = pathToNode(tree,path);
  parent.children = [previousnode];
  tree = insertAtPath(tree,path,parent,true);
  setUids(tree);
  return tree;
}

function alignAll(tree){ // Puts the whole tree (minus the root) in an align environment
  const alignNode = getNode("\\begin{align}");
  alignNode.children = tree.children.flatMap(n => (n.symbol==="="?[getNode("&"),n]:[n])); // Put '&' in front of any '='
  tree.children = [alignNode];
  return tree;
}

function setUids(tree,nextUid=0){// Inplace
  // Let's just give ids to all nodes
  tree.id = nextUid;
  nextUid++;
  if (tree.children){
    tree.children.forEach(childnode => {
      nextUid = setUids(childnode,nextUid);
    });
  }
  return nextUid;
}

// Cursor

function removeCursor(tree){
  const path = findCursorParent(tree).cursorPath;
  if (path) return deleteNode(tree,path);
  return tree;
}

function appendCursor(tree){
  tree.children.push(CURSOR);
  return tree;
}

function findCursorParent(tree){
  if (tree.children){
    for (var index=0;index<tree.children.length;index++){
      let child = tree.children[index];
      if (child.iscursor) return {node:tree,path:[],cursorIndex:index,cursorPath:[index]};
      else if (child.children) {
        var result = findCursorParent(child);
        if (result){
          result.path.unshift(index);
          result.cursorPath.unshift(index);
          return result;
        }
      }
    }
  }
  return false;
}

function pushCursorAtPath(tree,path){// CURSOR will be pushed as a child of the node reached following the path
  if (path.length===0) {tree.children.push(CURSOR); return tree;}
  tree.children[path[0]] = pushCursorAtPath(tree.children[path[0]],path.slice(1));
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

function insertAtCursor(tree,newnode){
  const targetpath = findCursorParent(tree).cursorPath;
  const modifiedNode = insertCursorInNode(newnode);
  var newtree = {};
  if (modifiedNode){// Case where we inserted the cursor, then we need to remove it by replacing it.
    newtree = insertAtPath(tree,targetpath,modifiedNode,true);
  }
  else{
    newtree = insertAtPath(tree,targetpath,newnode,false);
  }
  setUids(newtree);
  return newtree;
}

function adoptNodeBeforeCursor(tree,newnode){ // Add an accent or modifier on the node before the cursor
  const cpr = findCursorParent(tree);
  if (cpr.cursorIndex>=1){
    var path = cpr.path;
    path.push(cpr.cursorIndex-1);
    return adoptAtPath(tree,path,newnode);
  }
  return tree;
}

function applyReplacementShortcut(tree){
  const cursorParentResults = findCursorParent(tree);
  var cursorParent = cursorParentResults.node;
  const index = cursorParentResults.cursorIndex;
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

function canReplace(node,newnode){
  if ((!node.children) || node.implodes) return true; // A node with no children list can always be replaced. Same with a node that should 'implode' upon deletion
  // node has children and does not implode
  if (node.hasstrictlytwochildren) return (newnode.hasstrictlytwochildren);
  if (node.hassinglechild) return (newnode.hassinglechild);
  if (node.ismodifier) return (newnode.ismodifier);
  return true;
}

function replaceSelectedNode(tree,node,transferChildren=true){ // Replaces the selected node with 'node', and places the cursor just after. Keep the same children.
  return tree;// I will rewrite this entirely anyway
}

function adoptSelectedNode(tree,newnode){
  const selection = findSelectedNode(tree);
  return adoptAtPath(tree,selection.path,newnode);
}

function selectedToCursor(tree,side){ // Add cursor next to selected, and unselect
  var path = findSelectedNode(tree).path;
  if (side==="right") path[path.length-1] += 1;
  return unselect(insertAtPath(tree,path,CURSOR,false));
}

export default {CURSOR,DEFAULT_TREE,FracLike,getNode,isValidRawText,pathToNode,pushCursorAtPath,getFormula,applyToAllNodes,setUids,insertCursorInNode,deleteSelectedNode,replaceSelectedNode,deleteNextToCursor,insertAtCursor,adoptNodeBeforeCursor,adoptSelectedNode,removeCursor,appendCursor,shiftCursor,setSelectedNode,selectedToCursor,unselect,findCursorParent,applyReplacementShortcut,alignAll}