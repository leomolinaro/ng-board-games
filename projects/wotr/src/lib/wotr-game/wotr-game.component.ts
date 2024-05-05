import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BgAuthService, BgUser } from "@leobg/commons";
import { ChangeListener, SingleEvent, UntilDestroy } from "@leobg/commons/utils";
import { forkJoin, tap } from "rxjs";
import { WotrActionDieActionsService } from "../wotr-actions/wotr-action-die-actions.service";
import { WotrArmyActionsService } from "../wotr-actions/wotr-army-actions.service";
import { WotrCardActionsService } from "../wotr-actions/wotr-card-actions.service";
import { WotrCombatActionsService } from "../wotr-actions/wotr-combat-actions.service";
import { WotrCompanionActionsService } from "../wotr-actions/wotr-companion-actions.service";
import { WotrCompanionLogsService } from "../wotr-actions/wotr-companion-logs.service";
import { WotrFellowshipActionsService } from "../wotr-actions/wotr-fellowship-actions.service";
import { WotrGameActionLogsService } from "../wotr-actions/wotr-game-action-logs.service";
import { WotrGameActionsService } from "../wotr-actions/wotr-game-actions.service";
import { WotrHuntActionsService } from "../wotr-actions/wotr-hunt-actions.service";
import { WotrMinionActionsService } from "../wotr-actions/wotr-minion-actions.service";
import { WotrPoliticalActionsService } from "../wotr-actions/wotr-political-actions.service";
import { WotrBoardComponent } from "../wotr-board/wotr-board.component";
import { WotrCompanionStore } from "../wotr-elements/wotr-companion.store";
import { WotrFellowshipStore } from "../wotr-elements/wotr-fellowship.store";
import { WotrFrontStore } from "../wotr-elements/wotr-front.store";
import { WotrGameStore } from "../wotr-elements/wotr-game.store";
import { WotrHuntStore } from "../wotr-elements/wotr-hunt.store";
import { WotrLogStore } from "../wotr-elements/wotr-log.store";
import { WotrMinionStore } from "../wotr-elements/wotr-minion.store";
import { WotrNationStore } from "../wotr-elements/wotr-nation.store";
import { AWotrPlayer, WotrPlayer } from "../wotr-elements/wotr-player.models";
import { WotrRegionStore } from "../wotr-elements/wotr-region.store";
import { WotrPlayerDoc, WotrRemoteService } from "../wotr-remote.service";
import { WotrStoryDoc } from "../wotr-story.models";
import { WotrFlowService } from "./wotr-flow.service";
import { WotrPlayerAiService } from "./wotr-player-ai.service";
import { WotrPlayerLocalService } from "./wotr-player-local.service";
import { WotrStoryService } from "./wotr-story.service";
import { WotrUiStore } from "./wotr-ui.store";

@Component ({
  selector: "wotr-game",
  standalone: true,
  imports: [WotrBoardComponent, AsyncPipe],
  template: `
    <wotr-board
      [players]="store.players$ | async"
      [regions]="regionStore.regions ()"
      [freePeople]="frontStore.freePeopleFront ()"
      [shadow]="frontStore.shadowFront ()"
      [hunt]="huntStore.state ()"
      [fellowship]="fellowshipStore.state ()"
      [freePeopleNations]="nationStore.freePeopleNations ()"
      [nationById]="nationStore.nationById ()"
      [nations]="nationStore.nations ()"
      [companions]="companionStore.companions ()"
      [companionById]="companionStore.companionById ()"
      [shadowNations]="nationStore.shadowNations ()"
      [minions]="minionStore.minions ()"
      [minionById]="minionStore.minionById ()"
      [logs]="logStore.state ()"
      [message]="ui.message$ | async"
      (playerSelect)="ui.setCurrentPlayer ($event)"
      (testClick)="ui.testChange ()">
    </wotr-board>
  `,
  styles: [""],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    WotrGameStore,
    WotrFrontStore,
    WotrRegionStore,
    WotrNationStore,
    WotrCompanionStore,
    WotrMinionStore,
    WotrFellowshipStore,
    WotrHuntStore,
    WotrLogStore,

    WotrGameActionsService,
    WotrCardActionsService,
    WotrFellowshipActionsService,
    WotrHuntActionsService,
    WotrActionDieActionsService,
    WotrCompanionActionsService,
    WotrMinionActionsService,
    WotrArmyActionsService,
    WotrPoliticalActionsService,
    WotrCombatActionsService,

    WotrGameActionLogsService,
    WotrCompanionLogsService,

    WotrUiStore,
    WotrPlayerAiService,
    WotrPlayerLocalService,
    WotrStoryService,
    WotrFlowService
  ]
})
@UntilDestroy
export class WotrGameComponent implements OnInit, OnDestroy {

