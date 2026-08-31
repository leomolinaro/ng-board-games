import { Component } from '@angular/core';
import { injectDialogContext } from '@leobg/commons';
import { BgTransformPipe } from '@leobg/commons/utils';
import { TuiTable, TuiTableControl } from '@taiga-ui/addon-table';
import { TuiIcon } from '@taiga-ui/core';
import { BARONY_RESOURCE_TYPES } from '../barony-constants';
import { BaronyPlayer, BaronyResourceType } from '../barony-models';

interface BaronyEndGameData {
  players: BaronyPlayer[];
}

@Component({
  selector: 'barony-end-game-dialog',
  imports: [BgTransformPipe, TuiIcon, TuiTable, TuiTableControl],
  template: `
    <table
      tuiTable
      size="m"
      class="b-end-game-table"
    >
      <thead>
        <tr>
          <th tuiTh></th>
          <th tuiTh>Player</th>
          <th tuiTh>Score</th>
          <th
            tuiTh
            class="resources-header"
          >
            Resources
          </th>
          <th tuiTh>Victory points</th>
        </tr>
      </thead>
      <tbody tuiTbody>
        @for (player of players; track player.id) {
          <tr
            class="b-end-game-player-row"
            [class]="'is-' + player.id"
            [class.is-winner]="player.winner"
          >
            <td tuiTd>
              @if (player.winner) {
                <tui-icon icon="trophy" />
              }
            </td>
            <td tuiTd>
              {{ player.name }}
            </td>
            <td tuiTd>
              {{ player.score }}
            </td>
            <td
              tuiTd
              class="b-end-game-resources-cell"
            >
              <div>
                @for (resourceType of resourceTypes; track resourceType) {
                  <div class="b-end-game-resource-image">
                    <img
                      [src]="resourceType | bgTransform: getResourceImageSource"
                    />
                  </div>
                }
                @for (resourceType of resourceTypes; track resourceType) {
                  <div class="b-end-game-resource-quantity">
                    {{ player.resources[resourceType] }}
                  </div>
                }
              </div>
            </td>
            <td tuiTd>
              {{ player.victoryPoints }}
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: `
    @use 'barony-variables' as *;

    table {
      width: 100%;
    }

    [tuiTh],
    [tuiTd] {
      border-inline-start: none;
      border-inline-end: none;
      background: transparent;
    }

    .resources-header {
      text-align: center;
    }

    .b-end-game-resources-cell {
      justify-items: center;
      > div {
        margin-top: 1vh;
        display: grid;
        max-width: 150px;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        column-gap: 1vmin;
      }

      .b-end-game-resource-image {
        display: flex;
        align-items: center;
        & > img {
          width: 100%;
        }
      }
      .b-end-game-resource-quantity {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .b-end-game-player-row {
      &.is-red {
        box-shadow: widget-shadow($red-light);
      }
      &.is-yellow {
        box-shadow: widget-shadow($yellow-light);
      }
      &.is-green {
        box-shadow: widget-shadow($green-light);
      }
      &.is-blue {
        box-shadow: widget-shadow($blue-light);
      }
    }
  `,
})
export class BaronyEndGameDialog {
  context = injectDialogContext<BaronyEndGameData>();
  readonly players = this.context.data.players;

  playerColumns = ['player', 'score', 'resources', 'victoryPoints', 'winner'];

  resourceTypes = BARONY_RESOURCE_TYPES;

  getResourceImageSource(resourceType: BaronyResourceType) {
    return `assets/barony/resources/${resourceType}.png`;
  }
}
