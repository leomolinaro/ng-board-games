import { inject, Injectable } from "@angular/core";
import { WotrActionDie } from "../action-die/wotr-action-die.models";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship.store";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrNationStore } from "../nation/wotr-nation.store";
import { WotrRegionId } from "../region/wotr-region.models";
import { WotrRegionStore } from "../region/wotr-region.store";
import { playCharacter } from "./wotr-character-actions";
import { WotrCharacterStore } from "./wotr-character.store";

export interface WotrCharacterCard {
  name(): string;
  canBeBroughtIntoPlay(die: WotrActionDie): boolean;
  bringIntoPlay(): Promise<WotrAction>;
}

@Injectable({ providedIn: "root" })
export class WotrGandalfTheWhiteCard implements WotrCharacterCard {
  private characterStore = inject(WotrCharacterStore);
  name(): string {
    return this.characterStore.character("gandalf-the-white").name;
  }
  canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    if (!this.characterStore.isAvailable("gandalf-the-white")) return false;
    if (die !== "will-of-the-west") return false;
    const gandalf = this.characterStore.character("gandalf-the-grey");
    if (gandalf.status !== "inPlay" && gandalf.status !== "eliminated") return false;
    if (
      this.characterStore.minions().every(c => {
        return c.status !== "inPlay" && c.status !== "eliminated";
      })
    ) {
      return false;
    }
    return true;
  }
  bringIntoPlay(): Promise<WotrAction> {
    throw new Error("Method not implemented.");
  }
}

@Injectable({ providedIn: "root" })
export class WotrAragornCard implements WotrCharacterCard {
  private regionStore = inject(WotrRegionStore);
  private characterStore = inject(WotrCharacterStore);

  name(): string {
    return this.characterStore.character("aragorn").name;
  }

  canBeBroughtIntoPlay(die: WotrActionDie): boolean {
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
  async bringIntoPlay(): Promise<WotrAction> {
    const regionId = this.striderValidRegion();
    if (!regionId) throw new Error("Strider is not in a valid region to bring Aragorn into play.");
    return playCharacter(regionId, "aragorn");
  }
}

@Injectable({ providedIn: "root" })
export class WotrSarumanCard implements WotrCharacterCard {
  private characterStore = inject(WotrCharacterStore);
  private nationStore = inject(WotrNationStore);
  private regionStore = inject(WotrRegionStore);

  name(): string {
    return this.characterStore.character("saruman").name;
  }

  canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    return (
      die === "muster" &&
      this.characterStore.isAvailable("saruman") &&
      this.nationStore.isAtWar("isengard") &&
      this.regionStore.isUnconquered("orthanc")
    );
  }

  async bringIntoPlay(): Promise<WotrAction> {
    return playCharacter("orthanc", "saruman");
  }
}

@Injectable({ providedIn: "root" })
export class WotrWitchKingCard implements WotrCharacterCard {
  private characterStore = inject(WotrCharacterStore);
  private nationStore = inject(WotrNationStore);
  private regionStore = inject(WotrRegionStore);

  name(): string {
    return this.characterStore.character("the-witch-king").name;
  }

  canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    return (
      die === "muster" &&
      this.characterStore.isAvailable("the-witch-king") &&
      this.nationStore.isAtWar("sauron") &&
      this.nationStore.freePeoplesNations().some(n => this.nationStore.isAtWar(n.id)) &&
      this.regionStore.regions().some(r => {
        if (!r.army) return false;
        if (r.army.front !== "shadow") return false;
        return (
          r.army.regulars?.some(u => u.nation === "sauron") ||
          r.army.elites?.some(c => c.nation === "sauron")
        );
      })
    );
  }

  bringIntoPlay(): Promise<WotrAction> {
    throw new Error("Method not implemented.");
  }
}

@Injectable({ providedIn: "root" })
export class WotrMouthOfSauronCard implements WotrCharacterCard {
  private frontStore = inject(WotrFrontStore);
  private characterStore = inject(WotrCharacterStore);
  private fellowshipStore = inject(WotrFellowshipStore);
  private regionStore = inject(WotrRegionStore);

  name(): string {
    return this.characterStore.character("the-mouth-of-sauron").name;
  }

  canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    return (
      die === "muster" &&
      this.characterStore.isAvailable("the-mouth-of-sauron") &&
      (this.fellowshipStore.isOnMordorTrack() ||
        this.frontStore.front("free-peoples").victoryPoints > 0) &&
      this.regionStore
        .regions()
        .some(
          r =>
            r.nationId === "sauron" &&
            this.regionStore.isUnconquered(r.id) &&
            r.settlement === "stronghold"
        )
    );
  }
  bringIntoPlay(): Promise<WotrAction> {
    throw new Error("Method not implemented.");
  }
}
