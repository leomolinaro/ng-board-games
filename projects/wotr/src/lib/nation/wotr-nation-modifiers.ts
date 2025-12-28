import { Injectable } from "@angular/core";
import { WotrModifier } from "../commons/wotr-modifier";
import { WotrNationId } from "./wotr-nation-models";
import { WotrNationAdvanceSource } from "./wotr-nation-rules";

export type WotrCanAdvanceNationModifier = (
  nationId: WotrNationId,
  source: WotrNationAdvanceSource
) => boolean;

export type WotrAfterNationAdvance = (
  nationId: WotrNationId,
  source: WotrNationAdvanceSource
) => void;

@Injectable({ providedIn: "root" })
export class WotrNationModifiers {
  public readonly canAdvanceNationModifiers = new WotrModifier<WotrCanAdvanceNationModifier>();
  public canAdvanceNation(nationId: WotrNationId, source: WotrNationAdvanceSource): boolean {
    return this.canAdvanceNationModifiers.get().every(modifier => modifier(nationId, source));
  }

  public readonly afterNationAdvance = new WotrModifier<WotrAfterNationAdvance>();
  public onAfterNationAdvance(nationId: WotrNationId, source: WotrNationAdvanceSource): void {
    this.afterNationAdvance.get().forEach(handler => handler(nationId, source));
  }

  clear() {
    this.canAdvanceNationModifiers.clear();
    this.afterNationAdvance.clear();
  }
}
