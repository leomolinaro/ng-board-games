import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BgAuthService, BgUser } from "@leobg/commons";
import { UntilDestroy } from "@leobg/commons/utils";
import { WotrActionDieService } from "../action-die/wotr-action-die.service";
import { WotrBattleService } from "../battle/wotr-battle.service";
import { WotrCardEffectsService } from "../card/wotr-card-effects.service";
import { WotrCardService } from "../card/wotr-card.service";
import { WotrCharacterService } from "../character/wotr-character.service";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrFellowshipService } from "../fellowship/wotr-fellowship.service";
import { WotrGameTurnService } from "../game-turn/wotr-game-flow.service";
import { WotrHuntService } from "../hunt/wotr-hunt.service";
import { WotrNationService } from "../nation/wotr-nation.service";
import { AWotrPlayerInfo, WotrPlayerInfo } from "../player/wotr-player-info.models";
import { WotrPlayerLocalService } from "../player/wotr-player-local.service";
import { WotrRegionService } from "../region/wotr-region.service";
import { WotrPlayerDoc } from "../remote/wotr-remote.models";
import { WotrRemoteService } from "../remote/wotr-remote.service";
import { WotrUnitService } from "../unit/wotr-unit.service";
import { WotrBoardComponent } from "./board/wotr-board.component";
import { WotrGameStore } from "./wotr-game.store";
import { WotrStoryService } from "./wotr-story.service";

@Component({
  selector: "wotr-game",
  imports: [WotrBoardComponent],
  template: `
    <wotr-board
      (replayNext)="onReplayNext($event)"
      (replayLast)="onReplayLast()">
    </wotr-board>
  `,
  styles: [""],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy
export class WotrGameComponent implements OnInit, OnDestroy {
  protected store = inject(WotrGameStore);
  private remote = inject(WotrRemoteService);
  private route = inject(ActivatedRoute);
  private auth = inject(BgAuthService);
  private story = inject(WotrStoryService);
  private flow = inject(WotrGameTurnService);
  private cardEffects = inject(WotrCardEffectsService);
  private localPlayerService = inject(WotrPlayerLocalService);
  private actionService = inject(WotrActionService);

  constructor() {
    inject(WotrActionDieService).init();
    inject(WotrCardService).init();
    inject(WotrBattleService).init();
    inject(WotrCharacterService).init();
    inject(WotrGameTurnService).init();
    inject(WotrFellowshipService).init();
    inject(WotrHuntService).init();
    inject(WotrNationService).init();
    inject(WotrRegionService).init();
    inject(WotrUnitService).init();
    this.story.init(this.localPlayerService);
  }

  private gameId: string = this.route.snapshot.paramMap.get("gameId")!;

  async ngOnInit() {
    this.cardEffects.registerCardEffects();
    const [game, players, stories] = await Promise.all([
      this.remote.getGame(this.gameId),
      this.remote.getPlayers(this.gameId, ref => ref.orderBy("sort")),
      this.remote.getStories(this.gameId, ref => ref.orderBy("time").orderBy("playerId"))
    ]);
    if (game) {
      const user = this.auth.getUser();
      this.store.initGameState(
        players.map(p => this.playerDocToPlayerInfo(p, user)),
        this.gameId,
        game.owner
      );
      this.story.setStoryDocs(stories);
      await this.flow.game();
      // this.ui.updateUi (s => ({
      //   ...s,
      //   ...this.ui.resetUi (),
      //   // canCancel: false,
      // }));
    }
  }

  private playerDocToPlayerInfo(playerDoc: WotrPlayerDoc, user: BgUser): WotrPlayerInfo {
    if (playerDoc.isAi) {
      return {
        ...this.playerDocToAPlayerInfo(playerDoc),
        isAi: true,
        isLocal: false,
        isRemote: false
      };
    } else {
      return {
        ...this.playerDocToAPlayerInfo(playerDoc),
        isAi: false,
        controller: playerDoc.controller,
        isLocal: user.id === playerDoc.controller.id,
        isRemote: user.id !== playerDoc.controller.id
      };
    }
  }

  private playerDocToAPlayerInfo(playerDoc: WotrPlayerDoc): AWotrPlayerInfo {
    return {
      id: playerDoc.id,
      name: playerDoc.name
    };
  }

  ngOnDestroy() {
    this.store.clear();
    this.story.clear();
    this.actionService.clear();
  }

  onReplayNext(nStories: number) {
    this.story.nextReplay(nStories);
  }

  onReplayLast() {
    this.story.lastReplay();
  }
}
