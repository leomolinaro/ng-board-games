import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TrackByFunction,
} from "@angular/core";
import { BgAuthService, BooleanInput } from "@leobg/commons";
import { BritAssetsService } from "../brit-assets.service";
import { BritNation, BritNationId } from "../brit-components.models";
import { BritComponentsService } from "../brit-components.service";
import { BritPlayer } from "../brit-game-state.models";

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BritPlayerComponent implements OnInit {
  constructor (
    private authService: BgAuthService,
    private assetsService: BritAssetsService,
    private components: BritComponentsService
  ) {}

  @Input () player!: BritPlayer;
  @Input () @BooleanInput () currentPlayer: boolean = false;
  // @Input () validBuildings: BritBuilding[] | null = null;
  // @Input () validResources: BritResourceType[] | null = null;
  @Output () selectPlayer = new EventEmitter<void> ();
  @Output () nationClick = new EventEmitter<BritNationId> ();
  // @Output () clickPawn = new EventEmitter<BritPawnType> ();
  // @Output () clickResource = new EventEmitter<BritResourceType> ();

  // pawnNodes!: BritPawnNode[];
  // resourceNodes!: BritResourceNode[];

  nationNodes: BritNationNode[] = [];

  selectedNationNode: BritNationNode | null = null;

  nationTrackBy: TrackByFunction<BritNationNode> = (
    index,
    nationNode: BritNationNode
  ) => nationNode.id;
  // resourceTrackBy = (resourceNode: BritResourceNode) => resourceNode.type;

  ngOnInit (): void {
    for (const nationId of this.player.nationIds) {
      this.nationNodes.push ({
        id: nationId,
        nation: this.components.NATION[nationId],
        iconSource: this.assetsService.getNationIconImageSource (nationId),
        cardSource: this.assetsService.getNationCardImageSource (nationId),
      });
    } // for
  } // ngOnChanges

  onCardClick () {
    if (
      !this.player.isAi &&
      this.authService.isUserId (this.player.controller.id) &&
      !this.currentPlayer
    ) {
      this.selectPlayer.emit ();
    } // if
  } // onCardClick

  onNationClick (nationNode: BritNationNode, event: MouseEvent) {
    this.nationClick.next (nationNode.id);
    event.stopPropagation ();
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
