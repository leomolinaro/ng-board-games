import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { BritPlayer } from "../brit-models";

@Component ({
  selector: "brit-player",
  templateUrl: "./brit-player.component.html",
  styleUrls: ["./brit-player.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BritPlayerComponent implements OnInit {

  constructor () { }

  @Input () player!: BritPlayer;

  ngOnInit (): void {
  }

}
