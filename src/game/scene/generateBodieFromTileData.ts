import Matter from "matter-js";
import type { Shape } from "../tile/collision/Shape";
import type { Engine } from "../engine/Engine";

export function generateBodiesFromTileData(collisions: Shape[], engine: Engine) {
  collisions.forEach((col) => {
    if ("orientation" in col) {
      const { x, y, w, h, orientation } = col;
      let cx = x + w / 2;
      let cy = y + h / 2;

      let vertices;
      switch (orientation) {
        case "tl":
          vertices = [
            { x: -w / 2, y: -h / 2 }, // top-left
            { x: w / 2, y: -h / 2 }, // top-right
            { x: -w / 2, y: h / 2 }, // bottom-left
          ];
          break;
        case "tr":
          vertices = [
            { x: -w / 2, y: -h / 2 }, // top-left
            { x: w / 2, y: -h / 2 }, // top-right
            { x: w / 2, y: h / 2 }, // bottom-right
          ];
          break;
        case "bl":
          vertices = [
            { x: -w / 2, y: h / 2 }, // bottom-left
            { x: -w / 2, y: -h / 2 }, // top-left
            { x: w / 2, y: h / 2 }, // bottom-right
          ];
          break;
        case "br":
          vertices = [
            { x: w / 2, y: h / 2 }, // bottom-right
            { x: w / 2, y: -h / 2 }, // top-right
            { x: -w / 2, y: h / 2 }, // bottom-left
          ];
          break;
      }

      const body = Matter.Bodies.fromVertices(
        cx,
        cy,
        [vertices!],
        {
          isStatic: true,
          friction: 0.01,
        },
        true
      );

      Matter.World.add(engine.physicsWorld, body);

      // Fix triangle offset due to center of mass
      const dx = x + w / 2 - (body.bounds.min.x + (body.bounds.max.x - body.bounds.min.x) / 2);
      const dy = y + h / 2 - (body.bounds.min.y + (body.bounds.max.y - body.bounds.min.y) / 2);
      Matter.Body.translate(body, { x: dx, y: dy });
    } else {
      const body = Matter.Bodies.rectangle(col.x + col.w / 2, col.y + col.h / 2, col.w, col.h, {
        isStatic: true,
        friction: 0.01,
      });
      Matter.World.add(engine.physicsWorld, body);
    }
  });
}
