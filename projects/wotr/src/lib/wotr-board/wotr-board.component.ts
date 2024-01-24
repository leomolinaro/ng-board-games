import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, inject, input } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { WotrCompanionComponentsService } from "../wotr-components/companion.service";
import { WotrFront } from "../wotr-components/front.models";
import { WotrMinionComponentsService } from "../wotr-components/minion.service";
import { WotrCompanionId, WotrMinionId, WotrNationId } from "../wotr-components/nation.models";
import { WotrNationComponentsService } from "../wotr-components/nation.service";
import { WotrRegionId } from "../wotr-components/region.models";
import { WotrCompanionState, WotrFrontState, WotrLog, WotrMinionState, WotrNationState, WotrPlayer, WotrRegionState } from "../wotr-game-state.models";
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

  private nationComp = inject (WotrNationComponentsService);
  private companionComp = inject (WotrCompanionComponentsService);
  private minionComp = inject (WotrMinionComponentsService);

  players = input.required<WotrPlayer[]> ();
  fronts = input.required<Record<WotrFront, WotrFrontState>> ();
  regions = input.required<Record<WotrRegionId, WotrRegionState>> ();
  nations = input.required<Record<WotrNationId, WotrNationState>> ();
  companions = input.required<Record<WotrCompanionId, WotrCompanionState>> ();
  minions = input.required<Record<WotrMinionId, WotrMinionState>> ();
  logs = input.required<WotrLog[]> ();
  message = input<string> ();
  currentPlayer = input<WotrPlayer> ();

  protected freePeopleFront = computed (() => this.fronts ()["free-peoples"]);
  protected freePeopleNations = computed (() => this.nationComp.getFreePeopleNationIds ().map (nationId => this.nations ()[nationId]));
  protected freePeopleCompanions = computed (() => this.companionComp.getAllIds ().map (id => this.companions ()[id]));
  protected shadowFront = computed (() => this.fronts ().shadow);
  protected shadowNations = computed (() => this.nationComp.getShadowNationIds ().map (nationId => this.nations ()[nationId]));
  protected shadowMinions = computed (() => this.minionComp.getAllIds ().map (id => this.minions ()[id]));

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

  @Output () playerSelect = new EventEmitter<WotrFront> ();
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

} // WotrBoardComponent
