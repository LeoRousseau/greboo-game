import { Container, TilingSprite, Assets, Texture } from "pixi.js";
import type { Engine } from "../engine/Engine";

export type HorizontalParallaxCfg = {
  src: string; // image de texture (ex: arbres, montagnes)
  factorX: number; // facteur parallax horizontal
  y: number; // position Y fixe dans le monde
  depth?: number; // zIndex
};

export class HorizontalParallax {
  private root = new Container();
  private layers: Array<{
    cfg: HorizontalParallaxCfg;
    sprite: TilingSprite;
    tex: Texture;
  }> = [];

  constructor(
    private engine: Engine,
    private staticWorld: Container,
    private movingWorld: Container,
    private invertY = false
  ) {
    this.root.sortableChildren = true;
    this.staticWorld.addChildAt(this.root, 0);
    window.addEventListener("resize", this.handleResize);
  }

  async init(config: HorizontalParallaxCfg[]) {
    for (const cfg of config) {
      const tex = (await Assets.load(cfg.src)) as Texture;

      const spr = new TilingSprite(tex, this.engine.physicalWidth * 10, tex.height);
      spr.zIndex = cfg.depth ?? 0;

      this.root.addChild(spr);
      this.layers.push({ cfg, sprite: spr, tex });
    }
    this.root.sortableChildren = true;
  }

  update() {
    const camX = this.movingWorld.x;
    const camY = this.invertY ? -this.movingWorld.y : this.movingWorld.y;

    for (const { cfg, sprite } of this.layers) {
      // scroll horizontal
      sprite.tilePosition.x = camX * cfg.factorX;
      sprite.tilePosition.y = 0;

      // placer en Y
      sprite.y = cfg.y - camY;

      // collé au bord gauche
      sprite.x = 0;
    }
  }

  private handleResize = () => {
    for (const { sprite, tex } of this.layers) {
      sprite.width = this.engine.physicalWidth;
      sprite.height = tex.height;
    }
  };

  destroy() {
    window.removeEventListener("resize", this.handleResize);
    this.root.destroy({ children: true });
    this.layers = [];
  }
}
