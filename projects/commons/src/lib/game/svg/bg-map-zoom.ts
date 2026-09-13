import type { OnInit } from '@angular/core';
import {
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  input,
} from '@angular/core';

const MOVE_STEP = 30;
const ZOOM_STEP = 0.2;

interface BgMapZoomRefreshParams {
  zoom: number;
  x0: number;
  y0: number;
  xt: number;
  yt: number;
  reset: boolean;
}

@Component({
  selector: 'svg[bgSvg]',
  template: '<ng-content></ng-content>',
})
export class BgSvg {
  elementRef = inject<ElementRef<SVGSVGElement>>(ElementRef);

  createSVGPoint(): SVGPoint {
    return this.elementRef.nativeElement.createSVGPoint();
  }
  getScreenCTM(): DOMMatrix | undefined {
    return this.elementRef.nativeElement.getScreenCTM() ?? undefined;
  }
}

@Directive({
  selector: '[bgMapZoom]',
  host: {
    '(mousewheel)': 'onMouseWheel($event)',
  },
})
export class BgMapZoom implements OnInit {
  private bgSvg = inject(BgSvg);
  private cd = inject(ChangeDetectorRef);
  private elementRef = inject<ElementRef<SVGGElement>>(ElementRef);

  readonly config = input.required<{
    translateX?: number;
    translateY?: number;
    scale?: number;
    zoomStep?: number;
    translateStep?: number;
  }>({ alias: 'bgMapZoom' });

  @HostBinding('attr.transform')
  transform!: string;

  private scale!: number;
  private translateX!: number;
  private translateY!: number;
  private zoomStep!: number;
  private translateStep!: number;

  private grabbing = false;
  private grabbingX: number | undefined = undefined;
  private grabbingY: number | undefined = undefined;

  ngOnInit(): void {
    this.parseConfig();
    this.transform = `matrix (${this.scale}, 0, 0, ${this.scale}, ${this.translateX}, ${this.translateY})`;
  }

  private parseConfig(): void {
    this.scale = this.config().scale ?? 1;
    this.translateX = this.config().translateX ?? 0;
    this.translateY = this.config().translateY ?? 0;
    this.zoomStep = this.config().zoomStep ?? 0.1;
    this.translateStep = this.config().translateStep ?? 15;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (event.button === 0) {
      this.grabbing = true;
      this.grabbingX = event.clientX;
      this.grabbingY = event.clientY;
    } else if (event.button === 1) {
      event.preventDefault();
      this.reset();
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (event.button === 0) {
      this.endGrabbing();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.grabbing) {
      this.endGrabbing();
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.grabbing) {
      return;
    }

    const xt = event.clientX - this.grabbingX!;
    const yt = event.clientY - this.grabbingY!;
    this.grabbingX = event.clientX;
    this.grabbingY = event.clientY;
    this.refreshTransform({
      zoom: 1,
      x0: 0,
      y0: 0,
      xt: xt,
      yt: yt,
      reset: false,
    });
  }

  // @HostListener ("touchmove", ["$event"]) TODO
  onTouchMove(event: TouchEvent): void {
    if (this.grabbing) {
      const xt = event.touches[0].clientX - this.grabbingX!;
      const yt = event.touches[0].clientY - this.grabbingY!;
      this.grabbingX = event.touches[0].clientX;
      this.grabbingY = event.touches[0].clientY;
      this.refreshTransform({
        zoom: 1,
        x0: 0,
        y0: 0,
        xt: xt,
        yt: yt,
        reset: false,
      });
    } else {
      setTimeout(() => {
        this.grabbing = true;
        this.grabbingX = event.touches[0].clientX;
        this.grabbingY = event.touches[0].clientY;
      }, 50);
    }
  }

  public moveUp(): void {
    this.move(0, -MOVE_STEP);
  }
  public moveDown(): void {
    this.move(0, MOVE_STEP);
  }
  public moveLeft(): void {
    this.move(-MOVE_STEP, 0);
  }
  public moveRight(): void {
    this.move(MOVE_STEP, 0);
  }
  public zoomIn(): void {
    this.zoom(1 + ZOOM_STEP);
  }
  public zoomOut(): void {
    this.zoom(1 - ZOOM_STEP);
  }
  public reset(): void {
    this.refreshTransform({ zoom: 1, x0: 0, y0: 0, xt: 0, yt: 0, reset: true });
    if (this.grabbing) {
      this.endGrabbing();
    }
    this.cd.markForCheck();
  }

  public autoSize(): void {
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
  }

  private move(xt: number, yt: number): void {
    this.refreshTransform({
      zoom: 1,
      x0: 0,
      y0: 0,
      xt: xt,
      yt: yt,
      reset: false,
    });
    this.cd.markForCheck();
  }

  private zoom(zoom: number): void {
    this.refreshTransform({
      zoom: zoom,
      x0: 0,
      y0: 0,
      xt: 0,
      yt: 0,
      reset: false,
    });
    this.cd.markForCheck();
  }

  private endGrabbing(): void {
    this.grabbing = false;
    this.grabbingX = undefined;
    this.grabbingY = undefined;
  }

  onMouseWheel(event: Event): void {
    const wEvent = event as WheelEvent;
    event.preventDefault();
    const zoom = wEvent.deltaY > 0 ? 1 - this.zoomStep : 1 + this.zoomStep;
    const pt = this.bgSvg.createSVGPoint();
    pt.x = wEvent.clientX;
    pt.y = wEvent.clientY;
    const zoomOrigin = pt.matrixTransform(this.bgSvg.getScreenCTM()?.inverse());
    this.refreshTransform({
      zoom: zoom,
      x0: zoomOrigin.x,
      y0: zoomOrigin.y,
      xt: 0,
      yt: 0,
      reset: false,
    });
  }

  // @HostListener ("keydown", ["$event"]) TODO
  onKeyDown(event: KeyboardEvent): void {
    // N.B.: onKeyDown non viene lanciato!!!
    const refreshParams: BgMapZoomRefreshParams = {
      zoom: 1,
      x0: 0,
      y0: 0,
      xt: 0,
      yt: 0,
      reset: false,
    };
    switch (event.key) {
      case 'd':
        refreshParams.xt = -this.translateStep;
        break;
      case 'w':
        refreshParams.yt = this.translateStep;
        break;
      case 'a':
        refreshParams.xt = this.translateStep;
        break;
      case 's':
        refreshParams.yt = -this.translateStep;
        break;
      default:
        return;
    }
    this.refreshTransform(refreshParams);
  }

  private refreshTransform(refreshParams: BgMapZoomRefreshParams): void {
    if (refreshParams.reset) {
      this.parseConfig();
    } else {
      const newScale = refreshParams.zoom;
      this.scale *= newScale;
      const newXt = refreshParams.x0 * (1 - newScale) + refreshParams.xt;
      const newYt = refreshParams.y0 * (1 - newScale) + refreshParams.yt;
      this.translateX = newXt + newScale * this.translateX;
      this.translateY = newYt + newScale * this.translateY;
    }
    this.transform = `matrix (${this.scale}, 0, 0, ${this.scale}, ${this.translateX}, ${this.translateY})`;
  }
}
