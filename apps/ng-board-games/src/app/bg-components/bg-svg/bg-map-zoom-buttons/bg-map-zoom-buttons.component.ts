import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { BgMapZoomDirective } from '../bg-map-zoom.directive';

@Component({
  selector: 'bg-map-zoom-buttons',
  templateUrl: './bg-map-zoom-buttons.component.html',
  styleUrls: ['./bg-map-zoom-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BgMapZoomButtonsComponent implements OnInit {
  constructor() {}

  @Input() controls!: BgMapZoomDirective;

  ngOnInit(): void {} // ngOnInit

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
