// let color="green";

// //traffic light system
// if(color==="red"){
//     console.log("Hey ,you have to stop!");
// }
// else if(color==="Yellow"){
//     console.log("Slow down. Light color is yellow");
// }
//  else if(color==="Green"){
//     console.log("Go. Light color is now green");
// }

//use of else 
let age=17
if(age>=18){
    console.log("you can vote");
}
else{
    console.log("you cannot vote");
}


// // let marks=90;

// // if(marks>=80){
// //     console.log("A+");
// // }
// // else if(marks>=60){
// //     console.log("B");
// // }
// // else if(marks>=33){
// //     console.log("B");
// // }
// // else if(marks<33){
// //     console.log("F");
// // }

// // let month="January";
// // if(month==="January"){
// //     console.log("winter is here");
// // }
// // else if(month==="april"){
// //     console.log("summer is here");
// // }

// let str="apple";

// if(str[0]==="a"&& str.length>3){
//     console.log("good string");
// }
// else{
//     console.log("not a good string");
// }

// let string=" ";

// if(string){
//     console.log("string is not empty");
// }
// else{
//     console.log("string is empty");

// }

// let num=-10;

// if(num){
//     console.log("num is not equal to 0");
// }
// else{
//     console.log("num is equal to 0 ");
// }


// let color="red";

// switch(color){
//     case "red":
//         console.log("stop");
//         break;
//      case"yellow":
//          console.log("slow down");
//          break;
//     case "green":
//         console.log("go");
//         break;
//     default:
//         console.log("light is broken");         
// }
// console.log("aftrer switch statement");

let day= 5;

// switch(day){
//     case 1:
//         console.log("Monday");
//         break;
//     case 2:
//         console.log("Tuesday");
//         break;
//     case 3:
//         console.log("Wednesday");
//         break;
//     case 4:
//         console.log("Thursday");
//         break;
//     case 5:
//         console.log("Friday");
//         break;
//     case 6:
//         console.log("Saturday");
//         break;
//     case 7:
//         console.log("Sunday, fun day");
//         break;
//     default:
//         console.log("anyday");                        
// }

let firstName=prompt("enter first name");
let lastName=prompt("enter last name");
// console.log("Welcome", firstName,lastName, "!");
let msg="Welcome " + firstName +" " +lastName +"!";
alert(msg);