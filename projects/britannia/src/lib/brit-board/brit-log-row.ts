import { Component, computed, inject, input } from '@angular/core';
import type {
  BritArea,
  BritAreaId,
  BritLeaderId,
  BritPhase,
} from '../brit-components.models';
import { BritComponents } from '../brit-components.service';
import type {
  BritAreaLeader,
  BritAreaUnit,
  BritLog,
  BritPlayer,
} from '../brit-game-state.models';

interface BritLogStringFragment {
  type: 'string';
  label: string;
}

interface BritLogPlayerFragment {
  type: 'player';
  label: string;
  player: BritPlayer;
}

interface BritLogAreaFragment {
  type: 'area';
  label: string;
  area: BritArea;
}

// interface BritLogPawnFragment {
//   type: "pawn";
//   label: string;
//   pawn: BritPawnType;
// }

type BritLogFragment =
  | BritLogStringFragment
  | BritLogPlayerFragment
  | BritLogAreaFragment /*  | BritLogLandFragment | BritLogPawnFragment */;

@Component({
  selector: 'brit-log-row',
  template: `
    <div
      class="brit-log"
      [class.brit-log-h0]="log().type === 'setup' || log().type === 'round'"
      [class.brit-log-h1]="log().type === 'nation-turn'"
      [class.brit-log-h2]="log().type === 'phase'"
    >
      @for (fragment of fragments(); track fragment) {
        @switch (fragment.type) {
          @case ('string') {
            <span>{{ fragment.label }}</span>
          }
          @case ('area') {
            <span>{{ fragment.label }}</span>
          }
          <!-- <a *ngSwitchCase="'player'" [class]="'is-' + $any (fragment).player.color">{{ fragment.label }}</a>
          <a *ngSwitchCase="'land'" [class]="'is-' + $any (fragment).land.type">{{ fragment.label }}</a>
          <a *ngSwitchCase="'pawn'">{{ fragment.label }}</a> -->
        }
      }
    </div>
  `,
  styles: [
    `
      @use 'brit-variables' as *;

      .brit-log {
        margin-left: 1.5vw;

        &.brit-log-h0 {
          font-size: 130%;
          margin-left: 0;
        }
        &.brit-log-h1 {
          font-size: 120%;
          margin-left: 0.5vw;
        }
        &.brit-log-h2 {
          font-size: 110%;
          margin-left: 1vw;
        }

        .is-red {
          color: $red;
        }
        .is-blue {
          color: $blue;
        }
        .is-yellow {
          color: $yellow;
        }
        .is-green {
          color: $green;
        }
      }
    `,
  ],
})
export class BritLogRow {
  private components = inject(BritComponents);

  readonly log = input.required<BritLog>();

  protected fragments = computed<BritLogFragment[]>(() => {
    const l = this.log();
    switch (l.type) {
      case 'setup':
        return [this.string('Setup')];
      case 'round':
        return [this.string(`Round ${l.roundId}`)];
      case 'nation-turn':
        return [this.string(this.components.NATION[l.nationId].label)];
      case 'phase':
        return [this.string(this.getPhaseLabel(l.phase))];
      case 'population-marker-set': {
        const action =
          l.populationMarker == undefined ? 'unset' : `set to ${l.populationMarker}`;
        return [this.string(`Population marker ${action}`)];
      }
      case 'infantry-placement':
        return [
          this.string(
            `${l.quantity} infantr${l.quantity === 1 ? 'y' : 'ies'} placed in `,
          ),
          this.area(l.landId),
        ];
      case 'infantry-reinforcement':
        return [
          this.string(
            `${l.quantity} infantry reinforcement${l.quantity === 1 ? '' : 's'} in `,
          ),
          this.area(l.areaId),
        ];
      case 'army-movement': {
        const fragments: BritLogFragment[] = [];
        let quantity = 0;
        let isFirst = true;
        for (const unit of l.units) {
          if (isFirst) {
            isFirst = false;
          } else {
            fragments.push(this.string(', '));
          }
          if (unit.type === 'leader') {
            quantity++;
            fragments.push(this.leader(unit.leaderId));
          } else {
            quantity += unit.quantity;
            fragments.push(this.unit(unit));
          }
        }
        fragments.push(
          this.string(` ${quantity === 1 ? 'moves' : 'move'} from `),
          this.area(l.units[0].areaId),
          this.string(' to '),
          this.area(l.toAreaId),
        );
        return fragments;
      }
    }
  });

  private string(label: string): BritLogStringFragment {
    return {
      type: 'string',
      label: label,
    };
  }

  private area(areaId: BritAreaId): BritLogAreaFragment {
    const area = this.components.AREA[areaId];
    return {
      type: 'area',
      label: area.name,
      area,
    };
  }

  private leader(leaderId: BritLeaderId): BritLogStringFragment {
    return {
      type: 'string',
      label: this.components.getLeader(leaderId).name,
    };
  }

  private unit(
    unit: Exclude<BritAreaUnit, BritAreaLeader>,
  ): BritLogStringFragment {
    return {
      type: 'string',
      label: `${unit.quantity} ${this.components
        .getNation(unit.nationId)
        .label.toLowerCase()} ${this.components.getUnitTypeLabel(unit.type, unit.quantity === 1)}`,
    };
  }

  // private player (playerId: string): BritLogPlayerFragment {
  //   const player = this.game.getPlayer (playerId);
  //   return {
  //     type: "player",
  //     label: player.name,
  //     player: player
  //   };
  // }

  // private land (landId: BritLandCoordinates): BritLogLandFragment {
  //   const land = this.game.getLand (landId);
  //   let label: string;
  //   switch (land.type) {
  //     case "fields": label = "fields"; break;
  //     case "plain": label = "plain"; break;
  //     case "mountain": label = "mountain"; break;
  //     case "forest": label = "forest"; break;
  //     case "lake": label = "lake"; break;
  //   }
  //   return {
  //     type: "land",
  //     label: label,
  //     land: land
  //   };
  // }

  // private pawn (pawnType: BritPawnType): BritLogPawnFragment {
  //   let label: string;
  //   switch (pawnType) {
  //     case "city": label = "city"; break;
  //     case "knight": label = "knight"; break;
  //     case "stronghold": label = "stronghold"; break;
  //     case "village": label = "village"; break;
  //   }
  //   return {
  //     type: "pawn",
  //     label: label,
  //     pawn: pawnType
  //   };
  // }

  private getPhaseLabel(phase: BritPhase): string {
    switch (phase) {
      case 'populationIncrease':
        return 'Population Increase';
      case 'movement':
        return 'Movement';
      case 'battlesRetreats':
        return 'Battles / Retreats';
      case 'raiderWithdrawal':
        return 'Raider Withdrawal';
      case 'overpopulation':
        return 'Overpopulation';
    }
  }
}
