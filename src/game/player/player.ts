import { Container } from "pixi.js";
import type { Engine } from "../engine/Engine";
import { PlayerMovement } from "./playerMovement";
import { PlayerSprite } from "./PlayerSprite";
import { AudioManager } from "../audio/AudioManager";
import { AssetManager } from "../assets/AssetManager";

const WIN_X_POSITION = 20450;

export class Player {
  sprite?: PlayerSprite;
  readonly movement: PlayerMovement;

  inventory: Record<string, number> = {};

  isDead = false;

  // Health points (start with 3)
  hp = 3;

  // When true, collisions that would normally hurt the player are ignored
  invulnerable = false;

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
    // Hurt sound (add `ouch.mp3` to `public/`)
    this.audioManager.registerAudio("hurt", "ouch.mp3");

    // Utiliser le gestionnaire d'assets
    const sheet = AssetManager.getInstance().getSpritesheet("player_spritesheet");
    if (sheet) {
      this.sprite = new PlayerSprite(sheet);
    } else {
      console.warn("player_spritesheet non disponible");
    }

    this.movement = new PlayerMovement(
      engine.physicsEngine,
      (id: string) => {
        this._addToInventory(id);
      },
      () => {
        // Called by the physics layer when a lethal collision happens.
        // Instead of instantly dying, the player loses 1 hp (unless already 0)
        // and becomes invulnerable for 1.5s. If hp reaches 0, die.
        this.takeDamage();
      },
      () => {
        this.audioManager.playSound("jump", 0.7);
      },
      500,
      1300
    );
  }

  private takeDamage() {
    if (this.invulnerable) return;

    if (this.hp > 0) {
      console.log("Player takes damage!");
      this.hp = Math.max(0, this.hp - 1);
      // Play hurt sound for non-fatal damage
      this.audioManager.playSound("hurt", 1);
      // Start temporary invulnerability
      this.invulnerable = true;
      setTimeout(() => {
        console.log("Player is no longer invulnerable.");
        this.invulnerable = false;
      }, 1500);

      // If HP dropped to 0, treat as death
      if (this.hp === 0) {
        this.isDead = true;
        this.audioManager.playSound("death", 1);
        this.onDeathCallback?.();
      }
    } else {
      // Already at 0 hp -> die immediately
      this.isDead = true;
      this.audioManager.playSound("death", 1);
      this.onDeathCallback?.();
    }
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
      this.isDead,
      this.invulnerable
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
