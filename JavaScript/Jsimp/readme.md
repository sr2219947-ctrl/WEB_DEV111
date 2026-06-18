1.) Everything in javascript happens inside an execution context . 

execution context has two contexts in it 

1.) Memory --> key : value --> variable environment where  all the variables and functions store in key:value pair ..

2.) Components : where code is executed one at a time .. thread of execution . 

### java script is synchronous single threaded language . in the specific order . 

Question 1.) wht is AJax --> ahead 


example --> var n=2;
            function square(num){
                var ans =num*num;
                return ans;
            }
            var square2=square(n);
            var square4=square(4);

            let's understand this 
                #
                ## Memory                          Code 

## in phase i.) n is undefined                |   1.)memory|       |    code
                square:{ ....}                |      num:2             num* num  --->
                                                     ans:undefined  <---- stores in ans and it becomes 4
                                                     ans: 4 
                                               
                square2: undefined            |

                square4: undefined            | 

## in phase ii.)  n is 2 when function invoked|
                 and call.                    |


