interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  opacity: number;
}

const COUNT = 30;
const MAX_DIST = 130; // 连线最大距离
const BASE_SPEED = 0.15;

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let particles: Particle[] = [];
let width = 0;
let height = 0;
let animationId = 0;

function seed(): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * BASE_SPEED * 2,
    vy: (Math.random() - 0.5) * BASE_SPEED * 2,
    r: 1 + Math.random() * 2,
    opacity: 0.1 + Math.random() * 0.18,
  };
}

function initParticles(): void {
  particles = Array.from({ length: COUNT }, () => seed());
}

function resize(): void {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

function draw(): void {
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    // 移动 + 边界反弹
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    // 微扰
    p.vx += (Math.random() - 0.5) * 0.02;
    p.vy += (Math.random() - 0.5) * 0.02;

    // 限速
    const spd = Math.sqrt(p.vx ** 2 + p.vy ** 2);
    if (spd > BASE_SPEED * 2.5) {
      p.vx = (p.vx / spd) * BASE_SPEED * 2.5;
      p.vy = (p.vy / spd) * BASE_SPEED * 2.5;
    }

    // 连线
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MAX_DIST) {
        const alpha = (1 - dist / MAX_DIST) * 0.16;
        ctx.strokeStyle = `rgba(91,158,207,${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }

    // 画点
    ctx.fillStyle = `rgba(91,158,207,${p.opacity})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  animationId = requestAnimationFrame(draw);
}

export function initBackground(): void {
  canvas = document.getElementById("bgCanvas") as HTMLCanvasElement;
  if (!canvas) return;

  ctx = canvas.getContext("2d")!;
  resize();
  initParticles();
  draw();

  window.addEventListener("resize", () => {
    resize();
    initParticles();
  });
}

export function destroyBackground(): void {
  cancelAnimationFrame(animationId);
}
