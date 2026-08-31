import {
  Component,
  OnChanges,
  SimpleChanges,
  TrackByFunction,
  inject,
  input,
  output,
} from '@angular/core';
import { BgAuthService } from '@leobg/commons';
import { TuiIcon } from '@taiga-ui/core';
import {
  BARONY_PAWN_TYPES,
  BARONY_RESOURCE_TYPES,
} from '../../barony-constants';
import {
  BaronyBuilding,
  BaronyPawnType,
  BaronyPlayer,
  BaronyResourceType,
} from '../../barony-models';

interface BaronyPawnNode {
  source: string;
  type: BaronyPawnType;
  quantity: number;
  active: boolean;
}

interface BaronyResourceNode {
  source: string;
  type: BaronyResourceType;
  quantity: number;
  active: boolean;
}

@Component({
  selector: 'barony-player-area',
  imports: [TuiIcon],
  templateUrl: './barony-player-area.html',
  styleUrls: ['./barony-player-area.scss'],
})
export class BaronyPlayerArea implements OnChanges {
  private authService = inject(BgAuthService);

  readonly player = input.required<BaronyPlayer>();
  readonly currentPlayer = input<boolean>(false);
  readonly validBuildings = input<BaronyBuilding[] | null>(null);
  readonly validResources = input<BaronyResourceType[] | null>(null);
  readonly selectPlayer = output<void>();
  readonly clickPawn = output<BaronyPawnType>();
  readonly clickResource = output<BaronyResourceType>();

  pawnNodes!: BaronyPawnNode[];
  resourceNodes!: BaronyResourceNode[];

  pawnTrackBy: TrackByFunction<BaronyPawnNode> = (
    index,
    pawnNode: BaronyPawnNode,
  ) => pawnNode.type;
  resourceTrackBy: TrackByFunction<BaronyResourceNode> = (
    index,
    resourceNode: BaronyResourceNode,
  ) => resourceNode.type;

  ngOnChanges(changes: SimpleChanges): void {
    let refreshPawns = false;
    let refreshResources = false;

    const playerChanges = changes['player'];
    if (playerChanges) {
      const prevPlayer = playerChanges.previousValue as
        BaronyPlayer | undefined;
      const currPlayer = playerChanges.currentValue as BaronyPlayer;
      if (!prevPlayer || prevPlayer.pawns !== currPlayer.pawns) {
        refreshPawns = true;
      }
      if (!prevPlayer || prevPlayer.resources !== currPlayer.resources) {
        refreshResources = true;
      }
    }
    if (changes['validBuildings']) refreshPawns = true;
    if (changes['validResources']) refreshResources = true;

    if (refreshPawns) {
      this.pawnNodes = BARONY_PAWN_TYPES.map((pt) => {
        const validBuildings = this.validBuildings();
        return {
          source: `assets/barony/pawns/${this['player']().id}-${pt}.png`,
          type: pt,
          quantity: this['player']().pawns[pt],
          active:
            validBuildings && (pt === 'stronghold' || pt === 'village')
              ? validBuildings.includes(pt)
              : false,
        };
      });
    }

    if (refreshResources) {
      this.resourceNodes = BARONY_RESOURCE_TYPES.map((rt) => {
        const validResources = this.validResources();
        return {
          source: `assets/barony/resources/${rt}.png`,
          type: rt,
          quantity: this['player']().resources[rt],
          active: validResources ? validResources.includes(rt) : false,
        };
      });
    }
  }

  onCardClick() {
    const player = this['player']();
    if (
      !player.isAi &&
      this.authService.isUserId(player.controller.id) &&
      !this.currentPlayer()
    ) {
      this.selectPlayer.emit();
    }
  }

  onPawnClick(pawnNode: BaronyPawnNode) {
    if (pawnNode.active) {
      this.clickPawn.emit(pawnNode.type);
    }
  }

  onResourceClick(resourceNode: BaronyResourceNode) {
    if (resourceNode.active) {
      this.clickResource.emit(resourceNode.type);
    }
  }
}
