//Methods --> actions that can performed on objects.

//format -> stringName.method()

//trim str.trim() trim the whitespaces from both the end of the string and returns a new one .

// let msg ="    hello    ";
let password =prompt("set your password");
let newPass= password.trim();
console.log(password);

//and it does not change the orginal value rather it create the new copy and for that tirm method is used Okay .

let msg="hello!";
console.log(msg.trim().toUpperCase());


let name="lifechallannges"
name.slice(4,9);
// 4 is included and 9 is excluded 

name.slice(5)// hallennges 

name.slice(-1); //s  name.slice(length-num)

console.log(name.slice(4,name.length)); // same as name.slice(5)

name.indexOf("fe");

name.replace("challange","yes");

let newstr=name.slice(4).replace("l","t");

newstr.replace("l","t");

// repeat
let str="mango";
str.repeat(3);

// practice questions 


// sepearate the  javascript from the tryjavascript  and then replace p to t 
let u="tryjavascript";

u.slice(3);
// u.slice(3).replace('p','t');
let newu =u.slice(3).replaceAll('a','t');
let she =u.replace("try","our");

console.log(newu);
console.log(she);

//old cannot be changes completely you can always make a copy and then chnage but cannot change completely the original one 








