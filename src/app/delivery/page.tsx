"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGameActions, useGameState } from "@/game/store";
import { drawMotorbikeSimple } from "@/utils/drawMotorbike";
import RewardScreen from "@/components/game/RewardScreen";

// Delivery Game Types
interface DeliveryPoint {
  id: string;
  x: number;
  y: number;
  type: 'pickup' | 'dropoff';
  package?: string;
  collected?: boolean;
}

interface DeliveryGameState {
  phase: 'playing' | 'paused' | 'finished';
  playerX: number;
  playerY: number;
  score: number;
  timeLeft: number;
  packagesCarried: string[];
  deliveryPoints: DeliveryPoint[];
  completedDeliveries: number;
  totalPickups: number;
  totalDropoffs: number;
  maxPackages: number;
}

interface DeliveryGameConfig {
  gameTimeSeconds: number;
  mapWidth: number;
  mapHeight: number;
  playerSpeed: number;
  maxPackages: number;
  pointsPerDelivery: number;
}

// Custom hook for delivery game logic
function useDeliveryGame(config: DeliveryGameConfig, onFinish: (score: number, coins: number) => void) {
  const [gameState, setGameState] = useState<DeliveryGameState>(() => {
    // Initialize delivery points
    const deliveryPoints: DeliveryPoint[] = [
      { id: 'pickup1', x: 100, y: 100, type: 'pickup', package: 'pkg1' },
      { id: 'dropoff1', x: 400, y: 150, type: 'dropoff', package: 'pkg1' },
      { id: 'pickup2', x: 150, y: 300, type: 'pickup', package: 'pkg2' },
      { id: 'dropoff2', x: 450, y: 250, type: 'dropoff', package: 'pkg2' },
      { id: 'pickup3', x: 300, y: 80, type: 'pickup', package: 'pkg3' },
      { id: 'dropoff3', x: 200, y: 350, type: 'dropoff', package: 'pkg3' },
    ];

    return {
      phase: 'playing',
      playerX: config.mapWidth / 2,
      playerY: config.mapHeight / 2,
      score: 0,
      timeLeft: config.gameTimeSeconds,
      packagesCarried: [],
      deliveryPoints,
      completedDeliveries: 0,
      totalPickups: 0,
      totalDropoffs: 0,
      maxPackages: config.maxPackages,
    };
  });

  // Game loop
  useEffect(() => {
    if (gameState.phase !== 'playing') return;

    const interval = setInterval(() => {
      setGameState(prev => {
        const newTimeLeft = prev.timeLeft - 0.05; // smaller time decrements for smoother updates
        
        // Check for victory condition - all packages delivered
        const totalPackages = 3; // pkg1, pkg2, pkg3
        if (prev.completedDeliveries >= totalPackages) {
          const coins = Math.floor(prev.score / 10);
          onFinish(prev.score, coins);
          return { ...prev, phase: 'finished' };
        }
        
        if (newTimeLeft <= 0) {
          const coins = Math.floor(prev.score / 10);
          onFinish(prev.score, coins);
          return { ...prev, phase: 'finished', timeLeft: 0 };
        }

        return { ...prev, timeLeft: newTimeLeft };
      });
    }, 50); // faster timer updates for smoother gameplay

    return () => clearInterval(interval);
  }, [gameState.phase, onFinish]);

  // Player movement
  const movePlayer = useCallback((dx: number, dy: number) => {
    setGameState(prev => {
      if (prev.phase !== 'playing') return prev;

      const newX = Math.max(20, Math.min(config.mapWidth - 20, prev.playerX + dx * config.playerSpeed));
      const newY = Math.max(20, Math.min(config.mapHeight - 20, prev.playerY + dy * config.playerSpeed));

      // Check for delivery point interactions
      let newState = { ...prev, playerX: newX, playerY: newY };

      prev.deliveryPoints.forEach(point => {
        const distance = Math.sqrt((newX - point.x) ** 2 + (newY - point.y) ** 2);
        
        if (distance < 30) { // Close enough to interact
          if (point.type === 'pickup' && !point.collected && !newState.packagesCarried.includes(point.package!) && newState.packagesCarried.length < config.maxPackages) {
            // Pick up package
            newState = {
              ...newState,
              packagesCarried: [...newState.packagesCarried, point.package!],
              totalPickups: newState.totalPickups + 1,
              deliveryPoints: newState.deliveryPoints.map(p => 
                p.id === point.id ? { ...p, collected: true } : p
              )
            };
          } else if (point.type === 'dropoff' && newState.packagesCarried.includes(point.package!)) {
            // Drop off package
            newState = {
              ...newState,
              packagesCarried: newState.packagesCarried.filter(pkg => pkg !== point.package),
              score: newState.score + config.pointsPerDelivery,
              completedDeliveries: newState.completedDeliveries + 1,
              totalDropoffs: newState.totalDropoffs + 1,
              deliveryPoints: newState.deliveryPoints.filter(p => p.id !== point.id)
            };
          }
        }
      });

      return newState;
    });
  }, [config.mapWidth, config.mapHeight, config.playerSpeed, config.maxPackages, config.pointsPerDelivery]);

  const togglePause = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: prev.phase === 'playing' ? 'paused' : 'playing'
    }));
  }, []);

  const restart = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: 'playing',
      playerX: config.mapWidth / 2,
      playerY: config.mapHeight / 2,
      score: 0,
      timeLeft: config.gameTimeSeconds,
      packagesCarried: [],
      completedDeliveries: 0,
      totalPickups: 0,
      totalDropoffs: 0,
      deliveryPoints: [
        { id: 'pickup1', x: 100, y: 100, type: 'pickup', package: 'pkg1' },
        { id: 'dropoff1', x: 400, y: 150, type: 'dropoff', package: 'pkg1' },
        { id: 'pickup2', x: 150, y: 300, type: 'pickup', package: 'pkg2' },
        { id: 'dropoff2', x: 450, y: 250, type: 'dropoff', package: 'pkg2' },
        { id: 'pickup3', x: 300, y: 80, type: 'pickup', package: 'pkg3' },
        { id: 'dropoff3', x: 200, y: 350, type: 'dropoff', package: 'pkg3' },
      ]
    }));
  }, [config.mapWidth, config.mapHeight, config.gameTimeSeconds]);

  return {
    gameState,
    movePlayer,
    togglePause,
    restart
  };
}

