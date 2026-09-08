import {
  Component,
  computed,
  effect,
  inject,
  Injector,
  model,
  output,
  signal,
} from '@angular/core';
import type { BgTransformFn } from '@leobg/commons/utils';
import { BgTransformPipe } from '@leobg/commons/utils';
import { TuiButton } from '@taiga-ui/core';
import { BgDialogService } from '../../../../../commons/src';
import { WotrActionDiceBox } from '../../action-die/wotr-action-dice-box';
import type { WotrCardId } from '../../card/wotr-card-models';
import { isCharacterCard, isStrategyCard } from '../../card/wotr-card-models';
import type { WotrCardsDialogData } from '../../card/wotr-cards-dialog';
import { WotrCardsDialog } from '../../card/wotr-cards-dialog';
import { WotrCharacterStore } from '../../character/wotr-character-store';
import { WotrFellowshipDialog } from '../../fellowship/wotr-fellowship-dialog';
import { WotrFellowshipStore } from '../../fellowship/wotr-fellowship-store';
import { WotrFrontArea } from '../../front/wotr-front-area';
import type { WotrFrontId } from '../../front/wotr-front-models';
import { WotrFrontStore } from '../../front/wotr-front-store';
import { WotrHuntArea } from '../../hunt/wotr-hunt-area';
import { WotrHuntStore } from '../../hunt/wotr-hunt-store';
import { WotrLogList } from '../../log/wotr-log-list';
import { WotrLogStore } from '../../log/wotr-log-store';
import { WotrNationStore } from '../../nation/wotr-nation-store';
import { WotrOptionsPanel } from '../../player/wotr-options-panel';
import { WotrPlayerToolbar } from '../../player/wotr-player-toolbar';
import { WotrRegionDialog } from '../../region/dialog/wotr-region-dialog';
import type { WotrRegion } from '../../region/wotr-region-models';
import { WotrRegionStore } from '../../region/wotr-region-store';
import type { WotrRegionUnits } from '../../unit/wotr-unit-models';
import { WotrGameStore } from '../wotr-game-store';
import type { WotrCardSelection } from '../wotr-game-ui';
import { WotrGameUi } from '../wotr-game-ui';
import { WotrMap } from './map/wotr-map';
import { WotrReplayButtons } from './wotr-replay-buttons';

