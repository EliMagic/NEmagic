//https://www.w3schools.com/jsref/dom_obj_header.asp
const create_header = document.createElement("header");
// https://www.w3schools.com/jsref/met_document_createelement.asp
const create_h1 = document.createElement("h1");
let h1_text = document.createTextNode("Hello Rasmussen Students!");
create_h1.appendChild(h1_text);
create_header.appendChild(create_h1);
document.body.appendChild(create_header);

alert("Welcome, Rasmussen Students!")

