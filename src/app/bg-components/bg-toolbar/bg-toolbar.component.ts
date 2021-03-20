import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import { BgAuthService } from "@bg-services";
import { ExhaustingEvent, UntilDestroy } from "@bg-utils";

@Component ({
  selector: "bg-toolbar",
  templateUrl: "./bg-toolbar.component.html",
  styleUrls: ["./bg-toolbar.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy
export class BgToolbarComponent implements OnDestroy {

  constructor (
    private authService: BgAuthService
  ) { }

  user$ = this.authService.getUser$ ();

  ngOnDestroy () { }

  @ExhaustingEvent ()
  onSignInClick () {
    return this.authService.signIn$ ();
  } // onSignInClick

  @ExhaustingEvent ()
  onSignOutClick () {
    return this.authService.signOut$ ();
  } // onSignOutClick

} // BgToolbarComponent
