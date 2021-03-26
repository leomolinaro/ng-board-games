import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { BgAuthService } from "@bg-services";
import { InitEvent } from "@bg-utils";

@Component ({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {

  constructor (
    private authService: BgAuthService
  ) { }

  @InitEvent ()
  ngOnInit () {
    return this.authService.autoSignIn$ ();
  } // ngOnInit

  ngOnDestroy () { }

} // AppComponent
