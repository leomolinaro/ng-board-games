import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, inject, input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTabsModule } from "@angular/material/tabs";
import { WotrCardId } from "../wotr-components/wotr-card.models";
import { WotrCompanion, WotrCompanionId } from "../wotr-components/wotr-companion.models";
import { WotrFront, WotrFrontId } from "../wotr-components/wotr-front.models";
import { WotrMinion, WotrMinionId } from "../wotr-components/wotr-minion.models";
import { WotrNation } from "../wotr-components/wotr-nation.models";
import { WotrRegion, WotrRegionId } from "../wotr-components/wotr-region.models";
import { WotrLog, WotrPlayer } from "../wotr-game-state.models";
import { WotrCardsDialogComponent, WotrCardsDialogData } from "./wotr-cards-dialog.component";
import { WotrFrontAreaComponent } from "./wotr-front-area.component";
import { WotrLogsComponent } from "./wotr-logs.component";
import { WotrMapComponent } from "./wotr-map/wotr-map.component";

@Component ({
  selector: "wotr-board",
  standalone: true,
  imports: [NgIf, WotrMapComponent, MatTabsModule, WotrLogsComponent, WotrFrontAreaComponent],
  templateUrl: "./wotr-board.component.html",
  styleUrls: ["./wotr-board.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrBoardComponent {

  // constructor (private bottomSheet: MatBottomSheet) {}

  private dialog = inject (MatDialog);

  players = input.required<WotrPlayer[]> ();
  regions = input.required<WotrRegion[]> ();
  freePeopleFront = input.required<WotrFront> ();
  freePeopleNations = input.required<WotrNation[]> ();
  shadowFront = input.required<WotrFront> ();
  shadowNations = input.required<WotrNation[]> ();
  companions = input.required<WotrCompanion[]> ();
  companionById = input.required<Record<WotrCompanionId, WotrCompanion>> ();
  minions = input.required<WotrMinion[]> ();
  minionById = input.required<Record<WotrMinionId, WotrMinion>> ();
  logs = input.required<WotrLog[]> ();
  message = input<string> ();
  currentPlayer = input<WotrPlayer> ();

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
        // width: `${front.handCards.length * 192}px`,
        // height: `${352}px`
        // backdropClass: "cdk-overlay-transparent-backdrop",
        // hasBackdrop: false
      }
    );
  }

} // WotrBoardComponent
