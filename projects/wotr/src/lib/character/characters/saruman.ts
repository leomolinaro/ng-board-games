import { WotrAbility } from "../../ability/wotr-ability";
import { WotrActionDie } from "../../action-die/wotr-action-die-models";
import {
  WotrActionDieChoiceModifier,
  WotrActionDieModifiers
} from "../../action-die/wotr-action-die-modifiers";
import { WotrAction } from "../../commons/wotr-action-models";
import { WotrFrontId } from "../../front/wotr-front-models";
import { WotrGameUi, WotrUiCharacterChoice, WotrUiChoice } from "../../game/wotr-game-ui";
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

export class TheVoiceOfSarumanAbility implements WotrAbility<WotrActionDieChoiceModifier> {
  constructor(
    private nationStore: WotrNationStore,
    private regionStore: WotrRegionStore,
    private actionDieModifiers: WotrActionDieModifiers,
    private ui: WotrGameUi,
    private unitUi: WotrUnitUi
  ) {}

  public modifier = this.actionDieModifiers.actionDieChoices;

  public handler: WotrActionDieChoiceModifier = (die, frontId) => {
    if (die !== "muster" && die !== "muster-army") return [];
    if (frontId !== "shadow") return [];
    return [new SarumanVoiceChoice(this.regionStore, this.nationStore, this.ui, this.unitUi)];
  };
}

class SarumanVoiceChoice implements WotrUiCharacterChoice {
  constructor(
    private regionStore: WotrRegionStore,
    private nationStore: WotrNationStore,
    private ui: WotrGameUi,
    private unitUi: WotrUnitUi
  ) {
    this.subChoices = [
      new SarumanRecruitmentChoice(this.ui, this.regionStore, this.nationStore, this.unitUi),
      new SarumanUpgradeRegularsChoice(this.regionStore, this.nationStore, this.ui)
    ];
  }
  private subChoices: WotrUiChoice[];

  character: WotrCharacterId = "saruman";

  label(): string {
    return "Recruit with The Voice of Saruman";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    const nation = this.nationStore.nation("isengard");
    if (nation.politicalStep !== "atWar") return false;
    if (!this.regionStore.isUnconquered("orthanc")) return false;
    if (this.regionStore.isUnderSiege("orthanc")) return false;
    if (this.subChoices.some(c => c.isAvailable!(frontId))) return true;
    return false;
  }

  async actions(frontId: WotrFrontId): Promise<WotrAction[]> {
    const actions = await this.ui.askChoice(
      "Choose an action for The Voice of Saruman",
      this.subChoices,
      "shadow"
    );
    return actions;
  }
}

class SarumanRecruitmentChoice implements WotrUiChoice {
  constructor(
    private ui: WotrGameUi,
    private regionStore: WotrRegionStore,
    private nationStore: WotrNationStore,
    private unitUi: WotrUnitUi
  ) {}

  label(): string {
    return "Recruit up to three regular units";
  }

  isAvailable(): boolean {
    return this.nationStore.hasRegularReinforcements("isengard");
  }

  async actions(params: WotrFrontId): Promise<WotrAction[]> {
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
}

class SarumanUpgradeRegularsChoice implements WotrUiChoice {
  constructor(
    private regionStore: WotrRegionStore,
    private nationStore: WotrNationStore,
    private ui: WotrGameUi
  ) {}

  label(): string {
    return "Replace two regular units in Orthanc with two elite units";
  }

  isAvailable(): boolean {
    if (!this.nationStore.hasEliteReinforcements("isengard")) return false;
    const orthanc = this.regionStore.region("orthanc");
    return orthanc.army?.regulars?.some(r => r.nation === "isengard") ?? false;
  }

  async actions(params: WotrFrontId): Promise<WotrAction[]> {
    const maxRegulars = this.nUpgradeableRegulars();
    const quantity = await this.ui.askQuantity("How many regular units to upgrade?", {
      min: 1,
      max: maxRegulars,
      default: maxRegulars
    });
    return [upgradeRegularUnit("orthanc", "isengard", quantity)];
  }

  private nUpgradeableRegulars(): number {
    const orthanc = this.regionStore.region("orthanc");
    const nRegulars = orthanc.army?.regulars?.find(r => r.nation === "isengard")?.quantity ?? 0;
    const nAvailableElites = this.nationStore.nation("isengard").reinforcements?.elite ?? 0;
    return Math.min(nRegulars, nAvailableElites, 2);
  }
}

export class ServantsOfTheWhiteHandAbility implements WotrAbility<WotrLeadershipModifier> {
  constructor(private unitModifiers: WotrUnitModifiers) {}

  public modifier = this.unitModifiers.leadership;

  public handler: WotrLeadershipModifier = army => {
    if (army.front !== "shadow") return 0;
    return army.elites?.find(unit => unit.nation === "isengard")?.quantity || 0;
  };
}
