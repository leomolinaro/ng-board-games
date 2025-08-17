import { WotrActionDie } from "../../action-die/wotr-action-die-models";
import {
  WotrActionDieChoiceModifier,
  WotrActionDieModifiers
} from "../../action-die/wotr-action-die-modifiers";
import { WotrCardAbility } from "../../card/ability/wotr-card-ability";
import { WotrAction } from "../../commons/wotr-action-models";
import { WotrGameUi, WotrPlayerChoice } from "../../game/wotr-game-ui";
import { WotrNationStore } from "../../nation/wotr-nation-store";
import { WotrRegionId } from "../../region/wotr-region-models";
import { WotrRegionStore } from "../../region/wotr-region-store";
import { upgradeRegularUnit } from "../../unit/wotr-unit-actions";
import { WotrLeadershipModifier, WotrUnitModifiers } from "../../unit/wotr-unit-modifiers";
import { WotrUnitUi } from "../../unit/wotr-unit-ui";
import { playCharacter } from "../wotr-character-actions";
import { WotrCharacterId } from "../wotr-character-models";
import { WotrCharacterStore } from "../wotr-character-store";
import { WotrCharacterCard } from "./wotr-character-card";

// Saruman - Corrupted Wizard (Level 0, Leadership 1, +1 Action Die)
// If Isengard is "At War'' and Orthanc is unconquered, you may use one Muster Action die result to place Saruman in Orthanc. Saruman cannot leave Orthanc.
// The Voice of Saruman. As long as Orthanc is under your control and not under siege, you may use a Muster Action die result to recruit one Regular Isengard unit in
// every Isengard Settlement or to replace two Regular Isengard units in Orthanc with two Elite units.
// Servants of the White Hand. Each Isengard Elite unit is considered to be a Leader as well as an Army unit for all movement and combat purposes

export class WotrSaruman extends WotrCharacterCard {
  constructor(
    public override characterId: WotrCharacterId,
    private characterStore: WotrCharacterStore,
    private nationStore: WotrNationStore,
    private regionStore: WotrRegionStore
  ) {
    super();
  }

  override canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    return (
      die === "muster" &&
      this.characterStore.isAvailable("saruman") &&
      this.nationStore.isAtWar("isengard") &&
      this.regionStore.isUnconquered("orthanc")
    );
  }

  override async bringIntoPlay(): Promise<WotrAction> {
    return playCharacter("orthanc", "saruman");
  }
}

export class TheVoiceOfSarumanAbility extends WotrCardAbility<WotrActionDieChoiceModifier> {
  constructor(
    private nationStore: WotrNationStore,
    private regionStore: WotrRegionStore,
    actionDieModifiers: WotrActionDieModifiers,
    private ui: WotrGameUi,
    private unitUi: WotrUnitUi
  ) {
    super(actionDieModifiers.actionDieChoices);
  }

  protected override handler: WotrActionDieChoiceModifier = (die, frontId) => {
    if (die !== "muster" && die !== "muster-army") return [];
    if (frontId !== "shadow") return [];
    const choice: WotrPlayerChoice = {
      label: () => "Recruit with The Voice of Saruman",
      isAvailable: () => {
        const nation = this.nationStore.nation("isengard");
        if (nation.politicalStep !== "atWar") return false;
        if (!this.regionStore.isUnconquered("orthanc")) return false;
        if (this.regionStore.isUnderSiege("orthanc")) return false;
        if (this.canRecruitRegulars() || this.canUpgradeRegulars()) return true;
        return false;
      },
      resolve: async () => {
        const choices: WotrPlayerChoice[] = [];
        choices.push({
          label: () => "Recruit up to three regular units",
          isAvailable: () => this.canRecruitRegulars(),
          resolve: async () => this.recruitRegulars()
        });
        choices.push({
          label: () => "Replace two regular units in Orthanc with two elite units",
          isAvailable: () => this.canUpgradeRegulars(),
          resolve: async () => this.upgradeRegulars()
        });
        const actions = await this.ui.askChoice(
          "Choose an action for The Voice of Saruman",
          choices,
          "shadow"
        );
        return actions;
      }
    };
    return [choice];
  };

  private canRecruitRegulars(): boolean {
    const isengardNation = this.nationStore.nation("isengard");
    return this.nationStore.hasRegularReinforcements(isengardNation);
  }

  private canUpgradeRegulars(): boolean {
    const isengardNation = this.nationStore.nation("isengard");
    if (!this.nationStore.hasEliteReinforcements(isengardNation)) return false;
    const orthanc = this.regionStore.region("orthanc");
    return orthanc.army?.regulars?.some(r => r.nation === "isengard") ?? false;
  }

  private nUpgradeableRegulars(): number {
    const orthanc = this.regionStore.region("orthanc");
    const nRegulars = orthanc.army?.regulars?.find(r => r.nation === "isengard")?.quantity ?? 0;
    const nAvailableElites = this.nationStore.nation("isengard").reinforcements?.elite ?? 0;
    return Math.min(nRegulars, nAvailableElites, 2);
  }

  private async recruitRegulars(): Promise<WotrAction[]> {
    const exludedRegions = new Set<WotrRegionId>();
    let counter = 0;
    let canPass = false;
    const isengardNation = this.nationStore.nation("isengard");
    const actions: WotrAction[] = [];
    while (counter < 3) {
      const validRegions = this.regionStore
        .recruitmentRegions(isengardNation)
        .filter(r => !exludedRegions.has(r.id));
      const unit = await this.ui.askReinforcementUnit("Choose a unit to recruit", {
        units: [{ type: "regular", nation: "isengard" }],
        frontId: "shadow",
        canPass
      });
      if (!unit) return actions;
      const regionId = await this.ui.askRegion(
        "Choose a region to recruit in",
        validRegions.map(r => r.id)
      );
      exludedRegions.add(regionId);
      actions.push(this.unitUi.recruitUnit(unit, regionId));
      actions.push(...(await this.unitUi.checkStackingLimit(regionId, "shadow")));
      canPass = true;
      counter++;
    }
    return actions;
  }

  private async upgradeRegulars(): Promise<WotrAction[]> {
    const maxRegulars = this.nUpgradeableRegulars();
    const quantity = await this.ui.askQuantity("How many regular units to upgrade?", {
      min: 1,
      max: maxRegulars,
      default: maxRegulars
    });
    return [upgradeRegularUnit("orthanc", "isengard", quantity)];
  }
}

export class ServantsOfTheWhiteHandAbility extends WotrCardAbility<WotrLeadershipModifier> {
  constructor(unitModifiers: WotrUnitModifiers) {
    super(unitModifiers.leadership);
  }

  protected override handler: WotrLeadershipModifier = army => {
    if (army.front !== "shadow") return 0;
    return army.elites?.find(unit => unit.nation === "isengard")?.quantity || 0;
  };
}
