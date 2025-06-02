import { ChangeDetectionStrategy, Component, computed, inject, output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTabsModule } from "@angular/material/tabs";
import { BgTransformFn, BgTransformPipe } from "@leobg/commons/utils";
import { firstValueFrom } from "rxjs";
import { WotrActionDiceComponent } from "../../action/wotr-action-dice.component";
import { WotrCardId, isCharacterCard, isStrategyCard } from "../../card/wotr-card.models";
import { WotrCardsDialogComponent, WotrCardsDialogData } from "../../card/wotr-cards-dialog.component";
import { WotrCharacterStore } from "../../character/wotr-character.store";
import { WotrFellowshipStore } from "../../fellowship/wotr-fellowship.store";
import { WotrFrontAreaComponent } from "../../front/wotr-front-area.component";
import { WotrFront } from "../../front/wotr-front.models";
import { WotrFrontStore } from "../../front/wotr-front.store";
import { WotrHuntAreaComponent } from "../../hunt/wotr-hunt-area.component";
import { WotrHuntStore } from "../../hunt/wotr-hunt.store";
import { WotrLogStore } from "../../log/wotr-log.store";
import { WotrLogsComponent } from "../../log/wotr-logs.component";
import { WotrNationStore } from "../../nation/wotr-nation.store";
import { WotrPlayerInfoStore } from "../../player/wotr-player-info.store";
import { WotrPlayerToolbarComponent } from "../../player/wotr-player-toolbar.component";
import { WotrRegionDialogComponent, WotrRegionDialogData } from "../../region/wotr-region-dialog.component";
import { WotrRegion } from "../../region/wotr-region.models";
import { WotrRegionStore } from "../../region/wotr-region.store";
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
    WotrPlayerToolbarComponent
  ],
  template: `
    <div class="wotr-board">
      <wotr-map
        class="wotr-map"
        #wotrMap
        [regions]="regionStore.regions()"
        [nations]="nations()"
        [hunt]="huntStore.state()"
        [freePeoples]="freePeoples()"
        [shadow]="shadow()"
        [fellowship]="fellowshipStore.state()"
        [characterById]="characterById()"
        [validRegions]="ui.validRegions()"
        (regionClick)="onRegionClick($event)">
      </wotr-map>
      <wotr-player-toolbar
        class="wotr-toolbar"
        [currentPlayerId]="ui.currentPlayerId()"
        [players]="playerInfoStore.players()"
        [message]="ui.message()"
        [canConfirm]="ui.canConfirm()"
        [canContinue]="ui.canContinue()"
        [canPass]="ui.canPass()"
        [canCancel]="ui.canCancel()"
        [canInputQuantity]="ui.canInputQuantity()"
        (currentPlayerChange)="ui.setCurrentPlayerId($event?.id || null)"
        (confirm)="ui.confirm.emit($event)"
        (continue)="ui.continue.emit()"
        (inputQuantity)="ui.inputQuantity.emit($event)">
      </wotr-player-toolbar>
      <div class="wotr-fronts">
        <mat-tab-group>
          @for (front of fronts (); track front.id) {
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
              (cardClick)="onPreviewCardClick($event, front)">
            </wotr-front-area>
          </mat-tab>
          }
          <mat-tab label="Hunt">
            <wotr-hunt-area [hunt]="huntStore.state()"> </wotr-hunt-area>
          </mat-tab>
        </mat-tab-group>
      </div>
      <div class="wotr-action-dice-box">
        <wotr-action-dice
          [fronts]="fronts()"
          [validActionFront]="ui.validActionFront()"
          (actionSelect)="ui.action.emit($event)">
        </wotr-action-dice>
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

  protected playerInfoStore = inject(WotrPlayerInfoStore);
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
  protected nations = this.nationStore.nations;
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

  onPreviewCardClick(cardId: WotrCardId, front: WotrFront) {
    this.dialog.open<WotrCardsDialogComponent, WotrCardsDialogData>(WotrCardsDialogComponent, {
      data: {
        selectedCardId: cardId,
        cardIds: front.handCards
      },
      panelClass: "wotr-cards-overlay-panel"
    });
  }

  async onRegionClick(region: WotrRegion) {
    const dialogRef = this.dialog.open<WotrRegionDialogComponent, WotrRegionDialogData, boolean | undefined>(
      WotrRegionDialogComponent,
      {
        data: {
          region,
          nationById: this.nationById(),
          characterById: this.characterById(),
          fellowship: this.fellowshipStore.state(),
          selectable: this.ui.validRegions()?.includes(region.id) ?? false
        },
        panelClass: "mat-typography"
      }
    );
    const result = await firstValueFrom(dialogRef.afterClosed());
    if (result) {
      this.ui.region.emit(region.id);
    }
  }
}
