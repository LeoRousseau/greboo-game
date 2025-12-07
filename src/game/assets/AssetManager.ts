import { Assets, Spritesheet } from "pixi.js";

export type AssetKey =
  | "player_spritesheet"
  | "ghost_spritesheet"
  | "pinecone_spritesheet"
  | "level1_tiles"
  | "arrow"
  | "bg_ground"
  | "sky"
  | "bg_trees1"
  | "couriot"
  | "pine_icon"
  | "time_icon";

/**
 * Gestionnaire centralisé des assets
 * Permet le préchargement et la mise en cache de tous les assets du jeu
 */
export class AssetManager {
  private static instance: AssetManager;
  private cache = new Map<AssetKey, any>();
  private loadPromises = new Map<AssetKey, Promise<any>>();

  private constructor() {}

  static getInstance(): AssetManager {
    if (!AssetManager.instance) {
      AssetManager.instance = new AssetManager();
    }
    return AssetManager.instance;
  }

  /**
   * Définit les alias pour les assets
   */
  static initializeAssets() {
    Assets.add({
      alias: "player_spritesheet",
      src: "player_spritesheet.json",
    });
    Assets.add({
      alias: "ghost_spritesheet",
      src: "ghost_spritesheet.json",
    });
    Assets.add({
      alias: "pinecone_spritesheet",
      src: "pinecone_spritesheet.json",
    });
    Assets.add({
      alias: "level1_tiles",
      src: "level1_tiles.png",
    });
    Assets.add({
      alias: "arrow",
      src: "arrow.png",
    });
    Assets.add({
      alias: "bg_ground",
      src: "bg_ground.jpeg",
    });
    Assets.add({
      alias: "sky",
      src: "sky.png",
    });
    Assets.add({
      alias: "bg_trees1",
      src: "bg_trees1.png",
    });
    Assets.add({
      alias: "couriot",
      src: "couriot.png",
    });
    Assets.add({
      alias: "pine_icon",
      src: "pine_icon.png",
    });
    Assets.add({
      alias: "time_icon",
      src: "time_icon.png",
    });
  }

  /**
   * Précharge les assets essentiels au démarrage du jeu
   */
  async preloadEssentialAssets(): Promise<void> {
    const essentialAssets: AssetKey[] = [
      "player_spritesheet",
      "ghost_spritesheet",
      "pinecone_spritesheet",
      "level1_tiles",
      "bg_ground",
      "sky",
      "bg_trees1",
      "pine_icon",
      "time_icon",
    ];

    await Promise.all(essentialAssets.map((key) => this.load(key)));
  }

  /**
   * Précharge les assets de niveau
   */
  async preloadLevelAssets(): Promise<void> {
    const levelAssets: AssetKey[] = ["arrow", "couriot"];

    await Promise.all(levelAssets.map((key) => this.load(key)));
  }

  /**
   * Charge un asset et le met en cache
   */
  async load(key: AssetKey): Promise<any> {
    // Retourne du cache si déjà chargé
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    // Retourne la promesse existante si en cours de chargement
    if (this.loadPromises.has(key)) {
      return this.loadPromises.get(key)!;
    }

    // Lance le chargement
    const promise = Assets.load(key)
      .then((asset) => {
        this.cache.set(key, asset);
        return asset;
      })
      .catch((error) => {
        console.error(`Erreur lors du chargement de l'asset ${key}:`, error);
        this.loadPromises.delete(key);
        throw error;
      });

    this.loadPromises.set(key, promise);
    return promise;
  }

  /**
   * Récupère un asset du cache (doit être préchargé)
   */
  get(key: AssetKey): any {
    if (!this.cache.has(key)) {
      console.warn(`Asset ${key} non trouvé dans le cache. Assurez-vous qu'il a été préchargé.`);
      return null;
    }
    return this.cache.get(key);
  }

  /**
   * Récupère un asset du cache en tant que spritesheet
   */
  getSpritesheet(key: AssetKey): Spritesheet | null {
    const asset = this.get(key);
    return asset instanceof Spritesheet ? asset : null;
  }

  /**
   * Récupère un asset du cache en tant que texture
   */
  getTexture(key: AssetKey): any {
    return this.get(key);
  }

  /**
   * Vérifie si un asset est chargé
   */
  isLoaded(key: AssetKey): boolean {
    return this.cache.has(key);
  }

  /**
   * Vide le cache
   */
  clear(): void {
    this.cache.clear();
    this.loadPromises.clear();
  }
}
