"use client";
import React, { useEffect, useRef } from "react";
import { PublicState } from "@/game/core/engine";
import { sampleTrack, Track } from "@/game/core/world";
import { drawMotorbike } from "@/utils/drawMotorbike";

export default function GameCanvas({ api, state, playerImageSrc }: { api: { setTurn: (d:number)=>void; getPointerHandler:()=>{onDown:(x:number)=>void;onMove:(x:number)=>void;onUp:()=>void}; tryBoost: ()=>void }; state: PublicState; playerImageSrc?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Load player image sprite
  useEffect(() => {
    const src = playerImageSrc || "/base_vehicle.png";
    const img = new Image();
    img.src = src;
    img.onload = () => { imgRef.current = img; };
  }, [playerImageSrc]);

  // Resize to device pixel ratio
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Draw each animation frame from state changes using rAF micro-loop inside React
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;

    const drawPalm = (x:number, y:number, s:number) => {
      ctx.save(); ctx.translate(x,y); ctx.scale(s,s);
      // trunk
      ctx.fillStyle = "#b45309"; ctx.fillRect(-2, 0, 4, 18);
      // leaves
      ctx.fillStyle = "#10b981";
      for(let i=0;i<5;i++){
        ctx.save(); ctx.rotate(-0.8 + i*0.4);
        ctx.beginPath(); ctx.moveTo(0,0); ctx.quadraticCurveTo(18, -4, 24, 2); ctx.quadraticCurveTo(12, 4, 0,0); ctx.fill(); ctx.restore();
      }
      ctx.restore();
    };

    const drawSpectators = (y:number, flip=false) => {
      ctx.save();
      ctx.translate(0,y);
      for(let i=-6;i<=6;i++){
        const x = i*30 + (flip?15:0);
        ctx.fillStyle = i%2===0?"#fb923c":"#60a5fa"; ctx.beginPath(); ctx.arc(x, 0, 6, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "#374151"; ctx.fillRect(x-7, 6, 14, 6);
      }
      ctx.restore();
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width; const h = rect.height;
      ctx.clearRect(0,0,w,h);
      ctx.save();
      ctx.translate(w/2, h/2);

      // Background sky and city blocks
      const grad = ctx.createLinearGradient(0, -h/2, 0, h/2);
      grad.addColorStop(0, "#cfefff");
      grad.addColorStop(1, "#ffffff");
      ctx.fillStyle = grad; ctx.fillRect(-w/2, -h/2, w, h);
      // Simple buildings with subtle parallax scroll
      const cell = w/6; const scroll = (state.time * 20) % cell;
      for(let i=0;i<9;i++){
        const x = -w/2 - cell + i*cell + scroll;
        ctx.fillStyle = i%2?"#9ad0ff":"#ffd6a5";
        ctx.fillRect(x, -h/2+20, 40 + (i%3)*10, h*0.6);
      }

      // Palm trees along the boulevard
      for(let i=0;i<6;i++){
        drawPalm(-w/2 + 40 + i*90, -h/2 + 120, 0.7);
        drawPalm(-w/2 + 70 + i*90, h/2 - 140, 0.8);
      }
      // Spectators rows
      drawSpectators(-h/2 + 160);
      drawSpectators(h/2 - 160, true);

      // Track render (straight road with perspective)
      const t = state.track;
      const road = t.roadHalfWidth;
      
      // Draw straight road with perspective
      ctx.save();
      
      // Road perspective trapezoid
      const roadTop = -h/2 + 80; // top of visible road
      const roadBottom = h/2 - 20; // bottom of visible road
      const roadWidthTop = road * 0.3; // narrower at top (far)
      const roadWidthBottom = road * 1.5; // wider at bottom (near)
      
      // Road surface
      ctx.fillStyle = "#374151";
      ctx.beginPath();
      ctx.moveTo(-roadWidthTop, roadTop);
      ctx.lineTo(roadWidthTop, roadTop);
      ctx.lineTo(roadWidthBottom, roadBottom);
      ctx.lineTo(-roadWidthBottom, roadBottom);
      ctx.closePath();
      ctx.fill();
      
      // Road edges (guard rails)
      ctx.strokeStyle = "#6b7280";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-roadWidthTop, roadTop);
      ctx.lineTo(-roadWidthBottom, roadBottom);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(roadWidthTop, roadTop);
      ctx.lineTo(roadWidthBottom, roadBottom);
      ctx.stroke();
      
      // Lane dividers (dashed lines)
      ctx.setLineDash([12, 8]);
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, roadTop);
      ctx.lineTo(0, roadBottom);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Start/finish line at bottom
      ctx.fillStyle = "#fff";
      ctx.fillRect(-roadWidthBottom * 0.8, roadBottom - 8, roadWidthBottom * 1.6, 8);
      // Checkered pattern
      ctx.fillStyle = "#000";
      for(let i = 0; i < 8; i++) {
        if(i % 2 === 0) {
          const x = -roadWidthBottom * 0.8 + (i * roadWidthBottom * 1.6 / 8);
          ctx.fillRect(x, roadBottom - 8, roadWidthBottom * 1.6 / 8, 4);
          ctx.fillRect(x, roadBottom - 4, roadWidthBottom * 1.6 / 8, 4);
        }
      }
      
      ctx.restore();

      // Obstacles
      for(const ob of t.obstacles){
        const p = sampleTrack(t, ob.u, ob.lane);
        ctx.fillStyle = "#ef4444";
        ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI*2); ctx.fill();
      }

      // Coins
      for(const c of t.coins){
        if(c.taken) continue;
        const p = sampleTrack(t, c.u, c.lane);
        ctx.fillStyle = "#fbbf24"; ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }

      // AI scooters
      drawScooter(ctx, t, state.ai[0]?.u ?? 0, state.ai[0]?.lane ?? 0, "#3b82f6");
      if(state.ai[1]) drawScooter(ctx, t, state.ai[1].u, state.ai[1].lane, "#22c55e");

      // Player with boost trail
      if(state.player.boosting>0){
        const trail = sampleTrack(t, state.player.u-0.01, state.player.lane);
        ctx.strokeStyle = "rgba(255,165,0,0.6)"; ctx.lineWidth = 8; ctx.beginPath();
        const p2 = sampleTrack(t, state.player.u, state.player.lane);
        ctx.moveTo(trail.x, trail.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      }
      // Draw player vehicle (straight track positioning)
      {
        const p = sampleTrack(t, state.player.u, state.player.lane);
        // For straight track, angle is always 0 (pointing up)
        const straightAngle = 0;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(straightAngle);
        
        // Use image if available, otherwise use orange scooter
        const img = imgRef.current;
        if (img && img.complete) {
          const iw = 52, ih = 32;
          ctx.drawImage(img, -iw/2, -ih/2, iw, ih);
          // Add orange tint overlay
          ctx.globalCompositeOperation = "multiply";
          ctx.fillStyle = "#ff8c00";
          ctx.fillRect(-iw/2, -ih/2, iw, ih);
          ctx.globalCompositeOperation = "source-over";
        } else {
          // Fallback: draw orange scooter shape
          ctx.fillStyle = "#ff8c00"; // orange color
          ctx.strokeStyle = "#cc6600"; 
          ctx.lineWidth = 2;
          roundedRect(ctx, -26, -16, 52, 32, 8);
          ctx.fill();
          ctx.stroke();
          // Add details
          ctx.fillStyle = "#333";
          ctx.beginPath(); ctx.arc(-8,-8,3,0,Math.PI*2); ctx.fill(); // front wheel
          ctx.beginPath(); ctx.arc(8,8,3,0,Math.PI*2); ctx.fill(); // rear wheel
        }
        ctx.restore();
      }

      // Countdown text
      if(state.phase === "countdown"){
        const num = Math.ceil(state.countdown);
        ctx.fillStyle = "rgba(0,0,0,0.2)"; ctx.font = "bold 120px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(String(num), 0, 0);
      }

      ctx.restore();
    };

    draw();
  }, [state]);

  // Input handlers
  useEffect(() => {
    const c = ref.current!;
    const ph = api.getPointerHandler();
    const onDown = (e: PointerEvent) => { c.setPointerCapture(e.pointerId); ph.onDown(e.clientX); };
    const onMove = (e: PointerEvent) => { if (e.buttons) ph.onMove(e.clientX); };
    const onUp = (_: PointerEvent) => ph.onUp();
    c.addEventListener("pointerdown", onDown);
    c.addEventListener("pointermove", onMove);
    c.addEventListener("pointerup", onUp);
    return () => { c.removeEventListener("pointerdown", onDown); c.removeEventListener("pointermove", onMove); c.removeEventListener("pointerup", onUp); };
  }, [api]);

  // Keyboard steer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key.toLowerCase()==="a") api.setTurn(-1);
      if (e.key === "ArrowRight" || e.key.toLowerCase()==="d") api.setTurn(1);
      if (e.key === " ") api.tryBoost();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (["ArrowLeft","ArrowRight","a","d","A","D"].includes(e.key)) api.setTurn(0);
    };
    window.addEventListener("keydown", onKey); window.addEventListener("keyup", onKeyUp);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("keyup", onKeyUp); };
  }, [api]);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full touch-none" />;
}

