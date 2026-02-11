import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Injector,
  model,
  output,
  signal
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTabsModule } from "@angular/material/tabs";
import { BgTransformFn, BgTransformPipe } from "@leobg/commons/utils";
import { firstValueFrom } from "rxjs";
import { WotrActionDiceBox } from "../../action-die/wotr-action-dice-box";
import { isCharacterCard, isStrategyCard, WotrCardId } from "../../card/wotr-card-models";
import { WotrCardsDialog, WotrCardsDialogData } from "../../card/wotr-cards-dialog";
import { WotrCharacterStore } from "../../character/wotr-character-store";
import {
  WotrFellowshipDialog,
  WotrFellowshipDialogData,
  WotrFellowshipDialogRef,
  WotrFellowshipDialogResult
} from "../../fellowship/wotr-fellowship-dialog";
import { WotrFellowshipStore } from "../../fellowship/wotr-fellowship-store";
import { WotrFrontArea } from "../../front/wotr-front-area";
import { WotrFrontId } from "../../front/wotr-front-models";
import { WotrFrontStore } from "../../front/wotr-front-store";
import { WotrHuntArea } from "../../hunt/wotr-hunt-area";
import { WotrHuntStore } from "../../hunt/wotr-hunt-store";
import { WotrLogList } from "../../log/wotr-log-list";
import { WotrLogStore } from "../../log/wotr-log-store";
import { WotrNationStore } from "../../nation/wotr-nation-store";
import { WotrOptionsPanel } from "../../player/wotr-options-panel";
import { WotrPlayerToolbar } from "../../player/wotr-player-toolbar";
import {
  WotrRegionDialog,
  WotrRegionDialogData,
  WotrRegionDialogRef,
  WotrRegionDialogResult
} from "../../region/dialog/wotr-region-dialog";
import { WotrRegion } from "../../region/wotr-region-models";
import { WotrRegionStore } from "../../region/wotr-region-store";
import { WotrRegionUnits } from "../../unit/wotr-unit-models";
import { WotrCardSelection, WotrGameUi } from "../wotr-game-ui";
import { WotrMap } from "./map/wotr-map";
import { WotrReplayButton } from "./wotr-replay-buttons";

