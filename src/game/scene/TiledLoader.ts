import { Assets, Container, Rectangle, Sprite, Texture } from "pixi.js";

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
            const gid = data[row * width + col];
            if (gid !== 0) {
              const tileIndex = gid - map.tilesets[0].firstgid;
              const texture = textures[tileIndex];
              if (!texture) continue;

              const tile = new Sprite(texture);

              tiles.push(tile);
              tile.roundPixels = true;
              tile.width = tilewidth;
              tile.height = tileheight;
              tile.x = col * tilewidth;
              tile.y = row * tileheight;
              this.parent.addChild(tile);
            }
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
