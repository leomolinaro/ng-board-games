import { immutableUtil } from "@bg-utils";
import { Observable } from "rxjs";
import { BgStore } from "src/app/bg-utils/store.util";
import { BaronyLandTile, BaronyLandTileCoordinates, BaronyPawn, BaronyPawnType, BaronyPlayer, getLandTileCoordinateKey } from "../models";
import { createPlayer, getRandomLandTiles } from "./barony-initializer";

interface BaronyState {
  players: BaronyPlayer[];
  landTiles: {
    map: { [key: string]: BaronyLandTile };
    coordinates: BaronyLandTileCoordinates[];
  };
} // BaronyState

export class BaronyContext extends BgStore<BaronyState> {

  constructor () {
    super ({
      players: [
        createPlayer (0, "Leo", "blue"),
        createPlayer (1, "Nico", "red"),
        // { name: "Rob", color: "yellow" },
        // { name: "Salvatore", color: "green" }
      ],
      landTiles: getRandomLandTiles (2)
    });
  } // constructor

  getPlayers (): BaronyPlayer[] { return this.get (s => s.players); }
  getPlayerByIndex (index: number): BaronyPlayer { return this.getPlayers ()[index]; }
  getNumberOfPlayers (): number { return this.getPlayers ().length; }
  getLandTiles (): BaronyLandTile[] {
    const map = this.get (s => s.landTiles.map);
    const coordinates = this.get (s => s.landTiles.coordinates);
    return coordinates.map (coordinate => map[getLandTileCoordinateKey (coordinate)]);
  } // getLandTiles
  getFilteredLandTiles (matcher: (lt: BaronyLandTile) => boolean) {
    return this.getLandTiles ().filter (lt => matcher (lt));
  } // getFilteredLandTiles
  getLandTileByCoordinates (landTileCoordinates: BaronyLandTileCoordinates): BaronyLandTile | null {
    const key = getLandTileCoordinateKey (landTileCoordinates);
    const landTile = this.get (s => s.landTiles.map[key]);
    return landTile || null;
  } // getLandTileByCoordinates
  getNearbyLandTiles (landTileCoordinates: BaronyLandTileCoordinates): BaronyLandTile[] {
    const x = landTileCoordinates.x;
    const y = landTileCoordinates.y;
    const z = landTileCoordinates.z;
    const toReturn: BaronyLandTile[] = [];
    let lt;
    lt = this.getLandTileByCoordinates ({ x: x + 1, y: y - 1, z }); if (lt) { toReturn.push (lt); }
    lt = this.getLandTileByCoordinates ({ x: x - 1, y: y + 1, z }); if (lt) { toReturn.push (lt); }
    lt = this.getLandTileByCoordinates ({ x: x, y: y + 1 , z: z - 1 }); if (lt) { toReturn.push (lt); }
    lt = this.getLandTileByCoordinates ({ x: x, y: y - 1, z: z + 1 }); if (lt) { toReturn.push (lt); }
    lt = this.getLandTileByCoordinates ({ x: x - 1, y, z: z + 1 }); if (lt) { toReturn.push (lt); }
    lt = this.getLandTileByCoordinates ({ x: x + 1, y, z: z - 1 }); if (lt) { toReturn.push (lt); }
    return toReturn;
  } // getNearbyLandTiles

  private selectLandTileMap$ () { return this.select$ (s => s.landTiles.map); }
  private selectLandTileKeys$ () { return this.select$ (s => s.landTiles.coordinates); }
  selectLandTiles$ (): Observable<BaronyLandTile[]> {
    return this.select$ (
      this.selectLandTileMap$ (),
      this.selectLandTileKeys$ (),
      (map, keys) => keys.map (k => map[getLandTileCoordinateKey (k)])
    );
  } // selectLandTiles$
  selectPlayers$ (): Observable<BaronyPlayer[]> { return this.select$ (s => s.players); }

  placePawn (pawnType: BaronyPawnType, playerIndex: number, landTileCoordinates: BaronyLandTileCoordinates) {
    this.placePawns ([pawnType], playerIndex, landTileCoordinates);
  } // placePawn

  placePawns (pawnTypes: BaronyPawnType[], playerIndex: number, landTileCoordinates: BaronyLandTileCoordinates) {

    const key = getLandTileCoordinateKey (landTileCoordinates);

    const player = this.getPlayerByIndex (playerIndex);
    const playerPawns = { ...player.pawns };
    pawnTypes.forEach (pawnType => {
      playerPawns[pawnType]--; 
    });
    const newPlayer = {
      ...player,
      pawns: playerPawns
    };

    const pawns = pawnTypes.map (pawnType => ({ type: pawnType, color: player.color }));

    this.update (s => ({
      ...s,
      landTiles: {
        ...s.landTiles,
        map: {
          ...s.landTiles.map,
          [key]: {
            ...s.landTiles.map[key],
            pawns: immutableUtil.listPush (pawns, s.landTiles.map[key].pawns)
          }
        }
      },
      players: immutableUtil.listReplaceByIndex (playerIndex, newPlayer, s.players)
    }));
  } // placePawns

} // BaronyContext
