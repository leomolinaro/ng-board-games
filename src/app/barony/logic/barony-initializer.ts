import { arrayUtil, randomUtil } from "@bg-utils";
import { BaronyColor, BaronyLandTile, BaronyLandTileCoordinates, baronyLandTypes, BaronyPlayer, getLandTileCoordinateKey } from "../models";

export function createPlayer (index: number, name: string, color: BaronyColor): BaronyPlayer {
  return {
    index: index,
    name: name,
    color: color,
    score: 0,
    pawns: {
      city: 5,
      stronghold: 2,
      knight: 7,
      village: 14
    },
    resources: {
      forest: 0,
      mountain: 0,
      plain: 0,
      fields: 0
    }
  };
} // createPlayer

export function getRandomLandTiles (nPlayers: number): {
  map: { [key: string]: BaronyLandTile };
  coordinates: BaronyLandTileCoordinates[];
} {
  const nTiles = nPlayers * 27;
  const coordinates = getLandTilesCoordinates (nTiles);
  return {
    coordinates: coordinates,
    map: arrayUtil.toMap (coordinates, c => getLandTileCoordinateKey (c), (c, k) => ({
      key: k,
      coordinates: { ...c },
      type: randomUtil.getRandomElement (baronyLandTypes),
      pawns: []
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
