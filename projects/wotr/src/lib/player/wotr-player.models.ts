import { BgUser } from "@leobg/commons";
import { WotrFrontId } from "../front/wotr-front.models";

export interface AWotrPlayer {
  id: WotrFrontId;
  name: string;
}

export interface WotrAiPlayer extends AWotrPlayer {
  isAi: true;
  isRemote: false;
  isLocal: false;
}

export interface WotrRealPlayer extends AWotrPlayer {
  isAi: false;
  isRemote: boolean;
  isLocal: boolean;
  controller: BgUser;
}

export type WotrPlayer = WotrAiPlayer | WotrRealPlayer;
