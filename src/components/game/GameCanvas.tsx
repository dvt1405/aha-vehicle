"use client";
import React, { useEffect, useRef } from "react";
import { PublicState } from "@/game/core/engine";
import { sampleTrack, uToTheta } from "@/game/core/world";

export default function GameCanvas({ api, state }: { api: { setTurn: (d:number)=>void; getPointerHandler:()=>{onDown:(x:number)=>void;onMove:(x:number)=>void;onUp:()=>void}; tryBoost: ()=>void }; state: PublicState }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

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
      // Simple buildings
      for(let i=0;i<7;i++){
        const x = -w/2 + i*(w/6);
        ctx.fillStyle = i%2?"#9ad0ff":"#ffd6a5";
        ctx.fillRect(x, -h/2+20, 40 + (i%3)*10, h*0.6);
      }

      // Track render (oval road)
      const t = state.track;
      const road = t.roadHalfWidth;
      // outline
      ctx.strokeStyle = "#6b7280"; ctx.lineWidth = road*2 + 20; // guard rail
      pathEllipse(ctx, 0, 0, t.radiusX, t.radiusY); ctx.stroke();
      // asphalt
      ctx.strokeStyle = "#374151"; ctx.lineWidth = road*2; pathEllipse(ctx,0,0,t.radiusX, t.radiusY); ctx.stroke();
      // lane markers
      ctx.setLineDash([8,8]); ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 2;
      pathEllipse(ctx,0,0,t.radiusX, t.radiusY); ctx.stroke();
      ctx.setLineDash([]);

      // start line
      ctx.save();
      const th0 = uToTheta(0);
      const nx = Math.cos(th0), ny = Math.sin(th0);
      ctx.translate(nx*t.radiusX, ny*t.radiusY);
      ctx.rotate(Math.atan2(ny, nx)+Math.PI/2);
      ctx.fillStyle = "#fff"; ctx.fillRect(-road, -2, road*2, 4);
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

      // Player scooter with boost trail
      if(state.player.boosting>0){
        const trail = sampleTrack(t, state.player.u-0.01, state.player.lane);
        ctx.strokeStyle = "rgba(59,130,246,0.45)"; ctx.lineWidth = 8; ctx.beginPath();
        const p2 = sampleTrack(t, state.player.u, state.player.lane);
        ctx.moveTo(trail.x, trail.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      }
      drawScooter(ctx, t, state.player.u, state.player.lane, "#f97316", true);

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

function drawScooter(ctx: CanvasRenderingContext2D, t:any, u:number, lane:number, color:string, hasRider:boolean=false){
  const p = sampleTrack(t, u, lane);
  const th = uToTheta(u);
  ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(th+Math.PI/2);
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
