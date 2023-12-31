import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { objectUtil, SimpleChanges } from '@bg-utils';
import { BaronyColor, BaronyPlayer } from '../barony-models';

interface BaronyCounterNode {
  color: BaronyColor;
  href: string;
  x: number;
  y: number;
} // BaronyCounterNode

@Component({
  selector: 'barony-scoreboard',
  templateUrl: './barony-scoreboard.component.html',
  styleUrls: ['./barony-scoreboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaronyScoreboardComponent implements OnChanges {
  constructor() {}

  @Input() players!: BaronyPlayer[];

  counterWidth = 50;
  counterHeight = 50;

  counterNodes!: BaronyCounterNode[];

  counterTrackBy = (counterNode: BaronyCounterNode) => counterNode.color;

  ngOnChanges(changes: SimpleChanges<BaronyScoreboardComponent>): void {
    if (changes.players) {
      let changed = !!changes.players.previousValue;
      if (!changed) {
        changed = this.players.length !== changes.players.previousValue?.length;
      }
      let i = 0;
      while (!changed && i < this.players.length) {
        const player = this.players[i];
        const oldPlayer = changes.players.previousValue[i];
        if (player !== oldPlayer && player.score !== oldPlayer.score) {
          changed = true;
        } // if
      } // while

      if (changed) {
        this.refreshCounterNodes();
      } // if
    } // if
  } // ngOnChanges

  private refreshCounterNodes() {
    this.counterNodes = [];
    const playersByScore: Record<number, BaronyPlayer[]> = {};
    this.players.forEach((p) => {
      let sameScorePlayers = playersByScore[p.score];
      if (!sameScorePlayers) {
        sameScorePlayers = [];
        playersByScore[p.score] = sameScorePlayers;
      } // if
      sameScorePlayers.push(p);
    });
    objectUtil.forEachProp(playersByScore, (score, players: BaronyPlayer[]) => {
      players.forEach((p, index) => {
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
        this.counterNodes.push({
          color: p.color,
          href: `assets/barony/pawns/${p.color}-counter.png`,
          x: 200 + row * 70 + col * 105 + index * 5,
          y: 200 + row * 70 + index * 5,
        });
      });
    });
  } // refreshCounterNodes
} // BaronyScoreboardComponent
