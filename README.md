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

`tr` pops two items off the stack, and translates to that position.

### rotate
`r rt`

`rt` pops one item off the stack, and rotates. This should be in radians.

### scale
`x y sc`

Scale pops two items off the stack, and scales by that amount in each dimension.

### fill
#### set fill
`color f`

Pops one item off the stack, should be a HTML compatible color code (triplet, rgba, etc.) *containing no spaces*, or a value between 0-255. Sets the fill to that color.

#### clear fill
`nf`

Consumes nothing off the stack, and clears the fill. 

### Drawing Stack
Settings like transform, font, color, etc. can be managed on a separate drawing stack.

#### push
`psh` captures the current drawing state and pushes it onto the drawing stack. This includes pretty much all configuration: stroke, fill, font, etc. See [p5js#push](https://p5js.org/reference/#/p5/push) docs for details.
#### pop
`p` 

Consumes nothing off the program stack. Pops the last entry from the drawing stack.

#### multipop
`n pp`

Consumes one item off the stack, the number of levels you want to pop off the drawing stack.

#### clearpop
`ppp`

Consumes nothing off the stack, pops all the known transforms off the stack.

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
C++-style comments, `// comment here` works. No block comments.

### Blocks
The fundamental unit of flow control is the block. A block starts when a `{` is encountered in the stack, and the block ends when `}` is encountered. Blocks are a single entry in the stack, and can be pushed and popped like any other entry. Blocks can then be used with other commands.

#### A Note on Nested Blocks
You can't. This is because the parser is very dumb (and very simple), and it simply sees the first `}` as the end of the block. The ideal solution is to use procs (see below) instead of nesting blocks.

Maybe I will add nested blocks in the future. I probably will, they make sense, obviously, but at the moment they're a "no no".

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

### For Loops
While repeats are simple loops, a for loop is a much more complex loop which allows for complex operations on the stack. The `for` word pops 3 entries off the stack, expecting them in this sequence:

`{ action } { increment } { condition } for`

**NB**: unlike for loops in other languages, there is no initializer clause. Your stack's topmost item must be your initializer.

`condition` will be run before each loop. It should consume the top item off the stack, evaluate a true/false condition, and push true/false onto the top of the stack. If, after the condition, `true` is on the top of the stack, the `action` will be executed. After the action, the `increment` will execute- this should take the top item off the stack, modify it, and place the result atop the stack.

When `condition` is false, the loop stops.

### While Loops
While loops are simple loops. They pop two items off the stack, a block and a truthy value. If that truthy value *is* true, the block is executed. The block should, in its execution, push a truthy value to the top of the stack. While that value is true, the block will be re-executed. Otherwise, it'll break.

Example:

```
0
true
{
  10 10 tr
  0 0 10 c
  1 +
  .. 10 lt
} while
```

The `while` command pops the block and true off the stack, then runs the block, which you'll note consumes the 0 at the top of thee stack, incrementing it by one, then duplicating it to see if it's less than 10, which puts a `true` at the top of the stack.


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