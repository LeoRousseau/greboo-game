import { Graphics, Ticker, Text, TextStyle } from "pixi.js";
import type { Engine } from "../engine/Engine";
import type { Player } from "../player/player";

export class DeathAnimation {
  readonly rect: Graphics;
  readonly mask: Graphics;
  readonly youDiedText: Text;
  readonly restartText: Text;

  private _started = false;
  private _time = 0;
  private _speed = 0.5;
  private _minRadius = 50;
  private _onComplete?: () => void;

  private completed: () => void;

  constructor(
    readonly engine: Engine,
    readonly player: Player
  ) {
    this.rect = new Graphics();
    this.rect.beginFill(0x000000);
    this.rect.drawRect(0, 0, this.engine.renderWidth, this.engine.renderHeight);
    this.rect.endFill();

    this.mask = new Graphics();
    this.mask.beginFill(0xffffff);
    this.mask.drawRect(0, 0, this.engine.renderWidth, this.engine.renderHeight);
    this.mask.endFill();

    this.rect.setMask({
      mask: this.mask,
      inverse: true,
    });

    // préparer les textes (ne sont pas encore ajoutés au stage)
    const titleStyle = new TextStyle({
      fill: "#822022",
      fontSize: 52,
      fontFamily: "Jersey 15",
      letterSpacing: 3,

      dropShadow: true,
      // @ts-ignore
      dropShadowColor: 0x000000,
      dropShadowAlpha: 0.9,
      dropShadowAngle: Math.PI / 2,
      dropShadowDistance: 2,
      dropShadowBlur: 0,
    });
    const subStyle = new TextStyle({
      fill: "#ffffff",
      fontSize: 24,
      fontFamily: "Jersey 15",
      letterSpacing: 3,

      dropShadow: true,
      // @ts-ignore
      dropShadowColor: 0x000000,
      dropShadowAlpha: 0.9,
      dropShadowAngle: Math.PI / 2,
      dropShadowDistance: 2,
      dropShadowBlur: 0,
    });

    this.youDiedText = new Text("YOU DIED", titleStyle);
    this.restartText = new Text("PRESS TO RESTART", subStyle);

    this.completed = () => {
      window.removeEventListener("keydown", this.completed);
      window.removeEventListener("mousedown", this.completed);
      window.removeEventListener("touchstart", this.completed);
      this._onComplete?.();
    };
  }

  start(onComplete?: () => void) {
    if (this._started) return;

    this._started = true;
    this._onComplete = onComplete;
    this.engine.overlayWorld.addChild(this.rect);

    this.youDiedText.x = Math.round(this.engine.renderWidth / 2 - this.youDiedText.width / 2);
    this.youDiedText.y = Math.round(this.engine.renderHeight / 2 - this.youDiedText.height / 2 - 20);

    this.restartText.x = Math.round(this.engine.renderWidth / 2 - this.restartText.width / 2);
    this.restartText.y = Math.round(this.engine.renderHeight / 2 - this.restartText.height / 2 + 30);

    this.engine.overlayWorld.addChild(this.youDiedText);
    this.engine.overlayWorld.addChild(this.restartText);
  }

  update(ticker: Ticker) {
    if (!this._started) return;

    this._time += ticker.deltaMS;

    this.mask.clear();

    const worldPos = this.player.sprite?.sprite.worldTransform;
    const localPos = worldPos!.append(this.rect.worldTransform);

    const currentRadius = Math.max(this._minRadius, 400 - this._time * this._speed);

    this.mask.beginFill(0xffffff, 1);
    this.mask.circle(localPos.tx, localPos.ty, currentRadius);
    this.mask.fill();

    if (this._time > 1500) {
      window.addEventListener("keydown", this.completed, { once: true });
      window.addEventListener("mousedown", this.completed);
      window.addEventListener("touchstart", this.completed);
    }
  }
}