@Component({
  selector: 'wotr-board',
  imports: [
    BgTransformPipe,
    WotrMap,
    WotrLogList,
    WotrFrontArea,
    WotrHuntArea,
    WotrReplayButtons,
    WotrActionDiceBox,
    WotrOptionsPanel,
    WotrPlayerToolbar,
    TuiButton,
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
          (fellowshipBoxClick)="onFellowshipBoxClick()"
        >
        </wotr-map>
        @if (ui.inputQuantitySelection() || ui.options()?.length) {
          <wotr-options-panel class="wotr-options-panel"></wotr-options-panel>
        }
      </div>
      <wotr-player-toolbar class="wotr-toolbar"></wotr-player-toolbar>
      <div
        class="wotr-fronts"
        [class]="activeTabId"
      >
        <header>
          @for (front of fronts(); track front.id) {
            <button
              tuiButton
              size="xs"
              appearance="flat"
              [class.is-active]="activeTabId === front.id"
              (click)="activeTabId = front.id"
            >
              {{
                front.name +
                  ' ' +
                  (front.handCards | bgTransform: nChaCards) +
                  ' / ' +
                  (front.handCards | bgTransform: nStrCards)
              }}
            </button>
          }
          <button
            tuiButton
            size="xs"
            appearance="flat"
            [class.is-active]="activeTabId === 'hunt'"
            (click)="activeTabId = 'hunt'"
          >
            Hunt
          </button>
        </header>
        @for (front of fronts(); track front.id) {
          @if (activeTabId === front.id) {
            <wotr-front-area
              [front]="front"
              [nations]="
                front.id === 'free-peoples'
                  ? freePeoplesNations()
                  : shadowNations()
              "
              [characters]="characters()"
              (cardClick)="onPreviewCardClick($event, front.id)"
            >
            </wotr-front-area>
          }
        }
        @if (activeTabId === 'hunt') {
          <wotr-hunt-area
            [hunt]="huntStore.state()"
            [selectedHuntTabIndex]="selectedHuntTabIndex()"
          >
          </wotr-hunt-area>
        }
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
          (replayLast)="replayLast.emit()"
        ></wotr-replay-buttons>
        <wotr-log-list [logs]="logStore.state()"> </wotr-log-list>
      </div>
    </div>
  `,
  styleUrls: ['./wotr-board.scss'],
})
export class WotrBoard {
  protected regionStore = inject(WotrRegionStore);
  protected frontStore = inject(WotrFrontStore);
  protected huntStore = inject(WotrHuntStore);
  private characterStore = inject(WotrCharacterStore);
  protected fellowshipStore = inject(WotrFellowshipStore);
  protected nationStore = inject(WotrNationStore);
  protected logStore = inject(WotrLogStore);
  protected ui = inject(WotrGameUi);
  private gameStore = inject(WotrGameStore);
  private injector = inject(Injector);
  private dialogs = inject(BgDialogService);

  protected freePeoples = this.frontStore.freePeoplesFront;
  protected shadow = this.frontStore.shadowFront;
  protected fronts = computed(() => [this.freePeoples(), this.shadow()]);

  protected characters = this.characterStore.characters;
  protected characterById = this.characterStore.characterById;

  protected freePeoplesNations = this.nationStore.freePeoplesNations;
  protected nationById = this.nationStore.nationById;
  protected shadowNations = this.nationStore.shadowNations;

  protected activeTabId = 'free-peoples';

  replayMode = model();

  protected nChaCards: BgTransformFn<WotrCardId[], number> = (handCards) =>
    handCards.reduce(
      (count, card) => (isCharacterCard(card) ? count + 1 : count),
      0,
    );
  protected nStrCards: BgTransformFn<WotrCardId[], number> = (handCards) =>
    handCards.reduce(
      (count, card) => (isStrategyCard(card) ? count + 1 : count),
      0,
    );

  replayNext = output<number>();
  replayLast = output<void>();
  editStories = output<void>();

  summaryFixed = false;
  logsFixed = false;
  zoomFixed = false;

  protected selectedFrontTabIndex = signal<number>(0);
  private focusFront = effect(() => {
    const reinforcementUnitSelection = this.ui.reinforcementUnitSelection();
    const cardSelection = this.ui.handCardSelection();
    if (!reinforcementUnitSelection && !cardSelection) return;
    const frontId = reinforcementUnitSelection
      ? reinforcementUnitSelection.frontId
      : cardSelection!.frontId;
    this.selectedFrontTabIndex.set(frontId === 'free-peoples' ? 0 : 1);
  });

  protected selectedHuntTabIndex = signal<number>(0);
  private focusSovereigns = effect(() => {
    const sovereignSelection = this.ui.sovereignSelection();
    if (!sovereignSelection) return;
    this.selectedFrontTabIndex.set(2);
    this.selectedHuntTabIndex.set(
      this.gameStore.visibleCorruptionTiles() ? 3 : 2,
    );
  });

  private focusRegion = effect(() => {
    const regionUnitSelection = this.ui.regionUnitSelection();
    if (!regionUnitSelection) return;
    if (regionUnitSelection.regionIds.length !== 1) return;
    const region = this.regionStore.region(regionUnitSelection.regionIds[0]);
    void this.openRegionDialog(region);
  });

  private focusHandCards = effect(() => {
    const cardSelection = this.ui.handCardSelection();
    if (!cardSelection) return;
    void this.openHandCardsDialog(null, cardSelection.frontId);
  });

  private focusTableCards = effect(() => {
    const cardSelection = this.ui.tableCardSelection();
    if (!cardSelection) return;
    void this.openTableCardsDialog(null, cardSelection.frontId);
  });

  private focusFellowship = effect(() => {
    const fellowshipCompanionsSelection =
      this.ui.fellowshipCompanionsSelection();
    if (!fellowshipCompanionsSelection) return;
    void this.openFellowshipBoxDialog();
  });

  onPreviewCardClick(cardId: WotrCardId, frontId: WotrFrontId) {
    void this.openHandCardsDialog(cardId, frontId);
  }

  private async openHandCardsDialog(
    cardId: WotrCardId | null,
    frontId: WotrFrontId,
  ) {
    const front = this.frontStore.front(frontId);
    const result = await this.openCardDialog(
      cardId,
      front.handCards,
      this.ui.handCardSelection(),
    );
    if (result) {
      this.ui.handCards.emit(result);
    }
  }

  private async openTableCardsDialog(
    cardId: WotrCardId | null,
    frontId: WotrFrontId,
  ) {
    const front = this.frontStore.front(frontId);

    const result = await this.openCardDialog(
      cardId,
      front.tableCards,
      this.ui.tableCardSelection(),
    );
    if (result) {
      this.ui.tableCard.emit(result[0]);
    }
  }

  private async openCardDialog(
    focusedCardId: WotrCardId | null,
    cardIds: WotrCardId[],
    selectableCards: WotrCardSelection | null,
  ) {
    return this.dialogs.open<WotrCardsDialogData, WotrCardId[]>(
      WotrCardsDialog,
      {
        data: {
          focusedCardId,
          cardIds,
          selectableCards,
        },
        closable: false,
        size: 'l',
        appearance: 'wotr-cards-dialog',
      },
    );
  }

  private async openRegionDialog(region: WotrRegion) {
    const regionUnitSelection = this.ui.regionUnitSelection();
    const result = await this.dialogs.open(WotrRegionDialog, {
      data: {
        region,
        nationById: this.nationById(),
        characterById: this.characterById(),
        fellowship: this.fellowshipStore.state(),
        regionSelection:
          this.ui.regionSelection()?.includes(region.id) ?? false,
        unitSelection: regionUnitSelection?.regionIds.includes(region.id)
          ? regionUnitSelection
          : null,
      },
      label: region.name,
      injector: this.injector,
      size: 'm',
    });
    if (result) {
      if (result === true) {
        this.ui.region.emit(region.id);
      } else if ('removing' in result && 'downgrading' in result) {
        this.ui.casualtyUnits.emit(result);
      } else {
        const regionUnits: WotrRegionUnits = { ...result, regionId: region.id };
        this.ui.regionUnits.emit(regionUnits);
      }
    }
  }

  onRegionClick(region: WotrRegion) {
    void this.openRegionDialog(region);
  }

  onFellowshipBoxClick() {
    void this.openFellowshipBoxDialog();
  }

  private async openFellowshipBoxDialog() {
    const result = await this.dialogs.open(WotrFellowshipDialog, {
      data: {
        selection: this.ui.fellowshipCompanionsSelection(),
      },
      size: 'm',
      injector: this.injector,
      label: 'Fellowship',
    });
    if (result) this.ui.fellowshipCompanions.emit(result);
  }
}
