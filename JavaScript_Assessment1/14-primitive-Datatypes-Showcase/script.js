// String stores text
let studentName = "Sakshi";

// Number stores numeric values
let age = 20;

// Boolean stores true or false
let isStudent = true;

// Undefined means value not assigned
let address;

// Null means intentionally empty
let phoneNumber = null;

// BigInt stores very large integers
let largeNumber = 123456789012345678901234567890n;

// Symbol creates a unique identifier
let uniqueId = Symbol("id");

document.getElementById("string").textContent = studentName;
document.getElementById("number").textContent = age;
document.getElementById("boolean").textContent = isStudent;
document.getElementById("undefined").textContent = address;
document.getElementById("null").textContent = phoneNumber;
document.getElementById("bigint").textContent = largeNumber;
document.getElementById("symbol").textContent = uniqueId.toString();

console.log("String:", studentName);
console.log("Number:", age);
console.log("Boolean:", isStudent);
console.log("Undefined:", address);
console.log("Null:", phoneNumber);
console.log("BigInt:", largeNumber);
console.log("Symbol:", uniqueId);