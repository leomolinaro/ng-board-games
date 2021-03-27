import { BaronyColor } from "../models";

export interface BaronyNewGame {
  id: string | null;
  name: string;
  userId: string;
  players: BaronyNewPlayer[];
  type: BaronyNewGameType;
} // BaronyNewGame

export interface BaronyNewPlayer {
  userId: string | null;
  name: string;
  color: BaronyColor;
  type: BaronyNewPlayerType;
} // BaronyNewPlayer

export type BaronyNewGameType = "local" | "online";
export type BaronyNewPlayerType = "local" | "open" | "closed" | "ai";

export interface BaronyNewGameTypeOption {
  id: BaronyNewGameType;
  label: string;
} // BaronyNewGameTypeOption

export interface BaronyNewPlayerTypeOption {
  id: BaronyNewPlayerType;
  label: string;
  notOffline: boolean;
} // BaronyNewPlayerTypeOption

export const gameTypeOptions: BaronyNewGameTypeOption[] = [
  { id: "local", label: "Local" },
  { id: "online", label: "Online" }
];

export const playerTypeOptions: BaronyNewPlayerTypeOption[] = [
  { id: "local", label: "Local", notOffline: false },
  { id: "open", label: "Open", notOffline: true },
  { id: "closed", label: "Closed", notOffline: false },
  { id: "ai", label: "AI", notOffline: false },
]; // playerTypeOptions
