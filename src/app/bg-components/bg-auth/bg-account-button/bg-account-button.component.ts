import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BgAuthService, BgUserLoginType } from "@bg-services";
import { ExhaustingEvent, UntilDestroy } from "@bg-utils";
import { switchMap } from "rxjs/operators";

@Component ({
  selector: "bg-account-button",
  templateUrl: "./bg-account-button.component.html",
  styleUrls: ["./bg-account-button.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy
export class BgAccountButtonComponent implements OnInit, OnDestroy {

  constructor (
    private authService: BgAuthService,
    private router: Router
  ) { }

  user$ = this.authService.getUser$ ();

  ngOnInit () { }
  ngOnDestroy () { }

  @ExhaustingEvent ()
  onSignInClick (type: BgUserLoginType) {
    return this.authService.signIn$ (type);
  } // onSignInClick

  @ExhaustingEvent ()
  onSignOutClick () {
    return this.authService.signOut$ ().pipe (
      switchMap (() => this.router.navigate ([""]))
    );
  } // onSignOutClick

  @ExhaustingEvent ()
  onDeleteAccountClick () {
    return this.authService.deleteUser$ ().pipe (
      switchMap (() => this.router.navigate ([""]))
    );
  } // onDeleteAccountClick

} // BgAccountButtonComponent
