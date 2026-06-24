// Slice functions 
let cars=['audi','bmw','xuv','maruti']
cars.slice(1);// bmw, xuv, maruti

cars.slice(); // whole array ayega 

cars.slice(1,3); // bmw, xuv

cars.slice(3); // maruti 

cars.slice(cars.length-1); // maruti 

cars.slice(5); // there is no 5th index so [] empty output will be shown 

cars.slice(cars.length); // []

cars.slice(-2); //xuv, maruti 

cars.slice(-3); // bmw, xuv, maruti 

cars.slice(-5); 


//Splice method in an array 

// it  is used to add/ replaces / add elements in place 

// splice(start, deleteCount, item0 ....itemN) menas the elements from where we have to start and the element we have  to delete and then number of elements have to add at last okay .

// so there can be multiple permutations and combination to use the splice method okkk
colors=['pink','navy blue','susy pink', ' royal blue']
colors.splice(4); // ' royal blue ' will be splice from it 
colors.slice(4); // [] becuase it has been removed by splice method . 
colors.slice(3); // ['susy pink']


colors.splice('1',2,'orange','green','white');
// so 2 elements that will deleted --> ['navy blue', ' susy pink']
console.log(colors); //['pink','orange','green' , 'white', 'royal blue']


cars.splice(1,0,"skyBlue");
// pink , skyBlue, navyblue, susypink , royalblue

cars.splice(1,1,"gwagon");
console.log(cars);


// // sort
// let chars=['b','d','a','e']
// chars.sort(); // albhabetically from a to z so it works well for string to sort the elements yehh 
// console.log(sort);


// let numbers=[99,88,77,44,55,100,45,55,56];
// numbers.sort();
// console.log(numbers); // firstly it will sort numbers into string and thewn in utf-8 wht will be their value they will sort according to them only. 

// cars.sort();

//practice Questions 




let months=['jan','july', 'march', 'august'];

months.splice(0, 2, 'july','june');

console.log(months); // july , june , march, august

let lang=['c',"c++","c#","html","js","Python","Java"]

lang.push('sql');

lang.reverse().indexOf('js'); // it also called as method chaining know 

console.log(lang);

// 4 'll be the index of js yess

// arrary refernce 

"name"=="name" // true 

"name" ==="name"// true 

[1]==[1] // false 

[1]===[1] // flase

// so why they are false becuase they are arrays and store at different address maine to location okay so they are not equal in any aspect they are different hmshakals reside at distinct location you know 

// let arr=['a', 'b']
// let arrCopy=arr;
// so now arr===arrCopy becuase if we do change in the arrCopy they will reflect in arr becuase they point to same location ..
let arr=['a','b'];

let arrCopy=arr;
console.log(arrCopy); // a,b
arrCopy.push('c');
//3
console.log(arr); // a,b,c

arr==arrCopy // true 
// and if don't want to see them equal then we can assign an new array to arryCopy 
let arr=['a','b','c'];

let arrCopy=['a','b','c'];
arr.push(d);
//4 

console.log(arr); // a,b,c,d 
console.log(arrCopy); // a, b,c 

// at last same changes will reflect when address is same like as is the accompaniment so as the color 

