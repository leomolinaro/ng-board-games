import { Injectable, inject } from "@angular/core";
import {
  WotrActionDieChoiceModifier,
  WotrActionDieModifiers
} from "../../action-die/wotr-action-die-modifiers";
import { WotrBattleModifiers } from "../../battle/wotr-battle-modifiers";
import { WotrCardAbility } from "../../card/ability/wotr-card-ability";
import { WotrPlayerChoice } from "../../game/wotr-game-ui";
import { advanceNation } from "../../nation/wotr-nation-actions";
import { WotrNationStore } from "../../nation/wotr-nation-store";
import { WotrRegionStore } from "../../region/wotr-region-store";
import { WotrCharacterId } from "../wotr-character-models";
import { WotrCharacterStore } from "../wotr-character-store";
import { CaptainOfTheWestAbility, WotrCharacterCard } from "./wotr-character-card";

// Legolas - Son of Thranduil (Level 2, Leadership 1)
// Captain of the West. If Legolas is in a battle, add one to the Combat Strength of the Free Peoples Army (you can still roll a maximum of 5 Combat dice).
// Prince of Mirkwood. If Legolas is in an unconquered Elven Stronghold, you may use any Action die result to advance the Elven Nation one step on the Political Track.

@Injectable({ providedIn: "root" })
export class WotrLegolas extends WotrCharacterCard {
  protected characterStore = inject(WotrCharacterStore);
  private battleModifiers = inject(WotrBattleModifiers);
  private actionDieModifiers = inject(WotrActionDieModifiers);
  private regionStore = inject(WotrRegionStore);
  private nationStore = inject(WotrNationStore);

  protected override characterId: WotrCharacterId = "legolas";

  override inPlayAbilities(): WotrCardAbility[] {
    return [
      new CaptainOfTheWestAbility(this.characterId, this.battleModifiers),
      new PrinceOfMirkwoodAbility(this.regionStore, this.nationStore, this.actionDieModifiers)
    ];
  }
}

class PrinceOfMirkwoodAbility implements WotrCardAbility {
  constructor(
    private regionStore: WotrRegionStore,
    private nationStore: WotrNationStore,
    private actionDieModifiers: WotrActionDieModifiers
  ) {}

  private modifier: WotrActionDieChoiceModifier = (die, frontId) => {
    if (frontId !== "free-peoples") return [];
    const legolasRegion = this.regionStore.characterRegion("legolas")!;
    if (legolasRegion.nationId !== "elves") return [];
    if (legolasRegion.settlement !== "stronghold") return [];
    if (!this.regionStore.isUnconquered(legolasRegion.id)) return [];
    const choice: WotrPlayerChoice = {
      label: () => "Prince of Mirkwood",
      isAvailable: () => {
        const nation = this.nationStore.nation("elves");
        if (nation.politicalStep === "atWar") return false;
        return true;
      },
      resolve: async () => {
        return [advanceNation("elves")];
      }
    };
    return [choice];
  };

  activate(): void {
    this.actionDieModifiers.actionDieChoices.register(this.modifier);
  }

  deactivate(): void {
    this.actionDieModifiers.actionDieChoices.unregister(this.modifier);
  }
}
