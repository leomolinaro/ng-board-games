import { Component, OnChanges, computed, input, output } from "@angular/core";
import { Loading, SimpleChanges, immutableUtil } from "@leobg/commons/utils";
import { Observable } from "rxjs";
import {
  BaronyColor,
  BaronyLandCoordinates,
  BaronyLandType,
  BaronyPawn,
  BaronyPawnType
} from "../barony-models";
import { BaronyLandCoordinatesPipe, hexToCartesian } from "./barony-land-tile-coordinates.pipe";

interface BaronyPawnNode {
  type: BaronyPawnType;
  color: BaronyColor;
  quantity: number;
  href: string;
  x: number;
  y: number;
  xText: number;
  yText: number;
}

@Component({
  selector: "[baronyLandTile]",
  template: `
    <svg:g
      class="b-land-tile"
      [class.is-active]="active()"
      [class.is-disabled]="disabled()"
      (click)="onLandTileClick()">
      <svg:polygon
        class="b-land-tile-polygon"
        [attr.id]="coordinates().x + ' ' + coordinates().y + ' ' + coordinates().z"
        [attr.points]="coordinates() | baronyLandTileCoordinates: 'hexagon'"
        [attr.fill]="url()"></svg:polygon>

      @if (active()) {
        <svg:circle
          class="b-land-tile-active-signal"
          [attr.cx]="coordinates() | baronyLandTileCoordinates: 'center-x'"
          [attr.cy]="coordinates() | baronyLandTileCoordinates: 'center-y'"
          [attr.r]="activeCircleRadius"
          stroke="black"
          stroke-width="0.03"
          fill="transparent" />
      }

      @for (pawnNode of pawnNodes; track pawnNode.color + "_" + pawnNode.type) {
        <svg:image
          [attr.width]="pawnWidth"
          [attr.height]="pawnHeight"
          preserveAspectRatio="none"
          [attr.xlink:href]="pawnNode.href"
          [attr.x]="pawnNode.x"
          [attr.y]="pawnNode.y"></svg:image>
      }

      @for (pawnNode of pawnNodes; track pawnNode.color + "_" + pawnNode.type) {
        <ng-container>
          @if (pawnNode.quantity > 1) {
            <svg:text
              class="b-land-tile-pawn-quantity"
              [attr.x]="pawnNode.xText"
              [attr.y]="pawnNode.yText">
              {{ pawnNode.quantity }}
            </svg:text>
          }
        </ng-container>
      }
    </svg:g>
  `,
  styles: `
    @use "bg-variables" as bg;

    .b-land-tile {
      &.is-active {
        cursor: pointer;
      }
      &.is-disabled {
        fill-opacity: 0.8;
      }
      .b-land-tile-polygon {
        stroke-width: 0.035px;
        stroke: bg.$background;
      }
      .b-land-tile-active-signal {
        cursor: pointer;
        stroke: white;
        // stroke-dasharray: 0.05,0.05;
        stroke-width: 0.07;
        // animation: dash 10s linear;
        stroke-dasharray: 0.5;

        animation-duration: 10s;
        animation-name: activeSignal;
        animation-iteration-count: infinite;
        animation-direction: normal;
      }
      .b-land-tile-pawn-quantity {
        font-size: 0.5px;
        fill: white;
        font-weight: 600;
      }
    }

    @keyframes activeSignal {
      from {
        stroke-dashoffset: 0;
      }
      to {
        stroke-dashoffset: 10;
      }
    }
  `,
  imports: [BaronyLandCoordinatesPipe]
})
export class BaronyLandComponent implements OnChanges {
  constructor() {}

  readonly type = input.required<BaronyLandType>();
  readonly coordinates = input.required<BaronyLandCoordinates>();
  readonly pawns = input.required<BaronyPawn[]>();
  readonly active = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly landTileClick = output<void>();

  protected url = computed(() => `url('#${this.type()}')`);

  @Loading() loading$!: Observable<boolean>;

  pawnNodes!: BaronyPawnNode[];
  private hexCenter!: { x: number; y: number };

  pawnWidth = 0.7;
  pawnHeight = 0.7;
  pawnPositionRadius = 0.5;
  textXOffset = 0.2;
  textYOffset = 0.6;

  activeCircleRadius = Math.sqrt(3) / 2;

  ngOnChanges(changes: SimpleChanges<this>): void {
    if (changes.coordinates) {
      this.hexCenter = hexToCartesian(this.coordinates());
    }

    if (changes.pawns) {
      this.pawnNodes = [];
      this.pawns().forEach(pawn => {
        this.pawnNodes = immutableUtil.listUpdateFirstOrPush<BaronyPawnNode>(
          p => p.color === pawn.color && p.type === pawn.type,
          p => ({ ...p, quantity: p.quantity + 1 }),
          () => ({
            type: pawn.type,
            color: pawn.color,
            quantity: 1,
            href: `assets/barony/pawns/${pawn.color}-${pawn.type}.png`,
            x: 0,
            y: 0,
            xText: 0,
            yText: 0
          }),
          this.pawnNodes
        );
      });

      this.pawnNodes.sort((a, b) => {
        if (a.type === b.type) {
          return 0;
        } else {
          if (a.type === "knight") {
            return 1;
          } else {
            return -1;
          }
        }
      });

      this.pawnNodes.forEach((pawnNode, index) => {
        pawnNode.x =
          this.hexCenter?.x -
          this.pawnWidth / 2.0 +
          this.pawnPositionRadius * this.getPawnNodeDeltaX(index, this.pawnNodes.length);
        pawnNode.y =
          this.hexCenter?.y -
          this.pawnHeight / 2.0 +
          this.pawnPositionRadius * this.getPawnNodeDeltaY(index, this.pawnNodes.length);
        pawnNode.xText = pawnNode.x + this.textXOffset;
        pawnNode.yText = pawnNode.y + this.textYOffset;
      });
    }
  }

  private getPawnNodeDeltaX(index: number, total: number) {
    return total === 1 ? 0 : Math.sin((2 * Math.PI * index) / total);
  }

  private getPawnNodeDeltaY(index: number, total: number) {
    return total === 1 ? 0 : -1 * Math.cos((2 * Math.PI * index) / total);
  }

  onLandTileClick() {
    this.landTileClick.emit();
  }
}
