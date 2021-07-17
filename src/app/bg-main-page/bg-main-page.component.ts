import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { BgAppService, BgAuthService } from "@bg-services";
import { SingleEvent, UntilDestroy } from "@bg-utils";

@Component ({
  selector: "bg-main-page",
  templateUrl: "./bg-main-page.component.html",
  styleUrls: ["./bg-main-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy
export class BgMainPageComponent implements OnInit, OnDestroy {

  constructor (
    private authService: BgAuthService,
    private appService: BgAppService
  ) { }

  apps = this.appService.getApps ();

  @SingleEvent ()
  ngOnInit () {
    return this.authService.autoSignIn$ ();
  } // ngOnInit

  ngOnDestroy () { }

} // BgMainPageComponent
