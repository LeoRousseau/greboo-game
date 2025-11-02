import type { Engine } from "../engine/Engine";
import { TrapEntity } from "./TrapEntity";
import type { TrapPosition } from "./TrapPosition";

export function generateTrapsFromTileData(pos: TrapPosition[], engine: Engine) {
  pos.forEach((p) => {
    new TrapEntity(p, engine);
  });
}
