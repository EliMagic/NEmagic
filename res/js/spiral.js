const animationContainer = document.getElementById('animationContainer');
let angle = 0;
let radius = 10;

let speedControl = 0.1;
let speed = 0.065;

let effect_x = 0.1;
let effect_y = 0.1;

let density = 2000;

function isMobileDevice() {
    
    return /Mobi|Android/i.test(navigator.userAgent);
}


function createTornadoCharacter() {
    const character = document.createElement('div');
    character.classList.add('tornado-character');
    
    // You can customize the character here
    // '\u{25BD}', '\u{25FB}', '\u{25C9}', '\u{25C7}'
    // '\u{2752}', '\u{274F}', '\u{26AB}', '\u{2B55}'
    character.textContent = '0\n\n1';
    animationContainer.appendChild(character);
}

function animateTornado() {
    const characters = document.querySelectorAll('.tornado-character');
    characters.forEach((character, index) => {
        const x = radius * Math.cos(angle + index * effect_x);
        const y = radius * Math.sin(angle + index * effect_y);
        character.style.transform = `translate(${x*100}px, ${y*20}px) rotate(${angle}deg)`;
    });
    angle += speedControl * speed; // Adjust speed based on the control input
    requestAnimationFrame(animateTornado);
}

function init() {
    for (let i = 0; i < density; i++) { // Adjust the number of characters for density
        createTornadoCharacter();
    }

    animateTornado();
}

if (isMobileDevice()) {
    angle = 0;
    radius = 10;
    
    speedControl = 0.1;
    speed = 0.065;
    
    effect_x = 0.1;
    effect_y = 0.1;

    density = 500;
    init();
} else {
    init();
}
