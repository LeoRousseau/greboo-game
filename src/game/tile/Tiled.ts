// ---- Root Map ----
export interface TiledMap {
  height: number;
  width: number;
  tilewidth: number;
  tileheight: number;
  infinite: boolean;

  orientation: "orthogonal" | "isometric" | "staggered" | "hexagonal";
  renderorder: string;
  type: "map";
  version: string | number;
  tiledversion: string;

  nextlayerid: number;
  nextobjectid: number;

  layers: TiledLayer[];
  tilesets: TiledTilesetRef[];
}

// ---- Layers ----
export type TiledLayer = TiledTileLayer | TiledObjectLayer | TiledImageLayer | TiledGroupLayer;

export interface TiledBaseLayer {
  id: number;
  name: string;
  opacity: number;
  visible: boolean;
  x: number;
  y: number;
  type: string;
  properties?: TiledProperty[];
}

export interface TiledTileLayer extends TiledBaseLayer {
  type: "tilelayer";
  data: number[]; // GIDs
  height: number;
  width: number;
  encoding?: "csv" | "base64";
}

export interface TiledObjectLayer extends TiledBaseLayer {
  type: "objectgroup";
  draworder: "topdown" | "index";
  objects: TiledObject[];
}

export interface TiledImageLayer extends TiledBaseLayer {
  type: "imagelayer";
  image: string;
}

export interface TiledGroupLayer extends TiledBaseLayer {
  type: "group";
  layers: TiledLayer[];
}

// ---- Tileset ----
export interface TiledTilesetRef {
  firstgid: number;
  source: string; // external .tsx file
}

export interface TiledTileset {
  name: string;
  tilewidth: number;
  tileheight: number;
  tilecount: number;
  columns: number;
  image: string;
  imagewidth: number;
  imageheight: number;
  tiles: TiledTile[];
}

export interface TiledTile {
  id: number;
  properties?: TiledProperty[];
  objectgroup?: TiledObjectLayer;
}

// ---- Objects ----
export interface TiledObject {
  id: number;
  name: string;
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  visible: boolean;
  gid?: number;
  properties?: TiledProperty[];
}

// ---- Properties ----
export type TiledProperty =
  | { name: string; type: "string"; value: string }
  | { name: string; type: "int"; value: number }
  | { name: string; type: "float"; value: number }
  | { name: string; type: "bool"; value: boolean }
  | { name: string; type: "color"; value: string }
  | { name: string; type: "file"; value: string }
  | { name: string; type: "object"; value: number };

export function getCustomProperty<T>(el: TiledLayer | TiledObject | TiledTile, name: string) {
  return el?.properties?.find((p) => p.name === name)?.value as T | undefined;
}

export const FLIPPED_HORIZONTALLY_FLAG = 0x80000000;
export const FLIPPED_VERTICALLY_FLAG = 0x40000000;
export const FLIPPED_DIAGONALLY_FLAG = 0x20000000;

export function getTileIndexFromRawGID(rawGid: number, firstGid: number) {
  const gid = rawGid & ~(FLIPPED_HORIZONTALLY_FLAG | FLIPPED_VERTICALLY_FLAG | FLIPPED_DIAGONALLY_FLAG);
  return gid - firstGid;
}
