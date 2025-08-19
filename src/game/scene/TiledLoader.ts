import { Assets, Container, Rectangle, Sprite, Texture } from "pixi.js";

export class TiledLoader {
  constructor(private parent: Container) {}

  async loadMap(mapUrl: string, tilesetImageUrl: string) {
    const map = await (await fetch(mapUrl)).json();
    const tilesetTexture = await Assets.load<Texture>(tilesetImageUrl);
    const tileset = await (await fetch(map.tilesets[0].source)).json();

    const { tilewidth, tileheight, layers } = map;
    const tilesPerLine = Math.round(tilewidth / tileset.imagewidth);
    const textures = Array.from({ length: tileset.tilecount }, (_, i) => {
      return new Texture({
        source: tilesetTexture.source,
        frame: new Rectangle(i * tilewidth, Math.floor(i / tilesPerLine), tilewidth, tileheight),
      });
    });

    console.log(textures);

    for (const layer of layers) {
      if (layer.type === "tilelayer") {
        const { data } = layer;
        for (let row = 0; row < map.height; row++) {
          for (let col = 0; col < map.width; col++) {
            const tileId = data[row * map.width + col];
            if (tileId !== 0) {
              const tile = new Sprite(textures[tileId - 1]);
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
            // 👉 ici tu peux déplacer ton Player
          }
        }
      }
    }
  }
}
