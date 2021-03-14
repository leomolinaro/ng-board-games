import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { BgAuthService } from "@bg-services";
import { subscribeTo, UntilDestroy } from "@bg-utils";

@Component ({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy
export class AppComponent implements OnInit, OnDestroy {

  constructor (
    private authService: BgAuthService
  ) { }

  ngOnInit () {
    subscribeTo (this.authService.login$ ("leo"), this);
  } // ngOnInit

  ngOnDestroy () { }

} // AppComponent
