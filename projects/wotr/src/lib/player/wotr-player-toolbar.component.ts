import { NgClass } from "@angular/common";
import { Component, computed, inject, input, output } from "@angular/core";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { BgAuthService } from "@leobg/commons";
import { BgTransformPipe } from "@leobg/commons/utils";
import { WotrPlayerBadgeComponent } from "./wotr-player-badge.component";
import { WotrPlayerInfo } from "./wotr-player-info.models";

@Component ({
  selector: "wotr-player-toolbar",
  standalone: true,
  imports: [BgTransformPipe, NgClass, MatMenuTrigger, MatMenu, MatMenuItem, WotrPlayerBadgeComponent],
  template: `
    <wotr-player-badge
      [player]="currentPlayer ()"
      [ngClass]="{
        'can-change-player': !!selectablePlayers ().length
      }"
      [matMenuTriggerFor]="selectablePlayers ().length ? selectablePlayersMenu : null">
    </wotr-player-badge>
    <mat-menu #selectablePlayersMenu="matMenu">
      @for (player of selectablePlayers (); track player.id) {
        <div mat-menu-item (click)="currentPlayerChange.emit (player)">
          <wotr-player-badge [player]="player"></wotr-player-badge>
        </div>
      }
    </mat-menu>
    <span class="message">
      {{ message () }}
    </span>
    @if (canConfirm ()) {
      <button (click)="confirm.emit ()">Confirm</button>
    }
  `,
  styles: [`
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

  `]
})
export class WotrPlayerToolbarComponent {

  private authService = inject (BgAuthService);

  message = input.required<string> ();
  canConfirm = input.required<boolean> ();
  canPass = input.required<boolean> ();
  canCancel = input.required<boolean> ();
  currentPlayer = input.required<WotrPlayerInfo | null> ();
  players = input.required<WotrPlayerInfo[]> ();

  selectablePlayers = computed (() => {
    const currentPlayerId = this.currentPlayer ()?.id;
    return this.players ().filter (p => !p.isAi && currentPlayerId !== p.id && p.controller.id === this.authService.getUser ().id);
  });

  currentPlayerChange = output<WotrPlayerInfo | null> ();
  confirm = output<void> ();

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
