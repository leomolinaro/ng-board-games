import { Observable } from "rxjs";
import { BgStore } from "src/app/bg-utils/store.util";
import { BaronyLandTile, BaronyLandTileCoordinates, BaronyPlayer, getLandTileCoordinateKey } from "../models";
import { getRandomLandTiles } from "./barony-initializer";

interface BaronyState {
  players: BaronyPlayer[];
  landTiles: {
    map: { [key: string]: BaronyLandTile };
    coordinates: BaronyLandTileCoordinates[];
  };
} // BaronyState

export class BaronyContext {

  private store = new BgStore<BaronyState> ({
    players: [
      { name: "Leo", color: "blue" },
      { name: "Nico", color: "red" },
      // { name: "Rob", color: "yellow" },
      // { name: "Salvatore", color: "green" }
    ],
    landTiles: getRandomLandTiles (2)
  });

  getPlayers (): BaronyPlayer[] { return this.store.get (s => s.players); }
  getPlayerByIndex (index: number): BaronyPlayer { return this.getPlayers ()[index]; }
  getNumberOfPlayers (): number { return this.getPlayers ().length; }
  
  private selectLandTileMap$ () { return this.store.select$ (s => s.landTiles.map); }
  private selectLandTileKeys$ () { return this.store.select$ (s => s.landTiles.coordinates); }
  selectLandTiles$ (): Observable<BaronyLandTile[]> {
    return this.store.select$ (
      this.selectLandTileMap$ (),
      this.selectLandTileKeys$ (),
      (map, keys) => keys.map (k => map[getLandTileCoordinateKey (k)])
    );
  } // selectLandTiles$
  selectPlayers$ (): Observable<BaronyPlayer[]> { return this.store.select$ (s => s.players); }

} // BaronyContext
