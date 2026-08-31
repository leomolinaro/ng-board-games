import type { OnInit} from '@angular/core';
import { Component, input } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import type { BgMapZoom } from './bg-map-zoom';

@Component({
  selector: 'bg-map-zoom-buttons',
  imports: [TuiButton],
  template: `
    <section>
      <button
        tuiIconButton
        appearance="flat"
        size="m"
        iconStart="chevron-up"
        class="move-up"
        (click)="onMoveUp()"
      ></button>
      <button
        tuiIconButton
        appearance="flat"
        size="m"
        iconStart="chevron-down"
        class="move-down"
        (click)="onMoveDown()"
      ></button>
      <button
        tuiIconButton
        appearance="flat"
        size="m"
        iconStart="chevron-left"
        class="move-left"
        (click)="onMoveLeft()"
      ></button>
      <button
        tuiIconButton
        appearance="flat"
        size="m"
        iconStart="chevron-right"
        class="move-right"
        (click)="onMoveRight()"
      ></button>
      <!-- <button
        tuiIconButton
        appearance="flat"
        size="m"
        iconStart="expand"
        class="auto-size"
        (click)="onAutoSize()"></button> -->
    </section>
    <footer>
      <button
        tuiIconButton
        appearance="flat"
        size="m"
        iconStart="zoom-in"
        class="zoom-in"
        (click)="onZoomIn()"
      ></button>
      <button
        tuiButton
        appearance="flat"
        size="m"
        class="reset"
        (click)="onReset()"
      >
        Reset
      </button>
      <button
        tuiIconButton
        class="zoom-out"
        appearance="flat"
        size="m"
        iconStart="zoom-out"
        (click)="onZoomOut()"
      ></button>
    </footer>
  `,
  styles: [
    `
      button {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      :host {
        display: flex;
        flex-direction: column;
      }
      section {
        display: grid;
        grid-template-rows: 1fr 1fr 1fr;
        grid-template-columns: 1fr 1fr 1fr;
        justify-items: center;
        justify-content: center;
        grid-template-areas:
          '. moveUp .'
          'moveLeft autoSize moveRight'
          '. moveDown .';
        .move-up {
          grid-area: moveUp;
        }
        .move-down {
          grid-area: moveDown;
        }
        .move-left {
          grid-area: moveLeft;
        }
        .move-right {
          grid-area: moveRight;
        }
        .auto-size {
          grid-area: autoSize;
        }
        .zoom-in {
          grid-area: zoomIn;
        }
        .zoom-out {
          grid-area: zoomOut;
        }
        .reset {
          grid-area: resetButton;
        }
      }

      footer {
        display: flex;
        // grid-template-rows: 1fr 1fr 1fr 1fr;
        // grid-template-columns: 1fr 2fr 1fr;
        justify-items: center;
        justify-content: center;
        // .zoom-in {
        //   grid-area: zoomIn;
        // }
        // .zoom-out {
        //   grid-area: zoomOut;
        // }
        // .reset {
        //   grid-area: resetButton;
        // }
      }
    `,
  ],
})
export class BgMapZoomButtons implements OnInit {
  constructor() {}

  readonly controls = input.required<BgMapZoom>();

  ngOnInit(): void {}

  onMoveUp() {
    this.controls().moveUp();
  }
  onMoveDown() {
    this.controls().moveDown();
  }
  onMoveLeft() {
    this.controls().moveLeft();
  }
  onMoveRight() {
    this.controls().moveRight();
  }
  onZoomIn() {
    this.controls().zoomIn();
  }
  onZoomOut() {
    this.controls().zoomOut();
  }
  onReset() {
    this.controls().reset();
  }
  onAutoSize() {
    this.controls().autoSize();
  }
}
