import { Container, Ticker } from "pixi.js";
import { Camera } from "../player/camera";
import { InputManager } from "../engine/InputManager";
import { Player } from "../player/player";
import { TiledLoader } from "../tile/loader/TiledLoader";
import type { Engine } from "../engine/Engine";
import { Underground } from "./Underground";
import { HorizontalParallax } from "./HorizontalParallax";
import { DefaultEnemy } from "../enemy/DefaultEnemy";
import { Collectable } from "../collectable/Collectable";
import { Spawner } from "../spawner/Spawner";
import { generateBodiesFromTileData } from "./generateBodieFromTileData";
import { generateTrapsFromTileData } from "../trap/generateTrapsFromTileData";
import type { TiledMapData } from "../tile/loader/TiledMapData";

export class Level {
  camera: Camera;
  input: InputManager;

  bgContainer: Container;
  content: Container;

  underground: Underground;
  hParallax: HorizontalParallax;

  enemies: DefaultEnemy[] = [];
  spawners: Spawner[] = [];

  data?: TiledMapData;

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
    });
  }

  async init() {
    await this.underground.init({ src: "bg_ground.jpeg", clampY: { min: 1600 } });
    await this.hParallax.init([
      { src: "sky.jpg", factorX: 0.2, y: 640 },
      { src: "bg_trees1.png", factorX: 0.9, y: 1430 },
    ]);

    const data = await new TiledLoader(this.content).loadMap("./level1_v2.tmj", "./level1_tiles.png");
    this.data = data;
    generateBodiesFromTileData(data.collisions, this.engine);
    generateTrapsFromTileData(data.traps, this.engine);
    data.enemies.forEach((pos) => {
      const enemy = new DefaultEnemy(this.engine, pos);
      this.enemies.push(enemy);
      enemy.addTo(this.content, this.content.children.length);
    });

    data.pinecones.forEach((pos) => {
      const pinecone = new Collectable(this.engine, "pinecone", pos, "pinecone_spritesheet.json");
      pinecone.addTo(this.content, this.content.children.length);
    });

    data.projectiles.forEach((pos) => {
      const spawner = new Spawner(this.engine, this.content, pos, {
        rate: 200,
        spriteUrl: "arrow.png",
        velocity: { x: 0, y: 0.5 },
      });
      this.spawners.push(spawner);
    });
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
