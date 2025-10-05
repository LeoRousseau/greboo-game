import { Container } from "pixi.js";
import { Camera } from "../player/camera";
import { InputManager } from "../engine/InputManager";
import { Player } from "../player/player";
import { TiledLoader } from "../tile/loader/TiledLoader";
import type { Shape } from "../tile/collision/Shape";
import Matter from "matter-js";
import type { Engine } from "../engine/Engine";
import { Underground } from "./Underground";
import { HorizontalParallax } from "./HorizontalParallax";
import { DefaultEnemy } from "../enemy/DefaultEnemy";
import { Collectable } from "../collectable/Collectable";

export class Level {
  collisionData: Shape[] = [];
  camera: Camera;
  input: InputManager;

  bgContainer: Container;
  content: Container;

  underground: Underground;
  hParallax: HorizontalParallax;

  enemies: DefaultEnemy[] = [];

  constructor(
    readonly engine: Engine,
    readonly world: Container,
    readonly player: Player
  ) {
    this.bgContainer = new Container();
    this.world.addChild(this.bgContainer);

    this.underground = new Underground(engine.application, this.world, { invertY: true });
    this.hParallax = new HorizontalParallax(engine.application, this.world, true);

    this.content = new Container();
    this.world.addChild(this.content);

    this.camera = new Camera(this.player, this.world);
    this.input = new InputManager();

    this.init().then(() => {
      const mid = this.content.getChildByLabel("mid");
      this.player.addTo(this.content, mid ? this.content.getChildIndex(mid) + 1 : 0);

      const en1 = new DefaultEnemy(this.engine, [
        { x: 1600, y: 1650 },
        { x: 2100, y: 1650 },
      ]);
      this.enemies.push(en1);
      en1.addTo(this.content, this.content.children.length);

      const pinecones = new Collectable({ x: 1600, y: 1300 });
      pinecones.addTo(this.content, this.content.children.length);
    });
  }

  async init() {
    await this.underground.init({ src: "bg_ground.jpeg", clampY: { min: 1100 } });
    await this.hParallax.init([
      { src: "sky.jpg", factorX: 0.2, y: 512 },
      { src: "bg_trees1.png", factorX: 0.9, y: 512 },
      { src: "bg_bush.png", factorX: 1, y: 512 },
    ]);

    const data = await new TiledLoader(this.content).loadMap("./level1.tmj", "./level1_tiles.png");
    this.collisionData = data.collisions;

    data.collisions.forEach((col) => {
      if ("orientation" in col) {
        const { x, y, w, h, orientation } = col;
        let cx = x + w / 2;
        let cy = y + h / 2;

        let vertices;
        switch (orientation) {
          case "tl":
            vertices = [
              { x: -w / 2, y: -h / 2 }, // top-left
              { x: w / 2, y: -h / 2 }, // top-right
              { x: -w / 2, y: h / 2 }, // bottom-left
            ];
            break;
          case "tr":
            vertices = [
              { x: -w / 2, y: -h / 2 }, // top-left
              { x: w / 2, y: -h / 2 }, // top-right
              { x: w / 2, y: h / 2 }, // bottom-right
            ];
            break;
          case "bl":
            vertices = [
              { x: -w / 2, y: h / 2 }, // bottom-left
              { x: -w / 2, y: -h / 2 }, // top-left
              { x: w / 2, y: h / 2 }, // bottom-right
            ];
            break;
          case "br":
            vertices = [
              { x: w / 2, y: h / 2 }, // bottom-right
              { x: w / 2, y: -h / 2 }, // top-right
              { x: -w / 2, y: h / 2 }, // bottom-left
            ];
            break;
        }

        const body = Matter.Bodies.fromVertices(
          cx,
          cy,
          [vertices!],
          {
            isStatic: true,
            friction: 0.01,
          },
          true
        );

        Matter.World.add(this.engine.physicsWorld, body);

        // Fix triangle offset due to center of mass
        const dx = x + w / 2 - (body.bounds.min.x + (body.bounds.max.x - body.bounds.min.x) / 2);
        const dy = y + h / 2 - (body.bounds.min.y + (body.bounds.max.y - body.bounds.min.y) / 2);
        Matter.Body.translate(body, { x: dx, y: dy });
      } else {
        const body = Matter.Bodies.rectangle(col.x + col.w / 2, col.y + col.h / 2, col.w, col.h, {
          isStatic: true,
          friction: 0.01,
        });
        Matter.World.add(this.engine.physicsWorld, body);
      }
    });
  }

  update() {
    this.player.update({
      left: this.input.isDown("ArrowLeft") || this.input.isDown("KeyA"),
      right: this.input.isDown("ArrowRight") || this.input.isDown("KeyD"),
      jump: this.input.onDown("Space"),
    });

    this.camera.update();
    this.underground.update();
    this.hParallax.update();
    this.enemies.forEach((e) => e.update());
  }

  syncWithPhysics() {
    this.player.syncWithPhysics();
  }
}
