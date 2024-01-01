import { randomUtil } from "@leobg/commons/utils";
import {
  BARONY_LAND_PIECES,
  BARONY_LAND_TYPES,
  BARONY_NUMBER_OF_LAND_TILES,
} from "../barony-constants";
import {
  BaronyLandCoordinates,
  BaronyLandPiece,
  BaronyLandType,
} from "../barony-models";

export function getRandomLands (nPlayers: number): {
  coordinates: BaronyLandCoordinates;
  type: BaronyLandType;
}[] {
  const nTiles = nPlayers * 27;
  const coordinatess = generateExhagonalMap (nTiles);
  const typesPool: BaronyLandType[] = [];
  for (const type of BARONY_LAND_TYPES) {
    for (let i = 0; i < BARONY_NUMBER_OF_LAND_TILES[type]; i++) {
      typesPool.push (type);
    } // for
  } // for
  const landTypes = randomUtil.getRandomDraws (nTiles, typesPool);
  return coordinatess.map ((coordinates, index) => {
    return {
      coordinates: coordinates,
      type: landTypes[index],
    };
  });

  // const nPieces = nPlayers * 9;
  // const lands = generateRectangularMap (nPieces);
  // return lands;
} // getRandomLandTiles

function generateExhagonalMap (nTiles: number): BaronyLandCoordinates[] {
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
    if (i < radius - 1) {
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
    const sO = side === 0 && i === 0 ? sideOffsets[5] : sideOffsets[side];
    cX += sO.x;
    cY += sO.y;
    cZ += sO.z;
    coordinates.push ({ x: cX, y: cY, z: cZ });
    counter++;
  } // while
  return coordinates;
} // generateExhagonalMap

function generateRectangularMap (nPieces: number): {
  coordinates: BaronyLandCoordinates;
  type: BaronyLandType;
}[] {
  const piecesPool: BaronyLandPiece[] = [];
  const map: { [key in BaronyLandType]: number } = {
    fields: 0,
    mountain: 0,
    forest: 0,
    lake: 0,
    plain: 0,
  };
  for (const piece of BARONY_LAND_PIECES) {
    for (let i = 0; i < piece.quantity; i++) {
      map[piece[1]]++;
      map[piece[2]]++;
      map[piece[3]]++;
      piecesPool.push (piece);
    } // for
  } // for
  console.log ("map", map);

  const choosenPieces = [];
  for (let i = 0; i < nPieces; i++) {
    const pieceIndex = randomUtil.getRandomInteger (0, piecesPool.length);
    const piece = piecesPool.splice (pieceIndex, 1)[0];
    choosenPieces.push (piece);
  } // for

  const toReturn: {
    coordinates: BaronyLandCoordinates;
    type: BaronyLandType;
  }[] = [];
  let pIndex = 0;
  let rowIndex = 0;
  let up = true;
  for (const piece of choosenPieces) {
    let x = -1 * rowIndex;
    const y = 2 * rowIndex;
    let z = -1 * rowIndex;
    if (up) {
      x += (pIndex / 2) * 3;
      z += (pIndex / 2) * -3;
      toReturn.push ({ coordinates: { x, y, z }, type: piece[1] });
      toReturn.push ({
        coordinates: { x: x, y: y + 1, z: z - 1 },
        type: piece[2],
      });
      toReturn.push ({
        coordinates: { x: x - 1, y: y + 1, z: z },
        type: piece[3],
      });
    } else {
      x += ((pIndex - 1) / 2) * 3 + 1;
      z += ((pIndex - 1) / 2) * -3 - 1;
      toReturn.push ({ coordinates: { x, y, z }, type: piece[1] });
      toReturn.push ({
        coordinates: { x: x + 1, y: y, z: z - 1 },
        type: piece[2],
      });
      toReturn.push ({
        coordinates: { x: x, y: y + 1, z: z - 1 },
        type: piece[3],
      });
    } // if - else

    pIndex++;
    if (pIndex > 6) {
      pIndex = 0;
      rowIndex++;
      up = true;
    } else {
      up = !up;
    } // if - else
  } // for
  return toReturn;
} // generateRectangularMap
