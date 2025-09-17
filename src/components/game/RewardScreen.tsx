"use client";
import React, { useEffect, useRef, useState } from "react";
import { drawMotorbikeSimple } from "@/utils/drawMotorbike";

interface RewardScreenProps {
  coins: number;
  totalScore?: number;
  placement?: number;
  gameStats?: {
    time?: number;
    deliveries?: number;
    collectedCoins?: number;
    pickups?: number;
    dropoffs?: number;
  };
  onClaim: () => void;
  gameType?: 'racing' | 'delivery';
}

export default function RewardScreen({
  coins,
  totalScore = 0,
  placement,
  gameStats = {},
  onClaim,
  gameType = 'racing'
}: RewardScreenProps) {
  const vehicleCanvasRef = useRef<HTMLCanvasElement>(null);
  const [showCoins, setShowCoins] = useState(false);

  // Draw the motorbike in center
  useEffect(() => {
    const canvas = vehicleCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw motorbike in center
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    drawMotorbikeSimple(ctx, centerX, centerY, 60, 0);
  }, []);

  // Trigger coin animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setShowCoins(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Generate random positions for scattered coins
  const coinPositions = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 90 + 5, // 5% to 95% width
    y: Math.random() * 70 + 15, // 15% to 85% height
    delay: Math.random() * 1000, // Random delay up to 1s
    size: Math.random() * 0.5 + 0.8, // 0.8x to 1.3x size
  }));

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-green-100 to-green-50 flex items-center justify-center">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Garage/workshop background elements */}
        <div className="absolute top-8 left-8 w-16 h-12 bg-orange-300 rounded opacity-60"></div>
        <div className="absolute top-8 right-8 w-12 h-16 bg-blue-300 rounded opacity-60"></div>
        <div className="absolute bottom-12 left-12 w-8 h-8 bg-red-300 rounded-full opacity-60"></div>
        <div className="absolute bottom-12 right-12 w-10 h-6 bg-green-300 rounded opacity-60"></div>
        
        {/* Shelf-like elements */}
        <div className="absolute top-16 left-1/4 w-32 h-3 bg-amber-200 rounded opacity-70"></div>
        <div className="absolute top-16 right-1/4 w-32 h-3 bg-amber-200 rounded opacity-70"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Task Completed Banner */}
        <div className="text-center mb-6">
          <div className="inline-block px-8 py-4 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full shadow-lg border-4 border-white">
            <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
              TASK COMPLETED!
            </h1>
          </div>
        </div>

        {/* Vehicle and Coins Area */}
        <div className="relative bg-white/20 backdrop-blur-sm rounded-3xl p-8 mb-6 min-h-[300px] overflow-hidden">
          {/* Animated coins scattered around */}
          {showCoins && coinPositions.map((coin) => (
            <div
              key={coin.id}
              className="absolute text-yellow-400 animate-bounce"
              style={{
                left: `${coin.x}%`,
                top: `${coin.y}%`,
                animationDelay: `${coin.delay}ms`,
                fontSize: `${coin.size * 1.5}rem`,
                animationDuration: '1.5s',
              }}
            >
              🪙
            </div>
          ))}

          {/* Stars/sparkles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute text-yellow-300 animate-pulse"
              style={{
                left: `${10 + i * 10}%`,
                top: `${10 + (i % 2) * 70}%`,
                animationDelay: `${i * 200}ms`,
              }}
            >
              ✨
            </div>
          ))}

          {/* Central vehicle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <canvas 
                ref={vehicleCanvasRef}
                width={120}
                height={75}
                className="w-[120px] h-[75px] drop-shadow-lg"
                aria-label="Completed vehicle"
              />
              
              {/* Celebration burst effect */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-4xl animate-ping">💥</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Display */}
        <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 mb-6 text-center">
          <div className="grid grid-cols-2 gap-4 text-gray-800">
            {gameType === 'racing' && (
              <>
                {placement && (
                  <div>
                    <div className="text-lg font-bold">#{placement}</div>
                    <div className="text-sm text-gray-600">Place</div>
                  </div>
                )}
                {gameStats.time && (
                  <div>
                    <div className="text-lg font-bold">{gameStats.time.toFixed(1)}s</div>
                    <div className="text-sm text-gray-600">Time</div>
                  </div>
                )}
                {gameStats.collectedCoins !== undefined && (
                  <div>
                    <div className="text-lg font-bold">{gameStats.collectedCoins}</div>
                    <div className="text-sm text-gray-600">Collected</div>
                  </div>
                )}
              </>
            )}
            {gameType === 'delivery' && (
              <>
                <div>
                  <div className="text-lg font-bold">{totalScore}</div>
                  <div className="text-sm text-gray-600">Score</div>
                </div>
                {gameStats.deliveries !== undefined && (
                  <div>
                    <div className="text-lg font-bold">{gameStats.deliveries}</div>
                    <div className="text-sm text-gray-600">Deliveries</div>
                  </div>
                )}
                {gameStats.pickups !== undefined && (
                  <div>
                    <div className="text-lg font-bold text-blue-600">{gameStats.pickups}</div>
                    <div className="text-sm text-gray-600">Pickups</div>
                  </div>
                )}
                {gameStats.dropoffs !== undefined && (
                  <div>
                    <div className="text-lg font-bold text-orange-600">{gameStats.dropoffs}</div>
                    <div className="text-sm text-gray-600">Dropoffs</div>
                  </div>
                )}
              </>
            )}
            <div className="col-span-2 border-t pt-3">
              <div className="text-2xl font-bold text-orange-600 flex items-center justify-center gap-2">
                <span>🪙</span>
                <span>{coins}</span>
              </div>
              <div className="text-sm text-gray-600">Total Reward</div>
            </div>
          </div>
        </div>

        {/* Claim Rewards Button */}
        <div className="text-center">
          <button
            onClick={onClaim}
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xl font-bold rounded-full shadow-xl transform transition-all duration-200 hover:scale-105 border-4 border-white"
          >
            <span className="mr-2">🏆</span>
            CLAIM REWARDS
          </button>
        </div>
      </div>
    </div>
  );
}