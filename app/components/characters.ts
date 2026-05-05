export interface CharImages {
  chichi: HTMLImageElement | null;
  goten: HTMLImageElement | null;
  bulma: HTMLImageElement | null;
  trunks: HTMLImageElement | null;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(img);
    img.src = src;
  });
}

export async function preloadCharacters(): Promise<CharImages> {
  const [chichi, goten, bulma, trunks] = await Promise.all([
    loadImage("/Chi chi.png"),
    loadImage("/Gotten.png"),
    loadImage("/Bulma.png"),
    loadImage("/Trunks.png"),
  ]);
  return { chichi, goten, bulma, trunks };
}

function pompom(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size = 7) {
  ctx.shadowColor = color;
  ctx.shadowBlur = 14;
  ctx.fillStyle = color;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * size * 0.55, y + Math.sin(a) * size * 0.55, size * 0.38, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath(); ctx.arc(x, y, size * 0.42, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
}

function bubble(ctx: CanvasRenderingContext2D, cx: number, topY: number, text: string, color: string) {
  ctx.save();
  ctx.font = "bold 9px monospace";
  ctx.textAlign = "center";
  const tw = ctx.measureText(text).width + 14;
  const bh = 16;
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  ctx.beginPath(); ctx.roundRect(cx - tw / 2, topY, tw, bh, 3); ctx.fill(); ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.moveTo(cx - 4, topY + bh); ctx.lineTo(cx + 4, topY + bh); ctx.lineTo(cx, topY + bh + 6);
  ctx.closePath(); ctx.fillStyle = "rgba(255,255,255,0.95)"; ctx.fill();
  ctx.strokeStyle = color; ctx.stroke();
  ctx.fillStyle = color; ctx.fillText(text, cx, topY + bh - 4);
  ctx.restore();
}

function drawChar(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cx: number, by: number,
  w: number, h: number,
  tick: number,
  excited: boolean, sad: boolean,
  glowColor: string,
  // hand positions as fraction of [w, h] from top-left of drawn image
  leftHand: [number, number],
  rightHand: [number, number],
  pomColor: string,
  speechText: string,
  speechColor: string,
) {
  const bob = Math.sin(tick * 0.1) * 3;
  const jump = excited ? -Math.abs(Math.sin(tick * 0.22)) * 24 : 0;
  const dy = bob + jump;
  const x = cx - w / 2;
  const y = by - h + dy;

  ctx.save();
  ctx.globalAlpha = sad ? 0.45 : 1;

  // Glow when excited
  if (excited) {
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 20 + Math.sin(tick * 0.2) * 8;
  }

  ctx.drawImage(img, x, y, w, h);
  ctx.shadowBlur = 0;

  // Pom poms near hands (glowing orbs)
  const lhx = x + leftHand[0] * w;
  const lhy = y + leftHand[1] * h;
  const rhx = x + rightHand[0] * w;
  const rhy = y + rightHand[1] * h;
  const pomBob = excited ? Math.sin(tick * 0.28) * 6 : 0;
  pompom(ctx, lhx, lhy + pomBob, pomColor);
  pompom(ctx, rhx, rhy - pomBob, pomColor);

  if (excited && Math.sin(tick * 0.22) > 0.4) {
    bubble(ctx, cx, y - 18, speechText, speechColor);
  }

  ctx.restore();
}

export function drawChichi(
  ctx: CanvasRenderingContext2D, cx: number, by: number,
  img: HTMLImageElement | null, tick: number, excited: boolean, sad: boolean
) {
  if (!img) return;
  drawChar(ctx, img, cx, by, 90, 90, tick, excited, sad,
    "#FFEE00",
    [0.08, 0.22], [0.88, 0.22],
    "#FFEE00", "GO GOKU!!", "#0088FF"
  );
}

export function drawGoten(
  ctx: CanvasRenderingContext2D, cx: number, by: number,
  img: HTMLImageElement | null, tick: number, excited: boolean, sad: boolean
) {
  if (!img) return;
  drawChar(ctx, img, cx, by, 78, 78, tick, excited, sad,
    "#00AAFF",
    [0.06, 0.20], [0.90, 0.20],
    "#00AAFF", "GO DAD!!", "#FF6600"
  );
}

export function drawBulma(
  ctx: CanvasRenderingContext2D, cx: number, by: number,
  img: HTMLImageElement | null, tick: number, excited: boolean, sad: boolean
) {
  if (!img) return;
  drawChar(ctx, img, cx, by, 90, 90, tick, excited, sad,
    "#AA00FF",
    [0.06, 0.22], [0.90, 0.22],
    "#AA00FF", "VEGETA!! ♥", "#AA00FF"
  );
}

export function drawTrunks(
  ctx: CanvasRenderingContext2D, cx: number, by: number,
  img: HTMLImageElement | null, tick: number, excited: boolean, sad: boolean
) {
  if (!img) return;
  drawChar(ctx, img, cx, by, 78, 78, tick, excited, sad,
    "#CC88FF",
    [0.06, 0.18], [0.88, 0.18],
    "#CC88FF", "GO DAD!!", "#AA00FF"
  );
}
