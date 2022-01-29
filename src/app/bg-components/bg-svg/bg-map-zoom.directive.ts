import { ChangeDetectorRef, Component, Directive, ElementRef, HostBinding, HostListener, Input, OnInit } from "@angular/core";

const MOVE_STEP = 30;
const ZOOM_STEP = 0.2;

interface BgMapZoomRefreshParams {
  zoom: number;
  x0: number;
  y0: number;
  xt: number;
  yt: number;
  reset: boolean;
} // BgMapZoomRefreshParams

@Component ({
  selector: "svg[bgSvg]",
  template: "<ng-content></ng-content>"
})
export class BgSvgComponent {

  constructor (
    public elementRef: ElementRef<SVGSVGElement>,
  ) { }

  createSVGPoint () { return this.elementRef.nativeElement.createSVGPoint (); }
  getScreenCTM () { return this.elementRef.nativeElement.getScreenCTM (); }

} // BgSvgComponent

@Directive ({
  selector: "[bgMapZoom]"
})
export class BgMapZoomDirective implements OnInit {

  constructor (
    private bgSvg: BgSvgComponent,
    private cd: ChangeDetectorRef,
    private elementRef: ElementRef<SVGGElement>
  ) { }

  @Input ("bgMapZoom") config!: {
    translateX?: number;
    translateY?: number;
    scale?: number;
    zoomStep?: number;
    translateStep?: number;
  };

  @HostBinding ("attr.transform")
  transform!: string;

  private scale!: number;
  private translateX!: number;
  private translateY!: number;
  private zoomStep!: number;
  private translateStep!: number;

  private grabbing: boolean = false;
  private grabbingX: number | null = null;
  private grabbingY: number | null = null;

  ngOnInit () {
    this.parseConfig ();
    this.transform = `matrix (${this.scale}, 0, 0, ${this.scale}, ${this.translateX}, ${this.translateY})`;
  } // ngOnInit

  private parseConfig () {
    this.scale = this.config.scale || 1;
    this.translateX = this.config.translateX || 0;
    this.translateY = this.config.translateY || 0;
    this.zoomStep = this.config.zoomStep || 0.1;
    this.translateStep = this.config.translateStep || 15;
  } // parseConfig

  @HostListener ("mousedown", ["$event"])
  onMouseDown (event: MouseEvent) {
    if (event.button === 0) {
      this.grabbing = true;
      this.grabbingX = event.clientX;
      this.grabbingY = event.clientY;
    } else if (event.button === 1) {
      event.preventDefault ();
      this.reset ();
    } // if - else
  } // onMouseDown

  @HostListener ("mouseup", ["$event"])
  onMouseUp (event: MouseEvent) {
    if (event.button === 0) {
      this.endGrabbing ();
    } // if
  } // onMouseUp

  @HostListener ("mouseleave", ["$event"])
  onMouseLeave (event: MouseEvent) {
    if (this.grabbing) {
      this.endGrabbing ();
    } // if
  } // onMouseLeave

  @HostListener ("mousemove", ["$event"])
  onMouseMove (event: MouseEvent) {
    if (this.grabbing) {
      const xt = event.clientX - this.grabbingX!;
      const yt = event.clientY - this.grabbingY!;
      this.grabbingX = event.clientX;
      this.grabbingY = event.clientY;
      this.refreshTransform ({
        zoom: 1,
        x0: 0, y0: 0,
        xt: xt, yt: yt,
        reset: false
      });
    } // if
  } // onMouseMove

  // @HostListener ("touchmove", ["$event"]) TODO
  onTouchMove (event: TouchEvent) {
    if (this.grabbing) {
      const xt = event.touches[0].clientX - this.grabbingX!;
      const yt = event.touches[0].clientY - this.grabbingY!;
      this.grabbingX = event.touches[0].clientX;
      this.grabbingY = event.touches[0].clientY;
      this.refreshTransform ({
        zoom: 1,
        x0: 0, y0: 0,
        xt: xt, yt: yt,
        reset: false
      });
    } else {
      setTimeout (() => {
        this.grabbing = true;
        this.grabbingX = event.touches[0].clientX;
        this.grabbingY = event.touches[0].clientY;
      }, 50);
    } // onTouchMove
  } // onTouchMove

  public moveUp () { this.move (0, -MOVE_STEP); }
  public moveDown () { this.move (0, MOVE_STEP); }
  public moveLeft () { this.move (-MOVE_STEP, 0); }
  public moveRight () { this.move (MOVE_STEP, 0); }
  public zoomIn () { this.zoom (1 + ZOOM_STEP); }
  public zoomOut () { this.zoom (1 - ZOOM_STEP); }
  public reset () {
    this.refreshTransform ({
      zoom: 1,
      x0: 0, y0: 0,
      xt: 0, yt: 0,
      reset: true
    });
    if (this.grabbing) {
      this.endGrabbing ();
    } // if
    this.cd.markForCheck ();
  } // reset

