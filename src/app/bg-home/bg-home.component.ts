import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { ChangeDetectionStrategy, Component, Directive, OnInit, ViewContainerRef } from "@angular/core";
import { Loading } from "@bg-utils";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Directive ({
  selector: "[bgNewGameHost]"
})
export class BgNewGameHostDirective {

  constructor (
    public viewContainerRef: ViewContainerRef
  ) { }

} // BgNewGameHostDirective

@Component ({
  selector: "bg-home",
  templateUrl: "./bg-home.component.html",
  styleUrls: ["./bg-home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BgHomeComponent implements OnInit {

  constructor (
    private breakpointObserver: BreakpointObserver
  ) { }

  @Loading () loading$!: Observable<boolean>;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe (Breakpoints.Handset)
  .pipe (map (result => result.matches));

  ngOnInit (): void {
  } // ngOnInit

} // BgHomeComponent
