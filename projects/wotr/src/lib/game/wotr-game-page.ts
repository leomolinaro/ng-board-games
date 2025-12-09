import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { BgAuthService, BgUser } from "@leobg/commons";
import { UntilDestroy } from "@leobg/commons/utils";
import { WotrActionDieHandler } from "../action-die/wotr-action-die-handler";
import { WotrActionDieModifiers } from "../action-die/wotr-action-die-modifiers";
import { WotrBattleHandler } from "../battle/wotr-battle-handler";
import { WotrBattleModifiers } from "../battle/wotr-battle-modifiers";
import { WotrCards } from "../card/cards/wotr-cards";
import { WotrFreePeoplesCharacterCards } from "../card/cards/wotr-free-peoples-character-cards";
import { WotrCardHandler } from "../card/wotr-card-handler";
import { WotrCardPlayUi } from "../card/wotr-card-play-ui";
import { WotrCardStoryHandler } from "../card/wotr-card-story-handler";
import { WotrCharacterHandler } from "../character/wotr-character-handler";
import { WotrCharacters } from "../character/wotr-characters";
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
import {
  WotrStoriesDialog,
  WotrStoriesDialogData,
  WotrStoriesDialogRef
} from "./wotr-stories-dialog";
import { WotrStoryService } from "./wotr-story-service";

@Component({
  selector: "wotr-game-page",
  imports: [WotrBoard],
  template: `
    <wotr-board
      (editStories)="editStories()"
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
  private localPlayerService = inject(WotrPlayerUi);
  private actionRegistry = inject(WotrActionRegistry);
  private actionDieModifiers = inject(WotrActionDieModifiers);
  private unitModifiers = inject(WotrUnitModifiers);
  private battleModifiers = inject(WotrBattleModifiers);
  private characterHandler = inject(WotrCharacterHandler);
  private characters = inject(WotrCharacters);
  private cardHandler = inject(WotrCardHandler);
  private cards = inject(WotrCards);
  private freePeoplesCharacterCards = inject(WotrFreePeoplesCharacterCards);
  private cardPlayUi = inject(WotrCardPlayUi);

  private dialog = inject(MatDialog);

  constructor() {
    inject(WotrActionDieHandler).init();
    inject(WotrCardHandler).init();
    inject(WotrCardStoryHandler).init();
    inject(WotrBattleHandler).init();
    inject(WotrCharacterHandler).init();
    inject(WotrGameTurn).init();
    inject(WotrFellowshipHandler).init();
    inject(WotrHuntHandler).init();
    inject(WotrNationHandler).init();
    inject(WotrRegionHandler).init();
    inject(WotrUnitHandler).init();
    this.story.init(this.localPlayerService);
    this.characterHandler.characters = this.characters;
    this.cardHandler.cards = this.cards;
    this.freePeoplesCharacterCards.cardPlayUi = this.cardPlayUi;
  }

  private gameId: string = this.route.snapshot.paramMap.get("gameId")!;

  async ngOnInit() {
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
    this.battleModifiers.clear();
  }

  private storiesDialogRef: WotrStoriesDialogRef | null = null;

  editStories() {
    const data: WotrStoriesDialogData = {
      gameId: this.gameId
    };
    this.storiesDialogRef = this.dialog.open<WotrStoriesDialog, WotrStoriesDialogData, void>(
      WotrStoriesDialog,
      {
        data,
        panelClass: "mat-typography",
        maxHeight: "80vh",
        maxWidth: "80vw"
      }
    );
  }
}
