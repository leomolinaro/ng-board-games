import { Component, computed, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BgAuthService } from "@leobg/commons";
import { TuiDataList, TuiDropdown } from "@taiga-ui/core";
import { WotrGameUi } from "../game/wotr-game-ui";
import { WotrPlayerBadge } from "./wotr-player-badge";
import { WotrPlayerInfoStore } from "./wotr-player-info-store";

@Component({
  selector: "wotr-player-toolbar",
  imports: [TuiDropdown, TuiDataList, FormsModule, WotrPlayerBadge],
  template: `
    <wotr-player-badge
      [playerId]="ui.currentPlayerId()"
      [class]="{
        'can-change-player': !!selectablePlayers().length
      }"
      [tuiDropdown]="selectablePlayers().length ? selectablePlayersMenu : null"
      tuiDropdownAuto>
    </wotr-player-badge>
    <ng-template #selectablePlayersMenu>
      <tui-data-list>
        @for (player of selectablePlayers(); track player.id) {
          <div
            tuiOption
            (click)="ui.setCurrentPlayerId(player.id)">
            <wotr-player-badge [playerId]="player.id"></wotr-player-badge>
          </div>
        }
      </tui-data-list>
    </ng-template>
    <span class="message">
      {{ ui.message() }}
    </span>
    @if (ui.canCancel() && ui.message()) {
      <button
        class="cancel"
        (click)="ui.cancel.emit()">
        Cancel
      </button>
    }
  `,
  styles: [
    `
      @use "wotr-variables" as wotr;
      :host {
        @include wotr.golden-padding(1vmin);
        // height: 100%;
        display: flex;
        align-items: center;
      }
      .can-change-player {
        cursor: pointer;
      }
      .message {
        margin-left: 1vmin;
        margin-right: auto;
      }
      .cancel {
        @include wotr.button;
      }
    `
  ]
})
export class WotrPlayerToolbar {
  private authService = inject(BgAuthService);
  protected ui = inject(WotrGameUi);
  protected playerInfoStore = inject(WotrPlayerInfoStore);

  protected players = this.playerInfoStore.players;

  protected selectablePlayers = computed(() => {
    const currentPlayerId = this.ui.currentPlayerId();
    return this.players().filter(
      p => !p.isAi && currentPlayerId !== p.id && p.controller.id === this.authService.getUser().id
    );
  });
}
