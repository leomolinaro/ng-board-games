import { WotrAbility } from "../../ability/wotr-ability";
import { WotrActionDie } from "../../action-die/wotr-action-die-models";
import {
  WotrActionDieChoiceModifier,
  WotrActionDieModifiers
} from "../../action-die/wotr-action-die-modifiers";
import { WotrAction } from "../../commons/wotr-action-models";
import { WotrFrontId } from "../../front/wotr-front-models";
import { WotrGameQuery } from "../../game/wotr-game-query";
import { WotrGameUi, WotrUiCharacterChoice, WotrUiChoice } from "../../game/wotr-game-ui";
import { WotrRegionId } from "../../region/wotr-region-models";
import { upgradeRegularUnit } from "../../unit/wotr-unit-actions";
import { WotrLeaderModifier, WotrUnitModifiers } from "../../unit/wotr-unit-modifiers";
import { WotrUnitUi } from "../../unit/wotr-unit-ui";
import { playCharacter } from "../wotr-character-actions";
import { WotrCharacterId } from "../wotr-character-models";
import { WotrCharacterCard } from "./wotr-character-card";

// Saruman - Corrupted Wizard (Level 0, Leadership 1, +1 Action Die)
// If Isengard is "At War'' and Orthanc is unconquered, you may use one Muster Action die result to place Saruman in Orthanc. Saruman cannot leave Orthanc.
// The Voice of Saruman. As long as Orthanc is under your control and not under siege, you may use a Muster Action die result to recruit one Regular Isengard unit in
// every Isengard Settlement or to replace two Regular Isengard units in Orthanc with two Elite units.
// Servants of the White Hand. Each Isengard Elite unit is considered to be a Leader as well as an Army unit for all movement and combat purposes

export class WotrSaruman extends WotrCharacterCard {
  constructor(
    public override characterId: WotrCharacterId,
    private q: WotrGameQuery
  ) {
    super();
  }

  override canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    return (
      die === "muster" &&
      this.q.saruman.isAvailable() &&
      this.q.isengard.isAtWar() &&
      this.q.region("orthanc").isUnconquered()
    );
  }

  override async bringIntoPlay(): Promise<WotrAction> {
    return playCharacter("orthanc", "saruman");
  }
}

export class TheVoiceOfSarumanAbility implements WotrAbility<WotrActionDieChoiceModifier> {
  constructor(
    private q: WotrGameQuery,
    private actionDieModifiers: WotrActionDieModifiers,
    private ui: WotrGameUi,
    private unitUi: WotrUnitUi
  ) {}

  public modifier = this.actionDieModifiers.actionDieChoices;

  public handler: WotrActionDieChoiceModifier = (die, frontId) => {
    if (die !== "muster" && die !== "muster-army") return [];
    if (frontId !== "shadow") return [];
    return [new SarumanVoiceChoice(this.q, this.ui, this.unitUi)];
  };
}

class SarumanVoiceChoice implements WotrUiCharacterChoice {
  constructor(
    private q: WotrGameQuery,
    private ui: WotrGameUi,
    private unitUi: WotrUnitUi
  ) {
    this.subChoices = [
      new SarumanRecruitmentChoice(this.ui, this.q, this.unitUi),
      new SarumanUpgradeRegularsChoice(this.q, this.ui)
    ];
  }
  private subChoices: WotrUiChoice[];

  character: WotrCharacterId = "saruman";

  label(): string {
    return "Recruit with The Voice of Saruman";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    const isengard = this.q.isengard;
    if (!isengard.isAtWar()) return false;
    if (!this.q.region("orthanc").isUnconquered()) return false;
    if (this.q.region("orthanc").isUnderSiege("shadow")) return false;
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
    private q: WotrGameQuery,
    private unitUi: WotrUnitUi
  ) {}

  label(): string {
    return "Recruit up to three regular units";
  }

  isAvailable(): boolean {
    return this.q.isengard.hasRegularReinforcements();
  }

  async actions(params: WotrFrontId): Promise<WotrAction[]> {
    const exludedRegions = new Set<WotrRegionId>();
    let counter = 0;
    let canPass = false;
    const isengardNation = this.q.isengard;
    const actions: WotrAction[] = [];
    while (counter < 3) {
      const validRegions = isengardNation
        .recruitmentRegions()
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
      actions.push(...(await this.unitUi.recruitUnit(unit, regionId, "shadow")));
      canPass = true;
      counter++;
    }
    return actions;
  }
}

class SarumanUpgradeRegularsChoice implements WotrUiChoice {
  constructor(
    private q: WotrGameQuery,
    private ui: WotrGameUi
  ) {}

  label(): string {
    return "Replace two regular units in Orthanc with two elite units";
  }

  isAvailable(): boolean {
    if (!this.q.isengard.hasEliteReinforcements()) return false;
    const orthanc = this.q.region("orthanc").region();
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
    const orthanc = this.q.region("orthanc").region();
    const nRegulars = orthanc.army?.regulars?.find(r => r.nation === "isengard")?.quantity ?? 0;
    const nAvailableElites = this.q.isengard.nEliteReinforcements() ?? 0;
    return Math.min(nRegulars, nAvailableElites, 2);
  }
}

export class ServantsOfTheWhiteHandAbility implements WotrAbility<WotrLeaderModifier> {
  constructor(private unitModifiers: WotrUnitModifiers) {}

  public modifier = this.unitModifiers.leaderModifier;

  public handler: WotrLeaderModifier = (type, nationId) =>
    type === "elite" && nationId === "isengard";
}
