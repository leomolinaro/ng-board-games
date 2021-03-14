import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { BgAppService } from "@bg-services";
import { ExhaustingEvent, subscribeTo, UntilDestroy } from "@bg-utils";
import { BgAuthService, BgUser } from "../bg-services/bg-auth.service";

@Component ({
  selector: "bg-home",
  templateUrl: "./bg-home.component.html",
  styleUrls: ["./bg-home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy
export class BgHomeComponent implements OnDestroy {

  constructor (
    private appService: BgAppService,
    private authService: BgAuthService
  ) { }

  apps = this.appService.getApps ();
  users$ = this.authService.userChanges$ ();
  loggedUser$ = this.authService.getLoggedUser$ ();

  ngOnDestroy () { }

  @ExhaustingEvent ()
  onLoginClick (user: BgUser) {
    return this.authService.login$ (user.username);
  } // onLoginClick

} // BgHomeComponent
