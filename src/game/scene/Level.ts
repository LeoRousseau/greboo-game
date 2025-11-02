import { Container, Ticker } from "pixi.js";
import { Camera } from "../player/camera";
import { InputManager } from "../engine/InputManager";
import { Player } from "../player/player";
import { TiledLoader } from "../tile/loader/TiledLoader";
import type { Shape } from "../tile/collision/Shape";
import type { Engine } from "../engine/Engine";
import { Underground } from "./Underground";
import { HorizontalParallax } from "./HorizontalParallax";
import { DefaultEnemy } from "../enemy/DefaultEnemy";
import { Collectable } from "../collectable/Collectable";
import { Spawner } from "../spawner/Spawner";
import { generateBodiesFromTileData } from "./generateBodieFromTileData";
import { generateTrapsFromTileData } from "../trap/generateTrapsFromTileData";

export class Level {
  camera: Camera;
  input: InputManager;

  bgContainer: Container;
  content: Container;

  underground: Underground;
  hParallax: HorizontalParallax;

  enemies: DefaultEnemy[] = [];
  spawners: Spawner[] = [];

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

      const pinecones = new Collectable(this.engine, "pinecone", { x: 1600, y: 1300 }, "pinecone_spritesheet.json");
      pinecones.addTo(this.content, this.content.children.length);

      const pinecone2 = new Collectable(this.engine, "pinecone", { x: 1300, y: 1300 }, "pinecone_spritesheet.json");
      pinecone2.addTo(this.content, this.content.children.length);

      const spawner1 = new Spawner(
        this.engine,
        this.content,
        { x: 1600, y: 600 },
        { rate: 150, spriteUrl: "arrow.png", velocity: { x: 0, y: 0.5 } }
      );
      this.spawners.push(spawner1);
      const spawner2 = new Spawner(
        this.engine,
        this.content,
        { x: 2420, y: 720 },
        { rate: 180, spriteUrl: "arrow.png", velocity: { x: 0, y: 0.6 } }
      );
      this.spawners.push(spawner2);
    });
  }

  async init() {
    await this.underground.init({ src: "bg_ground.jpeg", clampY: { min: 1100 } });
    await this.hParallax.init([
      { src: "sky.jpg", factorX: 0.2, y: 512 },
      { src: "bg_trees1.png", factorX: 0.9, y: 850 },
    ]);

    const data = await new TiledLoader(this.content).loadMap("./level1.tmj", "./level1_tiles.png");
    generateBodiesFromTileData(data.collisions, this.engine);
    generateTrapsFromTileData(data.traps, this.engine);
  }

  update(ticker: Ticker) {
    this.player.update({
      left: this.input.isDown("ArrowLeft") || this.input.isDown("KeyA"),
      right: this.input.isDown("ArrowRight") || this.input.isDown("KeyD"),
      jump: this.input.onDown("Space"),
    });

    this.camera.update();
    this.underground.update();
    this.hParallax.update();
    this.enemies.forEach((e) => e.update());
    this.spawners.forEach((s) => s.update(ticker));
  }

  syncWithPhysics() {
    this.player.syncWithPhysics();
  }
}
