import { Container } from "pixi.js";
import { Camera } from "../player/camera";
import { InputManager } from "../engine/InputManager";
import { Player } from "../player/player";
import { Tile } from "./Tile";

export class Level {
  tiles: Tile[] = [];
  player: Player;
  camera: Camera;
  input: InputManager;

  constructor(public scene: Container) {
    this.player = new Player();
    this.player.x = 100;
    this.player.y = 300;
    this.player.addTo(scene);

    for (let i = 0; i < 10; i++) {
      const tile = new Tile(i * 100, 400, 100, 50);
      tile.addTo(scene);
      this.tiles.push(tile);
    }

    this.camera = new Camera(this.player, scene);
    this.input = new InputManager();
  }

  update() {
    this.player.update(
      {
        left: this.input.isDown("ArrowLeft") || this.input.isDown("KeyA"),
        right: this.input.isDown("ArrowRight") || this.input.isDown("KeyD"),
        jump: this.input.isDown("ArrowUp") || this.input.isDown("KeyW"),
      },
      this.tiles
    );

    this.camera.update();
  }
}
