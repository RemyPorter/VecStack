# Stack Based Vector Language

This is a little toy I threw together. The language is in flux, the way it works is fucking weird, but it's kinda a fun toy. You can try it [here](https://remyporter.github.io/VecStack/index.html). This is a crappy P5js implementation, which I did just because it was a quick way to get to drawing. I'm playing with an idea, not trying to make a useful tool.

Yes, I know, this is basically PostScript. I'm sorta implementing my own version as a learning exercise. And for fun. And it's not trying to map to PostScript, even if there are some syntactic similarities.

## Stacks
Everything interacts with a stack. Each item/entry you push onto the stack can then be consumed by entries which come later on the stack. For example:

```
50 30 10 c
```

This pushes `50`, then `30`, then `10` onto the stack. When we encounter the symbol `c`, that stands for "circle". `c` pops the last 3 items off the stack, and then draws a circle at `(50,30)` with a radius `10`.

A program is a series of symbols, seperated by whitespace. Most symbols *add* entries to the stack. Some, especially our reserved symbols, consume symbols off the stack. `c` is a reserved symbol.

## Drawing Shapes
Here's a quick summary of our drawing primitives, at this time:

### Circle
`x y r c`

The `c` operator consumes the last 3 things on the stack, and draws a circle. NB, x/y mark the *corner* of the circle at this time.

### Ellipse
`x y rx ry e`

The `e` operator consumes the last 4 things on the stack, and draws an ellipse. NB x/y mark the *corner* of the ellipse at this time.

### Rectangle

`x y w h r`

The `r` operator consumes the last 4 things on the stack, and draws a rectangle.

### Line
`x0 y0 x1 y1 l`

Pops four items off the stack, draws a line between the two points.

### Paths
Paths are more complicated. Paths consume at least *two* entries off the stack.

`closed n path`

`closed` should be a boolean value ("true" or "1" are true, anything else is considered false.) That controls whether or not the path will automatically close itself.

`n` is how many points are in the path. In addition to consuming closed/n off the stack, the `path` operator will consume 2n items off the stack, the x/y coordinate pairs of each point.

For example:

```
10 10
20 20
50 20
50 30
true 4 path
```

This creates a path from (50,30), to (50,20), to (20,20), to (10,10).

## Drawing Context
Context controls are the different ways to change the transform, or drawing settings. Separate from the program stack, each of these commands also interacts with the drawing stack, which is the stack of transforms, drawing settings, etc.

### size
`w h sz`

`sz` pops two items off the stack, and sets the drawing canvas to that size. Should probably be the first thing in your script, but there's nothing that prevents you from invoking it in the middle of drawing. It just… probably won't do what you want, is all.

### translate
`x y tr`

`tr` pops two items off the stack, and translates to that position. Pushes the transform onto the drawing stack.

### rotate
`r rt`

`rt` pops one item off the stack, and rotates. This should be in radians. Pushes the transform onto the drawing stack.

### scale
`x y sc`

Scale pops two items off the stack, and scales by that amount in each dimension. Pushes the transform onto the drawing stack.

### fill
#### set fill
`color f`

Pops one item off the stack, should be a HTML compatible color code (triplet, rgba, etc.) *containing no spaces*, or a value between 0-255. Sets the fill to that color, pushes that setting onto the drawing stack.

#### clear fill
`nf`

Consumes nothing off the stack, and clears the fill. Pushes that setting onto the drawing stack. It's important then, to note, that `f`/`nf` are *not* inverse operations- each adds a new entry onto the drawing stack.

### pop
#### pop
`p` 

Consumes nothing off the program stack. Pops the last entry from the drawing stack.

#### multipop
`n pp`

Consumes one item off the stack, the number of levels you want to pop off the drawing stack.

## Arithmetic
`+`,`-`,`*`,`/` and `**` (power) are all implemented as arithmetic operators.

### rad/deg
`rad` pops one item off the stack, converts it to radians, and pushes that onto the stack.

`deg` pops one item off the stack, converts it to radians, and pushes that onto the stack.

### Trig
`sin`, `cos`, and `tan` all pop the last item off the stack, evaluate the function, and push the result onto the stack. Input should be in radians.

### Constants
`pi` pushes the value PI onto the stack

## Flow Control
### Duplicate
The `..` operator pops the last item on the stack, and pushes it back twice. Useful for situations like scaling:

`0.5 .. sc` is equivalent to `0.5 0.5 sc`

### Swap
`<>` swaps the order of the top two items on the stack.

### Deletions
`--` pops the top element off the stack and discards it.
`d-` pops an integer off the stack, and then discards `n` items from the stack.

### Comments
C-style comments, `/* comment here */` work.

### Blocks
The fundamental unit of flow control is the block. A block starts when a `{` is encountered in the stack, and the block ends when `}` is encountered. Blocks are a single entry in the stack, and can be pushed and popped like any other entry. Blocks can then be used with other commands.

#### Simple Example
```
{
    0 0 400 400 l
}
exe
```

This defines a block which draws a line. The `exe` operator simply pops the last entry on the stack and tries to execute it as a block. This is basically useless, but illustrates how to create and execute a block.

### Repeat
A more practical example is `rep`.

```
{
    10 10 tr
    0 0 400 400 l
} 10 rep
```

`rep` pops two entries off the stack: a block, and a number of times to repeat that block. Afterwards, it pushes the number of times back on the stack. In the example above, this would pop the block and `10` off the stack, execute the block ten times, and then push `10` back onto the stack.

This is often used in conjunction with `pp` to undo all the transformations of the block. Adding a `pp` to the sample above would reset the transformation matrix.

### Conditional (if)
You can conditionally execute blocks using `if`. The `if` operator pops two items off the stack, both could be blocks. E.g.:

```
10 /* puts 10 on the stack */
{
    0 0 100 100 l /* draw a line */
}
{
    10 eq /* compare the top two items on the stack */
}
if
```

In this case, `if` pops two blocks off the stack, and then executes the conditional block. That pops another item off the stack (in this case, 10) and compares it against 10. It's true, so then we draw a line.

Instead of having the condition be a block, however, you could just have the condition be evaluated in place, e.g.:

```
{
    0 0 100 100 l
}
10 10 eq
if
```


### Procs
You can also use blocks to define a procedure. 

```
{
    10 10 tr
    0 0 400 400 l
} foo proc
```

This creates a new procedure/word/command called `foo`. Using `foo` anywhere in your program will execute this block.

Blocks also are a good way to create constants:

`{10} step proc` means that any time I use `step`, the value `10` will be placed on the stack.

## Other
`print` will dump the current stack to your browser console. It does not otherwise change the stack.