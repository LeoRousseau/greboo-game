import type { Engine } from "../engine/Engine";
import type { IPoint } from "../types/IPoint";
import { TrapEntity } from "./TrapEntity";

export function generateTrapsFromTileData(pos: IPoint[], engine: Engine) {
  pos.forEach((p) => {
    new TrapEntity(p, engine);
  });
}
