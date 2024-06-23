import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, inject, input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTabsModule } from "@angular/material/tabs";
import { BgTransformFn, BgTransformPipe } from "@leobg/commons/utils";
import { WotrActionDiceComponent } from "../../action-die/wotr-action-dice.component";
import { WotrCardId, isCharacterCard, isStrategyCard } from "../../card/wotr-card.models";
import { WotrCardsDialogComponent, WotrCardsDialogData } from "../../card/wotr-cards-dialog.component";
import { WotrCharacter, WotrCharacterId } from "../../companion/wotr-character.models";
import { WotrFellowship } from "../../fellowship/wotr-fellowhip.models";
import { WotrFrontAreaComponent } from "../../front/wotr-front-area.component";
import { WotrFront, WotrFrontId } from "../../front/wotr-front.models";
import { WotrHuntAreaComponent } from "../../hunt/wotr-hunt-area.component";
import { WotrHuntState } from "../../hunt/wotr-hunt.store";
import { WotrLog } from "../../log/wotr-log.models";
import { WotrLogsComponent } from "../../log/wotr-logs.component";
import { WotrNation, WotrNationId } from "../../nation/wotr-nation.models";
import { WotrPlayer } from "../../player/wotr-player.models";
import { WotrRegionDialogComponent, WotrRegionDialogData } from "../../region/wotr-region-dialog.component";
import { WotrRegion, WotrRegionId } from "../../region/wotr-region.models";
import { WotrMapComponent } from "./map/wotr-map.component";
import { WotrReplayButtonComponent } from "./wotr-replay-buttons.component";

@Component ({
  selector: "wotr-board",
  standalone: true,
  imports: [NgIf, BgTransformPipe, MatTabsModule,
    WotrMapComponent, WotrLogsComponent, WotrFrontAreaComponent,
    WotrHuntAreaComponent, WotrReplayButtonComponent, WotrActionDiceComponent
  ],
  template: `
    <div class="wotr-board">
      <wotr-map
        class="wotr-map"
        #wotrMap
        [regions]="regions ()"
        [nations]="nations ()"
        [hunt]="hunt ()"
        [freePeoples]="freePeoples ()"
        [shadow]="shadow ()"
        [fellowship]="fellowship ()"
        [characterById]="characterById ()"
        (regionClick)="onRegionClick ($event)">
      </wotr-map>
      <div class="wotr-toolbar">{{ message () }}</div>
      <div class="wotr-fronts">
        <mat-tab-group>
          @for (front of fronts (); track front.id) {
            <mat-tab [label]="front.name + ' ' + (front.handCards | bgTransform:nChaCards) + ' / ' + (front.handCards | bgTransform:nStrCards)"
              [labelClass]="front.id" [bodyClass]="front.id">
              <wotr-front-area
                [front]="front"
                [nations]="front.id === 'free-peoples' ? freePeoplesNations () : shadowNations ()"
                [characters]="characters ()"
                (cardClick)="onPreviewCardClick ($event, front)">
              </wotr-front-area>
            </mat-tab>
          }
          <mat-tab label="Hunt">
            <wotr-hunt-area
              [hunt]="hunt ()">
            </wotr-hunt-area>
          </mat-tab>
        </mat-tab-group>
      </div>
      <div class="wotr-action-dice-box">
        <wotr-action-dice [fronts]="fronts ()"></wotr-action-dice>
      </div>
      <div class="wotr-logs">
        <wotr-replay-buttons class="wotr-replay-buttons" (replayNext)="replayNext.next ($event)" (replayLast)="replayLast.next ()"></wotr-replay-buttons>
        <wotr-logs [logs]="logs ()"></wotr-logs>
      </div>
    </div>
  `,
  styleUrls: ["./wotr-board.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrBoardComponent {

  // constructor (private bottomSheet: MatBottomSheet) {}

  private dialog = inject (MatDialog);

  players = input.required<WotrPlayer[]> ();
  regions = input.required<WotrRegion[]> ();
  nations = input.required<WotrNation[]> ();
  freePeoples = input.required<WotrFront> ();
  shadow = input.required<WotrFront> ();
  fronts = computed (() => ([this.freePeoples (), this.shadow ()]));
  hunt = input.required<WotrHuntState> ();
  fellowship = input.required<WotrFellowship> ();
  freePeoplesNations = input.required<WotrNation[]> ();
  shadowNations = input.required<WotrNation[]> ();
  nationById = input.required<Record<WotrNationId, WotrNation>> ();
  characters = input.required<WotrCharacter[]> ();
  characterById = input.required<Record<WotrCharacterId, WotrCharacter>> ();
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

  @Output () replayNext = new EventEmitter<number> ();
  @Output () replayLast = new EventEmitter<void> ();

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
          characterById: this.characterById (),
          fellowship: this.fellowship ()
        },
        panelClass: "mat-typography",
      }
    );
  }

} // WotrBoardComponent
