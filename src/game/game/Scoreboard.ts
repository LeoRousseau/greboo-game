import * as PIXI from "pixi.js";
import { AssetManager } from "../assets/AssetManager";

export class Scoreboard {
  private container: PIXI.Container;
  private pineconeText: PIXI.Text;
  private pineconeIcon?: PIXI.Sprite;
  private timeText: PIXI.Text;
  private timeIcon?: PIXI.Sprite;
  private heartIcons: PIXI.Sprite[] = [];

  elapsedTime = 0;

  constructor(app: PIXI.Application) {
    this.container = new PIXI.Container();

    const style = new PIXI.TextStyle({
      fontFamily: "Jersey 15",
      fontSize: 32,
      fill: 0xeeeeee,
      letterSpacing: 3,

      dropShadow: true,
      // @ts-ignore
      dropShadowColor: 0x000000,
      dropShadowAlpha: 0.9,
      dropShadowAngle: Math.PI / 2,
      dropShadowDistance: 2,
      dropShadowBlur: 0,
    });

    this.pineconeText = new PIXI.Text("0", style);
    this.timeText = new PIXI.Text("00:00", style);

    this.pineconeText.x = 100;
    this.pineconeText.y = 20;
    this.timeText.x = 100;
    this.timeText.y = 60;

    // Utiliser le gestionnaire d'assets
    const assetManager = AssetManager.getInstance();
    const pineTexture = assetManager.getTexture("pine_icon");
    if (pineTexture) {
      this.pineconeIcon = new PIXI.Sprite(pineTexture);
      this.pineconeIcon.x = 50;
      this.pineconeIcon.y = 20;
      this.container.addChild(this.pineconeIcon);
    } else {
      console.warn("pine_icon non disponible");
    }

    const timeTexture = assetManager.getTexture("time_icon");
    if (timeTexture) {
      this.timeIcon = new PIXI.Sprite(timeTexture);
      this.timeIcon.x = 50;
      this.timeIcon.y = 60;
      this.container.addChild(this.timeIcon);
    } else {
      console.warn("time_icon non disponible");
    }

    // Hearts (3)
    const heartTexture = assetManager.getTexture("heart_icon");
    if (heartTexture) {
      const startX = (app.renderer ? app.renderer.width : 800) - 150;
      const y = 20;
      for (let i = 0; i < 3; i++) {
        const s = new PIXI.Sprite(heartTexture);
        s.x = startX + i * 44;
        s.y = y;
        s.scale.set(0.8);
        this.heartIcons.push(s);
        this.container.addChild(s);
      }
    } else {
      console.warn("heart_icon non disponible");
    }

    this.container.addChild(this.pineconeText);
    this.container.addChild(this.timeText);
    app.stage.addChild(this.container);
  }

  public reset() {
    this.elapsedTime = 0;
    this.pineconeText.text = "0";
    this.timeText.text = "00:00";
  }

  public update(ticker: PIXI.Ticker, inventory: Record<string, number>, hp: number = 3) {
    this.elapsedTime += ticker.deltaMS / 1000;

    const totalSeconds = Math.floor(this.elapsedTime);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    this.timeText.text = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    this.pineconeText.text = `${inventory["pinecone"] ?? 0}`;

    // Update hearts display
    for (let i = 0; i < this.heartIcons.length; i++) {
      const sprite = this.heartIcons[i];
      sprite.visible = i < hp;
      // Slightly dim hearts when not visible for consistent layout
      sprite.alpha = sprite.visible ? 1 : 0.2;
    }
  }
}
