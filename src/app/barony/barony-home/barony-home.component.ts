import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component ({
  selector: "app-barony-home",
  templateUrl: "./barony-home.component.html",
  styleUrls: ["./barony-home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaronyHomeComponent implements OnInit {

  constructor () { }

  ngOnInit (): void {
  }

}
