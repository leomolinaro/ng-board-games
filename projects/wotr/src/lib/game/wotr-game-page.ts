import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { BgAuthService, BgUser } from "@leobg/commons";
import { UntilDestroy } from "@leobg/commons/utils";
import { WotrActionDieHandler } from "../action-die/wotr-action-die-handler";
import { WotrActionDieModifiers } from "../action-die/wotr-action-die-modifiers";
import { WotrActionDieUi } from "../action-die/wotr-action-die-ui";
import { WotrBattleHandler } from "../battle/wotr-battle-handler";
import { WotrBattleModifiers } from "../battle/wotr-battle-modifiers";
import { WotrBattleUi } from "../battle/wotr-battle-ui";
import { WotrCombatCards } from "../battle/wotr-combat-cards";
import { WotrCards } from "../card/cards/wotr-cards";
import { WotrFreePeoplesCharacterCards } from "../card/cards/wotr-free-peoples-character-cards";
import { WotrCardHandler } from "../card/wotr-card-handler";
import { WotrCardPlayUi } from "../card/wotr-card-play-ui";
import { WotrCardStoryHandler } from "../card/wotr-card-story-handler";
import { WotrCharacterHandler } from "../character/wotr-character-handler";
import { WotrCharacterModifiers } from "../character/wotr-character-modifiers";
import { WotrCharacterAbilities } from "../character/wotr-characters";
import { WotrActionRegistry } from "../commons/wotr-action-registry";
import { WotrFellowshipHandler } from "../fellowship/wotr-fellowship-handler";
import { WotrFellowshipModifiers } from "../fellowship/wotr-fellowship-modifiers";
import { WotrFrontHandler } from "../front/wotr-front-handler";
import { WotrGameTurn } from "../game-turn/wotr-game-flow";
import { WotrHuntHandler } from "../hunt/wotr-hunt-handler";
import { WotrHuntModifiers } from "../hunt/wotr-hunt-modifiers";
import { WotrNationHandler } from "../nation/wotr-nation-handler";
import { WotrNationModifiers } from "../nation/wotr-nation-modifiers";
import { AWotrPlayerInfo, WotrPlayerInfo } from "../player/wotr-player-info-models";
import { WotrPlayerUi } from "../player/wotr-player-ui";
import { WotrRegionHandler } from "../region/wotr-region-handler";
import { WotrRemoteService } from "../remote/wotr-remote";
import { WotrPlayerDoc } from "../remote/wotr-remote-models";
import { WotrUnitHandler } from "../unit/wotr-unit-handler";
import { WotrUnitModifiers } from "../unit/wotr-unit-modifiers";
import { WotrUnitUtils } from "../unit/wotr-unit-utils";
import { WotrBoard } from "./board/wotr-board";
import { WotrGameQuery } from "./wotr-game-query";
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
      [replayMode]="replayMode"
      (replayModeChange)="reloadPage(true)"
      (editStories)="editStories()"
      (replayNext)="story.nextReplay($event)"
      (replayLast)="reloadPage(false)">
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
  private battleModifiers = inject(WotrBattleModifiers);
  private characterModifiers = inject(WotrCharacterModifiers);
  private fellowshipModifiers = inject(WotrFellowshipModifiers);
  private huntModifiers = inject(WotrHuntModifiers);
  private unitModifiers = inject(WotrUnitModifiers);
  private characterHandler = inject(WotrCharacterHandler);
  private characterAbilities = inject(WotrCharacterAbilities);
  private cardHandler = inject(WotrCardHandler);
  private cards = inject(WotrCards);
  private freePeoplesCharacterCards = inject(WotrFreePeoplesCharacterCards);
  private cardPlayUi = inject(WotrCardPlayUi);
  private battleUi = inject(WotrBattleUi);
  private combatCards = inject(WotrCombatCards);
  private actionDieUi = inject(WotrActionDieUi);
  private nationModifiers = inject(WotrNationModifiers);
  private unitUtils = inject(WotrUnitUtils);
  private q = inject(WotrGameQuery);
  private router = inject(Router);

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
    inject(WotrFrontHandler).init();
    this.story.init(this.localPlayerService);
    this.characterHandler.characterAbilities = this.characterAbilities;
    this.cardHandler.cards = this.cards;
    this.freePeoplesCharacterCards.cardPlayUi = this.cardPlayUi;
    this.combatCards.battleUi = this.battleUi;
    this.characterAbilities.actionDieUi = this.actionDieUi;
    this.unitUtils.q = this.q;
  }

  private gameId: string = this.route.snapshot.paramMap.get("gameId")!;
  protected replayMode = this.route.snapshot.queryParamMap.get("replay") === "true";

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
      if (this.replayMode) {
        this.story.setReplayMode(true);
      }
      this.story.setStoryDocs(stories);
      await this.flow.game();
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
    this.actionDieModifiers.clear();
    this.actionRegistry.clear();
    this.battleModifiers.clear();
    this.characterModifiers.clear();
    this.fellowshipModifiers.clear();
    this.huntModifiers.clear();
    this.nationModifiers.clear();
    this.unitModifiers.clear();
    this.store.clear();
    this.story.clear();
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

  protected reloadPage(replay: boolean) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: replay ? { replay } : {},
      queryParamsHandling: "replace"
    });
    setTimeout(() => location.reload());
  }
}
