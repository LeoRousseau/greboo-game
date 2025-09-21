import { Application, Container, TilingSprite, Assets, Texture } from "pixi.js";

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
    private app: Application,
    private world: Container,
    private invertY = false
  ) {
    this.root.sortableChildren = true;
    this.app.stage.addChildAt(this.root, 0);
    window.addEventListener("resize", this.handleResize);
  }

  async init(config: HorizontalParallaxCfg[]) {
    for (const cfg of config) {
      const tex = (await Assets.load(cfg.src)) as Texture;

      // hauteur = hauteur de la texture (pas de répétition verticale)
      const spr = new TilingSprite(tex, this.app.screen.width, tex.height);
      spr.zIndex = cfg.depth ?? 0;

      this.root.addChild(spr);
      this.layers.push({ cfg, sprite: spr, tex });
    }
    this.root.sortableChildren = true;
  }

  update() {
    const camX = this.world.x;
    const camY = this.invertY ? -this.world.y : this.world.y;

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
      sprite.width = this.app.screen.width;
      sprite.height = tex.height;
    }
  };

  destroy() {
    window.removeEventListener("resize", this.handleResize);
    this.root.destroy({ children: true });
    this.layers = [];
  }
}
