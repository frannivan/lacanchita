import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-interactive-ball',
    standalone: true,
    imports: [CommonModule],
    template: `
    <canvas #canvas class="absolute inset-0 w-full h-full pointer-events-auto" [style.cursor]="gameOver ? 'default' : 'none'" style="z-index: 0;"></canvas>
    <div class="absolute top-4 right-4 z-10 font-bold text-white text-xl drop-shadow-md select-none pointer-events-none">
      Dominadas: {{ score }}
    </div>
    <div *ngIf="gameOver" class="absolute top-0 right-0 w-[40%] h-full z-50 flex flex-col items-center justify-center text-white animate-fade-in backdrop-blur-sm">
        <h2 class="text-2xl font-bold mb-2">¡Se cayó el balón!</h2>
        <p class="text-lg mb-6">Puntaje: {{ score }}</p>
        <button (click)="resetGame()" class="px-5 py-2 text-sm bg-green-600 hover:bg-green-500 rounded-full font-bold transition-all transform hover:scale-105 cursor-pointer">
            Intentar de Nuevo ⚽
        </button>
    </div>
  `,
    styles: [`
    :host {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  `]
})
export class InteractiveBallComponent implements AfterViewInit, OnDestroy {
    @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

    private ctx!: CanvasRenderingContext2D;
    private animationId: number = 0;

    // Game State
    score: number = 0;
    gameOver: boolean = false;

    // Physics
    private ball = {
        x: 0,
        y: 0,
        radius: 20, // Smaller ball
        vx: 0,
        vy: 0,
        gravity: 0.8, // Faster gravity (was 0.5)
        friction: 0.99,
        bounce: 0.8
    };

    private mouse = { x: -1000, y: -1000 };
    private canvasWidth: number = 0;
    private canvasHeight: number = 0;

    // Logic Cooldowns
    private lastKickTime: number = 0;
    private canKick: boolean = true;

    // Shoe asset (emoji)
    private shoeEmoji = '👟'; // Running Shoe as placeholder for Cleat

    constructor(private ngZone: NgZone) { }

    ngAfterViewInit() {
        this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
        this.ctx.font = '50px serif'; // Preset font for emoji
        this.resize();
        this.resetGame();

        // Run outside Angular/Zone to avoid change detection on every frame
        this.ngZone.runOutsideAngular(() => {
            this.animate();
        });
    }

    ngOnDestroy() {
        cancelAnimationFrame(this.animationId);
    }

    @HostListener('window:resize')
    resize() {
        this.canvasWidth = window.innerWidth;
        this.canvasHeight = window.innerHeight;
        this.canvasRef.nativeElement.width = this.canvasWidth;
        this.canvasRef.nativeElement.height = this.canvasHeight;
    }

    @HostListener('window:mousemove', ['$event'])
    onMouseMove(e: MouseEvent) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;

