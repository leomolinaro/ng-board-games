import { ABgArcheoGame, ABgProtoGame, ABgProtoGameState, ABgProtoPlayer, ABgProtoPlayerType } from "@bg-services";
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
  ready: boolean;
} // BaronyProtoPlayer

export type BaronyProtoGameState = ABgProtoGameState;
export type BaronyProtoPlayerType = ABgProtoPlayerType;
