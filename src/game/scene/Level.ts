import { Container } from "pixi.js";
import { Camera } from "../player/camera";
import { InputManager } from "../engine/InputManager";
import { Player } from "../player/player";
import { Parallax } from "./Parallax";
import { TiledLoader } from "../tile/loader/TiledLoader";
import type { Shape } from "../tile/collision/Shape";
import Matter from "matter-js";
import type { Engine } from "../engine/Engine";

export class Level {
  collisionData: Shape[] = [];
  camera: Camera;
  input: InputManager;

  bgContainer: Container;
  content: Container;
  background: Parallax;

  constructor(
    readonly engine: Engine,
    readonly world: Container,
    readonly player: Player
  ) {
    this.bgContainer = new Container();
    this.world.addChild(this.bgContainer);
    this.background = new Parallax(engine.application, this.world);

    this.content = new Container();
    this.world.addChild(this.content);

    this.camera = new Camera(this.player, this.world);
    this.input = new InputManager();

    this.init().then(() => {
      const mid = this.content.getChildByLabel("mid");
      this.player.addTo(this.content, mid ? this.content.getChildIndex(mid) + 1 : 0);
    });
  }

  async init() {
    await this.background.init([{ src: "./sky.jpg", factor: 0.1 }]);
    const data = await new TiledLoader(this.content).loadMap("./level1.tmj", "./level1_tiles.png");
    this.collisionData = data.collisions;

    data.collisions.forEach((col) => {
      if ("orientation" in col) return;
      const body = Matter.Bodies.rectangle(col.x + col.w / 2, col.y + col.h / 2, col.w, col.h, {
        isStatic: true,
        friction: 1,
      });
      Matter.World.add(this.engine.physicsWorld, body);
    });
  }

  update() {
    this.player.update({
      left: this.input.isDown("ArrowLeft") || this.input.isDown("KeyA"),
      right: this.input.isDown("ArrowRight") || this.input.isDown("KeyD"),
      jump: this.input.isDown("Space"),
    });

    this.camera.update();
    this.background.update();
  }

  syncWithPhysics() {
    this.player.syncWithPhysics();
  }
}
