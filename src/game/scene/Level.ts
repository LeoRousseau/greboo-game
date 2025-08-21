import { Application, Container, Sprite } from "pixi.js";
import { Camera } from "../player/camera";
import { InputManager } from "../engine/InputManager";
import { Player } from "../player/player";
import { Parallax } from "./Parallax";
import { TiledLoader } from "./TiledLoader";

export class Level {
  tiles: Sprite[] = [];
  camera: Camera;
  input: InputManager;

  bgContainer: Container;
  content: Container;
  background: Parallax;

  constructor(
    readonly app: Application,
    readonly world: Container,
    readonly player: Player
  ) {
    this.bgContainer = new Container();
    this.world.addChild(this.bgContainer);
    this.background = new Parallax(app, this.world);

    this.content = new Container();
    this.world.addChild(this.content);

    this.player.addTo(this.content);

    this.camera = new Camera(this.player, this.world);
    this.input = new InputManager();

    this.init();
  }

  async init() {
    await this.background.init([{ src: "./sky.jpg", factor: 0.1 }]);
    this.tiles = await new TiledLoader(this.content).loadMap("./level1.tmj", "./level1_tiles.png");
  }

  update() {
    this.player.update(
      {
        left: this.input.isDown("ArrowLeft") || this.input.isDown("KeyA"),
        right: this.input.isDown("ArrowRight") || this.input.isDown("KeyD"),
        jump: this.input.isDown("Space"),
      },
      this.tiles
    );

    this.camera.update();
    this.background.update();
  }
}
