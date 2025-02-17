# TODO list

## Bugs
- Problem : interference between ids/classes and "_" in the placement for some operators (ex large operators)

## Basic capabilities
- Recognize commands that are more complicated that just symbols (ex sqrt, frac)

### Provisional list of math tokens types
- Simple symbols (visible, no child) : `a`
- Parent symbol (visible, has children, "explode" upon deletion, no deletion from outside on the right) : `\sqrt`
- Delimiter (visible, has childre, "explode" upon deletion, has a second symbol, can be modified to include `\left` and `\right`) : `(`
- Single-element modifier (non visible, has 1 child, "implode" upon deletion OR disappears only if it looses all children) : `\mathcal`
- General modifier (non visible, has children, disappears only if it looses all children, adjacent identical modifiers should merge) : `\text`
- Accent (visible, has 1 child, "implode" upon cursor deletion, "explode" upon selected deletion) : `\hat`
- Fraction (visible, has 2 children, "implode" upon deletion) : `\frac`

## Typing improvements
- Shortcuts
- On-screen special character keyboard ?

## Performance imprivements
- Test other methods of running MathJax to improve rendering speed