import {
  FLIPPED_DIAGONALLY_FLAG,
  FLIPPED_HORIZONTALLY_FLAG,
  FLIPPED_VERTICALLY_FLAG,
  getCustomProperty,
  getTileIndexFromRawGID,
  type TiledMap,
  type TiledTileLayer,
  type TiledTileset,
} from "../../tile/Tiled";
import { customCollisions } from "./customCollisions";
import type { Shape } from "./Shape";

export function generateCollisionTiles(collisionLayer: TiledTileLayer, map: TiledMap, tileSet: TiledTileset): Shape[] {
  const { width, height, data } = collisionLayer;
  const { tilewidth, tileheight } = map;
  const result: Shape[] = [];

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const rawGid = data[row * width + col];
      if (rawGid === 0) continue;

      const neighbors = [
        row > 0 ? data[(row - 1) * width + col] : 0, // up
        row < height - 1 ? data[(row + 1) * width + col] : 0, // down
        col > 0 ? data[row * width + (col - 1)] : 0, // left
        col < width - 1 ? data[row * width + (col + 1)] : 0, // right
      ];

      const surrounded = neighbors.every((n) => n && n !== 0);
      if (surrounded) continue;

      const tileId = getTileIndexFromRawGID(rawGid, map.tilesets[0].firstgid);
      const tile = tileSet.tiles.find((t) => t.id === tileId);
      const isTriangle = tile && getCustomProperty<Boolean>(tile, "isTriangle");
      const customCollisionID = tile && getCustomProperty<number>(tile, "customCollisionID");

      if (customCollisionID !== undefined) {
        const c = customCollisions[customCollisionID]; // custom collisions are rectangle and can't be oriented
        result.push({
          x: col * tilewidth + c.x,
          y: row * tileheight + c.y,
          w: c.w,
          h: c.h,
        });
      } else if (isTriangle) {
        const flippedH = (rawGid & FLIPPED_HORIZONTALLY_FLAG) !== 0;
        const flippedV = (rawGid & FLIPPED_VERTICALLY_FLAG) !== 0;
        const flippedD = (rawGid & FLIPPED_DIAGONALLY_FLAG) !== 0;

        result.push({
          x: col * tilewidth,
          y: row * tileheight,
          w: tilewidth,
          h: tileheight,
          orientation: getTriangleOrientation(flippedH, flippedV, flippedD),
        });
      } else {
        result.push({
          x: col * tilewidth,
          y: row * tileheight,
          w: tilewidth,
          h: tileheight,
        });
      }
    }
  }
  return result;
}

function getTriangleOrientation(flippedH: boolean, flippedV: boolean, flippedD: boolean): "tl" | "tr" | "bl" | "br" {
  // mask H V D -> 4 2 1
  const mask = (flippedH ? 4 : 0) | (flippedV ? 2 : 0) | (flippedD ? 1 : 0);

  switch (mask) {
    case 0: // ---
      // rot 0
      return "br";

    case 4: // H--
      // flip X
      return "bl";

    case 2: // -V-
      // flip Y
      return "tr";

    case 1: // --D
      return "tl";

    case 6: // HV-
      return "tl";

    case 5: // H-D
      return "bl";

    case 3: // -VD
      return "tr";

    case 7: // HVD
      return "br";
  }

  return "br";
}
