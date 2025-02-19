# TODO list

## Bugs
- Problem : interference between ids/classes and "_" in the placement for some operators (ex large operators)

## Basic capabilities
- Text mode : deletion by selection (global), and using the cursor
- Fractions
- Environment (multi-line)

### Provisional list of math tokens types
- Simple symbols (vis, no child) : `a` -> symbol
- Parent symbol (vis, has children, "explode" upon deletion, no deletion from outside on the right) : `\sqrt` -> symbol, children, nodeletionfromright
NB : `_` and `^` should probably be identified as parent symbol despite being invisible.
- Delimiter (vis, has children, "explode" upon deletion, has a second symbol, can be modified to include `\left` and `\right`) : `(` -> lefstsymbol, rightsymbol, children, adaptative
- Single-element modifier (invis, 1 child, "implode" upon deletion) : `\mathcal` -> symbol, children, singlechild
- Accent (vis, 1 child, "implode" upon cursor deletion, "explode" upon selected deletion) : `\hat` -> symbol, children, singlechild
NB : In the code, single-element modifiers and accents can therefore be mixed. They should also prevent the cursor to be one of their children (except at creation).
- General modifier (invis, children, deleted only if it looses all children, adjacent identical modifiers should merge) : `\text` -> symbol, children, ismodifier
- Fraction (vis, 2 children, "implode" upon deletion. deletion : from the middle ?) : `\frac` -> symbol, children, hasfixedchildren
- Fixed element (child of a fraction : non visible, has children, cannot be deleted)
NB : in cases where the number of children is fixed, the cursor should never be allowed as a child. The difference between hasfixedchildren and singlechild is that for the frac, the cursor can go "inside" because each child can have multiple children.
-> Idea : for singlechild elements, maybe allow the modification to be done only AFTER ? this way the cursor is really never inside. (ex typing `H \hat`).

## Typing improvements
- Shortcuts
- On-screen special character keyboard

## Performance imprivements
- Test other methods of running MathJax to improve rendering speed