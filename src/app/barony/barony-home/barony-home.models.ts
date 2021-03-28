import { BaronyColor } from "../models";

export interface BaronyNewGame {
  id: string | null;
  name: string;
  type: BaronyNewGameType;
  userId: string;
  players: BaronyNewPlayer[];
} // BaronyNewGame

export interface BaronyNewPlayer {
  userId: string | null;
  name: string;
  color: BaronyColor;
  type: BaronyNewPlayerType;
} // BaronyNewPlayer

export type BaronyNewGameType = "local" | "online";
export type BaronyNewPlayerType = "me" | "other" | "open" | "closed" | "ai";

export interface BaronyNewGameTypeOption {
  id: BaronyNewGameType;
  label: string;
} // BaronyNewGameTypeOption

export const gameTypeOptions: BaronyNewGameTypeOption[] = [
  { id: "local", label: "Local" },
  { id: "online", label: "Online" }
];
