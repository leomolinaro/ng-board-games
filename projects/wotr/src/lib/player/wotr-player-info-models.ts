import { BgUser } from "@leobg/commons";
import { WotrFrontId } from "../front/wotr-front-models";

export interface AWotrPlayerInfo {
  id: WotrFrontId;
  name: string;
}

export interface WotrAiPlayerInfo extends AWotrPlayerInfo {
  isAi: true;
  isRemote: false;
  isLocal: false;
}

export interface WotrRealPlayerInfo extends AWotrPlayerInfo {
  isAi: false;
  isRemote: boolean;
  isLocal: boolean;
  controller: BgUser;
}

export type WotrPlayerInfo = WotrAiPlayerInfo | WotrRealPlayerInfo;