        // Interaction: Kick the ball if mouse hits it
        this.checkPaddleCollision();
    }

    resetGame() {
        this.resize(); // Ensure dimensions are fresh
        this.gameOver = false;
        this.score = 0;
        this.canKick = true;
        this.lastKickTime = 0; // Reset cool down

        // Spawn on the Right Side safe zone
        if (this.canvasWidth > 0) {
            const playAreaStart = this.canvasWidth * 0.5; // Start a bit more to the right
            this.ball.x = playAreaStart + (this.canvasWidth - playAreaStart) / 2;
            this.ball.y = this.canvasHeight / 4; // Reset to top quarter
            this.ball.vx = (Math.random() - 0.5) * 6; // Gentler horizontal start
            this.ball.vy = 0; // Stationary start
        }

        // Ensure change detection updates the view (removes *ngIf overlay)
        this.ngZone.run(() => { });
    }

    checkPaddleCollision() {
        if (this.gameOver) return;

        // Debounce: prevent multi-hits in same millisecond frame sequence
        const now = Date.now();
        if (now - this.lastKickTime < 300) return; // 300ms cooldown

        const dx = this.ball.x - this.mouse.x;
        const dy = this.ball.y - this.mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If mouse (Shoe Center) is close to ball (kick radius)
        if (distance < this.ball.radius + 40) { // Reduced tracking rad since ball/shoe smaller
            // Kick logic
            const angle = Math.atan2(dy, dx);
            const force = 25; // Stronger kick (was 18)

            // Add velocity away from mouse - MORE HORIZONTAL
            this.ball.vx += Math.cos(angle) * 8; // Was 2. Now much more sensitive to side hits.
            this.ball.vy = -Math.abs(Math.sin(angle) * force) - 5; // Always kick UP

            this.score++;
            this.lastKickTime = now;

            // Trigger CD to update score
            this.ngZone.run(() => { });
        }
    }

    animate() {
        // Clear Screen ALWAYS first
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        if (this.gameOver) {
            this.animationId = requestAnimationFrame(() => this.animate());
            // DO NOT draw shoe here. Let system cursor take over via CSS.
            return;
        }

        // Physics
        this.ball.vy += this.ball.gravity;
        this.ball.vx *= this.ball.friction;
        this.ball.vy *= this.ball.friction;

        this.ball.x += this.ball.vx;
        this.ball.y += this.ball.vy;

        // Floor Collision (Game Over - Instant)
        if (this.ball.y + this.ball.radius > this.canvasHeight) {
            this.ball.y = this.canvasHeight - this.ball.radius;
            this.gameOver = true;
            this.ngZone.run(() => { }); // Update UI
        }

        // Wall Collisions
        // Right Wall
        if (this.ball.x + this.ball.radius > this.canvasWidth) {
            this.ball.x = this.canvasWidth - this.ball.radius;
            this.ball.vx *= -this.ball.bounce;
        }

        // Left Wall (Dynamic Constraint: 40% of screen width)
        const leftBoundary = this.canvasWidth * 0.4;
        if (this.ball.x - this.ball.radius < leftBoundary) {
            this.ball.x = leftBoundary + this.ball.radius;
            this.ball.vx *= -this.ball.bounce;
        }

        // Draw Elements
        this.drawSoccerBall(this.ball.x, this.ball.y, this.ball.radius, this.ball.x * 0.1);
        this.drawShoe(this.mouse.x, this.mouse.y);

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    drawShoe(x: number, y: number) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(-Math.PI / 4); // 45 degree tilt for kicking pose

        // Scale factor
        const s = 1.2; // Smaller shoe

        // Main Shoe Body (Black)
        this.ctx.beginPath();
        // Heel
        this.ctx.moveTo(-20 * s, 10 * s);
        this.ctx.quadraticCurveTo(-25 * s, 10 * s, -25 * s, -5 * s); // Heel back
        this.ctx.lineTo(-20 * s, -15 * s); // Ankle up
        this.ctx.lineTo(10 * s, -10 * s); // Laces area
        this.ctx.quadraticCurveTo(30 * s, -5 * s, 35 * s, 5 * s); // Toe tip top
        this.ctx.quadraticCurveTo(35 * s, 12 * s, 25 * s, 12 * s); // Toe tip bottom
        this.ctx.lineTo(-20 * s, 12 * s); // Sole line
        this.ctx.closePath();

        this.ctx.fillStyle = '#111827'; // Jet Black
        this.ctx.fill();
        this.ctx.strokeStyle = '#374151'; // Dark Grey for outline
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        // Stripes (White - Adidas style)
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(-10 * s, -10 * s); this.ctx.lineTo(-5 * s, 5 * s);
        this.ctx.moveTo(-2 * s, -8 * s); this.ctx.lineTo(3 * s, 6 * s);
        this.ctx.moveTo(6 * s, -6 * s); this.ctx.lineTo(11 * s, 7 * s);
        this.ctx.stroke();

        // Cleats (Tachones) - Little spikes on sole
        this.ctx.fillStyle = '#ffffff'; // Metal/White cleats
        const cleatY = 12 * s;
        // Heel Cleats
        this.drawCleat(-22 * s, cleatY, s);
        this.drawCleat(-15 * s, cleatY, s);
        // Front Cleats
        this.drawCleat(5 * s, cleatY, s);
        this.drawCleat(15 * s, cleatY, s);
        this.drawCleat(25 * s, cleatY - 2 * s, s); // Toe cleat slightly higher

        this.ctx.restore();
    }

    drawCleat(x: number, y: number, s: number) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + 2 * s, y + 5 * s); // Spike tip
        this.ctx.lineTo(x + 4 * s, y);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawSoccerBall(x: number, y: number, r: number, rotation: number) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);

        // Base White
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fill();
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Pentagons (Simplified pattern)
        this.ctx.fillStyle = '#000000';

        // Center Pentagon
        this.drawPentagon(0, 0, r / 2.5);

        // Surrounding Pentagons (clipped)
        for (let i = 0; i < 5; i++) {
            this.ctx.save();
            this.ctx.rotate((Math.PI * 2 / 5) * i);
            this.ctx.translate(0, -r * 0.9);
            this.drawPentagon(0, 0, r / 2.5);
            this.ctx.restore();
        }

        this.ctx.restore();
    }

    drawPentagon(x: number, y: number, size: number) {
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
            const px = x + Math.cos(angle) * size;
            const py = y + Math.sin(angle) * size;
            if (i === 0) this.ctx.moveTo(px, py);
            else this.ctx.lineTo(px, py);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
}
