// https://www.w3schools.com/jsref/met_document_createelement.asp
const activityMessage = document.createElement("p");
activityMessage.innerText = "This is my first external JavaScript test!";
document.body.appendChild(activityMessage);

const paragraph = document.getElementsByTagName("p");
paragraph[0].style.textAlign = "center";

