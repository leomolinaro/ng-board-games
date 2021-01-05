import { arrayUtil, randomUtil } from "@bg-utils";
import { Observable, of } from "rxjs";
import { BaronyLandPiece, BaronyLandTile, BaronyLandTileCoordinates, BaronyLandType, BaronyPlayer, BaronyState } from "../models";

export class BaronyContext {

  private state: BaronyState = {
    players: [
      { name: "Leo", color: "blue" },
      { name: "Nico", color: "red" }
    ],
    landTiles: getRandomLandTiles (2)
  };

  getPlayers (): BaronyPlayer[] { return this.state.players; }
  getPlayerByIndex (index: number): BaronyPlayer { return this.state.players[index]; }
  getNumberOfPlayers (): number { return this.state.players.length; }

  selectLandTiles$ (): Observable<BaronyLandTile[]> {
    return of (this.state.landTiles.coordinates.map (c => this.state.landTiles.map[getLandTileCoordinateKey (c)]));
  } // selectLandTiles$

} // BaronyContext

function getLandTileCoordinateKey (c: BaronyLandTileCoordinates) {
  return `${c.x}_${c.y}_${c.z}`;
} // getLandTileCoordinateKey

function getRandomLandTiles (nPlayers: number): {
  map: { [coordinates: string]: BaronyLandTile };
  coordinates: BaronyLandTileCoordinates[];
} {
  const nTiles = nPlayers * 27;
  const coordinates = getLandTilesCoordinates (nTiles);
  return {
    coordinates: coordinates,
    map: arrayUtil.toMap (coordinates, c => getLandTileCoordinateKey (c), c => ({
      coordinates: { ...c },
      type: randomUtil.getRandomElement (baronyLandTypes)
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

const baronyLandTypes: BaronyLandType[] = ["fields", "forest", "lake", "mountain", "plain"];
const baronyLandPieces: BaronyLandPiece[] = [
  { 1: "mountain", 2: "mountain", 3: "mountain", quantity: 1 },
  { 1: "mountain", 2: "mountain", 3: "forest", quantity: 1 },
  { 1: "mountain", 2: "mountain", 3: "plain", quantity: 1 },
  { 1: "mountain", 2: "mountain", 3: "fields", quantity: 1 },
  { 1: "mountain", 2: "mountain", 3: "lake", quantity: 2 },
  { 1: "mountain", 2: "forest", 3: "forest", quantity: 1 },
  { 1: "mountain", 2: "forest", 3: "plain", quantity: 0 },
  { 1: "mountain", 2: "forest", 3: "fields", quantity: 0 },
  { 1: "mountain", 2: "forest", 3: "lake", quantity: 1 },
  { 1: "mountain", 2: "plain", 3: "forest", quantity: 1 },
  { 1: "mountain", 2: "plain", 3: "plain", quantity: 1 },
  { 1: "mountain", 2: "plain", 3: "fields", quantity: 0 },
  { 1: "mountain", 2: "plain", 3: "lake", quantity: 0 },
  { 1: "mountain", 2: "fields", 3: "forest", quantity: 1 },
  { 1: "mountain", 2: "fields", 3: "plain", quantity: 1 },
  { 1: "mountain", 2: "fields", 3: "fields", quantity: 1 },
  { 1: "mountain", 2: "fields", 3: "lake", quantity: 0 },
  { 1: "mountain", 2: "lake", 3: "forest", quantity: 0 },
  { 1: "mountain", 2: "lake", 3: "plain", quantity: 1 },
  { 1: "mountain", 2: "lake", 3: "fields", quantity: 1 },
  { 1: "mountain", 2: "lake", 3: "lake", quantity: 0 },
  { 1: "forest", 2: "forest", 3: "forest", quantity: 2 },
  { 1: "forest", 2: "forest", 3: "plain", quantity: 1 },
  { 1: "forest", 2: "forest", 3: "fields", quantity: 1 },
  { 1: "forest", 2: "forest", 3: "lake", quantity: 2 },
  { 1: "forest", 2: "plain", 3: "plain", quantity: 1 },
  { 1: "forest", 2: "plain", 3: "fields", quantity: 1 },
  { 1: "forest", 2: "plain", 3: "lake", quantity: 0 },
  { 1: "forest", 2: "fields", 3: "plain", quantity: 0 },
  { 1: "forest", 2: "fields", 3: "fields", quantity: 1 },
  { 1: "forest", 2: "fields", 3: "lake", quantity: 0 },
  { 1: "forest", 2: "lake", 3: "plain", quantity: 1 },
  { 1: "forest", 2: "lake", 3: "fields", quantity: 1 },
  { 1: "forest", 2: "lake", 3: "lake", quantity: 0 },
  { 1: "plain", 2: "plain", 3: "plain", quantity: 2 },
  { 1: "plain", 2: "plain", 3: "fields", quantity: 1 },
  { 1: "plain", 2: "plain", 3: "lake", quantity: 2 },
  { 1: "plain", 2: "fields", 3: "fields", quantity: 1 },
  { 1: "plain", 2: "fields", 3: "lake", quantity: 1 },
  { 1: "plain", 2: "lake", 3: "fields", quantity: 0 },
  { 1: "plain", 2: "lake", 3: "lake", quantity: 0 },
  { 1: "fields", 2: "fields", 3: "fields", quantity: 1 },
  { 1: "fields", 2: "fields", 3: "lake", quantity: 2 },
  { 1: "fields", 2: "lake", 3: "lake", quantity: 0 },
  { 1: "lake", 2: "lake", 3: "lake", quantity: 0 },
];
