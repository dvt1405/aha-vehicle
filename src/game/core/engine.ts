"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { createStraightTrack, sampleTrack, Track, wrap01, progressDelta } from "./world";
import { Racer, createAIRacers, updateAI } from "./ai";

export type Phase = "loading" | "countdown" | "racing" | "paused" | "finished";

export type GameConfig = {
  trackRadius: number;
  roadWidth: number;
  lapsToWin: number;
  player: { baseSpeed: number; turnRate: number; boostSpeed: number; boostDuration: number; boostCooldown: number };
  ai: { count: number };
};

export type Player = {
  u: number; // progress on track [0..1)
  lane: number; // -1..1 lateral
  speed: number; // fraction of lap per second
  boosting: number; // time left
  boostCooldown: number; // time left
  coins: number;
  laps: number;
  lastU: number;
};

export type GameStateCore = {
  phase: Phase;
  time: number; // elapsed seconds since race start
  countdown: number; // 3..0
  track: Track;
  player: Player;
  ai: Racer[];
  totalLaps: number;
  lastFinishPlace?: number;
};

export type GameAPI = {
  setTurn: (dir: number) => void; // -1..1
  setAccel: (a: number) => void; // 0..1 (not heavily used)
  tryBoost: () => void;
  togglePause: () => void;
  restart: () => void;
  toggleLane?: () => void; // mobile steer helper
  // for canvas
  getPointerHandler: () => {
    onDown: (x: number) => void;
    onMove: (x: number) => void;
    onUp: () => void;
  };
};

export type GameHooks = {
  onCoin?: (n: number) => void;
  onFinish?: (place: number, timeSec: number, coins: number) => void;
};

export function useGameCore(config: GameConfig, hooks: GameHooks) {
  const [state, setState] = useState<GameStateCore>(() => {
    const track = createStraightTrack({ x: 0, y: -200 }, { x: 0, y: 200 }, config.roadWidth / 2);
    const player: Player = { u: 0, lane: 0, speed: 0, boosting: 0, boostCooldown: 0, coins: 0, laps: 0, lastU: 0 };
    const ai = createAIRacers(config.ai.count);
    return { phase: "countdown", time: 0, countdown: 3, track, player, ai, totalLaps: config.lapsToWin };
  });

  const desiredTurnRef = useRef(0);
  const accelRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const pointerDrag = useRef<{ active: boolean; startX: number; startLane: number } | null>(null);

  const api: GameAPI = useMemo(() => ({
    setTurn: (d) => { desiredTurnRef.current = Math.max(-1, Math.min(1, d)); },
    setAccel: (a) => { accelRef.current = Math.max(0, Math.min(1, a)); },
    tryBoost: () => {
      setState((s) => {
        if (s.phase !== "racing" && s.phase !== "countdown") return s;
        const p = { ...s.player };
        if (p.boostCooldown <= 0) {
          p.boosting = config.player.boostDuration;
          p.boostCooldown = config.player.boostCooldown;
        }
        return { ...s, player: p };
      });
    },
    togglePause: () => setState((s) => ({ ...s, phase: s.phase === "paused" ? "racing" : s.phase === "racing" ? "paused" : s.phase })),
    restart: () => {
      const track = createStraightTrack({ x: 0, y: config.trackRadius * 2 }, { x: 0, y: -config.trackRadius * 2 }, config.roadWidth / 2);
      const player: Player = { u: 0, lane: 0, speed: 0, boosting: 0, boostCooldown: 0, coins: 0, laps: 0, lastU: 0 };
      const ai = createAIRacers(config.ai.count);
      setState({ phase: "countdown", time: 0, countdown: 3, track, player, ai, totalLaps: config.lapsToWin });
    },
    toggleLane: () => {
      setState((s) => {
        if (s.phase !== "racing" && s.phase !== "countdown") return s;
        const p = { ...s.player };
        const target = p.lane >= 0 ? -0.6 : 0.6;
        p.lane = target;
        return { ...s, player: p };
      });
    },
    getPointerHandler: () => {
      return {
        onDown: (x) => {
          pointerDrag.current = { active: true, startX: x, startLane: state.player.lane };
        },
        onMove: (x) => {
          if (!pointerDrag.current) return;
          const dx = x - pointerDrag.current.startX;
          // width normalized by 240 (approx half of 16:9 height), tweak sensitivity
          const desired = pointerDrag.current.startLane + (dx / 240);
          const clamped = Math.max(-1, Math.min(1, desired));
          desiredTurnRef.current = Math.max(-1, Math.min(1, (clamped - state.player.lane) * 2));
        },
        onUp: () => { pointerDrag.current = null; desiredTurnRef.current = 0; },
      };
    },
  }), [config, state.player.lane]);

  // game loop
  useEffect(() => {
    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.02, (now - last) / 1000); // reduced clamp for smoother animation
      last = now;
      setState((s) => step(s, dt, config, hooks, desiredTurnRef.current));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [config]);

  return { state, api } as const;
}

