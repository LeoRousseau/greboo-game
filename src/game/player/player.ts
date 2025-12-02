import { Assets, Container } from "pixi.js";
import type { Engine } from "../engine/Engine";
import { PlayerMovement } from "./playerMovement";
import { PlayerSprite } from "./PlayerSprite";
import { AudioManager } from "../audio/AudioManager";

const WIN_X_POSITION = 20450;

export class Player {
  sprite?: PlayerSprite;
  readonly movement: PlayerMovement;

  inventory: Record<string, number> = {};

  isDead = false;

  get body() {
    return this.movement.body;
  }

  onDeathCallback?: () => void;
  onWinCallback?: () => void;

  constructor(
    readonly engine: Engine,
    readonly audioManager: AudioManager
  ) {
    this.audioManager.registerAudio("jump", "jump.mp3");
    this.audioManager.registerAudio("coin", "coin.mp3");
    this.audioManager.registerAudio("death", "death.mp3");

    Assets.load("player_spritesheet.json").then((sheet) => {
      this.sprite = new PlayerSprite(sheet);
    });

    this.movement = new PlayerMovement(
      engine.physicsEngine,
      (id: string) => {
        this._addToInventory(id);
      },
      () => {
        this.isDead = true;
        this.audioManager.playSound("death", 1);
        this.onDeathCallback?.();
      },
      () => {
        this.audioManager.playSound("jump", 0.7);
      },
      500,
      1300
    );
  }

  addTo(container: Container, index = 0) {
    this.sprite?.addTo(container, index);
  }

  update(input: { left: boolean; right: boolean; jump: boolean }) {
    this.movement.update(input);
  }

  syncWithPhysics() {
    if (this.body.position.x > WIN_X_POSITION) {
      this.onWinCallback?.();
    }

    this.sprite?.update(
      this.body.position.x,
      this.body.position.y,
      this.body.velocity.x,
      this.body.velocity.y,
      this.movement.isOnGround(),
      this.isDead
    );
  }

  private _addToInventory(id: string) {
    this.audioManager.playSound("coin", 1.5);
    if (id in this.inventory) {
      this.inventory[id] = this.inventory[id] + 1;
    } else {
      this.inventory[id] = 1;
    }
  }
}
