# Manim Animation Code Guidelines

## ⚠️ CRITICAL RULES - MUST FOLLOW

### � RULE #1: USE ONLY APPROVED OBJECTS (SEE LIST BELOW)
**If an object is not in the "ALLOWED" list → DO NOT USE IT**

Objects like CurvedPolyline, NumberLine, Axes, Graph, SVGMobject, ImageMobject, etc. 
either don't exist or will cause errors. Stick to the approved list ONLY.

---

### �🚫 NEVER USE THESE (WILL CAUSE ERRORS):

1. **NEVER use SVGMobject** - Files don't exist
   ```python
   # ❌ WRONG - WILL FAIL
   hand = SVGMobject("assets/hand.svg")
   icon = SVGMobject("icon.svg")
   ```

2. **NEVER use ImageMobject** - No image files available
   ```python
   # ❌ WRONG - WILL FAIL
   img = ImageMobject("photo.png")
   ```

3. **NEVER use 2D coordinates**
   ```python
   # ❌ WRONG
   point = [1, 2]  # Must be [1, 2, 0]
   ```

4. **NEVER add lists for coordinates**
   ```python
   # ❌ WRONG - Creates [1,2,0,0.5,0,0] (6 elements!)
   A = [1, 2, 0]
   B = A + [0.5, 0, 0]
   ```

5. **NEVER use VGroup text indexing**
   ```python
   # ❌ WRONG
   text_group[0].text.index_of_part("word")  # No such method
   ```

6. **NEVER use Angle with coordinates/arrays**
   ```python
   # ❌ WRONG
   angle = Angle(LEFT, RIGHT)  # Needs Line objects
   angle = Angle([0,0,0], [1,0,0])  # Needs Line objects
   ```

---

## ✅ USE ONLY THESE SAFE OBJECTS:

### ⚠️ THESE ARE THE ONLY ALLOWED MANIM OBJECTS - USE NOTHING ELSE!

**Basic Shapes (ONLY THESE):**
```python
Circle(radius=1, color=BLUE, fill_opacity=0.5)
Square(side_length=2, color=RED, fill_opacity=0.3)
Rectangle(width=3, height=2, color=GREEN)
Polygon([0,0,0], [1,0,0], [0.5,1,0], color=ORANGE)  # For triangles, custom shapes
Line(start=[0,0,0], end=[2,1,0], color=WHITE)
Arrow(start=[0,0,0], end=[1,1,0], color=PURPLE)
Dot(point=[1,1,0], color=PINK, radius=0.1)
Arc(radius=0.5, start_angle=0, angle=PI/4)
```

**Text Objects (ONLY THESE):**
```python
Text("Hello", font_size=36, color=BLUE)
MathTex(r"a^2 + b^2 = c^2")  # Always use r"..."
Tex("Simple text", font_size=24)
```

**Grouping:**
```python
VGroup(obj1, obj2, obj3)  # Group multiple objects
```

