import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, inject, input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTabsModule } from "@angular/material/tabs";
import { BgTransformFn, BgTransformPipe } from "@leobg/commons/utils";
import { WotrAssetsService } from "../wotr-assets.service";
import { WotrCardId, isCharacterCard, isStrategyCard } from "../wotr-elements/wotr-card.models";
import { WotrCompanion, WotrCompanionId } from "../wotr-elements/wotr-companion.models";
import { WotrActionDie } from "../wotr-elements/wotr-dice.models";
import { WotrFront, WotrFrontId } from "../wotr-elements/wotr-front.models";
import { WotrHuntState } from "../wotr-elements/wotr-hunt.store";
import { WotrLog } from "../wotr-elements/wotr-log.models";
import { WotrMinion, WotrMinionId } from "../wotr-elements/wotr-minion.models";
import { WotrNation, WotrNationId } from "../wotr-elements/wotr-nation.models";
import { WotrPlayer } from "../wotr-elements/wotr-player.models";
import { WotrRegion, WotrRegionId } from "../wotr-elements/wotr-region.models";
import { WotrCardsDialogComponent, WotrCardsDialogData } from "./wotr-cards-dialog.component";
import { WotrFrontAreaComponent } from "./wotr-front-area.component";
import { WotrHuntAreaComponent } from "./wotr-hunt-area.component";
import { WotrLogsComponent } from "./wotr-logs.component";
import { WotrMapComponent } from "./wotr-map/wotr-map.component";
import { WotrRegionDialogComponent, WotrRegionDialogData } from "./wotr-region-dialog.component";

