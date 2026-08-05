import { Injectable } from "@angular/core";
import { lazyInject } from "@leobg/commons/utils";
import { WotrActionDieUi } from "../action-die/wotr-action-die-ui";
import { WotrBattleUi } from "../battle/wotr-battle-ui";
import { WotrCardDrawUi } from "../card/wotr-card-draw-ui";
import { WotrCardPlayUi } from "../card/wotr-card-play-ui";
import { WotrCharacterUi } from "../character/wotr-character-ui";
import { WotrFellowshipUi } from "../fellowship/wotr-fellowship-ui";
import { WotrFrontUi } from "../front/wotr-front-ui";
import { WotrHuntUi } from "../hunt/wotr-hunt-ui";
import { WotrNationUi } from "../nation/wotr-nation-ui";
import { WotrUnitUi } from "../unit/wotr-unit-ui";
import { WotrGameUi } from "./wotr-game-ui";

@Injectable()
export class WotrGameUiContext {
  readonly actionDieUi = lazyInject(WotrActionDieUi);
  readonly battleUi = lazyInject(WotrBattleUi);
  readonly cardDrawUi = lazyInject(WotrCardDrawUi);
  readonly cardPlayUi = lazyInject(WotrCardPlayUi);
  readonly characterUi = lazyInject(WotrCharacterUi);
  readonly fellowshipUi = lazyInject(WotrFellowshipUi);
  readonly frontUi = lazyInject(WotrFrontUi);
  readonly huntUi = lazyInject(WotrHuntUi);
  readonly nationUi = lazyInject(WotrNationUi);
  readonly ui = lazyInject(WotrGameUi);
  readonly unitUi = lazyInject(WotrUnitUi);

  askActionDie = this.ui.askActionDie.bind(this.ui);
  askActionDieOrStop = this.ui.askActionDieOrStop.bind(this.ui);
  askRegion = this.ui.askRegion.bind(this.ui);
  askConfirm = this.ui.askConfirm.bind(this.ui);
  askRegionUnits = this.ui.askRegionUnits.bind(this.ui);
  askReinforcementUnit = this.ui.askReinforcementUnit.bind(this.ui);
  askQuantity = this.ui.askQuantity.bind(this.ui);
  askContinue = this.ui.askContinue.bind(this.ui);
  askNation = this.ui.askNation.bind(this.ui);
  askOption = this.ui.askOption.bind(this.ui);
  askSovereign = this.ui.askSovereign.bind(this.ui);
  askChoice = this.ui.askChoice.bind(this.ui);
  askFellowshipCompanions = this.ui.askFellowshipCompanions.bind(this.ui);
  askHandCard = this.ui.askHandCard.bind(this.ui);
  askHandCards = this.ui.askHandCards.bind(this.ui);
  askElvenRing = this.ui.askElvenRing.bind(this.ui);
  askTableCard = this.ui.askTableCard.bind(this.ui);
  askCasualtyUnits = this.ui.askCasualtyUnits.bind(this.ui);
  askDieStoryChoice = this.ui.askDieStoryChoice.bind(this.ui);
  askActionResolution = this.ui.askActionResolution.bind(this.ui);
  askOptionOrElvenRing = this.ui.askOptionOrElvenRing.bind(this.ui);
}
