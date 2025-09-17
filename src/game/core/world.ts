export type Vector = { x: number; y: number };

export type Coin = { u: number; lane: number; taken?: boolean };
export type Obstacle = { u: number; lane: number; radius: number };

export type Track = {
  // Straight track; u in [0,1) represents progress along straight road
  trackLength: number; // length of straight track
  roadHalfWidth: number;
  startPoint: Vector;
  endPoint: Vector;
  coins: Coin[];
  obstacles: Obstacle[];
};

export function createStraightTrack(startPoint: Vector, endPoint: Vector, roadHalfWidth: number): Track {
  const trackLength = Math.sqrt(
    Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2)
  );

  // scatter coins and a few obstacles along the straight track on lanes -1,0,1
  const coins: Coin[] = [];
  const obstacles: Obstacle[] = [];
  for (let i = 0; i < 30; i++) {
    coins.push({ u: (i / 30 + Math.random() * 0.02), lane: [-0.6, 0, 0.6][i % 3] });
  }
  for (let i = 0; i < 4; i++) {
    obstacles.push({ u: (i / 4 + 0.1), lane: i % 2 === 0 ? -0.4 : 0.4, radius: 10 });
  }

  return { trackLength, roadHalfWidth, startPoint, endPoint, coins, obstacles };
}

export function sampleTrack(track: Track, u: number, lateral: number): Vector {
  // u in [0,1] represents progress along straight track
  // lateral in [-1,1] scaled by roadHalfWidth represents side-to-side position
  const clampedU = Math.max(0, Math.min(1, u));
  
  // Linear interpolation along the track
  const px = track.startPoint.x + (track.endPoint.x - track.startPoint.x) * clampedU;
  const py = track.startPoint.y + (track.endPoint.y - track.startPoint.y) * clampedU;
  
  // Calculate perpendicular direction for lateral offset
  const dx = track.endPoint.x - track.startPoint.x;
  const dy = track.endPoint.y - track.startPoint.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  // Normalized perpendicular vector (90 degrees rotated)
  const perpX = -dy / length;
  const perpY = dx / length;
  
  return {
    x: px + perpX * lateral * track.roadHalfWidth,
    y: py + perpY * lateral * track.roadHalfWidth
  };
}

export function wrap01(u: number) {
  u = u % 1;
  return u < 0 ? u + 1 : u;
}

export function progressDelta(a: number, b: number) {
  // signed difference b-a on straight track [0,1]
  return b - a;
}
