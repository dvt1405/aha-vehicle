"use client";
import GameCanvas from "@/components/game/GameCanvas";
import type { PublicState } from "@/game/core/engine";

export default GameCanvas as unknown as ({ api, state, playerImageSrc }: { api: { setTurn: (d:number)=>void; getPointerHandler:()=>{onDown:(x:number)=>void;onMove:(x:number)=>void;onUp:()=>void}; tryBoost: ()=>void; toggleLane?: ()=>void }; state: PublicState; playerImageSrc?: string }) => JSX.Element;
