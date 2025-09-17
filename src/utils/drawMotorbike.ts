/**
 * Enhanced canvas-based motorbike drawing function
 * Main color: Orange (#f97316)
 */

export function drawMotorbike(
  ctx: CanvasRenderingContext2D,
  x: number = 0,
  y: number = 0,
  width: number = 52,
  height: number = 32,
  rotation: number = 0
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  
  const scale = Math.min(width / 52, height / 32);
  ctx.scale(scale, scale);
  
  // Main colors
  const orangeMain = "#f97316"; // Primary orange
  const orangeDark = "#ea580c"; // Darker orange for shadows
  const orangeLight = "#fb923c"; // Lighter orange for highlights
  const blackColor = "#111827";
  const grayColor = "#6b7280";
  const chromeColor = "#e5e7eb";
  
  // Draw rear wheel
  ctx.fillStyle = blackColor;
  ctx.beginPath();
  ctx.arc(-15, 8, 8, 0, Math.PI * 2);
  ctx.fill();
  
  // Rear wheel rim
  ctx.fillStyle = chromeColor;
  ctx.beginPath();
  ctx.arc(-15, 8, 6, 0, Math.PI * 2);
  ctx.fill();
  
  // Rear wheel center
  ctx.fillStyle = grayColor;
  ctx.beginPath();
  ctx.arc(-15, 8, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw front wheel
  ctx.fillStyle = blackColor;
  ctx.beginPath();
  ctx.arc(15, 8, 8, 0, Math.PI * 2);
  ctx.fill();
  
  // Front wheel rim
  ctx.fillStyle = chromeColor;
  ctx.beginPath();
  ctx.arc(15, 8, 6, 0, Math.PI * 2);
  ctx.fill();
  
  // Front wheel center
  ctx.fillStyle = grayColor;
  ctx.beginPath();
  ctx.arc(15, 8, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Main body frame (lower part)
  ctx.fillStyle = orangeMain;
  ctx.strokeStyle = orangeDark;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(-18, 0, 36, 12, 3);
  ctx.fill();
  ctx.stroke();
  
  // Engine block
  ctx.fillStyle = grayColor;
  ctx.strokeStyle = blackColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(-8, 4, 16, 8, 2);
  ctx.fill();
  ctx.stroke();
  
  // Seat
  ctx.fillStyle = blackColor;
  ctx.beginPath();
  ctx.roundRect(-12, -8, 20, 6, 3);
  ctx.fill();
  
  // Seat highlight
  ctx.fillStyle = grayColor;
  ctx.beginPath();
  ctx.roundRect(-10, -7, 16, 2, 1);
  ctx.fill();
  
  // Handlebars
  ctx.strokeStyle = chromeColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(8, -6);
  ctx.lineTo(12, -8);
  ctx.moveTo(8, -6);
  ctx.lineTo(12, -4);
  ctx.stroke();
  
  // Front fairing/windshield
  ctx.fillStyle = orangeLight;
  ctx.strokeStyle = orangeDark;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(10, -4);
  ctx.lineTo(18, -6);
  ctx.lineTo(18, 0);
  ctx.lineTo(12, 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Headlight
  ctx.fillStyle = "#fbbf24"; // Yellow for headlight
  ctx.beginPath();
  ctx.arc(16, -2, 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Headlight rim
  ctx.strokeStyle = chromeColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(16, -2, 2, 0, Math.PI * 2);
  ctx.stroke();
  
  // Rear section
  ctx.fillStyle = orangeDark;
  ctx.beginPath();
  ctx.roundRect(-20, -6, 8, 8, 2);
  ctx.fill();
  
  // Taillight
  ctx.fillStyle = "#ef4444"; // Red for taillight
  ctx.beginPath();
  ctx.arc(-18, -2, 1.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Exhaust pipe
  ctx.fillStyle = grayColor;
  ctx.strokeStyle = blackColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(-10, 10, 8, 3, 1.5);
  ctx.fill();
  ctx.stroke();
  
  // Side panels with orange gradient effect
  ctx.fillStyle = orangeMain;
  ctx.beginPath();
  ctx.roundRect(-6, -2, 12, 4, 1);
  ctx.fill();
  
  // Racing stripes
  ctx.strokeStyle = orangeLight;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-6, -1);
  ctx.lineTo(6, -1);
  ctx.moveTo(-6, 1);
  ctx.lineTo(6, 1);
  ctx.stroke();
  
  // Mirror
  ctx.fillStyle = chromeColor;
  ctx.beginPath();
  ctx.arc(10, -7, 1, 0, Math.PI * 2);
  ctx.fill();
  
  // Mirror stem
  ctx.strokeStyle = grayColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(10, -7);
  ctx.lineTo(11, -6);
  ctx.stroke();
  
  ctx.restore();
}

// Simplified version for smaller displays
export function drawMotorbikeSimple(
  ctx: CanvasRenderingContext2D,
  x: number = 0,
  y: number = 0,
  size: number = 24,
  rotation: number = 0
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  
  const scale = size / 24;
  ctx.scale(scale, scale);
  
  const orangeMain = "#f97316";
  const orangeDark = "#ea580c";
  const blackColor = "#111827";
  const chromeColor = "#e5e7eb";
  
  // Wheels
  ctx.fillStyle = blackColor;
  ctx.beginPath();
  ctx.arc(-8, 4, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(8, 4, 4, 0, Math.PI * 2);
  ctx.fill();
  
  // Wheel rims
  ctx.fillStyle = chromeColor;
  ctx.beginPath();
  ctx.arc(-8, 4, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(8, 4, 2.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Body
  ctx.fillStyle = orangeMain;
  ctx.strokeStyle = orangeDark;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.roundRect(-10, -2, 20, 6, 2);
  ctx.fill();
  ctx.stroke();
  
  // Seat
  ctx.fillStyle = blackColor;
  ctx.beginPath();
  ctx.roundRect(-6, -6, 10, 3, 1.5);
  ctx.fill();
  
  // Headlight
  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  ctx.arc(9, -1, 1, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}