
// https://www.w3schools.com/js/js_switch.asp
let theDay;
switch (new Date().getDay()) {
    case 0:
        theDay = "Sunday";
        break;
    case 1:
        theDay = "Monday";
        break;
    case 2:
        theDay = "Tuesday";
        break;
    case 3:
        theDay = "Wednesday";
        break;
    case 4:
        theDay = "Thursday";
        break;
    case 5:
        theDay = "Friday";
        break;
    case 6:
        theDay = "Saturday";
        break;
    default:
        theDay = "Unknown";
        break;
}

if (theDay == "Sunday" || theDay == "Saturday")
{
    // https://www.w3schools.com/jsref/met_document_createelement.asp
    const theMessage = document.createElement("h1");
    theMessage.innerText = "It's the weekend!";
    document.body.appendChild(theMessage);
}
else
{
    // https://www.w3schools.com/jsref/met_document_createelement.asp
    const theMessage = document.createElement("h1");
    theMessage.innerText = "It's the weekday!";
    document.body.appendChild(theMessage);
}

const theGreeting = document.createElement("p");
theGreeting.innerText = "Welcome, Rasmussen Students! It's " + theDay + "!";
document.body.appendChild(theGreeting);

const hour_now = new Date().getHours();
let time_of_day = "";

if (hour_now >= 5 && hour_now <= 11)
{
    time_of_day = "Good morning";
}
else if (hour_now >= 12 && hour_now <= 17)
{
    time_of_day = "Good afternoon";
}
else if (hour_now >= 18 && hour_now <= 21)
{
    time_of_day = "Good evening";
}
else
{
    time_of_day = "Good night";
}

//https://learning.rasmussen.edu/ultra/courses/_139684_1/outline/edit/document/_14472251_1?courseId=_139684_1&view=content
const rNum = Math.random();
let somebody = "";

if (rNum >= 0.333 && rNum <= 0.666)
{
    somebody = "John";
}
else if (rNum >= 0.667 && rNum <= 1)
{
    somebody = "Mary";
}
else
{
    somebody = "Bobby";
}

const theRandomGreeting = document.createElement("p");
theRandomGreeting.innerText = somebody + ' said, "' + time_of_day + '!"';
document.body.appendChild(theRandomGreeting);

// https://www.w3schools.com/jsref/met_document_getelementsbytagname.asp
const heading_1 = document.getElementsByTagName("h1");
heading_1[0].style.textAlign = "center";

const paragraph = document.getElementsByTagName("p");
for (let i = 0; i < paragraph.length; i++) {
  paragraph[i].style.textAlign = "center";
}