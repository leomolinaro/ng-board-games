import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { BaronyRemoteService } from "../barony-remote.service";

@Component ({
  selector: "app-barony-home",
  templateUrl: "./barony-home.component.html",
  styleUrls: ["./barony-home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaronyHomeComponent implements OnInit {

  constructor (
    private remote: BaronyRemoteService
  ) { }

  remoteGames$ = this.remote.selectGames$ ();

  ngOnInit (): void {
  } // ngOnInit

  onTestDataClick () {
    this.remote.generateExampleData$ ().subscribe ();
  } // onTestDataClick

} // BaronyHomeComponent
