import { Observable } from "rxjs";
import { BgStore } from "src/app/bg-utils/store.util";
import { BaronyLandTile, BaronyLandTileCoordinates, BaronyPlayer, getLandTileCoordinateKey } from "../models";
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
  
} // BaronyContext
