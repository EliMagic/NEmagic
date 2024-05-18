const container1 = document.getElementById('container1');

function createParticle(text) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.textContent = text;
    container.appendChild(particle);
    return particle;
}

function animateParticle(particle, angle, distance) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
}

function animate() {
    const particles = [];
    const numParticles = 26;
    const speed = 0.05;
    let angle = 10;

    for (let i = 0; i < numParticles; i++) {
        const text = String.fromCharCode(65 + i % 26); // A-Z characters
        const particle = createParticle(text);
        particles.push({ element: particle, angle });
    }

    function updateParticles() {
        particles.forEach((particle, index) => {
            const distance = index * 30;
            const oscillation = Math.sin(angle + index * 0.5) * 50;
            animateParticle(particle.element, particle.angle + speed, distance + oscillation);
        });
    }

    function animateLoop() {
        angle += speed;
        updateParticles();
        requestAnimationFrame(animateLoop);
    }

    animateLoop();
}

animate();