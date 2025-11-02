import * as PIXI from "pixi.js";

export class Scoreboard {
  private container: PIXI.Container;
  private pineconeText: PIXI.Text;
  private pineconeIcon?: PIXI.Sprite;
  private timeText: PIXI.Text;
  private timeIcon?: PIXI.Sprite;

  private elapsedTime = 0;

  constructor(app: PIXI.Application) {
    this.container = new PIXI.Container();

    const style = new PIXI.TextStyle({
      fontFamily: "Jersey 15",
      fontSize: 32,
      fill: 0xffffff,
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

    PIXI.Assets.load("pine_icon.png").then((tex) => {
      this.pineconeIcon = new PIXI.Sprite(tex);
      this.pineconeIcon.x = 50;
      this.pineconeIcon.y = 20;
      this.container.addChild(this.pineconeIcon);
    });

    PIXI.Assets.load("time_icon.png").then((tex) => {
      this.timeIcon = new PIXI.Sprite(tex);
      this.timeIcon.x = 50;
      this.timeIcon.y = 60;
      this.container.addChild(this.timeIcon);
    });

    this.container.addChild(this.pineconeText);
    this.container.addChild(this.timeText);
    app.stage.addChild(this.container);
  }

  public reset() {
    this.elapsedTime = 0;
    this.pineconeText.text = "0";
    this.timeText.text = "00:00";
  }

  public update(ticker: PIXI.Ticker, inventory: Record<string, number>) {
    this.elapsedTime += ticker.deltaMS / 1000;

    const totalSeconds = Math.floor(this.elapsedTime);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    this.timeText.text = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    this.pineconeText.text = `${inventory["pinecone"] ?? 0}`;
  }
}
