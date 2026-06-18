let studentId=101;
let studentName="Sakshi";
let studentAge=22;

let studentEmail="Sakshi@gmail.com";
let studentCourse="Mca";

let enrollmentStatus=true;

//Selecting HTML Elements
document.getElementById("studentId").textContent= studentId;
document.getElementById("studentName").textContent=studentName;
document.getElementById("studentAge").textContent=studentAge;
document.getElementById("studentEmail").textContent = studentEmail;
document.getElementById("studentCourse").textContent=studentCourse;

//studentStatus

let statusElement =document.getElementById("studentStatus");
if(enrollmentStatus){
    statusElement.textContent="Enrolled";
}
else{
    statusElement.textContent="Not Enrolled";
    statusElement.style.background="#dc3545";
}

//shorter version -> statusElement.textContent=enrollmentStatus ? "Enrolled" : "Not Enrolled";
//statusElement.textContent =
//     enrollmentStatus ? "Enrolled" : "Not Enrolled";

// statusElement.style.background =
    // enrollmentStatus ? "#28a745" : "#dc3545";


console.log("========== STUDENT REGISTRATION ==========");
console.log("Student ID :", studentId);
console.log("Name :", studentName);
console.log("Age :", studentAge);
console.log("Email :", studentEmail);
console.log("Course :", studentCourse);
console.log("Status :", enrollmentStatus);
console.log("==========================================");