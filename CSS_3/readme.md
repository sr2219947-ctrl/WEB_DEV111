# CSS Box Model, Margin & Display Properties Notes

## CSS Box Model

Every HTML element is treated as a box.

The box model consists of:

1. Content
2. Padding
3. Border
4. Margin

```
+-----------------------+
|       Margin          |
|  +-----------------+  |
|  |     Border      |  |
|  | +-------------+ |  |
|  | |   Padding   | |  |
|  | | +---------+ | |  |
|  | | | Content | | |  |
|  | | +---------+ | |  |
|  | +-------------+ |  |
|  +-----------------+  |
+-----------------------+
```

### Content
The actual content of the element.

Properties:
- `width`
- `height`

Example:

```css
div{
    width: 300px;
    height: 150px;
}
```

---

## Border

A border surrounds the padding and content.

### Border Properties

```css
border-width: 2px;
border-style: solid;
border-color: black;
```

### Shorthand Property

```css
border: 2px solid black;
```

---

## Border Sides

Control individual sides of the border.

```css
border-left
border-right
border-top
border-bottom
```

Example:

```css
border-left-color: green;
border-left-style: dashed;
```

### Rounded Corners

```css
border-radius: 15px;
```

---

## Padding

Padding is the space between content and border.

### Individual Sides

```css
padding-left: 50px;
padding-right: 50px;
padding-top: 20px;
padding-bottom: 20px;
```

Example:

```css
div{
    padding-left: 50px;
}
```

### Shorthand Forms

#### All Sides

```css
padding: 50px;
```

#### Top-Bottom | Left-Right

```css
padding: 10px 20px;
```

#### Top | Left-Right | Bottom

```css
padding: 10px 20px 30px;
```

#### Top | Right | Bottom | Left

```css
padding: 10px 20px 30px 40px;
```

---

## Margin

Margin is the space outside the border.

It creates distance between elements (boxes).

### Individual Sides

```css
margin-left: 20px;
margin-right: 20px;
margin-top: 10px;
margin-bottom: 10px;
```

### Shorthand Forms

#### All Sides

```css
margin: 20px;
```

#### Top-Bottom | Left-Right

```css
margin: 10px 20px;
```

#### Top | Left-Right | Bottom

```css
margin: 10px 20px 30px;
```

#### Top | Right | Bottom | Left

```css
margin: 10px 20px 30px 40px;
```

### Centering an Element

```css
div{
    width: 300px;
    margin: auto;
}
```

---

# Display Properties

The `display` property controls how an element appears on the page.

## 1. Block Elements

Take the full width available.

Examples:
- `<div>`
- `<p>`
- `<h1>` to `<h6>`

```css
display: block;
```

Characteristics:
- Starts on a new line.
- Takes full width.

---

## 2. Inline Elements

Take only the width needed by their content.

Examples:
- `<span>`
- `<a>`
- `<strong>`

```css
display: inline;
```

Characteristics:
- Does not start on a new line.
- Width and height cannot be set.

---

## 3. Inline-Block

Behaves like inline but allows width and height.

```css
display: inline-block;
```

Example:

```css
span{
    display: inline-block;
    width: 100px;
    height: 50px;
}
```

---

## 4. None

Hides the element completely.

```css
display: none;
```

Example:

```css
div{
    display: none;
}
```

The element is removed from the page layout.

---

# Quick Revision

## Box Model Order

```
Content → Padding → Border → Margin
```

## Border Shorthand

```css
border: 2px solid black;
```

## Padding Shorthand

```css
padding: top right bottom left;
```

## Margin Shorthand

```css
margin: top right bottom left;
```

## Display Types

| Display | New Line | Width/Height Allowed |
|----------|-----------|---------------------|
| block | Yes | Yes |
| inline | No | No |
| inline-block | No | Yes |
| none | Hidden | No |
