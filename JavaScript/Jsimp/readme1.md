## Hoisting in JS 

getName();
console.log(x);
console.log(getName)

var x=7;

function getName(){
    console.log("Namaste Javascript");
}

Output : 
Namaste JavaScript 
undefined 


Hoisting --> you access the variables and funtions before even initializing them .

console.log(getName) --> it will not gave you the error . it will give the function 

and in case of case it gives undefined .


getName();
console.log(x);
console.log(getName);

var x=7;

function getName(){
    console.log("Namaste Javascript");
}

even now it prints Namaste Javascript 
                    undefined 
                    function

                    why becuase memeroy creates in the gloabl scope and if 

                    we print the same or call at last they will print the same 


                    and when we remove the var x=7 from whole program then it shows the not defined . becuase now x is not present here .
