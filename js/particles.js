// Parçacık (Particle) Animasyonu
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '-1';
canvas.style.pointerEvents = 'none';

let particles = [];
const PARTICLE_COUNT = 80;
const CONNECTION_DISTANCE = 150;

let stars = [];
const STAR_COUNT = 250;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Star {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.1;
        this.speedX = (Math.random() - 0.5) * 0.05;
        this.speedY = (Math.random() - 0.5) * 0.05;
        this.opacity = Math.random();
        this.opacitySpeed = (Math.random() * 0.01) + 0.005;
        this.color = Math.random() > 0.9 ? '#00ffd5' : (Math.random() > 0.8 ? '#8b5cf6' : '#ffffff'); 
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        this.opacity += this.opacitySpeed;
        if (this.opacity >= 1) {
            this.opacity = 1;
            this.opacitySpeed = -this.opacitySpeed;
        } else if (this.opacity <= 0.1) {
            this.opacity = 0.1;
            this.opacitySpeed = -this.opacitySpeed;
        }

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity * 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.6 + 0.1;
        const colors = ['#00ffd5', '#8b5cf6', '#ff2d75', '#f97316'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.life = 0;
        this.maxLife = Math.random() * 200 + 100;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life++;
        if (this.life > this.maxLife || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    draw() {
        const fade = Math.sin((this.life / this.maxLife) * Math.PI);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity * fade;
        ctx.fill();
        // Glow effect
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
}

for (let i = 0; i < STAR_COUNT; i++) {
    stars.push(new Star());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars
    stars.forEach(s => {
        s.update();
        s.draw();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < CONNECTION_DISTANCE) {
                const fadeI = Math.sin((particles[i].life / particles[i].maxLife) * Math.PI);
                const fadeJ = Math.sin((particles[j].life / particles[j].maxLife) * Math.PI);
                const opacity = (1 - (distance / CONNECTION_DISTANCE)) * 0.2 * fadeI * fadeJ;
                
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = particles[i].color;
                ctx.globalAlpha = opacity;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }

    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}
animate();
