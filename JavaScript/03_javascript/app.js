// for(let i=1;i<=5;i++){
//     console.log(i);
// }
// for(let i=10;i>=1;i-3){
//     console.log(i);
// }
// //print odd numbers till 15
// for(let i=1;i<=15;i+2){
//     console.log(i);
// }
// console.log("backwards");

// for(let i=15;i>=1;i=i-2){
//     console.log(i);
// }

// print all even numbers fro 2 to 10 .

// for(let i=2;i<=10;i=1+2){
//     console.log(i);
// }
// console.log("backwards");

// for(let i=10;i>=2;i=i-2){
//     console.log(i);
// }
// for (let i=1;i++){
// console.log(i);
// }

// print multpication table of 5 

// 5 10 15 20 ---- 

// for(let i=5;i<=50;i=i+5){
//     console.log(i);
// }

// let n= prompt("write your number");
// n= parseInt(n);
// for(let i=n; i<=n*10; i=i+n){
//     console.log(i);
// }

// console.log("Nested loops");

// for(let i=1;i<=3;i++){
//     for(let j=1;j<=3;j++){
//         console.log(j);
//     }
// }

//While Loop 

// let i=5;

// while(i>=1){
//     console.log(i);
//     i--;
// }

// console.log("forwards");

// while(i<=5){
//     console.log(i);
//     i++;
// }

let y=1;
while(y<=5){
    if(y==3){
        break;
    }
    console.log(y);
    y++;
}

console.log("we used break at 3");


let fruits =["mango","apple","banana","Litchi","Orange"];
fruits.push("pineapple");

// for(let z=0;z<fruits.length;z++){

// for odd no of fruits 
//  for(let z=1;z<fruits.length;z=z+2){

//for even 
//   for(let z=0;z<fruits.length;z=z+2){
//     console.log(z,fruits[z]);
// }

//Backward

// for(let i=fruits.length-1;i>=0;i--){
//     console.log(i,fruits[i]);
// }


// loops with Nested arrays 

let heroes=[
    ["ironman","spiderman","thor"],
    ["superman","wonder woman", "flash"]
]

for(let i=0;i<heroes.length;i++){
    console.log(i,heroes[i],heroes[i].length);
    for(let j=0;j<heroes[i].length;j++){
        console.log(`j=${j}, ${heroes[i][j]}`);
    }
}

let student=[["sakshi",95],["sneha",89],["karan",100]];

for(let k=0;k<student.length;k++){
    console.log(`info of student #${k+1}`);
    for(let u=0;u<student[k].length;u++){
        console.log(student[k][u]);
    }
}

// for of loop 

// limitation -> does not work in internet explorer . 

let languages=["c","c++","c#","Python","Java","Javascript"];
for(lang of languages){
    // for(name of lang){
        console.log(lang);
    // }
}

for(char of "whtisdestiny"){
    console.log(char);
}

// Nested for Of loop 

