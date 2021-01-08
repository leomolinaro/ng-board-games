import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component ({
  selector: "barony",
  templateUrl: "./barony.component.html",
  styleUrls: ["./barony.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaronyComponent implements OnInit {

  constructor () { }

  ngOnInit (): void {
  }

}
