import { AssetManager } from "./AssetManager";

/**
 * Orchestrateur du préchargement des assets
 * Gère la progression et les phases de chargement
 */
export class AssetPreloader {
  private progressCallback?: (progress: number) => void;
  private totalSteps = 0;
  private completedSteps = 0;

  async preload(onProgress?: (progress: number) => void): Promise<void> {
    this.progressCallback = onProgress;
    this.completedSteps = 0;

    // Phase 1: Initialisation des assets
    this.totalSteps = 2;
    await this.preloadPhase1();
    this.completedSteps++;
    this.reportProgress();

    // Phase 2: Préchargement des assets essentiels
    await this.preloadPhase2();
    this.completedSteps++;
    this.reportProgress();
  }

  private async preloadPhase1(): Promise<void> {
    // Initialiser les alias des assets
    AssetManager.initializeAssets();
  }

  private async preloadPhase2(): Promise<void> {
    // Précharger tous les assets essentiels
    const assetManager = AssetManager.getInstance();
    await assetManager.preloadEssentialAssets();
  }

  private reportProgress(): void {
    const progress = (this.completedSteps / this.totalSteps) * 100;
    this.progressCallback?.(Math.round(progress));
  }

  /**
   * Précharge les assets de niveau après que le jeu ait commencé
   */
  async preloadLevelAssets(): Promise<void> {
    const assetManager = AssetManager.getInstance();
    await assetManager.preloadLevelAssets();
  }
}
