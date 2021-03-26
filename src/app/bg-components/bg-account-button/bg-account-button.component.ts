import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { BgAuthService } from "@bg-services";
import { ExhaustingEvent, UntilDestroy } from "@bg-utils";

@Component ({
  selector: "bg-account-button",
  templateUrl: "./bg-account-button.component.html",
  styleUrls: ["./bg-account-button.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy
export class BgAccountButtonComponent implements OnInit, OnDestroy {

  constructor (
    private authService: BgAuthService
  ) { }

  user$ = this.authService.getUser$ ();

  ngOnInit () { }
  ngOnDestroy () { }

  @ExhaustingEvent ()
  onSignInClick () {
    return this.authService.signIn$ ();
  } // onSignInClick

  @ExhaustingEvent ()
  onSignOutClick () {
    return this.authService.signOut$ ();
  } // onSignOutClick

} // BgAccountButtonComponent
