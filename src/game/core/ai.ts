import { Track, wrap01 } from "./world";

export type Racer = {
  u: number; // progress 0..1
  lane: number; // lateral -1..1
  speed: number; // progress units per second (fraction of lap per sec)
  targetLane: number;
  boostTimer: number;
  boostCooldown: number;
};

export function createAIRacers(count: number): Racer[] {
  const arr: Racer[] = [];
  for (let i = 0; i < count; i++) {
    arr.push({ u: 0.25 + i * 0.15, lane: i === 0 ? -0.3 : 0.3, targetLane: 0, speed: 0.16, boostTimer: 0, boostCooldown: 2 + i * 0.8 });
  }
  return arr;
}

export function updateAI(dt: number, ai: Racer[], playerU: number, playerSpeed: number) {
  for (const a of ai) {
    // Rubber banding: if far behind, speed up; if ahead, slow slightly
    let diff = playerU - a.u;
    // wrap into -0.5..0.5
    if (diff > 0.5) diff -= 1; if (diff < -0.5) diff += 1;
    const base = 0.16;
    const bonus = Math.max(-0.05, Math.min(0.10, -diff * 0.25));
    let maxSpeed = base + bonus;

    // Occasional boost when just behind player
    a.boostCooldown -= dt;
    if (diff > -0.12 && diff < 0.0 && a.boostCooldown <= 0) {
      a.boostTimer = 1.2;
      a.boostCooldown = 3.5 + Math.random() * 2;
    }
    if (a.boostTimer > 0) {
      maxSpeed += 0.12;
      a.boostTimer -= dt;
    }

    // lane sway
    if (Math.abs(a.lane - a.targetLane) < 0.05) {
      a.targetLane = Math.sin((a.u * Math.PI * 2) * 0.5 + (a === ai[0] ? 0 : 1)) * 0.5;
    }
    a.lane += (a.targetLane - a.lane) * Math.min(1, dt * 2);

    // advance
    a.speed = maxSpeed;
    a.u = wrap01(a.u + a.speed * dt);
  }
}
