import { Assets, Container, Rectangle, Sprite, Texture } from "pixi.js";

const FLIPPED_HORIZONTALLY_FLAG = 0x80000000;
const FLIPPED_VERTICALLY_FLAG = 0x40000000;
const FLIPPED_DIAGONALLY_FLAG = 0x20000000;

export class TiledLoader {
  constructor(private parent: Container) {}

  async loadMap(mapUrl: string, tilesetImageUrl: string): Promise<Sprite[]> {
    const map = await (await fetch(mapUrl)).json();
    const tileset = await (await fetch(map.tilesets[0].source)).json();
    const tilesetTexture = await Assets.load<Texture>(tilesetImageUrl);

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

    const tiles: Sprite[] = [];

    for (const layer of layers) {
      if (layer.type === "tilelayer") {
        const { data } = layer;

        for (let row = 0; row < height; row++) {
          for (let col = 0; col < width; col++) {
            const rawGid = data[row * width + col];
            if (rawGid === 0) continue;

            const flippedH = (rawGid & FLIPPED_HORIZONTALLY_FLAG) !== 0;
            const flippedV = (rawGid & FLIPPED_VERTICALLY_FLAG) !== 0;
            const flippedD = (rawGid & FLIPPED_DIAGONALLY_FLAG) !== 0;

            const gid = rawGid & ~(FLIPPED_HORIZONTALLY_FLAG | FLIPPED_VERTICALLY_FLAG | FLIPPED_DIAGONALLY_FLAG);
            const tileIndex = gid - map.tilesets[0].firstgid;
            const texture = textures[tileIndex];
            if (!texture) continue;

            const tile = new Sprite(texture);
            tile.roundPixels = true;
            tile.width = tilewidth;
            tile.height = tileheight;
            tile.x = col * tilewidth;
            tile.y = row * tileheight;

            if (flippedH) {
              tile.scale.x *= -1;
              tile.x += tilewidth; // TODO this break collisions
            }
            if (flippedV) {
              tile.scale.y *= -1;
              tile.y += tileheight;
            }
            if (flippedD) {
              tile.rotation = Math.PI / 2;
              tile.x += tileheight;
            }

            this.parent.addChild(tile);
            tiles.push(tile);
          }
        }
      }

      if (layer.type === "objectgroup") {
        for (const obj of layer.objects) {
          if (obj.name === "PlayerSpawn") {
            console.log("Player spawn at:", obj.x, obj.y);
            // 👉 ici tu pourras positionner ton player
          }
        }
      }
    }

    return tiles;
  }
}
