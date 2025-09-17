"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";

// Types
export type MissionKey = "deliver1" | "deliver5" | "deliver50";

export interface Mission {
  key: MissionKey;
  title: string;
  goal: number;
  progress: number;
  reward: number;
  completed: boolean;
  claimed: boolean;
}

export interface Upgrades {
  shinyWheels?: boolean;
  performance?: boolean;
  deluxeSponge?: boolean;
  customPaint?: boolean;
}

export interface Vehicle {
  id: "scooter-1";
  cleanliness: number; // 0..100
  level: number; // 1+
  upgrades: Upgrades;
}

export interface GameState {
  coins: number;
  vehicle: Vehicle;
  missions: Mission[];
  leaderboardScore: number;
}

const DEFAULT_MISSIONS: Mission[] = [
  { key: "deliver1", title: "Deliver 1 package", goal: 1, progress: 0, reward: 10, completed: false, claimed: false },
  { key: "deliver5", title: "Deliver 5 packages", goal: 5, progress: 0, reward: 60, completed: false, claimed: false },
  { key: "deliver50", title: "Deliver 50 packages", goal: 50, progress: 0, reward: 800, completed: false, claimed: false },
];

const DEFAULT_STATE: GameState = {
  coins: 0,
  vehicle: {
    id: "scooter-1",
    cleanliness: 50,
    level: 1,
    upgrades: {},
  },
  missions: DEFAULT_MISSIONS,
  leaderboardScore: 0,
};

// Actions
type Action =
  | { type: "LOAD"; state: GameState }
  | { type: "ADD_COINS"; amount: number }
  | { type: "SPEND_COINS"; amount: number }
  | { type: "START_WASH" }
  | { type: "FINISH_WASH"; amount?: number; bonus?: number }
  | { type: "BUY_UPGRADE"; key: keyof Upgrades; cost: number }
  | { type: "COMPLETE_DELIVERY"; count: number }
  | { type: "CLAIM_MISSION_REWARD"; key: MissionKey }
  | { type: "GAIN_SCORE"; amount: number };

function clamp(num: number, min: number, max: number) {
  return Math.max(min, Math.min(max, num));
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "LOAD":
      return action.state;
    case "ADD_COINS":
      return { ...state, coins: state.coins + action.amount };
    case "SPEND_COINS": {
      const can = state.coins >= action.amount;
      if (!can) return state;
      return { ...state, coins: state.coins - action.amount };
    }
    case "START_WASH": {
      const cleanliness = clamp(state.vehicle.cleanliness - 5, 0, 100);
      return { ...state, vehicle: { ...state.vehicle, cleanliness } };
    }
    case "FINISH_WASH": {
      const amount = action.amount ?? 50;
      const bonus = action.bonus ?? 5;
      const cleanliness = clamp(state.vehicle.cleanliness + amount, 0, 100);
      return { ...state, vehicle: { ...state.vehicle, cleanliness }, coins: state.coins + bonus };
    }
    case "BUY_UPGRADE": {
      const key = action.key;
      const cost = action.cost;
      if (state.vehicle.upgrades[key]) return state; // already owned
      if (state.coins < cost) return state;
      return {
        ...state,
        coins: state.coins - cost,
        vehicle: {
          ...state.vehicle,
          level: state.vehicle.level + 1,
          upgrades: { ...state.vehicle.upgrades, [key]: true },
        },
      };
    }
    case "COMPLETE_DELIVERY": {
      const count = action.count;
      const missions = state.missions.map((m) => {
        if (m.completed) return m;
        const newProgress = clamp(m.progress + count, 0, m.goal);
        const completed = newProgress >= m.goal;
        return { ...m, progress: newProgress, completed: completed || m.completed };
      });
      return { ...state, coins: state.coins + count, missions };
    }
    case "CLAIM_MISSION_REWARD": {
      const missions = state.missions.map((m) => {
        if (m.key !== action.key) return m;
        if (!m.completed || m.claimed) return m;
        return { ...m, claimed: true };
      });
      const target = state.missions.find((m) => m.key === action.key);
      if (!target || !target.completed || target.claimed) return state;
      return { ...state, coins: state.coins + target.reward, missions };
    }
    case "GAIN_SCORE":
      return { ...state, leaderboardScore: state.leaderboardScore + action.amount };
    default:
      return state;
  }
}

const GameStateContext = createContext<GameState | undefined>(undefined);
const GameActionsContext = createContext<{
  addCoins: (n: number) => void;
  spendCoins: (n: number) => boolean;
  startWash: () => void;
  finishWash: (amount?: number, bonus?: number) => void;
  buyUpgrade: (key: keyof Upgrades, cost: number) => boolean;
  completeDelivery: (count?: number) => void;
  claimMissionReward: (key: MissionKey) => void;
  gainScore: (n: number) => void;
} | undefined>(undefined);

const STORAGE_KEY = "driver-vehicle-care-state-v1";

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as GameState;
        // Defensive merge to ensure defaults exist if schema changed
        const merged: GameState = {
          ...DEFAULT_STATE,
          ...parsed,
          vehicle: { ...DEFAULT_STATE.vehicle, ...parsed.vehicle, upgrades: { ...DEFAULT_STATE.vehicle.upgrades, ...(parsed.vehicle?.upgrades || {}) } },
          missions: parsed.missions?.length ? parsed.missions : DEFAULT_MISSIONS,
        };
        dispatch({ type: "LOAD", state: merged });
      }
    } catch (e) {
      console.error("Failed to load game state", e);
    }
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save game state", e);
    }
  }, [state]);

  const addCoins = useCallback((n: number) => dispatch({ type: "ADD_COINS", amount: n }), []);
  const spendCoins = useCallback((n: number) => {
    if (state.coins < n) return false;
    dispatch({ type: "SPEND_COINS", amount: n });
    return true;
  }, [state.coins]);
  const startWash = useCallback(() => dispatch({ type: "START_WASH" }), []);
  const finishWash = useCallback((amount?: number, bonus?: number) => dispatch({ type: "FINISH_WASH", amount, bonus }), []);
  const buyUpgrade = useCallback((key: keyof Upgrades, cost: number) => {
    if (state.vehicle.upgrades[key]) return false;
    if (state.coins < cost) return false;
    dispatch({ type: "BUY_UPGRADE", key, cost });
    return true;
  }, [state.coins, state.vehicle.upgrades]);
  const completeDelivery = useCallback((count: number = 1) => dispatch({ type: "COMPLETE_DELIVERY", count }), []);
  const claimMissionReward = useCallback((key: MissionKey) => dispatch({ type: "CLAIM_MISSION_REWARD", key }), []);
  const gainScore = useCallback((n: number) => dispatch({ type: "GAIN_SCORE", amount: n }), []);

  const actions = useMemo(() => ({ addCoins, spendCoins, startWash, finishWash, buyUpgrade, completeDelivery, claimMissionReward, gainScore }), [addCoins, spendCoins, startWash, finishWash, buyUpgrade, completeDelivery, claimMissionReward, gainScore]);

  return (
    <GameStateContext.Provider value={state}>
      <GameActionsContext.Provider value={actions}>{children}</GameActionsContext.Provider>
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const ctx = useContext(GameStateContext);
  if (!ctx) throw new Error("useGameState must be used within GameProvider");
  return ctx;
}

export function useGameActions() {
  const ctx = useContext(GameActionsContext);
  if (!ctx) throw new Error("useGameActions must be used within GameProvider");
  return ctx;
}

export function useGame() {
  return { ...useGameState(), ...useGameActions() } as const;
}
