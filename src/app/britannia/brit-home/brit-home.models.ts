import { BgArcheoGame, BgProtoGame, BgProtoGameState, BgProtoPlayer, BgProtoPlayerType } from "src/app/bg-services/bg-proto-game.service";
import { BritColor } from "../brit.models";

export interface BritArcheoGame extends BgArcheoGame {
} // BritArcheoGame

export interface BritProtoGame extends BgProtoGame {
  state: BritProtoGameState;
} // BritanniaOpenGame

export interface BritProtoPlayer extends BgProtoPlayer {
  name: string;
  color: BritColor;
  type: BritProtoPlayerType;
  ready: boolean;
} // BritProtoPlayer

export type BritProtoGameState = BgProtoGameState;
export type BritProtoPlayerType = BgProtoPlayerType;
