import { arrayUtil, randomUtil } from "@bg-utils";
import { baronyColors, BaronyLandTile, BaronyLandTileCoordinates, baronyLandTypes, baronyPawnTypes, getLandTileCoordinateKey } from "../models";

export function getRandomLandTiles (nPlayers: number): {
  map: { [key: string]: BaronyLandTile };
  coordinates: BaronyLandTileCoordinates[];
} {
  const nTiles = nPlayers * 27;
  const coordinates = getLandTilesCoordinates (nTiles);
  return {
    coordinates: coordinates,
    map: arrayUtil.toMap (coordinates, c => getLandTileCoordinateKey (c), c => ({
      coordinates: { ...c },
      type: randomUtil.getRandomElement (baronyLandTypes),
      pawns: [
        ...randomUtil.getRandomArrayLength (0, 6, () => ({
          color: randomUtil.getRandomElement (baronyColors),
          type: randomUtil.getRandomElement (baronyPawnTypes)
        }))
      ]
    }))
  };
} // getRandomLandTiles

function getLandTilesCoordinates (nTiles: number): BaronyLandTileCoordinates[] {
  const coordinates: BaronyLandTileCoordinates[] = [];
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
} // getLandTilesCoordinates