@Component({
  selector: "wotr-board",
  imports: [
    BgTransformPipe,
    MatTabsModule,
    WotrMap,
    WotrLogList,
    WotrFrontArea,
    WotrHuntArea,
    WotrReplayButton,
    WotrActionDiceBox,
    WotrOptionsPanel,
    WotrPlayerToolbar
  ],
  template: `
    <div class="wotr-board">
      <div class="wotr-map">
        <wotr-map
          #wotrMap
          [regions]="regionStore.regions()"
          [hunt]="huntStore.state()"
          [freePeoples]="freePeoples()"
          [shadow]="shadow()"
          [fellowship]="fellowshipStore.state()"
          [characterById]="characterById()"
          (regionClick)="onRegionClick($event)"
          (fellowshipBoxClick)="onFellowshipBoxClick()">
        </wotr-map>
        @if (ui.inputQuantitySelection() || ui.options()?.length) {
          <wotr-options-panel class="wotr-options-panel"></wotr-options-panel>
        }
      </div>
      <wotr-player-toolbar class="wotr-toolbar"></wotr-player-toolbar>
      <div class="wotr-fronts">
        <mat-tab-group [selectedIndex]="selectedFrontIndex()">
          @for (front of fronts(); track front.id) {
            <mat-tab
              [label]="
                front.name +
                ' ' +
                (front.handCards | bgTransform: nChaCards) +
                ' / ' +
                (front.handCards | bgTransform: nStrCards)
              "
              [labelClass]="front.id"
              [bodyClass]="front.id">
              <wotr-front-area
                [front]="front"
                [nations]="front.id === 'free-peoples' ? freePeoplesNations() : shadowNations()"
                [characters]="characters()"
                (cardClick)="onPreviewCardClick($event, front.id)">
              </wotr-front-area>
            </mat-tab>
          }
          <mat-tab label="Hunt">
            <wotr-hunt-area [hunt]="huntStore.state()"> </wotr-hunt-area>
          </mat-tab>
        </mat-tab-group>
      </div>
      <div class="wotr-action-dice-box">
        <wotr-action-dice-box />
      </div>
      <div class="wotr-logs">
        <wotr-replay-buttons
          class="wotr-replay-buttons"
          [(replayMode)]="replayMode"
          (edit)="editStories.emit()"
          (replayNext)="replayNext.emit($event)"
          (replayLast)="replayLast.emit()"></wotr-replay-buttons>
        <wotr-log-list [logs]="logStore.state()"> </wotr-log-list>
      </div>
    </div>
  `,
  styleUrls: ["./wotr-board.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrBoard {
  private dialog = inject(MatDialog);
  private injector = inject(Injector);

  protected regionStore = inject(WotrRegionStore);
  protected frontStore = inject(WotrFrontStore);
  protected huntStore = inject(WotrHuntStore);
  private characterStore = inject(WotrCharacterStore);
  protected fellowshipStore = inject(WotrFellowshipStore);
  protected nationStore = inject(WotrNationStore);
  protected logStore = inject(WotrLogStore);
  protected ui = inject(WotrGameUi);

  protected freePeoples = this.frontStore.freePeoplesFront;
  protected shadow = this.frontStore.shadowFront;
  protected fronts = computed(() => [this.freePeoples(), this.shadow()]);

  protected characters = this.characterStore.characters;
  protected characterById = this.characterStore.characterById;

  protected freePeoplesNations = this.nationStore.freePeoplesNations;
  protected nationById = this.nationStore.nationById;
  protected shadowNations = this.nationStore.shadowNations;

  replayMode = model();

  protected nChaCards: BgTransformFn<WotrCardId[], number> = handCards =>
    handCards.reduce((count, card) => (isCharacterCard(card) ? count + 1 : count), 0);
  protected nStrCards: BgTransformFn<WotrCardId[], number> = handCards =>
    handCards.reduce((count, card) => (isStrategyCard(card) ? count + 1 : count), 0);

  replayNext = output<number>();
  replayLast = output<void>();
  editStories = output<void>();

  summaryFixed = false;
  logsFixed = false;
  zoomFixed = false;

  protected selectedFrontIndex = signal<number>(0);
  private focusFront = effect(() => {
    const reinforcementUnitSelection = this.ui.reinforcementUnitSelection();
    const cardSelection = this.ui.handCardSelection();
    if (!reinforcementUnitSelection && !cardSelection) return;
    const frontId = reinforcementUnitSelection
      ? reinforcementUnitSelection.frontId
      : cardSelection!.frontId;
    this.selectedFrontIndex.set(frontId === "free-peoples" ? 0 : 1);
  });

  private focusRegion = effect(() => {
    const regionUnitSelection = this.ui.regionUnitSelection();
    if (!regionUnitSelection) return;
    if (regionUnitSelection.regionIds.length !== 1) return;
    const region = this.regionStore.region(regionUnitSelection.regionIds[0]);
    this.openRegionDialog(region);
  });

  private focusHandCards = effect(() => {
    const cardSelection = this.ui.handCardSelection();
    if (!cardSelection) return;
    this.openHandCardsDialog(null, cardSelection.frontId);
  });

  private focusTableCards = effect(() => {
    const cardSelection = this.ui.tableCardSelection();
    if (!cardSelection) return;
    this.openTableCardsDialog(null, cardSelection.frontId);
  });

  private focusFellowship = effect(() => {
    const fellowshipCompanionsSelection = this.ui.fellowshipCompanionsSelection();
    if (!fellowshipCompanionsSelection) return;
    this.openFellowshipBoxDialog();
  });

  private regionDialogRef: WotrRegionDialogRef | null = null;
  private fellowshipDialogRef: WotrFellowshipDialogRef | null = null;

  onPreviewCardClick(cardId: WotrCardId, frontId: WotrFrontId) {
    this.openHandCardsDialog(cardId, frontId);
  }

  private async openHandCardsDialog(cardId: WotrCardId | null, frontId: WotrFrontId) {
    const front = this.frontStore.front(frontId);
    const result = await this.openCardDialog(cardId, front.handCards, this.ui.handCardSelection());
    if (result) {
      this.ui.handCards.emit(result);
    }
  }

  private async openTableCardsDialog(cardId: WotrCardId | null, frontId: WotrFrontId) {
    const front = this.frontStore.front(frontId);

    const result = await this.openCardDialog(
      cardId,
      front.tableCards,
      this.ui.tableCardSelection()
    );
    if (result) {
      this.ui.tableCard.emit(result[0]);
    }
  }

  private async openCardDialog(
    focusedCardId: WotrCardId | null,
    cardIds: WotrCardId[],
    selectableCards: WotrCardSelection | null
  ) {
    const cardsDialogRef = this.dialog.open<
      WotrCardsDialog,
      WotrCardsDialogData,
      undefined | WotrCardId[]
    >(WotrCardsDialog, {
      data: {
        focusedCardId,
        cardIds,
        selectableCards
      },
      injector: this.injector,
      panelClass: "wotr-cards-overlay-panel",
      width: "100%",
      maxWidth: "100%"
    });
    const result = await firstValueFrom(cardsDialogRef.afterClosed());
    return result;
  }

  private async openRegionDialog(region: WotrRegion) {
    const regionUnitSelection = this.ui.regionUnitSelection();
    const data: WotrRegionDialogData = {
      region,
      nationById: this.nationById(),
      characterById: this.characterById(),
      fellowship: this.fellowshipStore.state(),
      regionSelection: this.ui.regionSelection()?.includes(region.id) ?? false,
      unitSelection: regionUnitSelection?.regionIds.includes(region.id) ? regionUnitSelection : null
    };
    this.regionDialogRef = this.dialog.open<
      WotrRegionDialog,
      WotrRegionDialogData,
      WotrRegionDialogResult
    >(WotrRegionDialog, {
      data,
      injector: this.injector,
      panelClass: "mat-typography"
    });
    const result = await firstValueFrom(this.regionDialogRef.afterClosed());
    this.regionDialogRef = null;
    if (result) {
      if (result === true) {
        this.ui.region.emit(region.id);
      } else if ("removing" in result && "downgrading" in result) {
        this.ui.casualtyUnits.emit(result);
      } else {
        const regionUnits: WotrRegionUnits = { ...result, regionId: region.id };
        this.ui.regionUnits.emit(regionUnits);
      }
    }
  }

  onRegionClick(region: WotrRegion) {
    if (this.regionDialogRef) {
      this.regionDialogRef.close();
    }
    this.openRegionDialog(region);
  }

  onFellowshipBoxClick() {
    if (this.fellowshipDialogRef) {
      this.fellowshipDialogRef.close();
    }
    this.openFellowshipBoxDialog();
  }

  private async openFellowshipBoxDialog() {
    const data: WotrFellowshipDialogData = {
      selection: this.ui.fellowshipCompanionsSelection()
    };
    this.fellowshipDialogRef = this.dialog.open<
      WotrFellowshipDialog,
      WotrFellowshipDialogData,
      WotrFellowshipDialogResult
    >(WotrFellowshipDialog, { data, injector: this.injector, panelClass: "mat-typography" });
    const result = await firstValueFrom(this.fellowshipDialogRef.afterClosed());
    this.fellowshipDialogRef = null;
    if (result) {
      this.ui.fellowshipCompanions.emit(result);
    }
  }
}
