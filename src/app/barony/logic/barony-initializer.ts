import { randomUtil } from "@bg-utils";
import { BaronyColor, BaronyLandCoordinates, BaronyLandType, baronyLandTypes, BaronyPlayer } from "../models";

// export function createPlayer (id: string, name: string, color: BaronyColor, isAi: boolean): BaronyPlayer {
//   return {
//     id: id,
//     name: name,
//     isAi: isAi,
//     isRemote: false,
//     color: color,
//     score: 0,
//     pawns: {
//       city: 5,
//       stronghold: 2,
//       knight: 7,
//       village: 14
//     },
//     resources: {
//       forest: 0,
//       mountain: 0,
//       plain: 0,
//       fields: 0
//     }
//   };
// } // createPlayer

export function getRandomLands (nPlayers: number): {
  coordinates: BaronyLandCoordinates;
  type: BaronyLandType;
}[] {
  const nTiles = nPlayers * 27;
  const coordinatess = getLandCoordinates (nTiles);
  return coordinatess.map (coordinates => ({
    coordinates: coordinates,
    type: randomUtil.getRandomElement (baronyLandTypes)
  }));
} // getRandomLandTiles

function getLandCoordinates (nTiles: number): BaronyLandCoordinates[] {
  const coordinates: BaronyLandCoordinates[] = [];
  const sideOffsets = [
    { x: 0, y: -1, z: 1 },
    { x: 1, y: -1, z: 0 },
    { x: 1, y: 0, z: -1 },
    { x: 0, y: 1, z: -1 },
    { x: -1, y: 1, z: 0 },
    { x: -1, y: 0, z: 1 },
  ];
  let i = 0;
  let side = 5;
  let cX = 0;
  let cY = 0;
  let cZ = 0;
  let radius = 0;
  coordinates.push ({ x: cX, y: cY, z: cZ });
  let counter = 1;
  while (counter < nTiles) {
    if (i < (radius - 1)) {
      i++;
    } else {
      i = 0;
      if (side < 5) {
        side++;
      } else {
        side = 0;
        radius++;
      } // if - else
    } // if - else
    const sO = (side === 0 && i === 0) ? sideOffsets[5] : sideOffsets[side];
    cX += sO.x;
    cY += sO.y;
    cZ += sO.z;
    coordinates.push ({ x: cX, y: cY, z: cZ });
    counter++;
  } // while
  return coordinates;
} // getLandCoordinates
