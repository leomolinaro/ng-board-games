import { Injectable, inject } from "@angular/core";
import { WotrActionDie } from "../../action-die/wotr-action-die-models";
import { WotrCardAbility } from "../../card/ability/wotr-card-ability";
import { WotrAction } from "../../commons/wotr-action-models";
import { WotrGameUi } from "../../game/wotr-game-ui";
import { WotrRegionId } from "../../region/wotr-region-models";
import { WotrRegionStore } from "../../region/wotr-region-store";
import { playCharacter } from "../wotr-character-actions";
import { WotrCharacterId } from "../wotr-character-models";
import { WotrCharacterStore } from "../wotr-character-store";
import { CaptainOfTheWestAbility, WotrCharacterCard } from "./wotr-character-card";

// Aragorn - Heir to Isildur (Level 3, Leadership 2, +1 Action Die)
// If Strider is in Minas Tirith, Dol Amroth, or Pelargir, and that Settlement is unconquered, you may use one Will of the West Action die result to replace Strider
// with Aragorn.
// Captain of the West. If Aragorn is in a battle, add one to the Combat Strength of the Free Peoples Army (you can still roll a maximum of 5 Combat dice).

@Injectable({ providedIn: "root" })
export class WotrAragorn extends WotrCharacterCard {
  private regionStore = inject(WotrRegionStore);
  protected characterStore = inject(WotrCharacterStore);

  protected override characterId: WotrCharacterId = "aragorn";

  override canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    if (!this.characterStore.isAvailable("aragorn")) return false;
    if (die !== "will-of-the-west") return false;
    if (this.striderValidRegion()) return true;
    return false;
  }

  private striderValidRegion(): WotrRegionId | null {
    if (this.striderInRegion("minas-tirith")) return "minas-tirith";
    if (this.striderInRegion("dol-amroth")) return "dol-amroth";
    if (this.striderInRegion("pelargir")) return "pelargir";
    return null;
  }

  private striderInRegion(regionId: WotrRegionId): boolean {
    const region = this.regionStore.region(regionId);
    if (region.army?.front === "free-peoples") {
      return !!region.army.characters?.some(c => c === "strider");
    } else {
      return !!region.freeUnits?.characters?.some(c => c === "strider");
    }
  }

  override async bringIntoPlay(ui: WotrGameUi): Promise<WotrAction> {
    const regionId = this.striderValidRegion();
    if (!regionId) throw new Error("Strider is not in a valid region to bring Aragorn into play.");
    return playCharacter(regionId, "aragorn");
  }

  override inPlayAbilities(): WotrCardAbility[] {
    return [new CaptainOfTheWestAbility(this.characterId, this.characterStore)];
  }
}
