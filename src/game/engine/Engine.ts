import { Application, Container, RenderTexture, Sprite } from "pixi.js";
import Matter from "matter-js";

export class Engine {
  readonly application: Application;

  readonly physicsEngine: Matter.Engine;

  readonly world: Container;
  readonly movingWorld: Container;
  readonly staticWorld: Container;

  readonly renderWidth = 800;
  readonly renderHeight = 400;

  renderTexture!: RenderTexture;
  renderSprite!: Sprite;

  get physicsWorld(): Matter.World {
    return this.physicsEngine.world;
  }

  constructor(private parent: HTMLElement) {
    // Création du renderer
    this.application = new Application({
      width: this.renderWidth,
      height: this.renderHeight,
      background: 0x1099bb,
      antialias: false,
      autoStart: false, // on contrôle le rendu
      resolution: 1,
      roundPixels: true,
    });

    // Conteneur logique
    this.world = new Container();
    this.movingWorld = new Container();
    this.staticWorld = new Container();
    this.world.addChild(this.staticWorld);
    this.world.addChild(this.movingWorld);

    this.physicsEngine = Matter.Engine.create();
  }

  async init() {
    await this.application.init();
    this.parent.appendChild(this.application.view);

    // RenderTexture logique
    this.renderTexture = RenderTexture.create({ width: this.renderWidth, height: this.renderHeight });
    this.renderSprite = Sprite.from(this.renderTexture);
    this.renderTexture.source.scaleMode = "nearest";
    this.application.stage.addChild(this.renderSprite);

    // const game_window = document.getElementById("game_window");
    // game_window.appendChild(render.application.view);

    this.application.view.onselectstart = () => false;
    this.application.view.oncontextmenu = (event) => event.preventDefault();

    // Interaction
    this.application.renderer.events.autoPreventDefault = false;

    // Initial resize
    this.updatePhysicalSize();
    window.addEventListener("resize", () => this.updatePhysicalSize());
  }

  /** Calcule scale entier max et centres le rendu */
  private updatePhysicalSize() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    const data = {
      scale: 1,
      physical_width: this.renderWidth,
      physical_height: this.renderHeight,
      render_width: this.renderWidth,
      render_height: this.renderHeight,
    };

    if (false) {
      // mobile
      // if (width / render.render_width > height / render.render_height) {
      //   render.physical_height = height;
      //   render.physical_width = (render.render_width * render.physical_height) / render.render_height;
      // } else {
      //   render.physical_width = width;
      //   render.physical_height = (render.render_height * render.physical_width) / render.render_width;
      // }
      // game.update_touchscreen_controls();
    } else {
      do {
        const new_physical_width = data.render_width * (data.scale + 1);
        const new_physical_height = data.render_height * (data.scale + 1);
        console.log(new_physical_width, new_physical_height, width, height);
        if (new_physical_width < width && new_physical_height < height) {
          data.physical_width = new_physical_width;
          data.physical_height = new_physical_height;
          data.scale++;
        } else {
          break;
        }
      } while (data.scale < 10);
    }

    console.log;
    const game_window = document.getElementsByClassName("pixi-container")[0] as HTMLElement;
    game_window.style.width = data.physical_width + "px";
    game_window.style.height = data.physical_height + "px";
    game_window.style.marginLeft = (width - data.physical_width) / 2 + "px";
    game_window.style.marginTop = (height - data.physical_height) / 2 + "px";

    this.renderSprite.scale.x = data.physical_width / data.render_width;
    this.renderSprite.scale.y = data.physical_height / data.render_height;

    this.application.renderer.resize(data.physical_width, data.physical_height);
  }

  /** Boucle de rendu */
  start() {
    this.application.ticker.add(() => {
      // Rendu du monde logique dans la RenderTexture
      this.application.renderer.render({
        container: this.world,
        target: this.renderTexture,
        clear: true,
      });
    });

    this.application.start();
  }

  stop() {
    this.application.stop();
  }

  dispose() {
    window.removeEventListener("resize", () => this.updatePhysicalSize());
    this.application.destroy();
  }
}
