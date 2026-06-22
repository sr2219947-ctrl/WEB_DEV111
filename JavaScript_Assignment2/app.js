//Question 1 -> check the positive , negative or zero 
let num=-5;

if(num>0){
    console.log("Positive");
}
else if(num<0){
    console.log("Negative");
}
else{
    console.log("Zero");
}

//Leap year 

let year =2024;
if((year% 400===0)|| (year %4===0 && year %100 !==0)){
    console.log("leap year");
}
else{
    console.log("Not a leap year");
}

//Largest among three numbers 
let a=12;
let b=90;
let c=78;

if(a>b && a>c){
    console.log(a);
}
else if (b>a && b>c){
    console.log(b);
}
else{
    console.log(c);
}

//Grade Calculator 

let marks=90;

if(marks>=90){
    console.log("Grade A");
}else if(marks>=75){
    console.log("Grade B")
}
else if (marks>=50){
    console.log("Grade C");
}
else{
    console.log("Better Luck try next time");
}

//Question 5  --> voting  creadability 

let age=18;

if(age>=18){
    console.log("Elegible to vote");
}else{
    console.log("Not eligible");
}


//// Loops -->

// 6.) print 1 to 100
for(let i=0;i<=100;i++){
    console.log(i);
}

//7.) even numbers from 1 to 50 

for(let i=1;i<=50;i++){
    if(i%2==0){
        console.log(i);
    }
}

//8 sum 1 to N

let N=10;
let sum=0;

for(let i=1;i<=N;i++){
    sum+=i;
}
console.log(sum);


//Multipication of tables 

let table =5;
for(let i=1;i<=10;i++){
    console.log(table*i);
}

//10 Fibonacci series

let n=10;

let x=0;
let y=1;

for(let i=1;i<=N;i++){
    console.log(x);

    let next=x+y;
    x=y;
    y=next;
}

//        functions -->


// 11 .) Square functions 

function square(num){
    return num*num;
}
comsole.log(square(5));

//Palindrome 
// logic

// take string -> Break line into characters --> reverse characters -> make string again 

function palindrome(str){
    let reverse =str.split("").reverse().join("");
    if(str===reverse){
        return "palindorme";
    }
    else{
        return "Not palindrome"
    }
}
console.log(plaindrome("madam"));

// 13 Count vowels 

function countVowels(str){
    let count =0;

    for(let char of str){
        if("aeiouAEIOU".includes(char)){
            count++;
        }
    }
    return count;
}
console.log(countVowels("JavaScript"));

//14.)  Factorial 

function factorial(num){
    let fact=1;

    for(let i=1;i<=num;i++){
        fact*=i;
    }
    return fact;
}
console.log(factorial(5));

//Largest element in an array

function largest(arr){
    let max=arr[0];

    for(let i=1;i<arr.length;i++){
        if(arr[i]>max){
            max=arr[i];
        }
    }
    return max;
}
console.log(largest([10,20,20,90,30]));

