"use client";
import React, { useEffect, useRef } from "react";
import { drawMotorbike } from "@/utils/drawMotorbike";

export default function Vehicle({ size = 64, alt = "vehicle" }: { size?: number; alt?: string }){
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw motorbike in center
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    drawMotorbike(ctx, centerX, centerY, size * 0.8, size * 0.8 * 0.62, 0);
  }, [size]);
  
  return (
    <div style={{ width: size, height: size*0.62 }} className="relative select-none">
      <canvas 
        ref={canvasRef}
        width={size}
        height={size * 0.62}
        className="w-full h-full"
        aria-label={alt}
      />
    </div>
  );
}
