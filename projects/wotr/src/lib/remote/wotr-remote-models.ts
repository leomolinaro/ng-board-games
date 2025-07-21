import { BgUser } from "@leobg/commons";
import { WotrFrontId } from "../front/wotr-front-models";

export interface WotrGameDoc {
  id: string;
  name: string;
  owner: BgUser;
  online: boolean;
  state: "open" | "closed";
}

export interface AWotrPlayerDoc {
  id: WotrFrontId;
  name: string;
  sort: number;
}

export interface WotrAiPlayerDoc extends AWotrPlayerDoc {
  isAi: true;
}

export interface WotrReadPlayerDoc extends AWotrPlayerDoc {
  isAi: false;
  controller: BgUser;
}

export type WotrPlayerDoc = WotrAiPlayerDoc | WotrReadPlayerDoc;
