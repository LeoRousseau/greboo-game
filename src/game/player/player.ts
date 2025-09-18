import { Graphics, Container } from "pixi.js";
import type { Rect, Shape, Triangle } from "../tile/collision/Shape";

export class Player {
  public sprite: Graphics;
  public x = 100;
  public y = 0;
  public vx = 0;
  public vy = 0;

  private halfW = 15;
  private halfH = 30;

  private gravity = 0.4;
  private maxFall = 10;
  private speed = 5;
  private accel = 1.2;
  private airAccel = 0.6;
  private friction = 0.85;
  private jumpStrength = -13;

  private onGround = false;

  private jumpBufferFrames = 6;
  private coyoteFrames = 6;
  private jumpBuffer = 0;
  private coyote = 0;

  constructor() {
    this.sprite = new Graphics();
    this.sprite.beginFill(0xff0000);
    this.sprite.drawEllipse(0, 0, this.halfW, this.halfH);
    this.sprite.endFill();
  }

  addTo(container: Container, index = 0) {
    container.addChildAt(this.sprite, index);
    this.updateSprite();
  }

  setAt(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.updateSprite();
  }

  private updateSprite() {
    this.sprite.x = this.x;
    this.sprite.y = this.y;
  }

  private getAABB() {
    return {
      left: this.x - this.halfW,
      right: this.x + this.halfW,
      top: this.y - this.halfH,
      bottom: this.y + this.halfH,
    };
  }

  private intersects(tile: Shape) {
    if ("orientation" in tile) {
      const rect = this.getAABB();
      const tri = tile as Triangle;

      const pointInTriangle = (px: number, py: number) => {
        const x0 = tri.x,
          y0 = tri.y,
          x1 = tri.x + tri.w,
          y1 = tri.y + tri.h;
        switch (tri.orientation) {
          case "tl":
            return px >= x0 && px <= x1 && py >= y0 && py <= y1 && px - x0 + (py - y0) <= tri.w;
          case "tr":
            return px >= x0 && px <= x1 && py >= y0 && py <= y1 && x1 - px + (py - y0) <= tri.w;
          case "bl":
            return px >= x0 && px <= x1 && py >= y0 && py <= y1 && px - x0 + (y1 - py) <= tri.w;
          case "br":
            return px >= x0 && px <= x1 && py >= y0 && py <= y1 && x1 - px + (y1 - py) <= tri.w;
        }
        return false;
      };

      const rectPoints = [
        { x: rect.left, y: rect.top },
        { x: rect.right, y: rect.top },
        { x: rect.left, y: rect.bottom },
        { x: rect.right, y: rect.bottom },
      ];
      if (rectPoints.some((p) => pointInTriangle(p.x, p.y))) return true;

      const triPoints = [
        { x: tri.x, y: tri.y },
        { x: tri.x + tri.w, y: tri.y },
        { x: tri.x, y: tri.y + tri.h },
        { x: tri.x + tri.w, y: tri.y + tri.h },
      ];
      if (triPoints.some((p) => p.x >= rect.left && p.x <= rect.right && p.y >= rect.top && p.y <= rect.bottom))
        return true;

      return false;
    } else {
      const a = this.getAABB();
      const b = { left: tile.x, right: tile.x + tile.w, top: tile.y, bottom: tile.y + tile.h };
      return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
    }
  }

  update(input: { left: boolean; right: boolean; jump: boolean }, tiles: Shape[]) {
    if (input.jump) this.jumpBuffer = this.jumpBufferFrames;
    else if (this.jumpBuffer > 0) this.jumpBuffer--;

    if (this.onGround) this.coyote = this.coyoteFrames;
    else if (this.coyote > 0) this.coyote--;

    // -- Mouvement horizontal
    const want = (input.left ? -1 : 0) + (input.right ? 1 : 0);
    const targetVx = want * this.speed;
    const a = this.onGround ? this.accel : this.airAccel;

    if (want !== 0) {
      if (this.vx < targetVx) this.vx = Math.min(targetVx, this.vx + a);
      if (this.vx > targetVx) this.vx = Math.max(targetVx, this.vx - a);
    } else if (this.onGround) {
      this.vx *= this.friction;
      if (Math.abs(this.vx) < 0.05) this.vx = 0;
    }

    // -- Gravité + jump variable
    const extraGravity = this.vy < 0 && !input.jump ? 0.6 : 0;
    this.vy += this.gravity + extraGravity;
    if (this.vy > this.maxFall) this.vy = this.maxFall;

    // === HORIZONTAL ===
    this.x += this.vx;
    for (const t of tiles) {
      if (!this.intersects(t)) continue;

      if ("orientation" in t) {
        // Ignorer horizontal pour triangles (optionnel)
      } else {
        if (this.vx > 0) this.x = t.x - this.halfW;
        else if (this.vx < 0) this.x = t.x + t.w + this.halfW;
        this.vx = 0;
      }
    }

    // === VERTICAL ===
    this.onGround = false;
    this.y += this.vy;
    for (const t of tiles) {
      if (!this.intersects(t)) continue;

      if ("orientation" in t) {
        const tri = t as Triangle;
        if (this.vy > 0) {
          // chute
          const relX = this.x - tri.x;
          let triYAtX = tri.y;
          switch (tri.orientation) {
            case "tr": // top-left dans ton inversion
              triYAtX = tri.y + relX;
              break;
            case "tl": // top-right
              triYAtX = tri.y + (tri.w - relX);
              break;
            case "br": // bottom-left
              triYAtX = tri.y + tri.h - relX;
              break;
            case "bl": // bottom-right
              triYAtX = tri.y + tri.h - (tri.w - relX);
              break;
          }
          const topOfTriangle = triYAtX - this.halfH;
          if (this.y > topOfTriangle) {
            this.y = topOfTriangle;
            this.vy = 0;
            this.onGround = true;
          }
        }
      } else {
        if (this.vy > 0) {
          this.y = t.y - this.halfH;
          this.vy = 0;
          this.onGround = true;
        } else if (this.vy < 0) {
          this.y = t.y + t.h + this.halfH;
          this.vy = 0;
        }
      }
    }

    // === SAUT ===
    if (this.jumpBuffer > 0 && (this.onGround || this.coyote > 0)) {
      this.vy = this.jumpStrength;
      this.onGround = false;
      this.coyote = 0;
      this.jumpBuffer = 0;
    }

    this.updateSprite();
  }
}
