import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BgAppService } from "@bg-services";

@Component ({
  selector: "bg-home",
  templateUrl: "./bg-home.component.html",
  styleUrls: ["./bg-home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BgHomeComponent {

  constructor (
    private appService: BgAppService
  ) { }

  apps = this.appService.getApps ();

} // BgHomeComponent