@Component ({
  selector: "wotr-board",
  standalone: true,
  imports: [NgIf, WotrMapComponent, MatTabsModule, WotrLogsComponent, WotrFrontAreaComponent, WotrHuntAreaComponent, BgTransformPipe],
  templateUrl: "./wotr-board.component.html",
  styleUrls: ["./wotr-board.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrBoardComponent {

  // constructor (private bottomSheet: MatBottomSheet) {}

  private dialog = inject (MatDialog);
  private assets = inject (WotrAssetsService);

  players = input.required<WotrPlayer[]> ();
  regions = input.required<WotrRegion[]> ();
  fronts = input.required<WotrFront[]> ();
  hunt = input.required<WotrHuntState> ();
  freePeopleNations = input.required<WotrNation[]> ();
  shadowNations = input.required<WotrNation[]> ();
  nationById = input.required<Record<WotrNationId, WotrNation>> ();
  companions = input.required<WotrCompanion[]> ();
  companionById = input.required<Record<WotrCompanionId, WotrCompanion>> ();
  minions = input.required<WotrMinion[]> ();
  minionById = input.required<Record<WotrMinionId, WotrMinion>> ();
  logs = input.required<WotrLog[]> ();
  message = input<string> ();
  currentPlayer = input<WotrPlayer> ();

  protected nChaCards: BgTransformFn<WotrCardId[], number> = handCards => handCards.reduce ((count, card) => isCharacterCard (card) ? (count + 1) : count, 0);
  protected nStrCards: BgTransformFn<WotrCardId[], number> = handCards => handCards.reduce ((count, card) => isStrategyCard (card) ? (count + 1) : count, 0);
  // computed (() => this.freePeopleFront ().handCards.reduce ((count, card) => isCharacterCard (card) ? (count + 1) : count, 0));
  // protected freePeopleNChaCards = computed (() => this.freePeopleFront ().handCards.reduce ((count, card) => isCharacterCard (card) ? (count + 1) : count, 0));
  // protected freePeopleNStrCards = computed (() => this.freePeopleFront ().handCards.reduce ((count, card) => isStrategyCard (card) ? (count + 1) : count, 0));
  // protected shadowNChaCards = computed (() => this.shadowFront ().handCards.reduce ((count, card) => isCharacterCard (card) ? (count + 1) : count, 0));
  // protected shadowNStrCards = computed (() => this.shadowFront ().handCards.reduce ((count, card) => isStrategyCard (card) ? (count + 1) : count, 0));


  @Input () turnPlayer: WotrPlayer | null = null;
  // @Input () currentPlayer: WotrPlayer | null = null;
  // @Input () otherPlayers!: BaronyPlayer[];
  @Input () validRegions: WotrRegionId[] | null = null;
  // @Input () validUnits: WotrRegionUnit[] | null = null;
  // @Input () selectedUnits: WotrRegionUnit[] | null = null;
  // @Input () validActions: BaronyAction[] | null = null;
  // @Input () validBuildings: ("stronghold" | "village")[] | null = null;
  // @Input () validResources: { player: string; resources: BaronyResourceType[]; } | null = null;
  @Input () canPass: boolean = false;
  @Input () canConfirm: boolean = false;
  @Input () canCancel: boolean = false;

  protected playerTabIndex = computed (() => {
    const currentPlayer = this.currentPlayer ();
    if (!currentPlayer) { return 0; }
    return this.players ().findIndex (p => currentPlayer.id === p.id);
  });

  @Output () playerSelect = new EventEmitter<WotrFrontId> ();
  // @Output () buildingSelect = new EventEmitter<BaronyBuilding> ();
  @Output () regionClick = new EventEmitter<WotrRegionId> ();
  // @Output () unitClick = new EventEmitter<WotrRegionUnit> ();
  // @Output () selectedUnitsChange = new EventEmitter<WotrRegionUnit[]> ();
  // @Output () actionClick = new EventEmitter<BaronyAction> ();
  @Output () passClick = new EventEmitter<void> ();
  @Output () confirmClick = new EventEmitter<void> ();
  @Output () cancelClick = new EventEmitter<void> ();
  // @Output () knightsConfirm = new EventEmitter<number> ();
  // @Output () resourceSelect = new EventEmitter<BaronyResourceType> ();
  @Output () testClick = new EventEmitter<void> ();

  protected actionDieImage: BgTransformFn<WotrActionDie, string, WotrFrontId> = (actionDie, frontId) => this.assets.getActionDieImage (actionDie, frontId);

  summaryFixed = false;
  logsFixed = false;
  zoomFixed = false;
  onPlayerTabChange (tabIndex: number) { this.playerSelect.next (this.players ()[tabIndex].id); }

  // onPlayerSelect (player: WotrPlayer) { this.playerSelect.emit (player); }
  // onBuildingSelect (building: WotrBuilding) { this.buildingSelect.emit (building); }
  // onLandTileClick (landTile: WotrLand) { this.landTileClick.emit (landTile); }
  // onActionClick (action: WotrAction) { this.actionClick.emit (action); }
  onPassClick () { this.passClick.emit (); }
  onConfirmClick () { this.confirmClick.emit (); }
  onCancelClick () { this.cancelClick.emit (); }
  // onKnightsConfirm () {
  //   this.knightsConfirm.emit (this.numberOfKnights);
  //   this.numberOfKnights = 1;
  // } // onKnightsConfirm
  // onResourceSelect (resource: WotrResourceType) { this.resourceSelect.emit (resource); }

  onPreviewCardClick (cardId: WotrCardId, front: WotrFront) {
    this.dialog.open<WotrCardsDialogComponent, WotrCardsDialogData> (
      WotrCardsDialogComponent,
      {
        data: {
          selectedCardId: cardId,
          cardIds: front.handCards
        },
        panelClass: "wotr-cards-overlay-panel",
      }
    );
  }

  onRegionClick (region: WotrRegion) {
    this.dialog.open<WotrRegionDialogComponent, WotrRegionDialogData> (
      WotrRegionDialogComponent,
      {
        data: {
          region,
          nationById: this.nationById (),
          companionById: this.companionById (),
          minionById: this.minionById ()
        },
        panelClass: "mat-typography",
      }
    );
  }

} // WotrBoardComponent
