import { Application, Assets, Container, Sprite } from "pixi.js";

export class Engine {
  readonly application: Application;
  constructor(readonly parent: HTMLElement) {
    this.application = new Application();
  }

  async init() {
    await this.application.init({ background: "#1099bb", resizeTo: window });
    this.parent.appendChild(this.application.canvas);
    const pixiContainer = new Container();
    this.application.stage.addChild(pixiContainer);

    const texture = await Assets.load("https://pixijs.com/assets/bunny.png");

    for (let i = 0; i < 25; i++) {
      const bunny = new Sprite(texture);
      bunny.x = (i % 5) * 40;
      bunny.y = Math.floor(i / 5) * 40;
      pixiContainer.addChild(bunny);
    }

    pixiContainer.x = this.application.screen.width / 2;
    pixiContainer.y = this.application.screen.height / 2;
    pixiContainer.pivot.x = pixiContainer.width / 2;
    pixiContainer.pivot.y = pixiContainer.height / 2;

    this.application.ticker.add((time) => {
      pixiContainer.rotation -= 0.01 * time.deltaTime;
    });
  }

  start() {
    this.application.start();
  }

  stop() {
    this.application.stop();
  }

  dispose() {
    this.application.destroy();
  }
}
