"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { preloadCharacters, CharImages } from "./characters";

type GameState = "landing" | "playing" | "gameover";
type Difficulty = "Beginner" | "Rival" | "Legend";

interface GameResult {
  playerScore: number;
  aiScore: number;
  rallies: number;
  difficulty: Difficulty;
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  color: string; size: number;
}

interface RingEffect {
  x: number; y: number;
  radius: number; maxRadius: number;
  frame: number; maxFrames: number;
  color: string;
}

interface WaveEffect {
  x: number; y: number;
  width: number;
  frame: number; maxFrames: number;
  color: string;
  direction: 1 | -1;
}

interface TextFlash {
  text: string;
  x: number; y: number;
  frame: number; maxFrames: number;
  color: string;
}

const CANVAS_W = 800;
const CANVAS_H = 500;
const SPECTATOR_H = 82;
const PADDLE_W = 14;
const PADDLE_H = 90;
const BALL_SIZE = 12;
const WINNING_SCORE = 7;

const GOKU_COLOR = "#00aaff";
const VEGETA_COLOR = "#aa00ff";
const KI_COLOR = "#ffee00";

const DIFFICULTY_REACTION: Record<Difficulty, number> = {
  Beginner: 4,
  Rival: 7.5,
  Legend: 11,
};

export default function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState>("landing");
  const [gameState, setGameState] = useState<GameState>("landing");
  const [difficulty, setDifficulty] = useState<Difficulty>("Rival");
  const [result, setResult] = useState<GameResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [scale, setScale] = useState(1);
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);
  const animFrameRef = useRef<number>(0);
  const keysRef = useRef<Set<string>>(new Set());
  const charImagesRef = useRef<CharImages>({ chichi: null, goten: null, bulma: null, trunks: null });
  const chiChiImgRef = useRef<HTMLImageElement>(null);
  const gotenImgRef = useRef<HTMLImageElement>(null);
  const bulmaImgRef = useRef<HTMLImageElement>(null);
  const trunksImgRef = useRef<HTMLImageElement>(null);

  // All game state in a single ref to avoid stale closures
  const gRef = useRef({
    playerY: CANVAS_H / 2 - PADDLE_H / 2,
    aiY: CANVAS_H / 2 - PADDLE_H / 2,
    ballX: CANVAS_W / 2,
    ballY: CANVAS_H / 2,
    ballVX: 5,
    ballVY: 3,
    playerScore: 0,
    aiScore: 0,
    rallies: 0,
    currentDifficulty: "Rival" as Difficulty,
    scoring: false,
    tick: 0,
    gokuExcitedTick: 0,
    vegetaExcitedTick: 0,
    shakeX: 0,
    shakeY: 0,
    shakeDuration: 0,
    particles: [] as Particle[],
    rings: [] as RingEffect[],
    waves: [] as WaveEffect[],
    textFlashes: [] as TextFlash[],
    stars: Array.from({ length: 80 }, () => ({
      x: Math.random() * CANVAS_W,
      y: Math.random() * CANVAS_H,
      size: Math.random() * 1.5 + 0.5,
      twinkle: Math.random() * Math.PI * 2,
    })),
  });

  const spawnHitEffects = useCallback((x: number, y: number, isPlayer: boolean) => {
    const g = gRef.current;
    const color = isPlayer ? GOKU_COLOR : VEGETA_COLOR;
    const altColor = isPlayer ? "#ffffff" : "#ff88ff";
    const text = isPlayer ? "KAMEHAMEHA!" : "GALICK GUN!";

    // Expanding rings
    for (let i = 0; i < 3; i++) {
      g.rings.push({ x, y, radius: 5, maxRadius: 80 + i * 30, frame: 0, maxFrames: 18 + i * 4, color: i % 2 === 0 ? color : altColor });
    }

    // Particles burst
    for (let i = 0; i < 24; i++) {
      const angle = (Math.PI * 2 * i) / 24 + Math.random() * 0.3;
      const speed = 3 + Math.random() * 6;
      g.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 30 + Math.random() * 20,
        maxLife: 50,
        color: i % 3 === 0 ? KI_COLOR : color,
        size: 2 + Math.random() * 3,
      });
    }

    // Energy wave
    g.waves.push({
      x, y,
      width: 0,
      frame: 0, maxFrames: 22,
      color,
      direction: isPlayer ? 1 : -1,
    });

    // Text flash
    g.textFlashes.push({
      text,
      x: isPlayer ? 200 : CANVAS_W - 200,
      y: CANVAS_H / 2,
      frame: 0, maxFrames: 35,
      color,
    });

    // Screen shake
    const speed = Math.sqrt(g.ballVX ** 2 + g.ballVY ** 2);
    g.shakeDuration = Math.min(8, Math.floor(speed / 2));
    g.shakeX = (Math.random() - 0.5) * 8;
    g.shakeY = (Math.random() - 0.5) * 8;
  }, []);

  const spawnScoreEffects = useCallback((x: number, y: number, color: string, text: string) => {
    const g = gRef.current;
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;
      g.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 50 + Math.random() * 30,
        maxLife: 80,
        color: i % 2 === 0 ? KI_COLOR : color,
        size: 2 + Math.random() * 5,
      });
    }
    for (let i = 0; i < 5; i++) {
      g.rings.push({ x, y, radius: 5, maxRadius: 200 + i * 40, frame: 0, maxFrames: 30 + i * 5, color: i % 2 === 0 ? color : KI_COLOR });
    }
    g.textFlashes.push({ text, x: CANVAS_W / 2, y: CANVAS_H / 2 - 30, frame: 0, maxFrames: 60, color });
    g.shakeX = (Math.random() - 0.5) * 16;
    g.shakeY = (Math.random() - 0.5) * 16;
    g.shakeDuration = 14;
  }, []);

  const resetBall = useCallback((direction: 1 | -1) => {
    const g = gRef.current;
    g.ballX = CANVAS_W / 2;
    g.ballY = CANVAS_H / 2;
    const speed = 5 + g.rallies * 0.08;
    g.ballVX = direction * speed;
    g.ballVY = (Math.random() * 4 - 2);
  }, []);

  const startGame = useCallback((diff: Difficulty) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (screen.orientation as any).lock?.("landscape");
    } catch {}
    const g = gRef.current;
    g.playerY = CANVAS_H / 2 - PADDLE_H / 2;
    g.aiY = CANVAS_H / 2 - PADDLE_H / 2;
    g.playerScore = 0;
    g.aiScore = 0;
    g.rallies = 0;
    g.currentDifficulty = diff;
    g.tick = 0;
    g.particles = [];
    g.rings = [];
    g.waves = [];
    g.textFlashes = [];
    g.shakeDuration = 0;
    g.scoring = false;
    g.gokuExcitedTick = 0;
    g.vegetaExcitedTick = 0;
    resetBall(1);
    gameStateRef.current = "playing";
    setGameState("playing");
  }, [resetBall]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.type === "keydown") keysRef.current.add(e.key);
      if (e.type === "keyup") keysRef.current.delete(e.key);
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("keyup", handleKey);
    };
  }, []);

  useEffect(() => {
    preloadCharacters().then((imgs) => { charImagesRef.current = imgs; });
  }, []);

  useEffect(() => {
    const updateLayout = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setIsPortrait(h > w && w < 1024);
      setIsMobileLandscape(w > h && w < 1024);
      const sx = w / CANVAS_W;
      const sy = h / (CANVAS_H + SPECTATOR_H);
      setScale(Math.min(1, sx, sy) * 0.97);
    };
    updateLayout();
    window.addEventListener("resize", updateLayout);
    window.addEventListener("orientationchange", updateLayout);
    return () => {
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("orientationchange", updateLayout);
    };
  }, []);

  // Animate HTML character elements directly (no React re-renders)
  useEffect(() => {
    let id: number;
    const loop = () => {
      const g = gRef.current;
      const gExcited = g.gokuExcitedTick > 0;
      const vExcited = g.vegetaExcitedTick > 0;
      const gSad = g.vegetaExcitedTick > 80;
      const vSad = g.gokuExcitedTick > 80;

      const animChar = (
        el: HTMLImageElement | null,
        excited: boolean,
        sad: boolean,
        phase: number,
        glowColor: string,
      ) => {
        if (!el) return;
        const bob = Math.sin(g.tick * 0.1 + phase) * 3;
        const jump = excited ? -Math.abs(Math.sin(g.tick * 0.22)) * 26 : 0;
        el.style.transform = `translateY(${bob + jump}px)`;
        el.style.opacity = sad ? "0.4" : "1";
        el.style.filter = excited
          ? `drop-shadow(0 0 8px ${glowColor}) drop-shadow(0 0 16px ${glowColor})`
          : "none";
      };

      animChar(chiChiImgRef.current, gExcited, gSad, 0,    "#FFEE00");
      animChar(gotenImgRef.current,  gExcited, gSad, 0.8,  "#00AAFF");
      animChar(trunksImgRef.current, vExcited, vSad, 1.6,  "#CC88FF");
      animChar(bulmaImgRef.current,  vExcited, vSad, 2.4,  "#AA00FF");

      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fix blurry canvas on high-DPI (Retina) screens
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_W * dpr;
    canvas.height = CANVAS_H * dpr;
    canvas.style.width = `${CANVAS_W}px`;
    canvas.style.height = `${CANVAS_H}px`;
    ctx.scale(dpr, dpr);

    const drawStars = (tick: number) => {
      gRef.current.stars.forEach((s) => {
        const alpha = 0.4 + 0.4 * Math.sin(s.twinkle + tick * 0.03);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawDivider = (tick: number) => {
      const pulse = 0.08 + 0.06 * Math.sin(tick * 0.08);
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = `rgba(255,220,0,${pulse})`;
      ctx.lineWidth = 2;
      ctx.shadowColor = KI_COLOR;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(CANVAS_W / 2, 0);
      ctx.lineTo(CANVAS_W / 2, CANVAS_H);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;
    };

    const drawPaddle = (x: number, y: number, color: string, label: string, tick: number) => {
      const pulseBlur = 15 + 8 * Math.sin(tick * 0.1);
      // Outer aura
      ctx.shadowColor = color;
      ctx.shadowBlur = pulseBlur;
      ctx.fillStyle = color + "44";
      ctx.beginPath();
      ctx.roundRect(x - 4, y - 6, PADDLE_W + 8, PADDLE_H + 12, 8);
      ctx.fill();

      // Main paddle
      ctx.shadowBlur = 20;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(x, y, PADDLE_W, PADDLE_H, 4);
      ctx.fill();

      // Color overlay
      ctx.fillStyle = color + "88";
      ctx.beginPath();
      ctx.roundRect(x, y, PADDLE_W, PADDLE_H, 4);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label
      ctx.fillStyle = color;
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.fillText(label, x + PADDLE_W / 2, label === "GOKU" ? y - 12 : y + PADDLE_H + 20);
      ctx.shadowBlur = 0;
    };

    const drawBall = (x: number, y: number, tick: number) => {
      const pulseSize = BALL_SIZE / 2 + 1.5 * Math.sin(tick * 0.3);
      // Outer glow layers
      [40, 25, 15].forEach((blur, i) => {
        ctx.shadowColor = KI_COLOR;
        ctx.shadowBlur = blur;
        ctx.fillStyle = i === 0 ? "#ffffff44" : i === 1 ? "#ffee0066" : KI_COLOR;
        ctx.beginPath();
        ctx.arc(x, y, pulseSize + (2 - i), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;
    };

    const drawParticles = () => {
      const g = gRef.current;
      g.particles = g.particles.filter(p => p.life > 0);
      g.particles.forEach(p => {
        const alpha = p.life / p.maxLife;
        ctx.globalAlpha = alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.life--;
      });
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    };

    const drawRings = () => {
      const g = gRef.current;
      g.rings = g.rings.filter(r => r.frame < r.maxFrames);
      g.rings.forEach(r => {
        const progress = r.frame / r.maxFrames;
        const radius = r.radius + (r.maxRadius - r.radius) * progress;
        const alpha = 1 - progress;
        ctx.strokeStyle = r.color;
        ctx.globalAlpha = alpha * 0.8;
        ctx.shadowColor = r.color;
        ctx.shadowBlur = 15;
        ctx.lineWidth = 3 * (1 - progress) + 1;
        ctx.beginPath();
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        r.frame++;
      });
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    };

    const drawWaves = () => {
      const g = gRef.current;
      g.waves = g.waves.filter(w => w.frame < w.maxFrames);
      g.waves.forEach(w => {
        const progress = w.frame / w.maxFrames;
        const alpha = (1 - progress) * 0.25;
        const waveW = CANVAS_W * progress * w.direction;
        const grad = ctx.createLinearGradient(w.x, 0, w.x + waveW, 0);
        grad.addColorStop(0, w.color + "ff");
        grad.addColorStop(1, w.color + "00");
        ctx.globalAlpha = alpha;
        ctx.fillStyle = grad;
        ctx.fillRect(Math.min(w.x, w.x + waveW), 0, Math.abs(waveW), CANVAS_H);
        w.frame++;
      });
      ctx.globalAlpha = 1;
    };

    const drawTextFlashes = () => {
      const g = gRef.current;
      g.textFlashes = g.textFlashes.filter(t => t.frame < t.maxFrames);
      g.textFlashes.forEach(t => {
        const progress = t.frame / t.maxFrames;
        const alpha = progress < 0.2 ? progress / 0.2 : 1 - (progress - 0.2) / 0.8;
        const scale = 1 + 0.3 * (1 - progress);
        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.scale(scale, scale);
        ctx.globalAlpha = alpha;
        ctx.shadowColor = t.color;
        ctx.shadowBlur = 20;
        ctx.fillStyle = t.color;
        ctx.font = "bold 22px monospace";
        ctx.textAlign = "center";
        ctx.fillText(t.text, 0, 0);
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 0;
        ctx.font = "bold 20px monospace";
        ctx.fillText(t.text, 0, 0);
        ctx.restore();
        ctx.globalAlpha = 1;
        t.frame++;
      });
    };

    const drawHUD = (ps: number, as_: number, diff: Difficulty) => {
      // Score boxes
      const drawScoreBox = (score: number, x: number, color: string) => {
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        ctx.fillStyle = color + "22";
        ctx.beginPath();
        ctx.roundRect(x - 35, 10, 70, 55, 8);
        ctx.fill();
        ctx.strokeStyle = color + "88";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 40px monospace";
        ctx.textAlign = "center";
        ctx.fillText(String(score), x, 52);
      };
      drawScoreBox(ps, CANVAS_W / 2 - 90, GOKU_COLOR);
      drawScoreBox(as_, CANVAS_W / 2 + 90, VEGETA_COLOR);

      // VS
      ctx.fillStyle = KI_COLOR + "aa";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.fillText("VS", CANVAS_W / 2, 42);

      // Difficulty badge
      const diffColors: Record<Difficulty, string> = { Beginner: "#00ff88", Rival: KI_COLOR, Legend: "#ff4444" };
      ctx.shadowColor = diffColors[diff];
      ctx.shadowBlur = 8;
      ctx.fillStyle = diffColors[diff];
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`⚡ ${diff.toUpperCase()} ⚡`, CANVAS_W / 2, CANVAS_H - 10);
      ctx.shadowBlur = 0;
    };

    const loop = () => {
      if (gameStateRef.current !== "playing") return;
      const g = gRef.current;
      const keys = keysRef.current;
      g.tick++;

      // Screen shake decay
      if (g.shakeDuration > 0) {
        g.shakeDuration--;
        g.shakeX = (Math.random() - 0.5) * g.shakeDuration * 1.5;
        g.shakeY = (Math.random() - 0.5) * g.shakeDuration * 1.5;
      } else {
        g.shakeX = 0; g.shakeY = 0;
      }

      // Player movement
      const playerSpeed = 8;
      if ((keys.has("ArrowUp") || keys.has("w") || keys.has("W")) && g.playerY > 0) g.playerY -= playerSpeed;
      if ((keys.has("ArrowDown") || keys.has("s") || keys.has("S")) && g.playerY < CANVAS_H - PADDLE_H) g.playerY += playerSpeed;

      // AI movement
      const aiTarget = g.ballY - PADDLE_H / 2;
      const aiDiff = aiTarget - g.aiY;
      const jitter = g.currentDifficulty === "Beginner" ? (Math.random() - 0.5) * 40 : 0;
      g.aiY += (aiDiff + jitter) * DIFFICULTY_REACTION[g.currentDifficulty] * 0.016;
      g.aiY = Math.max(0, Math.min(CANVAS_H - PADDLE_H, g.aiY));

      // Ball movement
      g.ballX += g.ballVX;
      g.ballY += g.ballVY;

      // Wall bounce
      if (g.ballY <= BALL_SIZE / 2) { g.ballY = BALL_SIZE / 2; g.ballVY *= -1; }
      if (g.ballY >= CANVAS_H - BALL_SIZE / 2) { g.ballY = CANVAS_H - BALL_SIZE / 2; g.ballVY *= -1; }

      // Player paddle hit
      if (
        g.ballX - BALL_SIZE / 2 <= PADDLE_W + 20 &&
        g.ballX - BALL_SIZE / 2 >= 18 &&
        g.ballY >= g.playerY - 2 &&
        g.ballY <= g.playerY + PADDLE_H + 2
      ) {
        g.ballVX = Math.abs(g.ballVX) * 1.06;
        const hitPos = (g.ballY - g.playerY) / PADDLE_H - 0.5;
        g.ballVY = hitPos * 11;
        g.rallies++;
        spawnHitEffects(PADDLE_W + 20, g.ballY, true);
      }

      // AI paddle hit
      if (
        g.ballX + BALL_SIZE / 2 >= CANVAS_W - PADDLE_W - 20 &&
        g.ballX + BALL_SIZE / 2 <= CANVAS_W - 18 &&
        g.ballY >= g.aiY - 2 &&
        g.ballY <= g.aiY + PADDLE_H + 2
      ) {
        g.ballVX = -Math.abs(g.ballVX) * 1.06;
        const hitPos = (g.ballY - g.aiY) / PADDLE_H - 0.5;
        g.ballVY = hitPos * 11;
        g.rallies++;
        spawnHitEffects(CANVAS_W - PADDLE_W - 20, g.ballY, false);
      }

      // Cap speed
      const maxSpeed = 20;
      if (Math.abs(g.ballVX) > maxSpeed) g.ballVX = maxSpeed * Math.sign(g.ballVX);
      if (Math.abs(g.ballVY) > maxSpeed) g.ballVY = maxSpeed * Math.sign(g.ballVY);

      // Scoring
      if (g.ballX < -20 && !g.scoring) {
        g.scoring = true;
        g.aiScore++;
        g.ballVX = 0; g.ballVY = 0;
        g.vegetaExcitedTick = 160;
        spawnScoreEffects(CANVAS_W * 0.75, CANVAS_H / 2, VEGETA_COLOR, "VEGETA SCORES!");
        if (g.aiScore >= WINNING_SCORE) {
          gameStateRef.current = "gameover";
          setGameState("gameover");
          setResult({ playerScore: g.playerScore, aiScore: g.aiScore, rallies: g.rallies, difficulty: g.currentDifficulty });
          return;
        }
        setTimeout(() => { resetBall(1); g.scoring = false; }, 800);
      }
      if (g.ballX > CANVAS_W + 20 && !g.scoring) {
        g.scoring = true;
        g.playerScore++;
        g.ballVX = 0; g.ballVY = 0;
        g.gokuExcitedTick = 160;
        spawnScoreEffects(CANVAS_W * 0.25, CANVAS_H / 2, GOKU_COLOR, "GOKU SCORES!");
        if (g.playerScore >= WINNING_SCORE) {
          gameStateRef.current = "gameover";
          setGameState("gameover");
          setResult({ playerScore: g.playerScore, aiScore: g.aiScore, rallies: g.rallies, difficulty: g.currentDifficulty });
          return;
        }
        setTimeout(() => { resetBall(-1); g.scoring = false; }, 800);
      }

      // === DRAW ===
      ctx.save();
      ctx.translate(g.shakeX, g.shakeY);

      // Background
      ctx.fillStyle = "#050510";
      ctx.fillRect(-10, -10, CANVAS_W + 20, CANVAS_H + 20);

      // Subtle gradient overlay
      const bgGrad = ctx.createRadialGradient(CANVAS_W / 2, CANVAS_H / 2, 50, CANVAS_W / 2, CANVAS_H / 2, 400);
      bgGrad.addColorStop(0, "rgba(10,5,30,0.3)");
      bgGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      drawStars(g.tick);
      drawDivider(g.tick);
      drawWaves();
      drawRings();
      drawParticles();
      drawPaddle(20, g.playerY, GOKU_COLOR, "GOKU", g.tick);
      drawPaddle(CANVAS_W - PADDLE_W - 20, g.aiY, VEGETA_COLOR, "VEGETA", g.tick);
      drawBall(g.ballX, g.ballY, g.tick);
      drawTextFlashes();
      drawHUD(g.playerScore, g.aiScore, g.currentDifficulty);

      if (g.gokuExcitedTick > 0) g.gokuExcitedTick--;
      if (g.vegetaExcitedTick > 0) g.vegetaExcitedTick--;

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(loop);
    };

    if (gameState === "playing") {
      animFrameRef.current = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [gameState, spawnHitEffects, spawnScoreEffects, resetBall]);

  const handleShare = () => {
    if (!result) return;
    const won = result.playerScore > result.aiScore;
    const text = `🔥 Dragon Pong Z\n${won ? "I defeated Vegeta" : "Vegeta destroyed me"} ${result.playerScore}–${result.aiScore} on ${result.difficulty} mode! (${result.rallies} rallies)\nThink you can do better? →`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleCanvasTouch = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const y = (touch.clientY - rect.top) * (CANVAS_H / rect.height);
    gRef.current.playerY = Math.max(0, Math.min(CANVAS_H - PADDLE_H, y - PADDLE_H / 2));
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center select-none overflow-hidden"
      style={{ background: "radial-gradient(ellipse at center, #0d0520 0%, #050510 60%, #000005 100%)" }}>

      {/* Portrait orientation overlay — shown on mobile portrait only */}
      {isPortrait && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6"
          style={{ background: "radial-gradient(ellipse at center, #0d0520 0%, #050510 80%, #000005 100%)" }}>
          <div className="rotate-hint text-7xl">📱</div>
          <div className="text-center">
            <div className="text-2xl font-black tracking-widest font-mono"
              style={{ color: "#ffee00", textShadow: "0 0 20px #ffee00" }}>
              ROTATE DEVICE
            </div>
            <div className="text-white/40 text-sm mt-2 tracking-wider">
              Landscape mode required to play
            </div>
          </div>
        </div>
      )}

      {/* GIF background on landing */}
      {gameState === "landing" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/hero.gif" alt="" aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ opacity: 0.18, filter: "blur(1px) saturate(1.4)" }} />
      )}

      {/* Dark overlay to keep text readable */}
      {gameState === "landing" && (
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, #0d052088 0%, #050510cc 70%, #000005ee 100%)" }} />
      )}

      {/* Stars background on landing */}
      {gameState === "landing" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 60 }).map((_, i) => {
            const a = ((i * 2654435761) >>> 0) / 4294967296;
            const b = ((i * 2246822519) >>> 0) / 4294967296;
            const c = ((i * 3266489917) >>> 0) / 4294967296;
            const d = ((i * 668265263) >>> 0) / 4294967296;
            return (
              <div key={i} className="absolute rounded-full bg-white"
                style={{
                  left: `${a * 100}%`,
                  top: `${b * 100}%`,
                  width: `${c * 2 + 1}px`,
                  height: `${c * 2 + 1}px`,
                  opacity: d * 0.6 + 0.2,
                }} />
            );
          })}
        </div>
      )}

      {gameState === "landing" && (
        <div className={`flex ${isMobileLandscape ? "flex-row gap-6 items-center px-8 w-full max-w-3xl" : "flex-col gap-8 items-center px-4"} text-white z-10`}>
          {/* Title block */}
          <div className={`text-center ${isMobileLandscape ? "flex-shrink-0" : ""}`}>
            {!isMobileLandscape && (
              <div className="text-xs tracking-[0.4em] text-yellow-400/60 uppercase mb-3">⚡ Classic Arcade Reborn ⚡</div>
            )}
            <div className={`${isMobileLandscape ? "text-4xl" : "text-6xl"} font-black tracking-widest font-mono mb-1`}
              style={{ textShadow: "0 0 30px #ffee00, 0 0 60px #ff8800aa", color: "#ffee00" }}>
              DRAGON
            </div>
            <div className={`${isMobileLandscape ? "text-4xl" : "text-6xl"} font-black tracking-widest font-mono`}
              style={{ textShadow: "0 0 30px #00aaff, 0 0 60px #0044ffaa", color: "#ffffff" }}>
              PONG Z
            </div>
            <div className={`text-white/30 text-xs tracking-widest uppercase ${isMobileLandscape ? "mt-2" : "mt-3"}`}>
              Goku vs Vegeta · First to {WINNING_SCORE} wins
            </div>
          </div>

          {/* Controls block */}
          <div className={`flex flex-col items-center ${isMobileLandscape ? "gap-2" : "gap-3"} w-full max-w-xs`}>
            <div className="text-yellow-400/50 text-xs tracking-[0.3em] uppercase mb-1">⚡ Select Power Level ⚡</div>
            {(["Beginner", "Rival", "Legend"] as Difficulty[]).map((d) => {
              const cfg = {
                Beginner: { color: "#00ff88", border: "border-green-400", label: "Over 1,000 — A warm-up", glow: "0 0 15px #00ff8844" },
                Rival: { color: "#ffee00", border: "border-yellow-400", label: "Over 9,000 — A real fight", glow: "0 0 15px #ffee0044" },
                Legend: { color: "#ff4444", border: "border-red-500", label: "MAXIMUM POWER — No mercy", glow: "0 0 15px #ff444444" },
              }[d];
              return (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`w-full ${isMobileLandscape ? "py-1.5" : "py-3"} px-5 rounded-xl border-2 text-left transition-all ${cfg.border} ${difficulty === d ? "bg-white/10" : "border-opacity-20 bg-transparent"}`}
                  style={{ boxShadow: difficulty === d ? cfg.glow : "none" }}>
                  <div className="font-bold tracking-wider text-sm" style={{ color: cfg.color }}>{d.toUpperCase()}</div>
                  <div className="text-white/35 text-xs">{cfg.label}</div>
                </button>
              );
            })}

            <button onClick={() => startGame(difficulty)}
              className={`w-full ${isMobileLandscape ? "py-2 mt-1" : "mt-1 py-4"} px-12 font-black tracking-widest rounded-2xl ${isMobileLandscape ? "text-base" : "text-lg"} active:scale-95 transition-all text-black`}
              style={{ background: "linear-gradient(135deg, #ffee00, #ff8800)", boxShadow: "0 0 30px #ffee0066, 0 0 60px #ff880033" }}>
              FIGHT!
            </button>
            {!isMobileLandscape && (
              <div className="text-white/20 text-xs text-center">↑↓ or W/S to move your paddle</div>
            )}
            {isMobileLandscape && (
              <div className="text-white/40 text-xs text-center mt-1">
                Built by{" "}
                <a href="https://helmut-fritz.vercel.app" target="_blank" rel="noopener noreferrer"
                  className="text-yellow-400/60 underline underline-offset-2">
                  Helmut Fritz
                </a>
                {" "}using AI tools · 2026
              </div>
            )}
          </div>
        </div>
      )}

      {gameState === "playing" && (
        <div style={{
          width: CANVAS_W * scale,
          height: (CANVAS_H + SPECTATOR_H) * scale,
          position: "relative",
          flexShrink: 0,
        }}>
          <div style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            position: "absolute",
            top: 0,
            left: 0,
          }} className="flex flex-col items-center gap-0">
            <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H}
              className="rounded-t-xl"
              style={{ border: "1px solid rgba(255,238,0,0.15)", borderBottom: "none" }}
              onTouchMove={handleCanvasTouch} />
            {/* Spectator zone */}
            <div className="flex justify-between items-end px-2 py-1"
              style={{ width: CANVAS_W, background: "rgba(255,238,0,0.03)",
                border: "1px solid rgba(255,238,0,0.15)", borderTop: "1px solid rgba(255,238,0,0.08)",
                borderRadius: "0 0 12px 12px" }}>
              <div className="flex items-end gap-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img ref={chiChiImgRef} src="/Chi chi.png" alt="Chi-Chi" width={72} height={72} style={{ transition: "filter 0.2s" }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img ref={gotenImgRef} src="/Gotten.png" alt="Goten" width={60} height={60} style={{ transition: "filter 0.2s" }} />
              </div>
              <div className="text-white/20 text-xs tracking-wider self-center">↑↓ or W/S to move</div>
              <div className="flex items-end gap-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img ref={trunksImgRef} src="/Trunks.png" alt="Trunks" width={60} height={60} style={{ transition: "filter 0.2s" }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img ref={bulmaImgRef} src="/Bulma.png" alt="Bulma" width={72} height={72} style={{ transition: "filter 0.2s" }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState === "gameover" && result && (() => {
        const won = result.playerScore > result.aiScore;
        return (
          <div className="flex flex-col items-center gap-6 text-white px-4 text-center z-10">
            <div className="text-5xl font-black tracking-wider font-mono"
              style={{ textShadow: won ? "0 0 30px #ffee00" : "0 0 30px #aa00ff", color: won ? "#ffee00" : "#cc88ff" }}>
              {won ? "VICTORY! 🏆" : "DEFEATED... 💀"}
            </div>
            <div className="text-white/40 text-sm">{won ? "You defeated Vegeta!" : "Vegeta is too strong..."}</div>

            <div className="flex gap-10 items-center">
              <div className="text-center">
                <div className="text-5xl font-black font-mono" style={{ color: GOKU_COLOR, textShadow: `0 0 20px ${GOKU_COLOR}` }}>{result.playerScore}</div>
                <div className="text-white/40 text-xs tracking-widest uppercase mt-2">GOKU (YOU)</div>
              </div>
              <div className="text-yellow-400/40 text-3xl font-mono">vs</div>
              <div className="text-center">
                <div className="text-5xl font-black font-mono" style={{ color: VEGETA_COLOR, textShadow: `0 0 20px ${VEGETA_COLOR}` }}>{result.aiScore}</div>
                <div className="text-white/40 text-xs tracking-widest uppercase mt-2">VEGETA (AI)</div>
              </div>
            </div>

            <div className="text-white/30 text-sm">{result.rallies} ki exchanges · {result.difficulty} mode</div>

            <div className="flex gap-3 mt-2 flex-wrap justify-center">
              <button onClick={() => startGame(difficulty)}
                className="px-6 py-3 font-black rounded-xl text-sm tracking-wider text-black active:scale-95 transition-all"
                style={{ background: "linear-gradient(135deg, #ffee00, #ff8800)", boxShadow: "0 0 20px #ffee0066" }}>
                REMATCH!
              </button>
              <button onClick={handleShare}
                className="px-6 py-3 border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 active:scale-95 transition-all text-sm tracking-wider">
                {copied ? "COPIED ✓" : "SHARE RESULT"}
              </button>
              <button onClick={() => { gameStateRef.current = "landing"; setGameState("landing"); }}
                className="px-6 py-3 border border-white/10 text-white/40 font-bold rounded-xl hover:bg-white/5 active:scale-95 transition-all text-sm tracking-wider">
                MENU
              </button>
            </div>
          </div>
        );
      })()}

      {!isMobileLandscape && (
        <div className="absolute bottom-4 text-white/50 text-xs">
          Built by{" "}
          <a href="https://helmut-fritz.vercel.app" target="_blank" rel="noopener noreferrer"
            className="text-yellow-400/70 hover:text-yellow-400 transition-colors underline underline-offset-2">
            Helmut Fritz
          </a>
          {" "}using AI tools · 2026
        </div>
      )}
    </div>
  );
}
