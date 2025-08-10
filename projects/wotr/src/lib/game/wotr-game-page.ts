import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BgAuthService, BgUser } from "@leobg/commons";
import { UntilDestroy } from "@leobg/commons/utils";
import { WotrActionDieHandler } from "../action-die/wotr-action-die-handler";
import { WotrActionDieModifiers } from "../action-die/wotr-action-die-modifiers";
import { WotrBattleHandler } from "../battle/wotr-battle-handler";
import { WotrCardEffectsService } from "../card/wotr-card-effects-service";
import { WotrCardHandler } from "../card/wotr-card-handler";
import { WotrCharacterHandler } from "../character/wotr-character-handler";
import { WotrActionRegistry } from "../commons/wotr-action-registry";
import { WotrFellowshipHandler } from "../fellowship/wotr-fellowship-handler";
import { WotrGameTurn } from "../game-turn/wotr-game-flow";
import { WotrHuntHandler } from "../hunt/wotr-hunt-handler";
import { WotrNationHandler } from "../nation/wotr-nation-handler";
import { AWotrPlayerInfo, WotrPlayerInfo } from "../player/wotr-player-info-models";
import { WotrPlayerUi } from "../player/wotr-player-ui";
import { WotrRegionHandler } from "../region/wotr-region-handler";
import { WotrRemoteService } from "../remote/wotr-remote";
import { WotrPlayerDoc } from "../remote/wotr-remote-models";
import { WotrUnitHandler } from "../unit/wotr-unit-handler";
import { WotrUnitModifiers } from "../unit/wotr-unit-modifiers";
import { WotrBoard } from "./board/wotr-board";
import { WotrGameStore } from "./wotr-game-store";
import { WotrStoryService } from "./wotr-story-service";

@Component({
  selector: "wotr-game-page",
  imports: [WotrBoard],
  template: `
    <wotr-board
      (replayNext)="story.nextReplay($event)"
      (replayLast)="story.lastReplay()">
    </wotr-board>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy
export class WotrGamePage implements OnInit, OnDestroy {
  protected store = inject(WotrGameStore);
  private remote = inject(WotrRemoteService);
  private route = inject(ActivatedRoute);
  private auth = inject(BgAuthService);
  protected story = inject(WotrStoryService);
  private flow = inject(WotrGameTurn);
  private cardEffects = inject(WotrCardEffectsService);
  private localPlayerService = inject(WotrPlayerUi);
  private actionRegistry = inject(WotrActionRegistry);
  private actionDieModifiers = inject(WotrActionDieModifiers);
  private unitModifiers = inject(WotrUnitModifiers);

  constructor() {
    inject(WotrActionDieHandler).init();
    inject(WotrCardHandler).init();
    inject(WotrBattleHandler).init();
    inject(WotrCharacterHandler).init();
    inject(WotrGameTurn).init();
    inject(WotrFellowshipHandler).init();
    inject(WotrHuntHandler).init();
    inject(WotrNationHandler).init();
    inject(WotrRegionHandler).init();
    inject(WotrUnitHandler).init();
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
    this.actionRegistry.clear();
    this.actionDieModifiers.clear();
    this.unitModifiers.clear();
  }
}
