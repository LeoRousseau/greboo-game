import { Bodies, World } from "matter-js";
import type { Engine } from "../engine/Engine";
import type { IPoint } from "../types/IPoint";

export class TrapEntity {
  body: Matter.Body;
  constructor(
    readonly pos: IPoint,
    readonly engine: Engine
  ) {
    this.body = Bodies.rectangle(pos.x, pos.y, 56, 8, {
      isSensor: true,
      isStatic: true,
      label: "trap",
    });

    World.add(this.engine.physicsWorld, this.body);
  }
}
