export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type Triangle = {
  x: number;
  y: number;
  w: number;
  h: number;
  orientation: "tl" | "tr" | "bl" | "br"; // top-left, top-right, bottom-left, bottom-right
};

export type Shape = Rect | Triangle;