  protected store = inject (WotrGameStore);
  protected frontStore = inject (WotrFrontStore);
  protected regionStore = inject (WotrRegionStore);
  protected companionStore = inject (WotrCompanionStore);
  protected minionStore = inject (WotrMinionStore);
  protected nationStore = inject (WotrNationStore);
  protected huntStore = inject (WotrHuntStore);
  protected fellowshipStore = inject (WotrFellowshipStore);
  protected logStore = inject (WotrLogStore);
  protected ui = inject (WotrUiStore);
  private remote = inject (WotrRemoteService);
  private route = inject (ActivatedRoute);
  private auth = inject (BgAuthService);
  private story = inject (WotrStoryService);
  private flow = inject (WotrFlowService);

  private gameId: string = this.route.snapshot.paramMap.get ("gameId")!;

  // // endGame$ = this.game.selectEndGame$ ();

  // turnPlayer$ = this.ui.selectTurnPlayer$ ();
  // currentPlayer$ = this.ui.selectCurrentPlayer$ ();
  // // players$ = this.ui.selectPlayers$ ();
  // message$ = this.ui.selectMessage$ ();
  // validRegions$ = this.ui.selectValidRegions$ ();
  // validUnits$ = this.ui.selectValidUnits$ ();
  // selectedUnits$ = this.ui.selectSelectedUnits$ ();
  // // validActions$ = this.ui.selectValidActions$ ();
  // // validBuildings$ = this.ui.selectValidBuildings$ ();
  // // validResources$ = this.ui.selectValidResources$ ();
  // canPass$ = this.ui.selectCanPass$ ();
  // canConfirm$ = this.ui.selectCanContinue$ ();
  // canCancel$ = this.ui.selectCanCancel$ ();

  // @ViewChild (WotrBoardComponent) boardComponent!: WotrBoardComponent;

  @SingleEvent ()
  ngOnInit () {
    return forkJoin ([
      this.remote.getGame$ (this.gameId),
      this.remote.getPlayers$ (this.gameId, (ref) => ref.orderBy ("sort")),
      this.remote.getStories$ (this.gameId, (ref) => ref.orderBy ("time").orderBy ("playerId")),
    ]).pipe (
      tap (([game, players, stories]) => {
        if (game) {
          const user = this.auth.getUser ();
          this.store.initGameState (
            players.map ((p) => this.playerDocToPlayer (p, user)),
            this.gameId,
            game.owner
          );
          this.listenToGame (stories);
        }
      })
    );
  }

  @ChangeListener ()
  private listenToGame (stories: WotrStoryDoc[]) {
    this.story.setStoryDocs (stories);
    return this.flow.game$ ().pipe (
      tap (() => {
        this.ui.updateUi ("End game", (s) => ({
          ...s,
          ...this.ui.resetUi (),
          canCancel: false,
        }));
      })
    );
  }
  
  private playerDocToPlayer (playerDoc: WotrPlayerDoc, user: BgUser): WotrPlayer {
    if (playerDoc.isAi) {
      return {
        ...this.playerDocToAPlayerInit (playerDoc),
        isAi: true,
        isLocal: false,
        isRemote: false,
      };
    } else {
      return {
        ...this.playerDocToAPlayerInit (playerDoc),
        isAi: false,
        controller: playerDoc.controller,
        isLocal: user.id === playerDoc.controller.id,
        isRemote: user.id !== playerDoc.controller.id,
      };
    }
  }

  private playerDocToAPlayerInit (playerDoc: WotrPlayerDoc): AWotrPlayer {
    return {
      id: playerDoc.id,
      name: playerDoc.name,
    };
  }

  ngOnDestroy () {}

}

