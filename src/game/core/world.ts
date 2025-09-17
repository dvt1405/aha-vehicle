export type Vector = { x: number; y: number };

export type Coin = { u: number; lane: number; taken?: boolean };
export type Obstacle = { u: number; lane: number; radius: number };

export type Track = {
  // Parametric oval track; u in [0,1)
  radiusX: number;
  radiusY: number;
  center: Vector;
  length: number; // approximate perimeter
  roadHalfWidth: number;
  coins: Coin[];
  obstacles: Obstacle[];
};

export function createOvalTrack(center: Vector, radiusX: number, radiusY: number, roadHalfWidth: number): Track {
  // Ramanujan approximation for ellipse perimeter
  const h = Math.pow(radiusX - radiusY, 2) / Math.pow(radiusX + radiusY, 2);
  const length = Math.PI * (radiusX + radiusY) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));

  // scatter coins and a few obstacles along the loop on lanes -1,0,1
  const coins: Coin[] = [];
  const obstacles: Obstacle[] = [];
  for (let i = 0; i < 45; i++) {
    coins.push({ u: (i / 45 + Math.random() * 0.01) % 1, lane: [-0.6, 0, 0.6][i % 3] });
  }
  for (let i = 0; i < 6; i++) {
    obstacles.push({ u: (i / 6 + 0.08) % 1, lane: i % 2 === 0 ? -0.4 : 0.4, radius: 10 });
  }

  return { radiusX, radiusY, center, length, roadHalfWidth, coins, obstacles };
}

export function uToTheta(u: number) {
  return u * Math.PI * 2;
}

export function sampleTrack(track: Track, u: number, lateral: number): Vector {
  // lateral in [-1,1] scaled by roadHalfWidth
  const th = uToTheta(u);
  const nx = Math.cos(th);
  const ny = Math.sin(th);
  const px = track.center.x + track.radiusX * nx;
  const py = track.center.y + track.radiusY * ny;
  // outward normal for ellipse is not unit circle's normal; approximate using angle normal
  const tx = -ny;
  const ty = nx;
  return { x: px + tx * lateral * track.roadHalfWidth, y: py + ty * lateral * track.roadHalfWidth };
}

export function wrap01(u: number) {
  u = u % 1;
  return u < 0 ? u + 1 : u;
}

export function progressDelta(a: number, b: number) {
  // signed shortest difference b-a on circle [0,1)
  let d = wrap01(b) - wrap01(a);
  if (d > 0.5) d -= 1;
  if (d < -0.5) d += 1;
  return d;
}
