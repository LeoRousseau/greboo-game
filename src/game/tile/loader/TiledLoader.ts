import { Assets, Container, Rectangle, Sprite, Texture } from "pixi.js";
import {
  FLIPPED_DIAGONALLY_FLAG,
  FLIPPED_HORIZONTALLY_FLAG,
  FLIPPED_VERTICALLY_FLAG,
  getCustomProperty,
  getTileIndexFromRawGID,
  type TiledMap,
  type TiledTileLayer,
  type TiledTileset,
} from "../Tiled";
import type { Shape } from "../collision/Shape";
import { generateCollisionTiles } from "../collision/generateCollisionTiles";
import type { IPoint } from "../../types/IPoint";

export class TiledLoader {
  constructor(private parent: Container) {}

  async loadMap(
    mapUrl: string,
    tilesetImageUrl: string
  ): Promise<{
    layers: Container[];
    collisions: Shape[];
    traps: IPoint[];
    enemies: [IPoint, IPoint][];
    pinecones: IPoint[];
    projectiles: IPoint[];
  }> {
    const map: TiledMap = await (await fetch(mapUrl)).json();
    const tileset: TiledTileset = await (await fetch(map.tilesets[0].source)).json();
    const tilesetTexture = await Assets.load<Texture>(tilesetImageUrl);
    const traps: IPoint[] = [];

    const { tilewidth, tileheight, layers, width, height } = map;
    const tilesPerLine = tileset.imagewidth / tileset.tilewidth;

    const textures = Array.from({ length: tileset.tilecount }, (_, i) => {
      const x = (i % tilesPerLine) * tileset.tilewidth;
      const y = Math.floor(i / tilesPerLine) * tileset.tileheight;
      return new Texture({
        source: tilesetTexture.source,
        frame: new Rectangle(x, y, tileset.tilewidth, tileset.tileheight),
      });
    });

    const layerContainers: Container[] = [];

    for (const layer of layers) {
      if (layer.type !== "tilelayer") continue;

      const layerContainer = new Container();
      layerContainer.label = layer.name;
      this.parent.addChild(layerContainer);

      const { data } = layer;

      for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
          const rawGid = data[row * width + col];
          if (rawGid === 0) continue;

          const flippedH = (rawGid & FLIPPED_HORIZONTALLY_FLAG) !== 0;
          const flippedV = (rawGid & FLIPPED_VERTICALLY_FLAG) !== 0;
          const flippedD = (rawGid & FLIPPED_DIAGONALLY_FLAG) !== 0;

          const tileIndex = getTileIndexFromRawGID(rawGid, map.tilesets[0].firstgid);
          const _tile = tileset.tiles.find((t) => t.id === tileIndex);
          const isTrap = _tile && getCustomProperty<Boolean>(_tile, "isTrap");

          const texture = textures[tileIndex];
          if (!texture) continue;

          const tile = new Sprite(texture);
          tile.roundPixels = true;
          tile.width = tilewidth;
          tile.height = tileheight;

          tile.anchor.set(0.5);
          tile.x = col * tilewidth + tilewidth / 2;
          tile.y = row * tileheight + tileheight / 2;

          if (isTrap) {
            traps.push({ x: tile.x, y: tile.y + tileheight / 2 - 5 });
          }

          applyTiledFlags(tile, flippedH, flippedV, flippedD);

          layerContainer.addChild(tile);
        }
      }

      layerContainers.push(layerContainer);
    }

    const collisionLayer = layers.find((l) => getCustomProperty<boolean>(l, "collide"));
    const collisionData = collisionLayer ? generateCollisionTiles(collisionLayer as TiledTileLayer, map, tileset) : [];
    const objectPositions = this.extractObjectPositions(map);
    console.log("Extracted Object Positions:", objectPositions);
    return {
      layers: layerContainers,
      collisions: collisionData,
      traps,
      enemies: objectPositions.enemy,
      pinecones: objectPositions.pinecone,
      projectiles: objectPositions.projectile,
    };
  }

  private extractObjectPositions(mapData: TiledMap): {
    enemy: [IPoint, IPoint][];
    projectile: IPoint[];
    pinecone: IPoint[];
  } {
    const result: {
      enemy: [IPoint, IPoint][];
      projectile: IPoint[];
      pinecone: IPoint[];
    } = {
      enemy: [],
      projectile: [],
      pinecone: [],
    };

    if (!mapData || !Array.isArray(mapData.layers)) return result;

    for (const layer of mapData.layers) {
      if (layer.type !== "objectgroup") continue;
      const name = (layer.name || "").toLowerCase();
      if (!["enemy", "projectile", "pinecone"].includes(name)) continue;

      for (const obj of layer.objects || []) {
        console.log(obj);
        const x = typeof obj.x === "number" ? Math.round(obj.x) : 0;
        const y = typeof obj.y === "number" ? Math.round(obj.y) : 0;

        if (name === "enemy") {
          const value = obj.properties?.find((p) => p.name === "range")?.value;
          const range = typeof value === "number" ? Math.round(value) : 100;
          result[name].push([
            { x: x - range / 2, y },
            { x: x + range / 2, y },
          ]);
        } else {
          // @ts-ignore
          result[name].push({ x, y });
        }
      }
    }

    return result;
  }
}

function applyTiledFlags(tile: Sprite, flippedH: boolean, flippedV: boolean, flippedD: boolean) {
  tile.rotation = 0;
  tile.scale.set(1, 1);

  // mask H V D -> 4 2 1
  const mask = (flippedH ? 4 : 0) | (flippedV ? 2 : 0) | (flippedD ? 1 : 0);

  switch (mask) {
    case 0: // ---
      // rot 0
      break;

    case 4: // H--
      // flip X
      tile.scale.x = -1;
      break;

    case 2: // -V-
      // flip Y
      tile.scale.y = -1;
      break;

    case 1: // --D
      // rot 90 + flip X
      tile.rotation = Math.PI / 2;
      tile.scale.x = -1;
      break;

    case 6: // HV-
      // rot 180
      tile.rotation = Math.PI;
      break;

    case 5: // H-D
      // rot 90
      tile.rotation = Math.PI / 2;
      break;

    case 3: // -VD
      // rot 270
      tile.rotation = (3 * Math.PI) / 2;
      break;

    case 7: // HVD
      // rot 270 + flip X
      tile.rotation = (3 * Math.PI) / 2;
      tile.scale.x = -1;
      break;
  }
}
