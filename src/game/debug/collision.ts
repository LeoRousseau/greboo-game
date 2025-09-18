import { Container, Graphics, type ColorSource } from "pixi.js";
import type { Shape, Triangle } from "../tile/collision/Shape";

export function drawCollisionDebug(parent: Container, colliders: Shape[], color: ColorSource = "red"): Graphics {
  const g = new Graphics();
  g.lineStyle(1, color, 1);
  g.beginFill(color, 0.25);

  for (const c of colliders) {
    if ("orientation" in c) {
      console.log("triangle");
      drawTriangle(g, c as Triangle);
    } else {
      g.drawRect(c.x, c.y, c.w, c.h);
    }
  }

  g.endFill();
  parent.addChild(g);
  return g;
}

function drawTriangle(g: Graphics, tri: Triangle) {
  const { x, y, w, h, orientation } = tri;
  if (orientation === "tl") {
    g.moveTo(x, y);
    g.lineTo(x + w, y);
    g.lineTo(x, y + h);
  } else if (orientation === "tr") {
    g.moveTo(x, y);
    g.lineTo(x + w, y);
    g.lineTo(x + w, y + h);
  } else if (orientation === "bl") {
    g.moveTo(x, y + h);
    g.lineTo(x, y);
    g.lineTo(x + w, y + h);
  } else if (orientation === "br") {
    g.moveTo(x + w, y + h);
    g.lineTo(x + w, y);
    g.lineTo(x, y + h);
  }
  g.closePath();
}
