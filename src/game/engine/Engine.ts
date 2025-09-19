import { Application, Container } from "pixi.js";
import Matter from "matter-js";

export class Engine {
  readonly application: Application;
  readonly world: Container;

  readonly physicsEngine: Matter.Engine;

  get physicsWorld(): Matter.World {
    return this.physicsEngine.world;
  }

  constructor(readonly parent: HTMLElement) {
    this.application = new Application();
    this.world = new Container();
    this.physicsEngine = Matter.Engine.create();
  }

  async init() {
    await this.application.init({ background: "#1099bb", resizeTo: this.parent });
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
