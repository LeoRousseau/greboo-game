import type { Container, Ticker } from "pixi.js";
import type { IPoint } from "../types/IPoint";
import type { TSpawnerProperties } from "./TSpawnerProperties";
import { SpawnedEntity } from "./SpawnedEntity";
import type { Engine } from "../engine/Engine";

export class Spawner {
  private _timeCount = 0;
  private _spawned: SpawnedEntity[] = [];
  constructor(
    readonly engine: Engine,
    readonly container: Container,
    readonly pos: IPoint,
    readonly properties: TSpawnerProperties
  ) {}

  update(ticker: Ticker) {
    this._timeCount += ticker.deltaTime;
    if (this._timeCount > this.properties.rate) {
      this.spawn();
      this._timeCount = 0;
    }
    this._spawned = this._spawned.filter((s) => !s.destroyed);
    this._spawned.forEach((s) => s.update());
  }

  spawn() {
    console.log("spawn");
    const entity = new SpawnedEntity(
      this.engine.physicsEngine,
      this.pos,
      this.properties.velocity,
      this.properties.spriteUrl
    );
    entity.addTo(this.container);
    this._spawned.push(entity);
  }
}
