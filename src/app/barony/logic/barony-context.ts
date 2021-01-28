import { immutableUtil } from "@bg-utils";
import { Observable } from "rxjs";
import { BgStore } from "src/app/bg-utils/store.util";
import { BaronyColor, BaronyConstruction, BaronyLandTile, BaronyLandTileCoordinates, BaronyMovement, BaronyPawn, BaronyPawnType, BaronyPlayer, BaronyResourceType, getLandTileCoordinateKey } from "../models";
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

  private notTemporaryState: BaronyState | null = null;
  startTemporaryState () {
    this.notTemporaryState = this.get ();
  } // startTemporaryState
  endTemporaryState () {
    if (this.notTemporaryState) {
      const state = this.notTemporaryState;
      this.update (s => ({ ...state }));
      this.notTemporaryState = null;
    } else {
      throw new Error ("endTemporaryState without startTemporaryState");
    } // if - else
  } // endTemporaryState

  getPlayers (): BaronyPlayer[] { return this.get (s => s.players); }
  getPlayerByIndex (index: number): BaronyPlayer { return this.getPlayers ()[index]; }
  getNumberOfPlayers (): number { return this.getPlayers ().length; }
  getLandTiles (): BaronyLandTile[] {
    const map = this.get (s => s.landTiles.map);
    const coordinates = this.get (s => s.landTiles.coordinates);
    return coordinates.map (coordinate => map[getLandTileCoordinateKey (coordinate)]);
  } // getLandTiles
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

  private removePawnFromPlayer (pawnType: BaronyPawnType, playerIndex: number) {
    this.update (s => ({
      ...s,
      players: immutableUtil.listReplaceByIndex (playerIndex, {
        ...s.players[playerIndex],
        pawns: {
          ...s.players[playerIndex].pawns,
          [pawnType]: s.players[playerIndex].pawns[pawnType] - 1
        }
      }, s.players)
    }));
  } // removePawnFromPlayer

  private addPawnToLandTile (pawnType: BaronyPawnType, pawnColor: BaronyColor, landTileCoordinates: BaronyLandTileCoordinates) {
    const key = getLandTileCoordinateKey (landTileCoordinates);
    this.update (s => ({
      ...s,
      landTiles: {
        ...s.landTiles,
        map: {
          ...s.landTiles.map,
          [key]: {
            ...s.landTiles.map[key],
            pawns: immutableUtil.listPush ([{ color: pawnColor, type: pawnType }], s.landTiles.map[key].pawns)
          }
        }
      }
    }));
  } // addPawnToLandTile
  
  private removePawnFromLandTile (pawnType: BaronyPawnType, pawnColor: BaronyColor, landTileCoordinates: BaronyLandTileCoordinates) {
    const key = getLandTileCoordinateKey (landTileCoordinates);
    this.update (s => ({
      ...s,
      landTiles: {
        ...s.landTiles,
        map: {
          ...s.landTiles.map,
          [key]: {
            ...s.landTiles.map[key],
            pawns: immutableUtil.listRemoveFirst (p => p.type === pawnType && p.color === pawnColor, s.landTiles.map[key].pawns)
          }
        }
      }
    }));
  } // removePawnFromLandTile

  private addResourceToPlayer (landTileCoordinates: BaronyLandTileCoordinates, playerIndex: number) {
    this.update (s => {
      const key = getLandTileCoordinateKey (landTileCoordinates);
      const resource: BaronyResourceType = s.landTiles.map[key].type as BaronyResourceType;
      const player = s.players[playerIndex];
      const resources = player.resources;
      return {
        ...s,
        players: immutableUtil.listReplaceByIndex (playerIndex, {
          ...player,
          resources: {
            ...resources,
            [resource]: resources[resource] + 1
          }
        }, s.players)
      };
    });
  } // addResourceToPlayer

  applySetup (landTileCoordinates: BaronyLandTileCoordinates, player: BaronyPlayer) {
    this.removePawnFromPlayer ("knight", player.index);
    this.addPawnToLandTile ("knight", player.color, landTileCoordinates);
    this.removePawnFromPlayer ("city", player.index);
    this.addPawnToLandTile ("city", player.color, landTileCoordinates);
  } // applySetup

  applyRecruitment (landTileCoordinates: BaronyLandTileCoordinates, player: BaronyPlayer) {
    this.removePawnFromPlayer ("knight", player.index);
    this.addPawnToLandTile ("knight", player.color, landTileCoordinates);
  } // applyRecruitment

  applyMovement (movement: BaronyMovement, gainedResource: BaronyResourceType | null, player: BaronyPlayer) {
    this.removePawnFromLandTile ("knight", player.color, movement.fromLandTileCoordinates);
    this.addPawnToLandTile ("knight", player.color, movement.toLandTileCoordinates);
    // TODO firstGainedResource
  } // applyMovement

  applyConstruction (construction: BaronyConstruction, player: BaronyPlayer) {
    this.removePawnFromLandTile ("knight", player.color, construction.landTileCoordinates);
    this.addPawnToLandTile (construction.building, player.color, construction.landTileCoordinates);
    this.addResourceToPlayer (construction.landTileCoordinates, player.index);
  } // applyConstruction

} // BaronyContext
