import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, TrackByFunction } from "@angular/core";
import { BgAuthService } from "@bg-services";
import { BooleanInput, SimpleChanges } from "@bg-utils";
import { BritNation, BritNationId, BritPlayer } from "../brit-models";

// interface BritPawnNode {
//   source: string;
//   type: BritPawnType;
//   quantity: number;
//   active: boolean;
// } // BritPawnNode

// interface BritResourceNode {
//   source: string;
//   type: BritResourceType;
//   quantity: number;
//   active: boolean;
// } // BritResourceNode

interface BritNationNode {
  id: BritNationId;
  nation: BritNation;
  iconSource: string;
  cardSource: string;
} // BritNationNode

@Component ({
  selector: "brit-player",
  templateUrl: "./brit-player.component.html",
  styleUrls: ["./brit-player.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BritPlayerComponent implements OnChanges {

  constructor (
    private authService: BgAuthService
  ) { }

  @Input () player!: BritPlayer;
  @Input () nationsMap!: Record<BritNationId, BritNation>;
  @Input () @BooleanInput () currentPlayer: boolean = false;
  // @Input () validBuildings: BritBuilding[] | null = null;
  // @Input () validResources: BritResourceType[] | null = null;
  @Output () selectPlayer = new EventEmitter<void> ();
  // @Output () clickPawn = new EventEmitter<BritPawnType> ();
  // @Output () clickResource = new EventEmitter<BritResourceType> ();

  // pawnNodes!: BritPawnNode[];
  // resourceNodes!: BritResourceNode[];

  nationNodes!: BritNationNode[];
  private nationNodesMap: Partial<Record<BritNationId, BritNationNode>> = { };

  selectedNationNode: BritNationNode | null = null;

  nationTrackBy: TrackByFunction<BritNationNode> = (index, nationNode: BritNationNode) => nationNode.id;
  // resourceTrackBy = (resourceNode: BritResourceNode) => resourceNode.type;

  ngOnChanges (changes: SimpleChanges<this>): void {
    let changedNationIds: BritNationId[] | null = null;

    if (changes.player && changes.player.previousValue?.nations !== this.player.nations) {
      changedNationIds = this.player.nations;
    } // if
    if (!changedNationIds && changes.nationsMap) {
      if (changes.nationsMap.previousValue) {
        changedNationIds = this.player.nations?.filter (nationId => changes.nationsMap.previousValue[nationId] !== this.nationsMap[nationId]);
      } else {
        changedNationIds = this.player.nations;
      } // if - else
    } // if
    if (changedNationIds?.length) {
      for (const changedNationId of changedNationIds) {
        this.nationNodesMap[changedNationId] = {
          id: changedNationId,
          nation: this.nationsMap[changedNationId],
          iconSource: `assets/britannia/population-markers/${changedNationId}.png`,
          cardSource: `assets/britannia/nation-cards/${changedNationId}.png`
        };
      } // for
      this.nationNodes = this.player.nations.map (nationId => this.nationNodesMap[nationId]!);
      if (this.selectedNationNode) { this.selectedNationNode = this.nationNodesMap[this.selectedNationNode.id]!; }
    } // if

  } // ngOnChanges

  onCardClick () {
    if (!this.player.isAi && this.authService.isUserId (this.player.controller.id) && !this.currentPlayer) {
      this.selectPlayer.emit ();
    } // if
  } // onCardClick

  onNationClick (nationNode: BritNationNode) {
    if (nationNode === this.selectedNationNode) {
      this.selectedNationNode = null;
    } else {
      this.selectedNationNode = nationNode;
    } // if - else
  } // onNationClick

  // onPawnClick (pawnNode: BritPawnNode) {
  //   if (pawnNode.active) {
  //     this.clickPawn.emit (pawnNode.type);
  //   } // if
  // } // onPawnClick

  // onResourceClick (resourceNode: BritResourceNode) {
  //   if (resourceNode.active) {
  //     this.clickResource.emit (resourceNode.type);
  //   } // if
  // } // onResourceClick

} // BritPlayerComponent
