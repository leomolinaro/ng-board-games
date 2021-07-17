import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BgAuthService, BgProtoPlayer, BgProtoPlayerType, BgUser } from "@bg-services";

@Component({
  selector: 'bg-home-player-form',
  templateUrl: './bg-home-player-form.component.html',
  styleUrls: ['./bg-home-player-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BgHomePlayerFormComponent {

  constructor (
    private authService: BgAuthService
  ) { }

  @Input () onlineGame!: boolean;
  @Input () player!: BgProtoPlayer;
  @Output () playerChange = new EventEmitter<BgProtoPlayer> ();

  playerNameActive = (player: BgProtoPlayer) => {
    return player.type === "ai" || player.type === "me";
  } // playerNameActive

  onPlayerChange (player: BgProtoPlayer) {
    this.playerChange.next (player);
  } // onPlayerChange

  onNextPlayerType () {
    const controllerPatch: { controller?: BgUser | null } = { };
    const namePatch: { name?: string | "" } = { };
    const readyPatch: { ready?: boolean } = { };
    const nextPlayerType = this.getNextPlayerType (this.player.type);
    switch (nextPlayerType) {
      case "me": {
        controllerPatch.controller = this.authService.getUser ();
        namePatch.name = this.authService.getUser ().displayName;
        if (!this.onlineGame) { readyPatch.ready = true; }
        break;
      } // case
      case "closed": {
        controllerPatch.controller = null;
        namePatch.name = "";
        readyPatch.ready = false;
        break;
      } // case
      case "open": {
        controllerPatch.controller = null;
        namePatch.name = "";
        readyPatch.ready = false;
        break;
      } // case
      case "ai": {
        controllerPatch.controller = null;
        namePatch.name = "AI";
        readyPatch.ready = true;
        break;
      } // case
    } // switch
    this.playerChange.next ({
      ...this.player,
      type: nextPlayerType,
      ...controllerPatch,
      ...namePatch,
      ...readyPatch
    });
  } // onNextPlayerType

  private getNextPlayerType (currentType: BgProtoPlayerType): BgProtoPlayerType {
    switch (currentType) {
      case "closed": return "me";
      case "me": return this.onlineGame ? "open" : "ai";
      case "open": return "ai";
      case "ai": return "closed";
      case "other": return "closed";
    } // switch
  } // getNextPlayerType
  
} // BgHomePlayerFormComponent