function pathEllipse(ctx: CanvasRenderingContext2D, cx:number, cy:number, rx:number, ry:number){
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI*2);
}

function drawScooter(ctx: CanvasRenderingContext2D, t:Track, u:number, lane:number, color:string, hasRider:boolean=false){
  const p = sampleTrack(t, u, lane);
  // For straight track, all vehicles point straight up (0 degrees)
  const th = 0;
  ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(th);
  // body
  ctx.fillStyle = color; ctx.strokeStyle = "#111827"; ctx.lineWidth = 1.5;
  roundedRect(ctx, -6, -10, 12, 20, 5); ctx.fill(); ctx.stroke();
  // wheels
  ctx.fillStyle = "#111827"; ctx.beginPath(); ctx.arc(0,-10,2,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(0,10,2,0,Math.PI*2); ctx.fill();
  if(hasRider){ ctx.fillStyle = "#fde68a"; ctx.beginPath(); ctx.arc(0,-14,4,0,Math.PI*2); ctx.fill(); }
  ctx.restore();
}

function roundedRect(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number){
  const k = r;
  ctx.beginPath();
  ctx.moveTo(x+k, y);
  ctx.lineTo(x+w-k, y);
  ctx.quadraticCurveTo(x+w, y, x+w, y+k);
  ctx.lineTo(x+w, y+h-k);
  ctx.quadraticCurveTo(x+w, y+h, x+w-k, y+h);
  ctx.lineTo(x+k, y+h);
  ctx.quadraticCurveTo(x, y+h, x, y+h-k);
  ctx.lineTo(x, y+k);
  ctx.quadraticCurveTo(x, y, x+k, y);
}
