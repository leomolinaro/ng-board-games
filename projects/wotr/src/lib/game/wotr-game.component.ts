import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BgAuthService, BgUser } from "@leobg/commons";
import { UntilDestroy } from "@leobg/commons/utils";
import { WotrActionDieService } from "../action-die/wotr-action-die.service";
import { WotrActionTokenService } from "../action-token/wotr-action-token.service";
import { WotrBattleService } from "../battle/wotr-battle.service";
import { WotrBattleStore } from "../battle/wotr-battle.store";
import { WotrCombatCardsService } from "../battle/wotr-combat-cards.service";
import { WotrCardEffectsService } from "../card/wotr-card-effects.service";
import { WotrCardService } from "../card/wotr-card.service";
import { WotrCharacterService } from "../character/wotr-character.service";
import { WotrCharacterStore } from "../character/wotr-character.store";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrEventService } from "../commons/wotr-event.service";
import { WotrFellowshipService } from "../fellowship/wotr-fellowship.service";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship.store";
import { WotrFrontService } from "../front/wotr-front.service";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrGameTurnService } from "../game-turn/wotr-game-flow.service";
import { WotrHuntFlowService } from "../hunt/wotr-hunt-flow.service";
import { WotrHuntService } from "../hunt/wotr-hunt.service";
import { WotrHuntStore } from "../hunt/wotr-hunt.store";
import { WotrLogStore } from "../log/wotr-log.store";
import { WotrNationService } from "../nation/wotr-nation.service";
import { WotrNationStore } from "../nation/wotr-nation.store";
import { WotrAllPlayers } from "../player/wotr-all-players";
import { WotrFreePeoplesPlayer } from "../player/wotr-free-peoples-player";
import { WotrPlayerAiService } from "../player/wotr-player-ai.service";
import { AWotrPlayerInfo, WotrPlayerInfo } from "../player/wotr-player-info.models";
import { WotrPlayerInfoStore } from "../player/wotr-player-info.store";
import { WotrPlayerLocalService } from "../player/wotr-player-local.service";
import { WotrShadowPlayer } from "../player/wotr-shadow-player";
import { WotrRegionService } from "../region/wotr-region.service";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrPlayerDoc } from "../remote/wotr-remote.models";
import { WotrRemoteService } from "../remote/wotr-remote.service";
import { WotrUnitService } from "../unit/wotr-unit.service";
import { WotrBoardComponent } from "./board/wotr-board.component";
import { WotrGameUiStore } from "./wotr-game-ui.store";
import { WotrGameStore } from "./wotr-game.store";
import { WotrStoryService } from "./wotr-story.service";

@Component ({
  selector: "wotr-game",
  imports: [
    WotrBoardComponent
  ],
  template: `
    <wotr-board
      [players]="playerInfoStore.players ()"
      [regions]="regionStore.regions ()"
      [freePeoples]="frontStore.freePeoplesFront ()"
      [shadow]="frontStore.shadowFront ()"
      [hunt]="huntStore.state ()"
      [fellowship]="fellowshipStore.state ()"
      [freePeoplesNations]="nationStore.freePeoplesNations ()"
      [nationById]="nationStore.nationById ()"
      [nations]="nationStore.nations ()"
      [characters]="characterStore.characters ()"
      [characterById]="characterStore.characterById ()"
      [shadowNations]="nationStore.shadowNations ()"
      [logs]="logStore.state ()"
      [currentPlayerId]="ui.currentPlayerId ()"
      [message]="ui.message ()"
      [canCancel]="ui.canCancel ()"
      [canPass]="ui.canPass ()"
      [canConfirm]="ui.canConfirm ()"
      (confirm)="ui.confirmSelect.emit ()"
      (currentPlayerChange)="ui.setCurrentPlayerId ($event?.id || null)"
      (replayNext)="onReplayNext ($event)"
      (replayLast)="onReplayLast ()">
    </wotr-board>
  `,
  styles: [""],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    WotrActionDieService,
    WotrActionService,
    WotrActionTokenService,
    WotrBattleService,
    WotrBattleStore,
    WotrCardEffectsService,
    WotrCardService,
    WotrCharacterService,
    WotrCharacterStore,
    WotrCombatCardsService,
    WotrEventService,
    WotrFellowshipService,
    WotrFellowshipStore,
    WotrFrontService,
    WotrFrontStore,
    WotrGameStore,
    WotrGameTurnService,
    WotrHuntFlowService,
    WotrHuntService,
    WotrHuntStore,
    WotrLogStore,
    WotrNationService,
    WotrNationStore,
    WotrPlayerAiService,
    WotrAllPlayers,
    WotrShadowPlayer,
    WotrFreePeoplesPlayer,
    WotrPlayerLocalService,
    WotrPlayerInfoStore,
    WotrRegionService,
    WotrRegionStore,
    WotrStoryService,
    WotrGameUiStore,
    WotrUnitService
  ]
})
@UntilDestroy
export class WotrGameComponent implements OnInit, OnDestroy {

