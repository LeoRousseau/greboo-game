import { Container, TilingSprite, Assets, Graphics, Texture } from "pixi.js";
import type { Engine } from "../engine/Engine";

type LayerCfg = {
  src: string;
  clampY?: { min?: number; max?: number };
};

export class Underground {
  private root = new Container();
  private layers: Array<{
    cfg: LayerCfg;
    group: Container;
    sprite: TilingSprite;
    mask?: Graphics;
    tex?: Texture;
  }> = [];
  private invertY: boolean;

  factor = 10;

  constructor(
    private engine: Engine,
    private staticWorld: Container,
    private movingWorld: Container,
    options?: { invertY?: boolean } // <--- ici tu choisis la convention Y
  ) {
    this.invertY = !!options?.invertY;
    this.staticWorld.sortableChildren = true;
    this.staticWorld.addChildAt(this.root, 0);
    window.addEventListener("resize", this.handleResize);
  }

  async init(cfg: LayerCfg) {
    const tex = (await Assets.load(cfg.src)) as Texture;
    const group = new Container();

    const spr = new TilingSprite(
      tex,
      this.engine.physicalWidth * this.factor,
      this.engine.physicalHeight * this.factor
    );
    spr.position.set(0, 0);

    let mask: Graphics | undefined;
    if (cfg.clampY) {
      mask = new Graphics();
      group.addChild(mask);
      spr.mask = mask;
    }

    group.addChildAt(spr, 0);
    this.root.addChild(group);

    this.layers.push({ cfg, group, sprite: spr, mask, tex });
  }

  update() {
    const camX_raw = this.movingWorld.x;
    const camY_raw = this.movingWorld.y;

    const camX = camX_raw;
    const camY = this.invertY ? -camY_raw : camY_raw;

    for (const layer of this.layers) {
      const { cfg, sprite, mask } = layer;

      sprite.tilePosition.x = camX;
      sprite.tilePosition.y = camY;
      if (mask && cfg.clampY) {
        const worldMin = cfg.clampY.min ?? -Infinity;
        const worldMax = cfg.clampY.max ?? Infinity;

        const worldToScreen = (worldY: number) => worldY - (this.invertY ? -camY_raw : camY_raw);

        const sA = worldToScreen(worldMin);
        const sB = worldToScreen(worldMax);

        const top = Math.max(0, Math.floor(Math.min(sA, sB)));
        const bottom = Math.min(this.engine.physicalHeight * this.factor, Math.ceil(Math.max(sA, sB)));
        const h = bottom - top;

        mask.clear();
        if (h > 0) {
          mask.beginFill(0xffffff);
          mask.drawRect(0, top, this.engine.physicalWidth * this.factor, h * this.factor);
          mask.endFill();
          sprite.visible = true;
        } else {
          sprite.visible = false;
        }
      }
    }
  }

  private handleResize = () => {
    for (const l of this.layers) {
      l.sprite.width = this.engine.physicalWidth * this.factor;
      l.sprite.height = this.engine.physicalHeight * this.factor;
    }
  };

  destroy() {
    window.removeEventListener("resize", this.handleResize);
    this.root.destroy({ children: true });
  }
}
