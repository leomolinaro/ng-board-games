import { NgClass } from "@angular/common";
import { Component, computed, inject, input, output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { BgAuthService } from "@leobg/commons";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrGameUiInputQuantity } from "../game/wotr-game-ui.store";
import { WotrPlayerBadgeComponent } from "./wotr-player-badge.component";
import { WotrPlayerInfo } from "./wotr-player-info.models";

@Component({
  selector: "wotr-player-toolbar",
  imports: [NgClass, MatMenuTrigger, MatMenu, MatMenuItem, FormsModule, WotrPlayerBadgeComponent],
  template: `
    <wotr-player-badge
      [playerId]="currentPlayerId()"
      [ngClass]="{
        'can-change-player': !!selectablePlayers().length
      }"
      [matMenuTriggerFor]="selectablePlayers().length ? selectablePlayersMenu : null">
    </wotr-player-badge>
    <mat-menu #selectablePlayersMenu="matMenu">
      @for (player of selectablePlayers (); track player.id) {
      <div
        mat-menu-item
        (click)="currentPlayerChange.emit(player)">
        <wotr-player-badge [playerId]="player.id"></wotr-player-badge>
      </div>
      }
    </mat-menu>
    <span class="message">
      {{ message() }}
    </span>
    @if (canConfirm ()) {
    <button (click)="confirm.emit(true)">Yes</button>
    <button (click)="confirm.emit(false)">No</button>
    } @if (canContinue ()) {
    <button (click)="continue.emit()">Continue</button>
    } @let q = canInputQuantity (); @if (q) {
    <form (ngSubmit)="inputQuantity.emit(quantity)">
      <input
        type="number"
        [(ngModel)]="quantity"
        name="inputField"
        placeholder="Enter the quantity" />
      <button type="submit">Confirm</button>
    </form>
    }
  `,
  styles: [
    `
      @import "wotr-variables";
      :host {
        @include golden-padding(1vmin);
        height: 100%;
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
    `
  ]
})
export class WotrPlayerToolbarComponent {
  private authService = inject(BgAuthService);

  message = input.required<string>();
  canConfirm = input.required<boolean>();
  canContinue = input.required<boolean>();
  canPass = input.required<boolean>();
  canCancel = input.required<boolean>();
  canInputQuantity = input.required<WotrGameUiInputQuantity | false>();
  currentPlayerId = input.required<WotrFrontId | null>();
  players = input.required<WotrPlayerInfo[]>();

  selectablePlayers = computed(() => {
    const currentPlayerId = this.currentPlayerId();
    return this.players().filter(
      p => !p.isAi && currentPlayerId !== p.id && p.controller.id === this.authService.getUser().id
    );
  });

  currentPlayerChange = output<WotrPlayerInfo | null>();
  confirm = output<boolean>();
  continue = output<void>();
  inputQuantity = output<number>();

  protected quantity = 0;

  // otherPlayers = computed (() => {
  //   const currentPlayerId = this.currentPlayerId ();
  //   const playerIds = this.playerInfoStore.playerIds ();
  //   const playerMap = this.playerInfoStore.playerMap ();
  //   if (currentPlayerId) {
  //     const n = playerIds.length;
  //     const toReturn: WotrPlayer[] = [];
  //     const offset = playerIds.indexOf (currentPlayerId);
  //     for (let i = 1; i < n; i++) {
  //       toReturn.push (playerMap[playerIds[(offset + i) % n]]);
  //     }
  //     return toReturn;
  //   } else {
  //     return playerIds.map (id => playerMap[id]);
  //   }
  // });
}
