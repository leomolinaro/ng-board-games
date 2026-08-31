import { Component, inject, resource } from '@angular/core';
import type { BgTransformFn} from '@leobg/commons/utils';
import { BgTransformPipe } from '@leobg/commons/utils';
import { TuiTabBar } from '@taiga-ui/addon-mobile';
import { TuiTable, TuiTableControl } from '@taiga-ui/addon-table';
import { TuiDropdown, TuiTitle } from '@taiga-ui/core';
import { TuiCell } from '@taiga-ui/core/components/cell';
import { TuiItemsWithMore, TuiProgress } from '@taiga-ui/kit';
import { AgotData } from '../agot-services/agot-data';
import type { AgotFcDeck} from './agot-fc-decks';
import { DECKS } from './agot-fc-decks';

@Component({
  selector: 'agot-fc-decks',
  imports: [
    BgTransformPipe,
    TuiCell,
    TuiCell,
    TuiDropdown,
    TuiItemsWithMore,
    TuiProgress,
    TuiTabBar,
    TuiTable,
    TuiTableControl,
    TuiTitle,
  ],
  template: `
    <table
      tuiTable
      size="m"
      class="agot-fc-table"
    >
      <tbody tuiTbody>
        @for (deck of loading() ? [] : decks; track deck.name) {
          <tr>
            <td tuiTd>
              <div tuiCell="m">
                <img
                  class="agot-fc-card-image"
                  [src]="deck | bgTransform: getDeckFactionImage"
                  width="50"
                />
                <img
                  class="agot-fc-card-image"
                  [src]="deck | bgTransform: getDeckAgendaImage"
                  width="50"
                />
              </div>
            </td>
            <td tuiTd>
              <div tuiCell="m">
                <span tuiTitle>
                  {{ deck.name }}
                </span>
              </div>
            </td>
            <td tuiTd>
              <div tuiCell="m">
                @if (deck.link) {
                  <a
                    [href]="deck.link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on ThronesDB
                  </a>
                } @else {
                  <span>No link</span>
                }
              </div>
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: `
    .agot-fc-table {
      width: 100%;
    }
  `,
})
export class AgotFcDecksPage {
  private data = inject(AgotData);

  protected decks = DECKS;

  protected getDeckFactionImage: BgTransformFn<AgotFcDeck, string> = (deck) => {
    return `assets/agot/factions/${deck.faction}.png`;
  };
  protected getDeckAgendaImage: BgTransformFn<AgotFcDeck, string> = (deck) => {
    const card = this.data.getCard(deck.agenda);
    return card?.image_url;
  };

  private dataLoad = resource({
    loader: () => this.data.load(),
  });

  protected loading = this.dataLoad.isLoading;
}
