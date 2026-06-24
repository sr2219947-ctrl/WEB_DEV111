// in js array can be colllections of various data types 
let info=["Sakshi",22, 87.7];
console.log(info);

let empArr=[];
empArr.length; // 0 

info.length; //3

[].length ; // 0

[1,2,3].length; // 3

info[0]; //Sakshi 

info[0][0]; // S zero'th index of oth element in an array . 

info[0][1]; // a

info[0].length ; //6

// string are immutable but arrays are mutable . 

let fruits=["mango","apple","litchi"];

fruits[0]="banana";
fruits[6]="Slice";
//now the spaces in between are empty and goes and stored on 6th index. 
// 'banana'

console.log(fruits);

// ['banana', 'apple', 'litchi']

// but in string 

let name="shaksham";
name[0]='a';
console.log(name); // shaksham hi ayega '.

//Array Methods 
//push : add to end 
//pop : delete from end and returns it .
// shift: delete from start and returns it .
//Unshif : add to start . 

let cars=["audi","bmw","xuv","maruti"]
cars.push("toyota");
console.log(cars);
cars.push("ferrari");
console.log(cars);

cars.pop();
cars.shift("audi");
cars.unshift("bike");
cars.unshift("ferrari");

// real world app example .. 
let followers=["a","b","c"];
let blocked=followers.shift();
console.log(followers);// b,c
console.log(blocked); //a 


// Practice Questions

let start=['january','july','march','august']

start.shift('january');

console.log(start);


start.unshift('june');
start.unshift('sep');

start.indexOf('january');


let marks=['99','100','78','89']
marks.indexOf(100);

marks.indexOf(37); // which is -1 shows the absence of that specific number 

start.includes("89");
start.includes("100");


//Concatenation of strings now we will do the concatenation of arrays 

let primary=["red","yellow","blue"];

let secondary=["red","green","orange"];

let allarray=primary.concat(secondary); // primary elements appear first then elements of secondary ok 

let array1=secondary.concat(primary); 

console.log(primary);
console.log(secondary);

console.log(allarray);//  concat does not change the orginal array btw

// reverse method 

let colors=['pinkish','blueish','hotPink'];
colors.reverse();

console.log(colors); // it change the original array also yeh 




