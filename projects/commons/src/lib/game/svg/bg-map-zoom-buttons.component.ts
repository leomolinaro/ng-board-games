import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { BgMapZoomDirective } from "./bg-map-zoom.directive";
import { MatIconButton } from "@angular/material/button";

@Component({
  selector: "bg-map-zoom-buttons",
  template: `
    <button
      mat-icon-button
      class="move-up"
      (click)="onMoveUp()">
      <i class="fa fa-angle-up"></i>
    </button>
    <button
      mat-icon-button
      class="move-down"
      (click)="onMoveDown()">
      <i class="fa fa-angle-down"></i>
    </button>
    <button
      mat-icon-button
      class="move-left"
      (click)="onMoveLeft()">
      <i class="fa fa-angle-left"></i>
    </button>
    <button
      mat-icon-button
      class="move-right"
      (click)="onMoveRight()">
      <i class="fa fa-angle-right"></i>
    </button>
    <button
      mat-icon-button
      class="zoom-in"
      (click)="onZoomIn()">
      <i class="fa fa-search-plus"></i>
    </button>
    <button
      mat-icon-button
      class="zoom-out"
      (click)="onZoomOut()">
      <i class="fa fa-search-minus"></i>
    </button>
    <button
      mat-icon-button
      class="reset"
      (click)="onReset()">
      Reset
    </button>
    <button
      mat-icon-button
      class="auto-size"
      (click)="onAutoSize()">
      <i class="fa fa-arrows-alt"></i>
    </button>
  `,
  styles: [
    `
      @mixin icon-size($size) {
        i.fa {
          font-size: $size;
          line-height: $size;
        }
      }
      :host {
        display: grid;
        grid-template-rows: 6vmin 6vmin 6vmin 6vmin;
        grid-template-columns: 6vmin 6vmin 6vmin;
        /* align-items: center; */
        grid-template-areas:
          ". moveUp ."
          "moveLeft autoSize moveRight"
          ". moveDown ."
          "zoomIn resetButton zoomOut";
        button {
          display: flex;
          align-items: center;
          justify-content: center;
          height: auto;
          width: auto;
        }
        .move-up {
          grid-area: moveUp;
          @include icon-size(8vmin);
        }
        .move-down {
          grid-area: moveDown;
          @include icon-size(8vmin);
        }
        .move-left {
          grid-area: moveLeft;
          @include icon-size(8vmin);
        }
        .move-right {
          grid-area: moveRight;
          @include icon-size(8vmin);
        }
        .auto-size {
          grid-area: autoSize;
          @include icon-size(4vmin);
        }
        .zoom-in {
          grid-area: zoomIn;
          @include icon-size(20px);
        }
        .zoom-out {
          grid-area: zoomOut;
          @include icon-size(20px);
        }
        .reset {
          grid-area: resetButton;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconButton]
})
export class BgMapZoomButtonsComponent implements OnInit {
  constructor() {}

  @Input() controls!: BgMapZoomDirective;

  ngOnInit(): void {}

  onMoveUp() {
    this.controls.moveUp();
  }
  onMoveDown() {
    this.controls.moveDown();
  }
  onMoveLeft() {
    this.controls.moveLeft();
  }
  onMoveRight() {
    this.controls.moveRight();
  }
  onZoomIn() {
    this.controls.zoomIn();
  }
  onZoomOut() {
    this.controls.zoomOut();
  }
  onReset() {
    this.controls.reset();
  }
  onAutoSize() {
    this.controls.autoSize();
  }
} // BgMapZoomButtonsComponent
