import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { BgAuthService, BgUser } from "../../../authentication";
import { BooleanInput } from "../../../utils";
import { BgProtoPlayer, BgProtoPlayerType } from "../../bg-proto-game.service";

@Component ({
  selector: "bg-home-player-form",
  templateUrl: "./bg-home-player-form.component.html",
  styleUrls: ["./bg-home-player-form.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BgHomePlayerFormComponent {

  constructor (private authService: BgAuthService) {}

  @Input () onlineGame!: boolean;
  @Input () player!: BgProtoPlayer;
  @Input () @BooleanInput () isOwner!: boolean;
  @Input () @BooleanInput () isPlayer!: boolean;

  @Output () playerChange = new EventEmitter<BgProtoPlayer> ();

  playerNameActive = (player: BgProtoPlayer) => {
    return (player.type === "ai" && this.isOwner) || this.isPlayer;
  }; // playerNameActive

  onPlayerChange (player: BgProtoPlayer) {
    this.playerChange.next (player);
  } // onPlayerChange

  onNextPlayerType () {
    const controllerPatch: { controller?: BgUser | null } = {};
    const namePatch: { name?: string | "" } = {};
    const readyPatch: { ready?: boolean } = {};
    const nextPlayerType = this.getNextPlayerType (this.player.type);
    switch (nextPlayerType) {
      case "user": {
        controllerPatch.controller = this.authService.getUser ();
        namePatch.name = this.authService.getUser ().displayName;
        if (!this.onlineGame) {
          readyPatch.ready = true;
        }
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
      ...readyPatch,
    });
  } // onNextPlayerType

  private getNextPlayerType (currentType: BgProtoPlayerType): BgProtoPlayerType {
    if (this.isOwner) {
      switch (currentType) {
        case "closed":
          return "user";
        case "user":
          return this.onlineGame ? "open" : "ai";
        case "open":
          return "ai";
        case "ai":
          return "closed";
      } // switch
    } else {
      switch (currentType) {
        case "closed":
          return "closed";
        case "user":
          return "open";
        case "open":
          return "user";
        case "ai":
          return "ai";
      } // switch
    } // if - else
  } // getNextPlayerType
  
} // BgHomePlayerFormComponent
