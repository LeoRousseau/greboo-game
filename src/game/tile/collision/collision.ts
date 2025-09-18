import type { Player } from "../../player/player";
import type { TCollisionRect } from "./TCollisionRect";

export function intersects(a: TCollisionRect, b: TCollisionRect): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function checkPlayerCollisions(player: Player, colliders: TCollisionRect[]): TCollisionRect[] {
  return colliders.filter((c) => intersects(player.bbox, c));
}
