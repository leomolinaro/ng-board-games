import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  output,
  signal
} from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatTabsModule } from "@angular/material/tabs";
import { BgTransformFn, BgTransformPipe } from "@leobg/commons/utils";
import { firstValueFrom } from "rxjs";
import { WotrActionDiceComponent } from "../../action-die/wotr-action-dice.component";
import { WotrCardId, isCharacterCard, isStrategyCard } from "../../card/wotr-card.models";
import {
  WotrCardsDialogComponent,
  WotrCardsDialogData
} from "../../card/wotr-cards-dialog.component";
import { WotrCharacterStore } from "../../character/wotr-character.store";
import { WotrFellowshipStore } from "../../fellowship/wotr-fellowship.store";
import { WotrFrontAreaComponent } from "../../front/wotr-front-area.component";
import { WotrFrontId } from "../../front/wotr-front.models";
import { WotrFrontStore } from "../../front/wotr-front.store";
import { WotrHuntAreaComponent } from "../../hunt/wotr-hunt-area.component";
import { WotrHuntStore } from "../../hunt/wotr-hunt.store";
import { WotrLogStore } from "../../log/wotr-log.store";
import { WotrLogsComponent } from "../../log/wotr-logs.component";
import { WotrNationStore } from "../../nation/wotr-nation.store";
import { WotrOptionsPanelComponent } from "../../player/wotr-options-panel.component";
import { WotrPlayerToolbarComponent } from "../../player/wotr-player-toolbar.component";
import {
  WotrRegionDialogComponent,
  WotrRegionDialogData,
  WotrRegionDialogResult
} from "../../region/wotr-region-dialog.component";
import { WotrRegion } from "../../region/wotr-region.models";
import { WotrRegionStore } from "../../region/wotr-region.store";
import { WotrUnits } from "../../unit/wotr-unit.models";
import { WotrGameUiStore } from "../wotr-game-ui.store";
import { WotrMapComponent } from "./map/wotr-map.component";
import { WotrReplayButtonComponent } from "./wotr-replay-buttons.component";

@Component({
  selector: "wotr-board",
  imports: [
    BgTransformPipe,
    MatTabsModule,
    WotrMapComponent,
    WotrLogsComponent,
    WotrFrontAreaComponent,
    WotrHuntAreaComponent,
    WotrReplayButtonComponent,
    WotrActionDiceComponent,
    WotrOptionsPanelComponent,
    WotrPlayerToolbarComponent
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
          (regionClick)="onRegionClick($event)">
        </wotr-map>
        <wotr-options-panel class="wotr-options-panel"></wotr-options-panel>
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
        <wotr-action-dice></wotr-action-dice>
      </div>
      <div class="wotr-logs">
        <wotr-replay-buttons
          class="wotr-replay-buttons"
          (replayNext)="replayNext.emit($event)"
          (replayLast)="replayLast.emit()"></wotr-replay-buttons>
        <wotr-logs [logs]="logStore.state()"> </wotr-logs>
      </div>
    </div>
  `,
  styleUrls: ["./wotr-board.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrBoardComponent {
  private dialog = inject(MatDialog);

  protected regionStore = inject(WotrRegionStore);
  protected frontStore = inject(WotrFrontStore);
  protected huntStore = inject(WotrHuntStore);
  protected characterStore = inject(WotrCharacterStore);
  protected fellowshipStore = inject(WotrFellowshipStore);
  protected nationStore = inject(WotrNationStore);
  protected logStore = inject(WotrLogStore);
  protected ui = inject(WotrGameUiStore);

  protected freePeoples = this.frontStore.freePeoplesFront;
  protected shadow = this.frontStore.shadowFront;
  protected fronts = computed(() => [this.freePeoples(), this.shadow()]);

  protected characters = this.characterStore.characters;
  protected characterById = this.characterStore.characterById;

  protected freePeoplesNations = this.nationStore.freePeoplesNations;
  protected nationById = this.nationStore.nationById;
  protected shadowNations = this.nationStore.shadowNations;

  protected nChaCards: BgTransformFn<WotrCardId[], number> = handCards =>
    handCards.reduce((count, card) => (isCharacterCard(card) ? count + 1 : count), 0);
  protected nStrCards: BgTransformFn<WotrCardId[], number> = handCards =>
    handCards.reduce((count, card) => (isStrategyCard(card) ? count + 1 : count), 0);

  replayNext = output<number>();
  replayLast = output<void>();

  summaryFixed = false;
  logsFixed = false;
  zoomFixed = false;

  protected selectedFrontIndex = signal<number>(0);
  private focusFront = effect(() => {
    const reinforcementUnitSelection = this.ui.reinforcementUnitSelection();
    const cardSelection = this.ui.cardSelection();
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

  private focusCards = effect(() => {
    const cardSelection = this.ui.cardSelection();
    if (!cardSelection) return;
    this.openCardsDialog(null, cardSelection.frontId);
  });

  private regionDialogRef: MatDialogRef<
    WotrRegionDialogComponent,
    true | WotrUnits | { removing: WotrUnits; declassing: WotrUnits }
  > | null = null;

  onPreviewCardClick(cardId: WotrCardId, frontId: WotrFrontId) {
    this.openCardsDialog(cardId, frontId);
  }

  private async openCardsDialog(cardId: WotrCardId | null, frontId: WotrFrontId) {
    const front = this.frontStore.front(frontId);
    const cardsDialogRef = this.dialog.open<
      WotrCardsDialogComponent,
      WotrCardsDialogData,
      undefined | WotrCardId[]
    >(WotrCardsDialogComponent, {
      data: {
        focusedCardId: cardId,
        cardIds: front.handCards,
        selectableCards: this.ui.cardSelection()
      },
      panelClass: "wotr-cards-overlay-panel",
      width: "100%",
      maxWidth: "100%"
    });
    const result = await firstValueFrom(cardsDialogRef.afterClosed());
    this.regionDialogRef = null;
    if (result) {
      this.ui.cards.emit(result);
    }
  }

  private async openRegionDialog(region: WotrRegion) {
    const regionUnitSelection = this.ui.regionUnitSelection();
    const data: WotrRegionDialogData = {
      region,
      nationById: this.nationById(),
      characterById: this.characterById(),
      fellowship: this.fellowshipStore.state(),
      regionSelection: this.ui.regionSelection()?.includes(region.id) ?? false,
      unitSelection: regionUnitSelection
    };
    this.regionDialogRef = this.dialog.open<
      WotrRegionDialogComponent,
      WotrRegionDialogData,
      WotrRegionDialogResult
    >(WotrRegionDialogComponent, {
      data,
      panelClass: "mat-typography"
    });
    const result = await firstValueFrom(this.regionDialogRef.afterClosed());
    this.regionDialogRef = null;
    if (result) {
      if (result === true) {
        this.ui.region.emit(region.id);
      } else if ("removing" in result || "declassing" in result) {
        throw new Error("Removing or declassing units is not implemented yet.");
      } else {
        this.ui.regionUnits.emit(result);
      }
    }
  }

  async onRegionClick(region: WotrRegion) {
    if (this.regionDialogRef) {
      this.regionDialogRef.close();
    }
    this.openRegionDialog(region);
  }
}
