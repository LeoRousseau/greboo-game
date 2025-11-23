import Matter from "matter-js";
import type { Engine } from "../engine/Engine";
import { Player } from "../player/player";
import { Level } from "../scene/Level";
import { Scoreboard } from "./Scoreboard";
import { DeathAnimation } from "./DeathAnimation";
import { AudioManager } from "../audio/AudioManager";

export class Game {
  currentLevel: Level;
  player: Player;
  scoreboard: Scoreboard;
  audioManager: AudioManager;

  deathAnimation: DeathAnimation;

  constructor(
    readonly engine: Engine,
    readonly onRestart: () => void
  ) {
    this.audioManager = new AudioManager();
    this.player = new Player(engine, this.audioManager);
    Matter.World.addBody(this.engine.physicsWorld, this.player.body);
    this.currentLevel = new Level(engine, this.player);
    this.scoreboard = new Scoreboard(engine.application);
    this.deathAnimation = new DeathAnimation(engine, this.player);

    this.initializeAudio();
    this.loadLevel();

    this.player.onDeathCallback = () => {
      this.deathAnimation.start(() => {
        onRestart();
      });
    };
  }

  private initializeAudio() {
    // Register background music (you can add more music tracks as needed)
    this.audioManager.registerAudio("music", "music.mp3");

    // Play background music loop
    this.audioManager.playMusic("music", 0.5);
  }

  loadLevel() {
    this.engine.application.ticker.add((ticker) => {
      this.currentLevel.update(ticker);
      if (!this.player.isDead) {
        this.scoreboard.update(ticker, this.player.inventory);
      }

      Matter.Engine.update(this.engine.physicsEngine, 1000 / 60);
      this.currentLevel.syncWithPhysics();
      this.deathAnimation.update(ticker);
    });
  }

  start() {
    this.engine.start();
  }
}
