import { Assets, Container, Sprite, Texture } from "pixi.js";

type ImageParallaxCfg = {
  src: string;
  depth?: number;
  x: number;
  y: number;
};

export class ImageParallax {
  private root = new Container();
  constructor(private movingWorld: Container) {
    this.movingWorld.addChildAt(this.root, 0);
  }

  async init(config: ImageParallaxCfg[]) {
    for (const cfg of config) {
      const tex = (await Assets.load(cfg.src)) as Texture;

      const spr = new Sprite(tex);
      spr.zIndex = cfg.depth ?? 0;

      spr.x = cfg.x;
      spr.y = cfg.y;
      this.root.addChild(spr);
    }
  }
}
