import { Application, Container } from "pixi.js";

export class Engine {
  readonly application: Application;
  readonly world: Container;

  constructor(readonly parent: HTMLElement) {
    this.application = new Application();
    this.world = new Container();
  }

  async init() {
    await this.application.init({ background: "#1099bb", resizeTo: window });
    this.parent.appendChild(this.application.canvas);
    this.application.stage.addChild(this.world);
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
