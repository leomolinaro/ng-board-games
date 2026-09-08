import { Component, computed, input } from '@angular/core';
import { BgSvg } from '@leobg/commons';
import { objectUtil } from '@leobg/commons/utils';
import type { BaronyColor, BaronyPlayer } from '../barony-models';

interface BaronyCounterNode {
  color: BaronyColor;
  href: string;
  x: number;
  y: number;
}

@Component({
  selector: 'barony-scoreboard',
  template: `
    <svg
      bgSvg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="100%"
      height="100%"
      viewBox="0 0 1000 500"
      preserveAspectratio="xMinYMin"
    >
      <svg:g>
        <svg:image
          [attr.width]="1000"
          preserveAspectRatio="xMinYMin"
          xlink:href="assets/barony/scoreboard.jpg"
        ></svg:image>
        @for (counterNode of counterNodes(); track counterNode.color) {
          <svg:image
            [attr.width]="counterWidth"
            [attr.height]="counterHeight"
            preserveAspectRatio="none"
            [attr.xlink:href]="counterNode.href"
            [attr.x]="counterNode.x"
            [attr.y]="counterNode.y"
          ></svg:image>
        }
      </svg:g>
    </svg>
  `,
  imports: [BgSvg],
})
export class BaronyScoreboard {
  players = input.required<BaronyPlayer[]>();

  counterWidth = 50;
  counterHeight = 50;

  protected counterNodes = computed<BaronyCounterNode[]>(() => {
    const counterNodes: BaronyCounterNode[] = [];
    const playersByScore: Record<number, BaronyPlayer[]> = {};
    for (const p of this.players()) {
      let sameScorePlayers = playersByScore[p.score];
      if (!sameScorePlayers) {
        sameScorePlayers = [];
        playersByScore[p.score] = sameScorePlayers;
      }
      sameScorePlayers.push(p);
    }
    objectUtil.forEachProp(
      playersByScore,
      (_score, players: BaronyPlayer[]) => {
        for (const [index, p] of players.entries()) {
          let row = 0;
          let col;
          if (p.score % 15 === 0) {
            col = p.score / 15;
          } else if ((p.score - 10) % 15 === 0) {
            row = 1;
            col = (p.score - 10) / 15;
          } else {
            row = 2;
            col = (p.score - 20) / 15;
          }
          counterNodes.push({
            color: p.id,
            href: `assets/barony/pawns/${p.id}-counter.png`,
            x: 200 + row * 70 + col * 105 + index * 5,
            y: 200 + row * 70 + index * 5,
          });
        }
      },
    );
    return counterNodes;
  });
}
