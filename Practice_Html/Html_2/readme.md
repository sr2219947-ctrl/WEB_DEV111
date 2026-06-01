# HTML Basics Revision Notes

## 1. Block Elements

Block elements take up the full available width of the webpage.

### Features

* Start from a new line
* Occupy full width available
* Create separate blocks

### Examples

```html id="x7u2pd"
<div></div>
<p></p>
<h1></h1>
<section></section>
<footer></footer>
```

---

# 2. Inline Elements

Inline elements only take the width necessary for their content.

### Features

* Do not start from a new line
* Occupy only required width
* Stay in the same line

### Examples

```html id="k0d9mq"
<span></span>
<a></a>
<strong></strong>
<img>
```

---

# 3. Semantic HTML Tags

Semantic tags clearly describe the meaning of the content.

---

## Header Tag `<header>`

The `<header>` tag is used for the top section of a webpage.

### Uses

* Website title
* Logo
* Navigation links

### Example

```html id="g6wqja"
<header>
    <h1>Library Website</h1>
</header>
```

---

## Navigation Tag `<nav>`

The `<nav>` tag is used to create navigation menus.

### Example

```html id="ib4r2n"
<nav>
    <a href="home.html">Home</a>
    <a href="about.html">About</a>
</nav>
```

---

## Main Tag `<main>`

The `<main>` tag contains the primary content of the webpage.

### Features

* Appears only once
* Contains important content

### Example

```html id="8sz0ce"
<main>
    <h2>Welcome to Our Website</h2>
</main>
```

---

## Section Tag `<section>`

The `<section>` tag groups related content together.

### Example

```html id="p5n0wr"
<section>
    <h2>Features</h2>
    <p>This is a section.</p>
</section>
```

---

## Article Tag `<article>`

The `<article>` tag represents independent content.

### Example

```html id="sy8f1q"
<article>
    <h2>Blog Title</h2>
    <p>Blog content here...</p>
</article>
```

---

## Aside Tag `<aside>`

The `<aside>` tag contains extra or side information.

### Example

```html id="q1m4vk"
<aside>
    <p>Quick Tips</p>
</aside>
```

---

## Footer Tag `<footer>`

The `<footer>` tag is used for the bottom section of a webpage.

### Uses

* Copyright
* Contact information
* Social links

### Example

```html id="t7z2oh"
<footer>
    <p>Made with ❤️</p>
</footer>
```

---

# 4. HTML Entities

HTML entities are special codes used to display reserved characters or symbols.

### Common HTML Entities

| Symbol | Entity Name |
| ------ | ----------- |
| <      | `&lt;`      |
| >      | `&gt;`      |
| &      | `&amp;`     |
| ©      | `&copy;`    |
| ❤️     | `&hearts;`  |
| ₹      | `&#8377;`   |

### Example

```html id="m2x5le"
<p>Made with &hearts;</p>
<p>Copyright &copy; 2026</p>
```

---

# 5. Difference Between Inline and Block Elements

| Block Elements      | Inline Elements        |
| ------------------- | ---------------------- |
| Start from new line | Stay in same line      |
| Take full width     | Take necessary width   |
| Used for structure  | Used for small content |

---

# Conclusion

Semantic tags improve webpage structure and readability.
Block and inline elements help organize webpage layouts properly.
HTML entities are useful for displaying special symbols and reserved characters.
