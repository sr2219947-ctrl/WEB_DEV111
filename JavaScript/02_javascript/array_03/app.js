// like
const u=9;
// u=8; // reassignment cannot possible 
// let's understand array 

const arr=[1,2,3];
console.log(arr);
arr.push(4); // 1,2,3,4 
arr.pop(); // 1,2, 3 

// so we can add / remove change the elements becuase address is same we are chnaging the elements on that addresss so that can happen . 

// we cannot chnage the array completely 
// arr=[3,4,5];
// reference variable means it store the address not the value so you cannot change the address know 

// Nested arrays --> multidimensional array 

let nums=[[1,2],[3,4],[4,5]];
nums.length
nums[0]; // 1,2 
nums[0].length; // 2
nums[0][0]; // 1

// [ [0],[1], [2]]


//individuals array and numbers can access 

// tictactoe nested array repersentation 

let game=[['x',null,'0'],[null,'x','0'],[null,'x',null],['0',null,'x']];
console.log(game);
game[0][1]='0';



