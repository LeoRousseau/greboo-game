import { Assets, Container, Sprite, TilingSprite } from "pixi.js";

export class Parallax {
  sprites: TilingSprite[] = [];

  constructor(readonly parent: Container) {}

  async init() {
    const textures = [
      "https://pxpx.imgix.net/2021/10/parallax-1.jpg", // arrière-plan lointain
    ];

    for (let i = 0; i < textures.length; i++) {
      const texture = await Assets.load(textures[i]);
      const sprite = new TilingSprite(texture, parent.innerWidth, texture.height);
      this.sprites.push(sprite);
      this.parent.addChildAt(sprite, 0);
    }
  }

  update(playerX: number) {
    console.log(playerX);
    const factors = [0.3, 0.6, 1]; // vitesse relative pour le parallax
    this.sprites.forEach((s, i) => {
      s.tilePosition.x = playerX * factors[i];
    });
  }
}
