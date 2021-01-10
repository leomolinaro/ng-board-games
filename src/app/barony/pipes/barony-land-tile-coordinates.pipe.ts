import { Pipe, PipeTransform } from "@angular/core";
import { BaronyLandTileCoordinates } from "../models";

const sqrt3Half = Math.sqrt (3) / 2.0;
const half = 0.5;
const one = 1.0;
const oneHalf = 1.5;
const sqrt3 = Math.sqrt (3);

const scaleForGap = 1.02;

@Pipe ({
  name: "baronyLandTileCoordinates"
})
export class BaronyLandTileCoordinatesPipe implements PipeTransform {

  transform (c: BaronyLandTileCoordinates, to: "hexagon" | "center-x" | "center-y", translate?: number): string {
    switch (to) {
      case "hexagon": {
        const center = hexToCartesian (c);
        
        const p1x = center.x - sqrt3Half;
        const p6x = p1x;
        const p2x = center.x;
        const p5x = p2x;
        const p3x = center.x + sqrt3Half;
        const p4x = p3x;
        
        const p1y = center.y - half;
        const p3y = p1y;
        const p2y = center.y - one;
        const p5y = center.y + one;
        const p4y = center.y + half;
        const p6y = p4y;

        return `${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y} ${p4x},${p4y} ${p5x},${p5y} ${p6x},${p6y}`;
      } // case
      case "center-x": {
        if (translate) {
          return (hexToCartesian (c).x + translate) + "";
        } else {
          return hexToCartesian (c).x + "";
        } // if - else
      } // case
      case "center-y": {
        if (translate) {
          return (hexToCartesian (c).y + translate) + "";
        } else {
          return hexToCartesian (c).y + "";
        } // if - else
      } // case
    } // switch
  } // transform

} // BaronyLandTileCoordinatesPipe

export function hexToCartesian (hex: { x: number, y: number}): { x: number, y: number} {
  const radius = (Math.abs (hex.x) + Math.abs (hex.y) + Math.abs (hex.x + hex.y)) / 2;
  return {
    x: (sqrt3 * hex.x + sqrt3Half * hex.y) * scaleForGap,
    y: (oneHalf * hex.y) * scaleForGap
  };
} // hexToCartesian
