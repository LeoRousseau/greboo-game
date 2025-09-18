import type { TiledMap, TiledTileLayer } from "../../tile/Tiled";
import type { Rect } from "./Rect";

export function generateCollisionTiles(collisionLayer: TiledTileLayer, map: TiledMap): Rect[] {
  const { width, height, data } = collisionLayer;
  const { tilewidth, tileheight } = map;
  const result: Rect[] = [];

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const gid = data[row * width + col];
      if (gid === 0) continue;

      const neighbors = [
        row > 0 ? data[(row - 1) * width + col] : 0, // up
        row < height - 1 ? data[(row + 1) * width + col] : 0, // down
        col > 0 ? data[row * width + (col - 1)] : 0, // left
        col < width - 1 ? data[row * width + (col + 1)] : 0, // right
      ];

      const surrounded = neighbors.every((n) => n && n !== 0);
      if (surrounded) continue;

      result.push({
        x: col * tilewidth,
        y: row * tileheight,
        w: tilewidth,
        h: tileheight,
      });
    }
  }
  return result;
}
