"use client";

import { type ReactNode, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Point = { x: number; y: number };
type Ripple = Point & { radius: number; opacity: number; born: number };

const CELL_SIZE = 54;
const INFLUENCE_RADIUS = 210;

export default function KineticGrid({ children, className, globalColor = "default" }: { children?: ReactNode; className?: string; globalColor?: "default" | "monochrome" }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<Point>({ x: -9999, y: -9999 });
  const targetRef = useRef<Point>({ x: -9999, y: -9999 });
  const ripplesRef = useRef<Ripple[]>([]);
  const frameRef = useRef(0);

  const draw = useCallback((now: number) => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const bounds = root.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = bounds.width;
    const height = bounds.height;
    if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    context.fillStyle = globalColor === "monochrome" ? "#050505" : "#060c12";
    context.fillRect(0, 0, width, height);

    const mouse = mouseRef.current;
    mouse.x += (targetRef.current.x - mouse.x) * .08;
    mouse.y += (targetRef.current.y - mouse.y) * .08;
    const cols = Math.ceil(width / CELL_SIZE) + 1;
    const rows = Math.ceil(height / CELL_SIZE) + 1;
    const cellWidth = width / (cols - 1);
    const cellHeight = height / (rows - 1);
    const points: Array<Array<{ x: number; y: number; active: number }>> = [];

    for (let row = 0; row < rows; row++) {
      points[row] = [];
      for (let col = 0; col < cols; col++) {
        const x = col * cellWidth; const y = row * cellHeight;
        const edge = Math.min(col / 1.6, (cols - 1 - col) / 1.6, row / 1.6, (rows - 1 - row) / 1.6, 1);
        const dx = x - mouse.x; const dy = y - mouse.y; const distance = Math.hypot(dx, dy);
        const active = Math.max(0, 1 - distance / INFLUENCE_RADIUS) * edge * edge;
        const amount = active * 22;
        let offsetX = distance ? dx / distance * amount : 0;
        let offsetY = distance ? dy / distance * amount : 0;
        for (const ripple of ripplesRef.current) {
          const rippleDistance = Math.hypot(x - ripple.x, y - ripple.y);
          const difference = Math.abs(rippleDistance - ripple.radius);
          if (difference < 42) { const strength = (1 - difference / 42) * ripple.opacity * 14 * edge; offsetX += (x - ripple.x) / Math.max(rippleDistance, 1) * strength; offsetY += (y - ripple.y) / Math.max(rippleDistance, 1) * strength; }
        }
        points[row][col] = { x: x + offsetX, y: y + offsetY, active };
      }
    }

    context.lineCap = "butt";
    const segment = (from: typeof points[0][0], to: typeof points[0][0]) => {
      const active = (from.active + to.active) / 2;
      context.beginPath(); context.moveTo(from.x, from.y); context.lineTo(to.x, to.y);
      context.strokeStyle = globalColor === "monochrome" ? `rgba(255,255,255,${.09 + active * .65})` : `rgba(${Math.round(110 - active * 90)},${Math.round(165 + active * 70)},255,${.1 + active * .72})`;
      context.lineWidth = .7 + active * .9; context.stroke();
    };
    for (let row = 0; row < rows; row++) for (let col = 0; col < cols - 1; col++) segment(points[row][col], points[row][col + 1]);
    for (let col = 0; col < cols; col++) for (let row = 0; row < rows - 1; row++) segment(points[row][col], points[row + 1][col]);
    for (const row of points) for (const point of row) { context.beginPath(); context.arc(point.x, point.y, 1.3 + point.active * 1.8, 0, Math.PI * 2); context.fillStyle = `rgba(150,235,255,${.18 + point.active * .8})`; context.fill(); }

    ripplesRef.current = ripplesRef.current.filter(ripple => {
      const age = (now - ripple.born) / 1000; ripple.radius = age * 310; ripple.opacity = 1 - age * 1.2;
      if (ripple.opacity <= 0) return false;
      context.beginPath(); context.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2); context.strokeStyle = `rgba(0,217,255,${ripple.opacity * .3})`; context.lineWidth = 1.2; context.stroke(); return true;
    });
    frameRef.current = requestAnimationFrame(draw);
  }, [globalColor]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const move = (event: PointerEvent) => { const bounds = root.getBoundingClientRect(); targetRef.current = { x: event.clientX - bounds.left, y: event.clientY - bounds.top }; };
    const leave = () => { targetRef.current = { x: -9999, y: -9999 }; };
    const click = (event: PointerEvent) => { const bounds = root.getBoundingClientRect(); ripplesRef.current.push({ x: event.clientX - bounds.left, y: event.clientY - bounds.top, radius: 0, opacity: 1, born: performance.now() }); };
    root.addEventListener("pointermove", move); root.addEventListener("pointerleave", leave); root.addEventListener("pointerdown", click);
    frameRef.current = requestAnimationFrame(draw);
    return () => { root.removeEventListener("pointermove", move); root.removeEventListener("pointerleave", leave); root.removeEventListener("pointerdown", click); cancelAnimationFrame(frameRef.current); };
  }, [draw]);

  return <div ref={rootRef} className={cn("relative isolate overflow-hidden", className)}><canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" /><div className="relative z-10 h-full">{children}</div></div>;
}
