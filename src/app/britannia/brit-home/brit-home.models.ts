import { ABgArcheoGame, ABgProtoGame, ABgProtoGameState, ABgProtoPlayer, ABgProtoPlayerType } from "src/app/bg-services/bg-proto-game.service";
import { BritColor } from "../brit.models";

export interface BritArcheoGame extends ABgArcheoGame {
} // BritArcheoGame

export interface BritProtoGame extends ABgProtoGame {
  state: BritProtoGameState;
} // BritanniaOpenGame

export interface BritProtoPlayer extends ABgProtoPlayer {
  name: string;
  color: BritColor;
  type: BritProtoPlayerType;
  ready: boolean;
} // BritProtoPlayer

export type BritProtoGameState = ABgProtoGameState;
export type BritProtoPlayerType = ABgProtoPlayerType;
