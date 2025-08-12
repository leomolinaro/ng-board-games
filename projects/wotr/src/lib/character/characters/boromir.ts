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

// Boromir - Son of Denethor (Level 2, Leadership 1)
// Captain of the West. If Boromir is in a battle, add one to the Combat Strength of the Free Peoples Army (you can still roll a maximum of 5 Combat dice).
// High Warden of the White Tower. If Boromir is in an unconquered Gondor City or Stronghold, use any Action die result to advance the Gondor Nation one step on
// the Political Track.

@Injectable({ providedIn: "root" })
export class WotrBoromir extends WotrCharacterCard {
  protected characterStore = inject(WotrCharacterStore);
  private battleModifiers = inject(WotrBattleModifiers);
  private actionDieModifiers = inject(WotrActionDieModifiers);
  private regionStore = inject(WotrRegionStore);
  private nationStore = inject(WotrNationStore);

  protected override characterId: WotrCharacterId = "boromir";

  override inPlayAbilities(): WotrCardAbility[] {
    return [
      new CaptainOfTheWestAbility(this.characterId, this.battleModifiers),
      new HighWardenOfTheWhiteTowerAbility(
        this.regionStore,
        this.nationStore,
        this.actionDieModifiers
      )
    ];
  }
}

class HighWardenOfTheWhiteTowerAbility implements WotrCardAbility {
  constructor(
    private regionStore: WotrRegionStore,
    private nationStore: WotrNationStore,
    private actionDieModifiers: WotrActionDieModifiers
  ) {}

  private modifier: WotrActionDieChoiceModifier = (die, frontId) => {
    if (frontId !== "free-peoples") return [];
    const boromirRegion = this.regionStore.characterRegion("boromir")!;
    if (boromirRegion.nationId !== "gondor") return [];
    if (boromirRegion.settlement !== "city" && boromirRegion.settlement !== "stronghold") return [];
    if (!this.regionStore.isUnconquered(boromirRegion.id)) return [];
    const choice: WotrPlayerChoice = {
      label: () => "High Warden of the White Tower",
      isAvailable: () => {
        const nation = this.nationStore.nation("gondor");
        if (nation.politicalStep === "atWar") return false;
        return true;
      },
      resolve: async () => {
        return [advanceNation("gondor")];
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
