import { WotrHuntTile } from "./wotr-hunt.models";

export interface WotrHuntState {
  huntPool: WotrHuntTile[];
  huntDrawn: WotrHuntTile[];
  huntReady: WotrHuntTile[];
  huntAvailable: WotrHuntTile[];
  huntRemoved: WotrHuntTile[];
  nHuntDice: number;
}

export function initHuntState (): WotrHuntState {
  return {
    huntPool: ["3", "3", "3", "2", "2", "1", "1", "er", "er", "er", "er", "2r", "1r", "1r", "0r", "0r"],
    huntDrawn: [],
    huntReady: [],
    huntAvailable: ["b0", "b-1", "b-2", "er", "r1rs", "r3s", "rds", "rers"],
    huntRemoved: [],
    nHuntDice: 0
  };
}
