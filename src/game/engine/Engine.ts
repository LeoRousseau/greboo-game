import { Application, Assets, Container, Sprite } from "pixi.js";

export class Engine {
  readonly application: Application;
  readonly scene: Container;

  constructor(readonly parent: HTMLElement) {
    this.application = new Application();
    this.scene = new Container();
  }

  async init() {
    await this.application.init({ background: "#1099bb", resizeTo: window });
    this.parent.appendChild(this.application.canvas);
    this.application.stage.addChild(this.scene);

    const texture = await Assets.load("https://pixijs.com/assets/bunny.png");

    for (let i = 0; i < 25; i++) {
      const bunny = new Sprite(texture);
      bunny.x = (i % 5) * 40;
      bunny.y = Math.floor(i / 5) * 40;
      this.scene.addChild(bunny);
    }

    this.scene.x = this.application.screen.width / 2;
    this.scene.y = this.application.screen.height / 2;
    this.scene.pivot.x = this.scene.width / 2;
    this.scene.pivot.y = this.scene.height / 2;

    this.application.ticker.add((time) => {
      this.scene.rotation -= 0.01 * time.deltaTime;
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
