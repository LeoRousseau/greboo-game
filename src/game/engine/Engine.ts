import { Application, Container } from "pixi.js";

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

    this.scene.x = this.application.screen.width / 2;
    this.scene.y = this.application.screen.height / 2;
    this.scene.pivot.x = this.scene.width / 2;
    this.scene.pivot.y = this.scene.height / 2;
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
