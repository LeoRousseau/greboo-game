import type { Container } from "pixi.js";
import type { Shape } from "../collision/Shape";
import type { IPoint } from "../../types/IPoint";

export type TiledMapData = {
  layers: Container[];
  collisions: Shape[];
  traps: IPoint[];
  enemies: [IPoint, IPoint][];
  pinecones: IPoint[];
  projectiles: IPoint[];
};