  public autoSize () {
    // const containerEl = this.bgSvg.elementRef.nativeElement;
    // const childEl = this.elementRef.nativeElement.getBoundingClientRect ();
    
    // const scaleX = containerEl.clientWidth / childEl.width;
    // const scaleY = containerEl.clientHeight / childEl.height;
    // const scale = Math.min (scaleX, scaleY);

    // const xt = (containerEl.clientWidth - childEl.width * scale) / 2 - childEl.x * scale;
    // const yt = (containerEl.clientHeight - childEl.height * scale) / 2 - childEl.y * scale;

    // console.log ("scale", scale);
    // console.log ("xt", xt + childEl.x);
    // console.log ("yt", yt + childEl.y);

    // this.refreshTransform ({
    //   zoom: scale,
    //   x0: 0, y0: 0,
    //   xt: xt, yt: yt,
    //   reset: false
    // });
    // this.cd.markForCheck ();
  } // autoSize

  private move (xt: number, yt: number) {
    this.refreshTransform ({
      zoom: 1,
      x0: 0, y0: 0,
      xt: xt, yt: yt,
      reset: false
    });
    this.cd.markForCheck ();
  } // move

  private zoom (zoom: number) {
    this.refreshTransform ({
      zoom: zoom,
      x0: 0, y0: 0,
      xt: 0, yt: 0,
      reset: false
    });
    this.cd.markForCheck ();
  } // move

  private endGrabbing () {
    this.grabbing = false;
    this.grabbingX = null;
    this.grabbingY = null;
  } // endGrabbing

  @HostListener ("mousewheel", ["$event"])
  onMouseWheel (event: MouseEvent | any) {
    if (event.ctrlKey) {
      event.preventDefault ();
      const zoom = (event.deltaY > 0) ? (1 - this.zoomStep) : (1 + this.zoomStep);
      const pt = this.bgSvg.createSVGPoint ();
      pt.x = event.clientX;
      pt.y = event.clientY;
      const zoomOrigin = pt.matrixTransform (this.bgSvg.getScreenCTM ()?.inverse ());
      this.refreshTransform ({
        zoom: zoom,
        x0: zoomOrigin.x, y0: zoomOrigin.y,
        xt: 0, yt: 0,
        reset: false
      });
    } else if (event.shiftKey) {
      event.preventDefault ();
      this.refreshTransform ({
        zoom: 1,
        x0: 0, y0: 0,
        xt: this.translateStep * (event.deltaY > 0 ? -1 : 1), yt: 0,
        reset: false
      });
    } else {
      event.preventDefault ();
      this.refreshTransform ({
        zoom: 1,
        x0: 0, y0: 0,
        xt: 0, yt: this.translateStep * (event.deltaY > 0 ? -1 : 1),
        reset: false
      });
    } // if - else
  } // onMouseWheel

  // @HostListener ("keydown", ["$event"]) TODO
  onKeyDown (event: KeyboardEvent) {
    // N.B.: onKeyDown non viene lanciato!!!
    const refreshParams: BgMapZoomRefreshParams = {
      zoom: 1,
      x0: 0, y0: 0,
      xt: 0, yt: 0,
      reset: false
    };
    switch (event.key) {
      case "d": refreshParams.xt = -1 * this.translateStep; break;
      case "w": refreshParams.yt = this.translateStep; break;
      case "a": refreshParams.xt = this.translateStep; break;
      case "s": refreshParams.yt = -1 * this.translateStep; break;
      default: return;
    } // switch
    this.refreshTransform (refreshParams);
  } // onKeyDown

  private refreshTransform (refreshParams: BgMapZoomRefreshParams) {
    if (refreshParams.reset) {
      this.parseConfig ();
    } else {
      const newScale = refreshParams.zoom;
      this.scale = newScale * this.scale;
      const newXt = refreshParams.x0 * (1 - newScale) + refreshParams.xt;
      const newYt = refreshParams.y0 * (1 - newScale) + refreshParams.yt;
      this.translateX = newXt + newScale * this.translateX;
      this.translateY = newYt + newScale * this.translateY;
    } // if - else
    this.transform = `matrix (${this.scale}, 0, 0, ${this.scale}, ${this.translateX}, ${this.translateY})`;
  } // refreshTransform

} // BgMapZoomDirective