**🚫 DO NOT USE THESE - THEY DON'T EXIST OR WILL FAIL:**
- ❌ CurvedPolyline (doesn't exist - use Arc or Line instead)
- ❌ SVGMobject (no files available)
- ❌ ImageMobject (no images available)
- ❌ NumberLine (use Line + Text instead)
- ❌ Axes (use Line objects instead)
- ❌ Graph (use Line objects instead)
- ❌ Any object not in the list above

### Colors (UPPERCASE ONLY):
```python
BLUE, RED, GREEN, YELLOW, WHITE, ORANGE, PURPLE, PINK, GRAY, BLACK
```

---

## 🎯 If You Need a Curve

**Use Arc instead of CurvedPolyline:**
```python
# ✅ CORRECT - For curves use Arc
curve = Arc(radius=2, start_angle=0, angle=PI/2, color=RED)

# ✅ OR multiple connected Lines
line1 = Line([0,0,0], [1,1,0], color=BLUE)
line2 = Line([1,1,0], [2,0,0], color=BLUE)
path = VGroup(line1, line2)

# ❌ WRONG - CurvedPolyline doesn't exist
curve = CurvedPolyline(points, color=RED)  # ERROR!
```

---

## 📐 Coordinate Rules

### ✅ SAFE Methods:

**Method 1: Use numpy for math**
```python
import numpy as np
A = np.array([1, 2, 0])
B = A + np.array([0.5, 0, 0])  # SAFE
label = Text("A").move_to(B)
```

**Method 2: Use .shift() (RECOMMENDED)**
```python
A = [1, 2, 0]
label = Text("A").move_to(A).shift(UP*0.3 + RIGHT*0.2)  # SAFE
```

**Method 3: Use .next_to()**
```python
square = Square()
label = Text("Box").next_to(square, UP, buff=0.2)  # SAFE
```

---

## 🎬 Animation Methods

```python
# Create
self.play(Create(obj))
self.play(Write(text))
self.play(FadeIn(obj))

# Transform
self.play(Transform(obj1, obj2))
self.play(obj.animate.move_to([1,0,0]))
self.play(obj.animate.shift(UP*2))
self.play(obj.animate.scale(1.5))
self.play(obj.animate.rotate(PI/4))

# Remove
self.play(FadeOut(obj))
self.play(Uncreate(obj))

# Wait
self.wait(2)  # Pause for 2 seconds
```

---

## 📋 Template - Copy This Structure

**⚠️ IMPORTANT: This template uses ONLY approved objects. Follow this pattern!**

```python
from manim import *
import numpy as np

class SlideAnimation(Scene):
    def construct(self):
        # Title - using Text (approved)
        title = Text("Your Title", font_size=48)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(0.5)
        
        # Shapes - using Circle, Square (approved)
        shape1 = Circle(radius=1, color=BLUE, fill_opacity=0.5)
        shape2 = Square(side_length=1.5, color=RED, fill_opacity=0.3)
        shape2.next_to(shape1, RIGHT, buff=0.5)
        
        self.play(Create(shape1), Create(shape2))
        self.wait(0.5)
        
        # Labels - using Text with .shift() (approved, safe)
        label1 = Text("A", font_size=24)
        label1.next_to(shape1, DOWN, buff=0.3)
        
        label2 = Text("B", font_size=24)
        label2.next_to(shape2, DOWN, buff=0.3)
        
        self.play(Write(label1), Write(label2))
        self.wait(0.5)
        
        # Arrows - using Arrow (approved)
        arrow = Arrow(start=[0,-1,0], end=[0,-2,0], color=YELLOW)
        self.play(Create(arrow))
        
        # Animation - using .animate (approved)
        self.play(shape1.animate.scale(1.5))
        self.play(shape1.animate.set_color(GREEN))
        
        # Math - using MathTex (approved)
        formula = MathTex(r"E = mc^2")
        formula.to_edge(DOWN)
        self.play(Write(formula))
        
        self.wait(2)
```

**Key Points of This Template:**
- Uses ONLY approved objects: Circle, Square, Text, Arrow, MathTex
- Uses numpy for coordinates
- Uses .shift() and .next_to() for positioning (safe)
- No CurvedPolyline, NumberLine, SVGMobject, etc.

---

## ⚡ Quick Checklist

Before generating code, verify:
- [ ] Class name is `SlideAnimation`
- [ ] All coordinates are 3D: `[x, y, 0]`
- [ ] **Using ONLY approved objects** (Circle, Square, Rectangle, Polygon, Line, Arrow, Arc, Dot, Text, MathTex, Tex, VGroup)
- [ ] **NOT using** CurvedPolyline, NumberLine, Axes, Graph, SVGMobject, ImageMobject
- [ ] No list addition for coordinates (use numpy or .shift())
- [ ] Colors are UPPERCASE (BLUE, RED, etc.)
- [ ] Using `import numpy as np` for coordinate math
- [ ] Using `.shift()` or `.next_to()` for positioning
- [ ] Duration matches request (~{duration}s)

---

## 🎯 If You Need Complex Shapes

**Instead of SVG, build with basic shapes:**
```python
# Example: Hand pushing box → Use Rectangle + Arrow
box = Square(side_length=1, color=BLUE, fill_opacity=0.7)
force_arrow = Arrow(start=[-2,0,0], end=[0,0,0], color=RED, buff=0)
force_label = Text("Force", font_size=24, color=RED)
force_label.next_to(force_arrow, UP)

# Animate
self.play(Create(box), Create(force_arrow), Write(force_label))
self.play(box.animate.shift(RIGHT*3))
```

That's it! Keep it simple, use basic shapes, no external files.