// Player Vehicle Component
function PlayerVehicle({ x, y }: { x: number; y: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw motorbike in center of canvas
    drawMotorbikeSimple(ctx, 16, 16, 24, 0);
  }, []);
  
  return (
    <div
      className="absolute w-8 h-8 transition-all duration-[35ms]"
      style={{
        left: x - 16,
        top: y - 16,
      }}
    >
      <canvas 
        ref={canvasRef}
        width={32}
        height={32}
        className="w-full h-full"
        aria-label="Player vehicle"
      />
    </div>
  );
}

// Delivery Game Canvas Component
function DeliveryCanvas({ gameState }: { gameState: DeliveryGameState }) {
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-green-100 to-green-50 overflow-hidden">
      {/* Roads/Grid */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Delivery Points */}
      {gameState.deliveryPoints.map(point => (
        <div
          key={point.id}
          className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
            point.type === 'pickup' 
              ? (point.collected ? 'bg-gray-300 border-gray-400 text-gray-600' : 'bg-blue-400 border-blue-600 text-white')
              : 'bg-orange-400 border-orange-600 text-white'
          }`}
          style={{
            left: point.x - 16,
            top: point.y - 16,
          }}
        >
          {point.type === 'pickup' ? (point.collected ? '✓' : '📦') : '🏠'}
        </div>
      ))}

      {/* Player Vehicle */}
      <PlayerVehicle
        x={gameState.playerX}
        y={gameState.playerY}
      />
    </div>
  );
}

// HUD Component for Delivery Game
function DeliveryHUD({ gameState, onPause }: { gameState: DeliveryGameState; onPause: () => void }) {
  const { t } = useTranslation();
  const minutes = Math.floor(gameState.timeLeft / 60);
  const seconds = Math.floor(gameState.timeLeft % 60);

  return (
    <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/20 to-transparent">
      <div className="flex items-center justify-between text-white">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-black/30 px-3 py-1 rounded text-sm">
            {t('score')}: {gameState.score}
          </div>
          <div className="bg-black/30 px-3 py-1 rounded text-sm">
            {t('time')}: {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
          <div className="bg-black/30 px-3 py-1 rounded text-sm">
            {t('carrying')}: {gameState.packagesCarried.length}/{gameState.maxPackages}
          </div>
          <div className="bg-blue-500/30 px-3 py-1 rounded text-sm border border-blue-400/50">
            {t('pickups')}: {gameState.totalPickups}
          </div>
          <div className="bg-orange-500/30 px-3 py-1 rounded text-sm border border-orange-400/50">
            {t('dropoffs')}: {gameState.totalDropoffs}
          </div>
        </div>
        <button
          onClick={onPause}
          className="bg-black/30 hover:bg-black/50 px-3 py-1 rounded text-white"
        >
{gameState.phase === 'paused' ? t('resume') : t('pause')}
        </button>
      </div>
    </div>
  );
}

// Victory Overlay Component
function DeliveryVictoryOverlay({ gameState, onRestart }: { gameState: DeliveryGameState; onRestart: () => void }) {
  const coins = Math.floor(gameState.score / 10);

  return (
    <RewardScreen
      coins={coins}
      totalScore={gameState.score}
      gameStats={{
        deliveries: gameState.completedDeliveries,
        pickups: gameState.totalPickups,
        dropoffs: gameState.totalDropoffs
      }}
      onClaim={onRestart}
      gameType="delivery"
    />
  );
}

export default function DeliveryPage() {
  const { t } = useTranslation();
  const { addCoins } = useGameActions();
  const { vehicle } = useGameState();

  // Game configuration with vehicle upgrades
  const config: DeliveryGameConfig = useMemo(() => {
    let baseSpeed = 5; // increased base speed for faster gameplay
    if (vehicle.upgrades.performance) baseSpeed += 2; // increased upgrade bonus
    if (vehicle.upgrades.shinyWheels) baseSpeed += 1; // increased upgrade bonus

    return {
      gameTimeSeconds: 60,
      mapWidth: 500,
      mapHeight: 400,
      playerSpeed: baseSpeed,
      maxPackages: 2,
      pointsPerDelivery: 50,
    };
  }, [vehicle.upgrades]);

  const { gameState, movePlayer, togglePause, restart } = useDeliveryGame(config, (score, coins) => {
    addCoins(coins);
    console.log('Delivery game finished', { score, coins });
  });

  // Keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (gameState.phase !== 'playing') {
        if (e.key === "Escape" || e.key.toLowerCase() === "p") {
          togglePause();
        }
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          movePlayer(0, -1);
          break;
        case 's':
        case 'arrowdown':
          movePlayer(0, 1);
          break;
        case 'a':
        case 'arrowleft':
          movePlayer(-1, 0);
          break;
        case 'd':
        case 'arrowright':
          movePlayer(1, 0);
          break;
        case 'p':
        case 'escape':
          togglePause();
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameState.phase, movePlayer, togglePause]);

  return (
    <div className="min-h-[75vh] w-full mx-auto max-w-[960px] relative select-none">
      <div className="relative bg-gradient-to-b from-sky-100 to-white rounded-2xl shadow-lg overflow-hidden aspect-[16/9]">
        <DeliveryCanvas gameState={gameState} />
        
        <DeliveryHUD gameState={gameState} onPause={togglePause} />

        {/* Mobile controls */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between">
          <div className="grid grid-cols-3 gap-2">
            <div></div>
            <button
              onClick={() => movePlayer(0, -1)}
              className="w-12 h-12 bg-gray-800/70 text-white rounded-lg font-bold"
            >
              ↑
            </button>
            <div></div>
            <button
              onClick={() => movePlayer(-1, 0)}
              className="w-12 h-12 bg-gray-800/70 text-white rounded-lg font-bold"
            >
              ←
            </button>
            <div></div>
            <button
              onClick={() => movePlayer(1, 0)}
              className="w-12 h-12 bg-gray-800/70 text-white rounded-lg font-bold"
            >
              →
            </button>
            <div></div>
            <button
              onClick={() => movePlayer(0, 1)}
              className="w-12 h-12 bg-gray-800/70 text-white rounded-lg font-bold"
            >
              ↓
            </button>
          </div>
        </div>

        {/* Victory/summary */}
        {gameState.phase === "finished" && (
          <DeliveryVictoryOverlay gameState={gameState} onRestart={restart} />
        )}
        
        {gameState.phase === "paused" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-gray-800 font-semibold">{t('gamePaused')}</p>
              <button
                onClick={togglePause}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                {t('resume')}
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="mt-3 text-center text-xs text-gray-500">
        {t('deliveryControlsInstructions')}
      </p>
    </div>
  );
}