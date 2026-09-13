import type { OnInit } from '@angular/core';
import {
  Component,
  booleanAttribute,
  inject,
  input,
  output,
} from '@angular/core';
import { BgAuthService } from '@leobg/commons';
import { TuiHint, TuiIcon } from '@taiga-ui/core';
import { BritAssetsService } from '../brit-assets.service';
import type { BritNation, BritNationId } from '../brit-components.models';
import { BritComponents } from '../brit-components.service';
import type { BritPlayer } from '../brit-game-state.models';

// interface BritPawnNode {
//   source: string;
//   type: BritPawnType;
//   quantity: number;
//   active: boolean;
// }

// interface BritResourceNode {
//   source: string;
//   type: BritResourceType;
//   quantity: number;
//   active: boolean;
// }

interface BritNationNode {
  id: BritNationId;
  nation: BritNation;
  iconSource: string;
  cardSource: string;
}

@Component({
  selector: 'brit-player',
  imports: [TuiHint, TuiIcon],
  template: `
    <div
      [class]="'brit-player-card ' + 'is-' + player().id"
      [class.is-active]="currentPlayer()"
      [class.is-ai]="player().isAi"
      [class.is-remote]="player().isRemote"
      [class.is-local]="player().isLocal"
      (click)="onCardClick()"
    >
      <div class="brit-player-header">
        <tui-icon
          class="brit-player-type-icon"
          [icon]="
            player().isAi
              ? 'monitor'
              : player().isRemote
                ? 'globe'
                : currentPlayer()
                  ? 'user-round-check'
                  : 'user-round'
          "
        />
        <div class="brit-player-name">{{ player().name }}</div>
        <tui-icon
          icon="star"
          class="brit-player-score-icon"
        ></tui-icon>
        <div class="brit-player-score">{{ player().score }}</div>
      </div>
      <div class="brit-player-content">
        @for (nationNode of nationNodes; track nationNode.id) {
          <div
            class="brit-player-nation"
            (click)="onNationClick(nationNode, $event)"
          >
            <img
              class="brit-player-nation-icon"
              [src]="nationNode.iconSource"
              [tuiHint]="nationNode.nation.label"
            />
          </div>
        }

        <!-- <div *ngFor="let pawnNode of pawnNodes; trackBy: pawnTrackBy"
    class="brit-player-pawn-image"
    [class.is-active]="pawnNode.active"
    (click)="onPawnClick (pawnNode)">
    <img [src]="pawnNode.source">
  </div> -->
        <!-- <div *ngFor="let resourceNode of resourceNodes; trackBy: resourceTrackBy" class="brit-player-resource-image"
  [class.is-active]="resourceNode.active"
  (click)="onResourceClick (resourceNode)">
  <img [src]="resourceNode.source">
</div>
<div *ngFor="let pawnNode of pawnNodes; trackBy: pawnTrackBy" class="brit-player-pawn-quantity">
  {{ $any (player.pawns)[pawnNode.type] }}
</div>
<div *ngFor="let resourceNode of resourceNodes; trackBy: resourceTrackBy" class="brit-player-resource-quantity">
  {{ resourceNode.quantity }}
</div> -->
      </div>
    </div>
  `,
  styleUrls: ['./brit-player-area.scss'],
})
export class BritPlayerComponent implements OnInit {
  private authService = inject(BgAuthService);
  private assetsService = inject(BritAssetsService);
  private components = inject(BritComponents);

  readonly player = input.required<BritPlayer>();
  readonly currentPlayer = input(false, { transform: booleanAttribute });
  // @Input () validBuildings: BritBuilding[] | null = null;
  // @Input () validResources: BritResourceType[] | null = null;
  readonly selectPlayer = output<void>();
  readonly nationClick = output<BritNationId>();
  // @Output () clickPawn = new EventEmitter<BritPawnType> ();
  // @Output () clickResource = new EventEmitter<BritResourceType> ();

  // pawnNodes!: BritPawnNode[];
  // resourceNodes!: BritResourceNode[];

  nationNodes: BritNationNode[] = [];

  selectedNationNode: BritNationNode | null = null;

  ngOnInit(): void {
    for (const nationId of this.player().nationIds) {
      this.nationNodes.push({
        id: nationId,
        nation: this.components.NATION[nationId],
        iconSource: this.assetsService.getNationIconImageSource(nationId),
        cardSource: this.assetsService.getNationCardImageSource(nationId),
      });
    }
  }

  onCardClick(): void {
    const player = this.player();
    if (
      !player.isAi &&
      this.authService.isUserId(player.controller.id) &&
      !this.currentPlayer()
    ) {
      this.selectPlayer.emit();
    }
  }

  onNationClick(nationNode: BritNationNode, event: MouseEvent): void {
    this.nationClick.emit(nationNode.id);
    event.stopPropagation();
  }

  // onPawnClick (pawnNode: BritPawnNode) {
  //   if (pawnNode.active) {
  //     this.clickPawn.emit (pawnNode.type);
  //   }
  // }

  // onResourceClick (resourceNode: BritResourceNode) {
  //   if (resourceNode.active) {
  //     this.clickResource.emit (resourceNode.type);
  //   }
  // }
}