function step(prev: GameStateCore, dt: number, config: GameConfig, hooks: GameHooks, desiredTurn: number): GameStateCore {
  const s = { ...prev } as GameStateCore;

  if (s.phase === "paused" || s.phase === "finished") return s;

  if (s.phase === "countdown") {
    s.countdown -= dt;
    if (s.countdown <= 0) {
      s.phase = "racing";
      s.countdown = 0;
    }
  }

  // Update timers
  s.time += dt;
  s.player.boostCooldown = Math.max(0, s.player.boostCooldown - dt);
  if (s.player.boosting > 0) s.player.boosting = Math.max(0, s.player.boosting - dt);

  // steering/lane update
  const turnSpeed = config.player.turnRate;
  s.player.lane += desiredTurn * turnSpeed * dt;
  s.player.lane = Math.max(-1, Math.min(1, s.player.lane));

  // base forward speed and boost
  let maxSpeed = config.player.baseSpeed + (s.player.boosting > 0 ? (config.player.boostSpeed - config.player.baseSpeed) : 0);

  // simple collisions: track edge bounce if lane beyond 1
  if (Math.abs(s.player.lane) > 0.98) {
    maxSpeed *= 0.7;
  }

  // obstacles and coins
  for (const c of s.track.coins) {
    if (!c.taken) {
      if (Math.abs(progressDelta(s.player.u, c.u)) < 0.01 && Math.abs(s.player.lane - c.lane) < 0.3) {
        c.taken = true;
        s.player.coins += 1;
        hooks.onCoin?.(1);
      }
    }
  }
  for (const ob of s.track.obstacles) {
    if (Math.abs(progressDelta(s.player.u, ob.u)) < 0.008 && Math.abs(s.player.lane - ob.lane) < 0.35) {
      maxSpeed *= 0.5; // hit slowdown
    }
  }

  // advance player
  s.player.speed = maxSpeed;
  s.player.lastU = s.player.u;
  s.player.u = s.player.u + s.player.speed * dt;

  // lap detection for straight track
  if (s.player.u >= 1.0) {
    s.player.laps += 1;
    s.player.u = 0; // reset to start
    s.player.lastU = 0;
    if (s.player.laps >= s.totalLaps) {
      // compute placement relative to AI
      const others = s.ai.map((a) => a.u + a.laps || 0);
      const playerTotal = s.player.u + s.player.laps;
      const ahead = others.filter((total) => total > playerTotal).length;
      const place = ahead + 1; // 1 is first
      s.phase = "finished";
      s.lastFinishPlace = place;
      hooks.onFinish?.(place, s.time, s.player.coins);
      return s;
    }
  }

  // update AI
  updateAI(dt, s.ai, s.player.u, s.player.speed);

  return s;
}

export type PublicState = {
  phase: Phase;
  countdown: number;
  time: number;
  totalLaps: number;
  player: Player;
  ai: Racer[];
  track: Track;
  lastFinishPlace?: number;
};
