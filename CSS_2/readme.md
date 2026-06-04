1.) Universal Selector 
to select everything .
2.) Id selecetor #myid{
    property:value;
}
there shoul be unique id for element 
<h1 id="myid">

3.) class selector 
<h1 class="a">
<button class="a">
<p class="a">
the elements who are group there style change be chnaged '
.a{
    color:red;
}

descendant Selector 
eg - select all the paragaphs inside div
div p{
    property :value;
}
Selects all the paragraphs inside the div .


4.) Adjacent Sibling Combinator 
eg - Heading3 that comes immidiately after any paragraph 

when the  <p></p>
          <h3></h3>
          <h3></h3>
          <div> <h3></h3></div>
           in this p and first two h3 are at same level and called sibling so we can use + to connect them .
           But the div contain  is inside div so div is parent and contain h3 . 

           p+h3{
            property:value;
           }

           el1+el2 relation means there are siblings and equality among them .

5.) Child combinator 
Selects all buttons which are direct children of spans
span>button{
    property:value;
}
6.)Attribute Selector 
input[type="text"]{
    color:"red"
}
input[type="password"]{
    color:blue;
}
input[type]{
    background-color:white;
}

7.) Pseudo Class
A keyword added to a selector that specifies state of the selected elements. 

:hover
:active
:checked
:nth of type 

element:pseudo class

active when button is clicked then it is refer as active .


checked  state --> radio and checkbox color changes 

* nth-of-type() = when we want to chnage the specific property of elements n elements specifically then we use nth 

we can gave value of that like in index.html we watn to change 2 post then 
nth-of-type(2)  it chnage the color of  boob para 2nd post 

## and if we want to change the color of all post it contianes then we can assign the div to psot and it change the property we want to change of that specfifc div ..

* Pseudo elements 
A keyword added to a selector that lets you style a specific part of the selected elements(s)

:: first-letter
:: first-line
:: selection 

6.)) Cascadong Stylesheets
the css cascade algorithm's job is to select css declaration in order to determine correct values for css properties.
h2{
    background-color:yellow;
}
h2{
    background-color:blue;
}
so prefernce given to second h2 for specfifc property given ..


## Selector Specficity
it is algorithm that calculates the weight that is applied to given css declaration 
id    class          element&pseudo-ele
      attribute & 
      pseudo-class


[id has more importance]


h2{
    background-color:yellow;
}

id=0 becuase not any id 
class attribute and pseudo-class =0 not sssigned ] 1= element and pseudo-element 
so 001


.myClass:hover{
    color:blue
}
id=0
class attribute and pseudo class=2
elementand pseudo-elemet=0

# id>class>element
# more selector>less selector 
means in login and signup button bg color not changes due to css specificity but color chnages beaucse it is not assigned in .. 
so id selector has highest preference..

# if specificity same> the cascading change 

## and inline style are more specific than id means Inline Specificity 
but we cannot use inline  style why becuase further it cannot chnage and it is meesy to chnage so complex .. 


!important if written  after any property it cannot change 
h3{
    background-color: blue !important ;
}

then it cannot change .

## Inheritence 

if parents have any property that  will be inherited to child and grandchild . 