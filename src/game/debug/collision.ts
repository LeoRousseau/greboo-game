import { Container, Graphics, type ColorSource } from "pixi.js";
import type { Rect } from "../tile/collision/Rect";

export function drawCollisionDebug(parent: Container, colliders: Rect[], color: ColorSource = "red"): Graphics {
  const g = new Graphics();
  g.lineStyle(1, color, 1);
  g.beginFill(color, 0.25);

  for (const c of colliders) {
    g.drawRect(c.x, c.y, c.w, c.h);
  }

  g.endFill();
  parent.addChild(g);
  return g;
}
