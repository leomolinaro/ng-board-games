import { WotrRegionId } from "./wotr-region.models";

export type WotrRegionAction = WotrRegionChoose;

export interface WotrRegionChoose { type: "region-choose"; region: WotrRegionId }
export function targetRegion (region: WotrRegionId): WotrRegionChoose { return { type: "region-choose", region }; }
