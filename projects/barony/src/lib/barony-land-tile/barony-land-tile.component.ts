import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import { BooleanInput, Loading, SimpleChanges, immutableUtil } from "@leobg/commons";
import { Observable } from "rxjs";
import {
  BaronyColor,
  BaronyLandCoordinates,
  BaronyLandType,
  BaronyPawn,
  BaronyPawnType,
} from "../barony-models";
import { hexToCartesian } from "./barony-land-tile-coordinates.pipe";

interface BaronyPawnNode {
  type: BaronyPawnType;
  color: BaronyColor;
  quantity: number;
  href: string;
  x: number;
  y: number;
  xText: number;
  yText: number;
} // BaronyPawnNode

@Component ({
  selector: "[baronyLandTile]",
  templateUrl: "./barony-land-tile.component.html",
  styleUrls: ["./barony-land-tile.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaronyLandComponent implements OnChanges {
  constructor () {}

  @Input () type!: BaronyLandType;
  @Input () coordinates!: BaronyLandCoordinates;
  @Input () pawns!: BaronyPawn[];
  @Input () @BooleanInput () active: boolean = false;
  @Input () @BooleanInput () disabled: boolean = false;
  @Output () landTileClick = new EventEmitter<void> ();

  @Loading () loading$!: Observable<boolean>;

  pawnNodes!: BaronyPawnNode[];
  private hexCenter!: { x: number; y: number };

  pawnWidth = 0.7;
  pawnHeight = 0.7;
  pawnPositionRadius = 0.5;
  textXOffset = 0.2;
  textYOffset = 0.6;

  activeCircleRadius = Math.sqrt (3) / 2;

  pawnTrackBy = (pawnNode: BaronyPawnNode) =>
    pawnNode.color + "_" + pawnNode.type;

  ngOnChanges (changes: SimpleChanges<this>): void {
    if (changes.coordinates) {
      this.hexCenter = hexToCartesian (this.coordinates);
    } // if

    if (changes.pawns) {
      this.pawnNodes = [];
      this.pawns.forEach ((pawn) => {
        this.pawnNodes = immutableUtil.listUpdateFirstOrPush<BaronyPawnNode> (
          (p) => p.color === pawn.color && p.type === pawn.type,
          (p) => ({ ...p, quantity: p.quantity + 1 }),
          () => ({
            type: pawn.type,
            color: pawn.color,
            quantity: 1,
            href: `assets/barony/pawns/${pawn.color}-${pawn.type}.png`,
            x: 0,
            y: 0,
            xText: 0,
            yText: 0,
          }),
          this.pawnNodes
        );
      });

      this.pawnNodes.sort ((a, b) => {
        if (a.type === b.type) {
          return 0;
        } else {
          if (a.type === "knight") {
            return 1;
          } else {
            return -1;
          } // if - else
        } // if - else
      });

      this.pawnNodes.forEach ((pawnNode, index) => {
        pawnNode.x =
          this.hexCenter?.x -
          this.pawnWidth / 2.0 +
          this.pawnPositionRadius *
            this.getPawnNodeDeltaX (index, this.pawnNodes.length);
        pawnNode.y =
          this.hexCenter?.y -
          this.pawnHeight / 2.0 +
          this.pawnPositionRadius *
            this.getPawnNodeDeltaY (index, this.pawnNodes.length);
        pawnNode.xText = pawnNode.x + this.textXOffset;
        pawnNode.yText = pawnNode.y + this.textYOffset;
      });
    } // if
  } // ngOnChanges

  private getPawnNodeDeltaX (index: number, total: number) {
    return total === 1 ? 0 : Math.sin ((2 * Math.PI * index) / total);
  } // getPawnNodeX

  private getPawnNodeDeltaY (index: number, total: number) {
    return total === 1 ? 0 : -1 * Math.cos ((2 * Math.PI * index) / total);
  } // getPawnNodeX

  onLandTileClick () {
    this.landTileClick.next ();
  }
} // BaronyLandComponent
