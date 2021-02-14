# Stack Based Vector Language

This is a little toy I threw together. The language is in flux, the way it works is fucking weird, but it's kinda a fun toy. You can try it [here](https://remyporter.github.io/VecStack/index.html). This is a crappy P5js implementation, which I did just because it was a quick way to get to drawing. I'm playing with an idea, not trying to make a useful tool.

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

`closed n p`

`closed` should be a boolean value ("true" or "1" are true, anything else is considered false.) That controls whether or not the path will automatically close itself.

`n` is how many points are in the path. In addition to consuming closed/n off the stack, the `p` operator will consume 2n items off the stack, the x/y coordinate pairs of each point.

For example:

```
10 10
20 20
50 20
50 30
true 4 p
```

This creates a path from (50,30), to (50,20), to (20,20), to (10,10).

## Drawing Context
Context controls are the different ways to change the transform, or drawing settings. Separate from the program stack, each of these commands also interacts with the drawing stack, which is the stack of transforms, drawing settings, etc.

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