  protected store = inject (WotrGameStore);
  protected frontStore = inject (WotrFrontStore);
  protected regionStore = inject (WotrRegionStore);
  protected playerInfoStore = inject (WotrPlayerInfoStore);
  protected characterStore = inject (WotrCharacterStore);
  protected nationStore = inject (WotrNationStore);
  protected huntStore = inject (WotrHuntStore);
  protected fellowshipStore = inject (WotrFellowshipStore);
  protected logStore = inject (WotrLogStore);
  protected ui = inject (WotrGameUiStore);
  private remote = inject (WotrRemoteService);
  private route = inject (ActivatedRoute);
  private auth = inject (BgAuthService);
  private story = inject (WotrStoryService);
  private flow = inject (WotrGameTurnService);
  private cardEffects = inject (WotrCardEffectsService);

  constructor () {
    inject (WotrActionDieService).init ();
    inject (WotrActionTokenService).init ();
    inject (WotrCardService).init ();
    inject (WotrBattleService).init ();
    inject (WotrCharacterService).init ();
    inject (WotrGameTurnService).init ();
    inject (WotrFellowshipService).init ();
    inject (WotrHuntService).init ();
    inject (WotrNationService).init ();
    inject (WotrRegionService).init ();
    inject (WotrUnitService).init ();
  }

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

  async ngOnInit () {
    this.cardEffects.registerCardEffects ();
    const [game, players, stories] = await Promise.all ([
      this.remote.getGame (this.gameId),
      this.remote.getPlayers (this.gameId, (ref) => ref.orderBy ("sort")),
      this.remote.getStories (this.gameId, (ref) => ref.orderBy ("time").orderBy ("playerId")),
    ]);
    if (game) {
      const user = this.auth.getUser ();
      this.store.initGameState (
        players.map ((p) => this.playerDocToPlayerInfo (p, user)),
        this.gameId,
        game.owner
      );
      this.story.setStoryDocs (stories);
      await this.flow.game ();
      // this.ui.updateUi (s => ({
      //   ...s,
      //   ...this.ui.resetUi (),
      //   // canCancel: false,
      // }));
    }
  }
  
  private playerDocToPlayerInfo (playerDoc: WotrPlayerDoc, user: BgUser): WotrPlayerInfo {
    if (playerDoc.isAi) {
      return {
        ...this.playerDocToAPlayerInfo (playerDoc),
        isAi: true,
        isLocal: false,
        isRemote: false,
      };
    } else {
      return {
        ...this.playerDocToAPlayerInfo (playerDoc),
        isAi: false,
        controller: playerDoc.controller,
        isLocal: user.id === playerDoc.controller.id,
        isRemote: user.id !== playerDoc.controller.id,
      };
    }
  }

  private playerDocToAPlayerInfo (playerDoc: WotrPlayerDoc): AWotrPlayerInfo {
    return {
      id: playerDoc.id,
      name: playerDoc.name,
    };
  }

  ngOnDestroy () {}

  onReplayNext (nStories: number) { this.story.nextReplay (nStories); }

  onReplayLast () { this.story.lastReplay (); }

}

