import { Application, Assets, Container, Sprite } from "pixi.js";
import { Camera } from "../player/camera";
import { InputManager } from "../engine/InputManager";
import { Player } from "../player/player";
import { Parallax } from "./Parallax";

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
    await this.background.init([{ src: "https://pxpx.imgix.net/2021/10/parallax-1.jpg", factor: 0.2 }]);

    const texture = await Assets.load(
      "https://mir-s3-cdn-cf.behance.net/project_modules/max_632_webp/2be35548008379.56081eba26285.png"
    );

    for (let i = 0; i < 20; i++) {
      const tile = new Sprite(texture);
      tile.x = i * 100;
      tile.y = 400;
      tile.width = 100;
      tile.height = 100;
      this.content.addChild(tile);
      this.tiles.push(tile);
    }

    const tile = new Sprite(texture);
    tile.x = 600;
    tile.y = 300;
    tile.width = 100;
    tile.height = 100;
    this.content.addChild(tile);
    this.tiles.push(tile);
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
