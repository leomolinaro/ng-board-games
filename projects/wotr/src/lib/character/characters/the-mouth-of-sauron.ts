import { WotrAbility } from "../../ability/wotr-ability";
import { WotrActionDie } from "../../action-die/wotr-action-die-models";
import { WotrAction } from "../../commons/wotr-action-models";
import { WotrFellowshipStore } from "../../fellowship/wotr-fellowship-store";
import { WotrFrontStore } from "../../front/wotr-front-store";
import { WotrGameUi } from "../../game/wotr-game-ui";
import { WotrRegion } from "../../region/wotr-region-models";
import { WotrRegionStore } from "../../region/wotr-region-store";
import { playCharacter } from "../wotr-character-actions";
import { WotrCharacterId } from "../wotr-character-models";
import { WotrCharacterStore } from "../wotr-character-store";
import { WotrCharacterCard } from "./wotr-character-card";

// The Mouth of Sauron - Lieutenant of Barad-dûr (Level 3, Leadership 2, +1 Action Die)
// If the Fellowship is on the Mordor Track or all the Free Peoples Nations are "At War," you may use one Muster action die result to place the Mouth of Sauron in
// any region with an unconquered Sauron Stronghold.
// Messenger of the Dark Tower. Once per turn, you may use a Muster Action die result as an Army Action die result instead.

export class WotrMouthOfSauron extends WotrCharacterCard {
  constructor(
    public override characterId: WotrCharacterId,
    private characterStore: WotrCharacterStore,
    private fellowshipStore: WotrFellowshipStore,
    private regionStore: WotrRegionStore,
    private frontStore: WotrFrontStore
  ) {
    super();
  }

  override canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    return (
      die === "muster" &&
      this.characterStore.isAvailable("the-mouth-of-sauron") &&
      (this.fellowshipStore.isOnMordorTrack() ||
        this.frontStore.front("free-peoples").victoryPoints > 0) &&
      this.regionStore.regions().some(r => this.isValidRegion(r))
    );
  }

  override async bringIntoPlay(ui: WotrGameUi): Promise<WotrAction> {
    const validRegions = this.regionStore
      .regions()
      .filter(r => this.isValidRegion(r))
      .map(r => r.id);
    const region = await ui.askRegion(
      "Select a region to bring the Mouth of Sauron into play",
      validRegions
    );
    return playCharacter(region, "the-mouth-of-sauron");
  }

  private isValidRegion(r: WotrRegion): boolean {
    return (
      r.nationId === "sauron" &&
      this.regionStore.isUnconquered(r.id) &&
      r.settlement === "stronghold"
    );
  }
}

export class MessengerOfTheDarkTowerAbility implements WotrAbility<unknown> {
  public modifier = null as any;
  public handler = null;
}
