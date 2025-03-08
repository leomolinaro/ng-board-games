import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from "@angular/core";
import { SimpleChanges, objectUtil } from "@leobg/commons/utils";
import { BaronyColor, BaronyPlayer } from "./barony-models";
import { BgSvgComponent } from "../../../commons/src/lib/game/svg/bg-map-zoom.directive";
import { NgFor } from "@angular/common";

interface BaronyCounterNode {
  color: BaronyColor;
  href: string;
  x: number;
  y: number;
} // BaronyCounterNode

@Component ({
  selector: "barony-scoreboard",
  template: `
    <svg
      bgSvg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="100%"
      height="100%"
      viewBox="0 0 1000 500"
      preserveAspectratio="xMinYMin">
      <svg:g>
        <svg:image
          [attr.width]="1000"
          preserveAspectRatio="xMinYMin"
          xlink:href="assets/barony/scoreboard.jpg"
        ></svg:image>
        <svg:image
          *ngFor="let counterNode of counterNodes; trackBy: counterTrackBy"
          [attr.width]="counterWidth"
          [attr.height]="counterHeight"
          preserveAspectRatio="none"
          [attr.xlink:href]="counterNode.href"
          [attr.x]="counterNode.x"
          [attr.y]="counterNode.y"
        ></svg:image>
      </svg:g>
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BgSvgComponent, NgFor]
})
export class BaronyScoreboardComponent implements OnChanges {
  constructor () {}

  @Input () players!: BaronyPlayer[];

  counterWidth = 50;
  counterHeight = 50;

  counterNodes!: BaronyCounterNode[];

  counterTrackBy = (counterNode: BaronyCounterNode) => counterNode.color;

  ngOnChanges (changes: SimpleChanges<this>): void {
    if (changes.players) {
      let changed = !!changes.players.previousValue;
      if (!changed) {
        changed = this.players.length !== changes.players.previousValue?.length;
      }
      const i = 0;
      while (!changed && i < this.players.length) {
        const player = this.players[i];
        const oldPlayer = changes.players.previousValue[i];
        if (player !== oldPlayer && player.score !== oldPlayer.score) {
          changed = true;
        } // if
      } // while

      if (changed) {
        this.refreshCounterNodes ();
      } // if
    } // if
  } // ngOnChanges

  private refreshCounterNodes () {
    this.counterNodes = [];
    const playersByScore: Record<number, BaronyPlayer[]> = {};
    this.players.forEach ((p) => {
      let sameScorePlayers = playersByScore[p.score];
      if (!sameScorePlayers) {
        sameScorePlayers = [];
        playersByScore[p.score] = sameScorePlayers;
      } // if
      sameScorePlayers.push (p);
    });
    objectUtil.forEachProp (playersByScore, (score, players: BaronyPlayer[]) => {
      players.forEach ((p, index) => {
        let row = 0;
        let col = 0;
        if (p.score % 15 === 0) {
          col = p.score / 15;
        } else if ((p.score - 10) % 15 === 0) {
          row = 1;
          col = (p.score - 10) / 15;
        } else {
          row = 2;
          col = (p.score - 20) / 15;
        } // if - else
        this.counterNodes.push ({
          color: p.id,
          href: `assets/barony/pawns/${p.id}-counter.png`,
          x: 200 + row * 70 + col * 105 + index * 5,
          y: 200 + row * 70 + index * 5,
        });
      });
    });
  } // refreshCounterNodes
} // BaronyScoreboardComponent
