import { Injectable } from "@angular/core";
import { WotrModifier } from "../commons/wotr-modifier";
import { WotrNationId } from "./wotr-nation-models";
import { WotrNationActivationSource, WotrNationAdvanceSource } from "./wotr-nation-rules";

export type WotrCanAdvanceNationModifier = (
  nationId: WotrNationId,
  source: WotrNationAdvanceSource
) => boolean;

export type WotrAfterNationAdvance = (
  nationId: WotrNationId,
  source: WotrNationAdvanceSource
) => void;

export type WotrCanActivateNationModifier = (
  nationId: WotrNationId,
  source: WotrNationActivationSource
) => boolean;

export type WotrAfterNationActivation = (
  nationId: WotrNationId,
  source: WotrNationActivationSource
) => void;

@Injectable()
export class WotrNationModifiers {
  public readonly canAdvanceNationModifier = new WotrModifier<WotrCanAdvanceNationModifier>();
  public canAdvanceNation(nationId: WotrNationId, source: WotrNationAdvanceSource): boolean {
    return this.canAdvanceNationModifier.get().every(modifier => modifier(nationId, source));
  }

  public readonly afterNationAdvance = new WotrModifier<WotrAfterNationAdvance>();
  public onAfterNationAdvance(nationId: WotrNationId, source: WotrNationAdvanceSource): void {
    this.afterNationAdvance.get().forEach(handler => handler(nationId, source));
  }

  public readonly canActivateNationModifier = new WotrModifier<WotrCanActivateNationModifier>();
  public canActivateNation(nationId: WotrNationId, source: WotrNationActivationSource): boolean {
    return this.canActivateNationModifier.get().every(modifier => modifier(nationId, source));
  }

  public readonly afterNationActivation = new WotrModifier<WotrAfterNationActivation>();
  public onAfterNationActivation(nationId: WotrNationId, source: WotrNationActivationSource): void {
    this.afterNationActivation.get().forEach(handler => handler(nationId, source));
  }

  clear() {
    this.canAdvanceNationModifier.clear();
    this.afterNationAdvance.clear();
    this.canActivateNationModifier.clear();
    this.afterNationActivation.clear();
  }
}
