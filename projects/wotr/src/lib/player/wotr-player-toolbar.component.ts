import { NgClass } from "@angular/common";
import { Component, computed, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { BgAuthService } from "@leobg/commons";
import { WotrGameUiStore } from "../game/wotr-game-ui.store";
import { WotrPlayerBadgeComponent } from "./wotr-player-badge.component";
import { WotrPlayerInfoStore } from "./wotr-player-info.store";

@Component({
  selector: "wotr-player-toolbar",
  imports: [NgClass, MatMenuTrigger, MatMenu, MatMenuItem, FormsModule, WotrPlayerBadgeComponent],
  template: `
    <wotr-player-badge
      [playerId]="ui.currentPlayerId()"
      [ngClass]="{
        'can-change-player': !!selectablePlayers().length
      }"
      [matMenuTriggerFor]="selectablePlayers().length ? selectablePlayersMenu : null">
    </wotr-player-badge>
    <mat-menu #selectablePlayersMenu="matMenu">
      @for (player of selectablePlayers(); track player.id) {
        <div
          mat-menu-item
          (click)="ui.setCurrentPlayerId(player.id)">
          <wotr-player-badge [playerId]="player.id"></wotr-player-badge>
        </div>
      }
    </mat-menu>
    <span class="message">
      {{ ui.message() }}
    </span>
    @if (ui.canConfirm()) {
      <button (click)="ui.confirm.emit(true)">Yes</button>
      <button (click)="ui.confirm.emit(false)">No</button>
    }
    @if (ui.canContinue()) {
      <button (click)="ui.continue.emit()">Continue</button>
    }
    @if (ui.canInputQuantity()) {
      <form (ngSubmit)="ui.inputQuantity.emit(quantity)">
        <input
          type="number"
          [(ngModel)]="quantity"
          name="inputField"
          placeholder="Enter the quantity" />
        <button type="submit">Confirm</button>
      </form>
    }
    @for (option of ui.validOptions(); track option.value) {
      <button
        [disabled]="!!option.disabled"
        (click)="!option.disabled && ui.option.emit(option)">
        {{ option.label }}
      </button>
    }
  `,
  styles: [
    `
      @use "wotr-variables" as wotr;
      :host {
        @include wotr.golden-padding(1vmin);
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
  protected ui = inject(WotrGameUiStore);
  protected playerInfoStore = inject(WotrPlayerInfoStore);

  protected players = this.playerInfoStore.players;

  protected selectablePlayers = computed(() => {
    const currentPlayerId = this.ui.currentPlayerId();
    return this.players().filter(
      p => !p.isAi && currentPlayerId !== p.id && p.controller.id === this.authService.getUser().id
    );
  });

  protected quantity = 0;
}
