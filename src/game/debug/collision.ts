import { Container, Graphics, type ColorSource } from "pixi.js";
import type { Shape, Triangle } from "../tile/collision/Shape";
import Matter from "matter-js";

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

export function drawPhysicsCollisionDebug(
  parent: Container,
  world: Matter.World,
  color: ColorSource = "green"
): Graphics {
  const g = new Graphics();
  g.lineStyle(1, color, 1);
  g.beginFill(color, 0.25);

  drawMatterBodies(g, world);
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

function drawMatterBodies(g: Graphics, world: Matter.World) {
  g.clear();
  g.lineStyle(1, 0x00ff00, 1);

  const bodies: Matter.Body[] = Matter.Composite.allBodies(world);

  for (const body of bodies) {
    for (const part of body.parts) {
      if (part === body && body.parts.length > 1) continue; // éviter les doublons

      g.moveTo(part.vertices[0].x, part.vertices[0].y);

      for (let j = 1; j < part.vertices.length; j++) {
        g.lineTo(part.vertices[j].x, part.vertices[j].y);
      }

      g.lineTo(part.vertices[0].x, part.vertices[0].y); // fermer le polygone
    }
  }
}
