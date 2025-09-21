import { Application, Container, TilingSprite, Assets } from "pixi.js";

type LayerCfg = { src: string; factor: { x: number; y: number }; preservHeight?: boolean };

export class Parallax {
  private container = new Container();
  private layers: { sprite: TilingSprite; factor: { x: number; y: number } }[] = [];

  constructor(
    private app: Application,
    private world: Container
  ) {
    this.container.zIndex = 0;
    this.app.stage.sortableChildren = true;

    this.app.stage.addChildAt(this.container, 0);
    window.addEventListener("resize", this.handleResize);
  }

  async init(config: LayerCfg[]) {
    for (const { src, factor } of config) {
      const tex = await Assets.load(src);
      const spr = new TilingSprite({
        texture: tex,
        width: this.app.screen.width,
        height: this.app.screen.height,
      });
      spr.position.set(0, 0);
      this.container.addChild(spr);
      this.layers.push({ sprite: spr, factor });
    }
  }

  update() {
    for (const { sprite, factor } of this.layers) {
      sprite.tilePosition.x = this.world.x * factor.x;
      sprite.tilePosition.y = this.world.y * factor.y;
    }
  }

  private handleResize = () => {
    for (const { sprite } of this.layers) {
      sprite.width = this.app.screen.width;
      sprite.height = this.app.screen.height;
    }
  };

  destroy() {
    window.removeEventListener("resize", this.handleResize);
    this.container.destroy({ children: true });
  }
}
