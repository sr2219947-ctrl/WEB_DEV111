# JavaScript Execution Context

Everything in JavaScript happens inside an **Execution Context**.

An Execution Context consists of two main components:

## 1. Memory Component (Variable Environment)

This is where JavaScript stores:

- Variables
- Functions

in **key : value** pairs.

Example:

```javascript
var n = 2;

function square(num) {
    var ans = num * num;
    return ans;
}
```

Memory Component:

```text
n       : undefined
square  : { function code }
square2 : undefined
square4 : undefined
```

---

## 2. Code Component (Thread of Execution)

This is where JavaScript executes code **line by line**.

JavaScript executes only one statement at a time.

```text
Line 1 → Execute
Line 2 → Execute
Line 3 → Execute
...
```

This is called the **Thread of Execution**.

---

# JavaScript is Synchronous and Single-Threaded

## Synchronous

JavaScript executes code in a specific order.

Example:

```javascript
console.log("A");
console.log("B");
console.log("C");
```

Output:

```text
A
B
C
```

The next line waits until the current line finishes.

---

## Single-Threaded

JavaScript has only **one call stack**.

It can execute only one task at a time.

```text
Task 1
Task 2
Task 3
```

Execution:

```text
Task 1 → Complete
Task 2 → Complete
Task 3 → Complete
```

---

# Question

## What is AJAX?

AJAX stands for:

```text
Asynchronous JavaScript And XML
```

AJAX allows a web page to communicate with a server without reloading the entire page.

Examples:

- Live search suggestions
- Chat applications
- Notifications
- Loading comments dynamically

---

# Example: Execution Context

```javascript
var n = 2;

function square(num) {
    var ans = num * num;
    return ans;
}

var square2 = square(n);
var square4 = square(4);
```

---

# Phase 1: Memory Creation Phase

Before executing any code, JavaScript allocates memory.

Memory:

```text
n       : undefined
square  : { function code }
square2 : undefined
square4 : undefined
```

---

# Phase 2: Code Execution Phase

## Line 1

```javascript
var n = 2;
```

Memory becomes:

```text
n : 2
```

---

## Function Declaration

```javascript
function square(num) {
    var ans = num * num;
    return ans;
}
```

Function is already stored in memory.

No execution happens yet.

---

## Function Invocation

```javascript
var square2 = square(n);
```

Equivalent to:

```javascript
square(2);
```

A new Execution Context is created.

### Memory

```text
num : undefined
ans : undefined
```

### Code Execution

```javascript
num = 2
```

Memory:

```text
num : 2
ans : undefined
```

---

```javascript
ans = num * num;
```

```javascript
ans = 2 * 2;
```

Memory:

```text
num : 2
ans : 4
```

---

```javascript
return ans;
```

Returns:

```text
4
```

Back to Global Execution Context:

```javascript
var square2 = 4;
```

Memory:

```text
square2 : 4
```

---

## Second Function Call

```javascript
var square4 = square(4);
```

New Execution Context:

### Memory

```text
num : undefined
ans : undefined
```

### Execution

```javascript
num = 4
ans = 16
return 16
```

Back to Global Execution Context:

```text
square4 : 16
```

---

# Final Memory State

```text
n       : 2
square  : { function code }
square2 : 4
square4 : 16
```

---

# Execution Context Flow

```text
Global Execution Context
        |
        |
        v
    square(2)
        |
        v
    Returns 4
        |
        v
Global Execution Context
        |
        v
    square(4)
        |
        v
    Returns 16
        |
        v
Global Execution Context
```

---

# Summary

- JavaScript creates an Execution Context before running code.
- Every Execution Context has:
  - Memory Component
  - Code Component
- Memory stores variables and functions.
- Code executes line by line.
- JavaScript is synchronous.
- JavaScript is single-threaded.
- Each function invocation creates a new Execution Context.
- After function execution completes, its Execution Context is removed from the Call Stack.