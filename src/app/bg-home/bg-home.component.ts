import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { BgAppService, BgAuthService } from "@bg-services";
import { InitEvent, UntilDestroy } from "@bg-utils";

@Component ({
  selector: "bg-home",
  templateUrl: "./bg-home.component.html",
  styleUrls: ["./bg-home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy
export class BgHomeComponent implements OnInit, OnDestroy {

  constructor (
    private authService: BgAuthService,
    private appService: BgAppService
  ) { }

  apps = this.appService.getApps ();

  @InitEvent ()
  ngOnInit () {
    return this.authService.autoSignIn$ ();
  } // ngOnInit

  ngOnDestroy () { }

} // BgHomeComponent
