import { ABgArcheoGame, ABgProtoGame, ABgProtoGameState, ABgProtoPlayer, ABgProtoPlayerType } from "src/app/bg-services/bg-proto-game.service";
import { BaronyColor } from "../models";

export interface BaronyArcheoGame extends ABgArcheoGame {
} // BaronyArcheoGame

export interface BaronyProtoGame extends ABgProtoGame {
  state: BaronyProtoGameState;
} // BaronyanniaOpenGame

export interface BaronyProtoPlayer extends ABgProtoPlayer {
  name: string;
  color: BaronyColor;
  type: BaronyProtoPlayerType;
} // BaronyProtoPlayer

export type BaronyProtoGameState = ABgProtoGameState;
export type BaronyProtoPlayerType = ABgProtoPlayerType;
