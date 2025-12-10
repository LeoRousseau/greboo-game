import { Container, Ticker } from "pixi.js";
import { Camera } from "../player/camera";
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
import { ImageParallax } from "./ImageParallax";
import { AssetPreloader } from "../assets/AssetPreloader";

export class Level {
  camera: Camera;

  content: Container;

  underground: Underground;
  hParallax: HorizontalParallax;
  iParallax: ImageParallax;

  enemies: DefaultEnemy[] = [];
  spawners: Spawner[] = [];

  data?: TiledMapData;

  private initPromise: Promise<void>;

  constructor(
    readonly engine: Engine,
    readonly player: Player
  ) {
    this.underground = new Underground(engine, engine.staticWorld, engine.movingWorld, { invertY: true });
    this.hParallax = new HorizontalParallax(engine, engine.staticWorld, engine.movingWorld, true);
    this.iParallax = new ImageParallax(engine.movingWorld);

    this.content = new Container();
    engine.movingWorld.addChild(this.content);

    this.camera = new Camera(this.player, this.engine.movingWorld, { x: engine.renderWidth, y: engine.renderHeight });

    this.initPromise = this.init().then(() => {
      const mid = this.content.getChildByLabel("mid");
      this.player.addTo(this.content, mid ? this.content.getChildIndex(mid) + 1 : 0);
    });

    // Précharger les assets de niveau en arrière-plan
    const preloader = new AssetPreloader();
    preloader.preloadLevelAssets().catch((error) => {
      console.error("Erreur lors du préchargement des assets de niveau:", error);
    });
  }

  async init() {
    await this.underground.init({ src: "bg_ground.jpeg", clampY: { min: 1650 } });
    await this.hParallax.init([
      { src: "sky.png", factorX: 0.02, y: 1400 },
      { src: "tree.png", factorX: 0.9, y: 1437 },
    ]);

    await this.iParallax.init([{ src: "couriot.png", x: 13800, y: 1090, depth: 1 }]);

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
      const pinecone = new Collectable(this.engine, "pinecone", pos, "pinecone_spritesheet");
      pinecone.addTo(this.content, this.content.children.length);
    });

    data.projectiles.forEach((pos) => {
      const spawner = new Spawner(this.engine, this.content, pos, {
        rate: 500,
        spriteUrl: "arrow",
        velocity: { x: 0, y: 0.5 },
      });
      this.spawners.push(spawner);
    });
  }

  update(ticker: Ticker) {
    const input = this.engine.input;
    this.player.update({
      left: input.isDown("ArrowLeft") || input.isDown("KeyA") || input.isJoystickLeft(),
      right: input.isDown("ArrowRight") || input.isDown("KeyD") || input.isJoystickRight(),
      jump: input.onDown("Space") || input.onJoystickButtonPressed(),
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

  waitForInit(): Promise<void> {
    return this.initPromise;
  }
}
