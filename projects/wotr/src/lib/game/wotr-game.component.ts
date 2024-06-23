import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BgAuthService, BgUser } from "@leobg/commons";
import { UntilDestroy } from "@leobg/commons/utils";
import { WotrActionDieService } from "../action-die/wotr-action-die.service";
import { WotrBattleFlowService } from "../battle/wotr-battle-flow.service";
import { WotrBattleService } from "../battle/wotr-battle.service";
import { WotrCombatCardsService } from "../battle/wotr-combat-cards.service";
import { WotrCardEffectsService } from "../card/wotr-card-effects.service";
import { WotrCardService } from "../card/wotr-card.service";
import { WotrCharacterService } from "../character/wotr-character.service";
import { WotrCharacterStore } from "../character/wotr-character.store";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrEventService } from "../commons/wotr-event.service";
import { stories as exampleStories } from "../examples/very-late-minions";
import { WotrFellowshipService } from "../fellowship/wotr-fellowship.service";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship.store";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrHuntFlowService } from "../hunt/wotr-hunt-flow.service";
import { WotrHuntService } from "../hunt/wotr-hunt.service";
import { WotrHuntStore } from "../hunt/wotr-hunt.store";
import { WotrLogStore } from "../log/wotr-log.store";
import { WotrNationService } from "../nation/wotr-nation.service";
import { WotrNationStore } from "../nation/wotr-nation.store";
import { WotrPlayerAiService } from "../player/wotr-player-ai.service";
import { WotrPlayerLocalService } from "../player/wotr-player-local.service";
import { AWotrPlayer, WotrPlayer } from "../player/wotr-player.models";
import { WotrRegionService } from "../region/wotr-region.service";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrUnitService } from "../unit/wotr-unit.service";
import { WotrBoardComponent } from "./board/wotr-board.component";
import { WotrGameFlowService } from "./wotr-game-flow.service";
import { WotrGameStore } from "./wotr-game.store";
import { WotrRemoteMockService } from "./wotr-remote-mock.service";
import { WotrPlayerDoc } from "./wotr-remote.service";
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
      [message]="ui.message$ | async"
      (playerSelect)="ui.setCurrentPlayer ($event)"
      (replayNext)="onReplayNext ($event)"
      (replayLast)="onReplayLast ()">
    </wotr-board>
  `,
  styles: [""],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    WotrGameStore,
    WotrStoryService,
    
    WotrGameFlowService,
    WotrBattleFlowService,
    WotrHuntFlowService,

    WotrActionService,
    WotrActionDieService,
    WotrCardService,
    WotrBattleService,
    WotrCombatCardsService,
    WotrCharacterService,
    WotrFellowshipService,
    WotrHuntService,
    WotrNationService,
    WotrRegionService,
    WotrUnitService,

    WotrEventService,
    WotrCardEffectsService,

    WotrPlayerAiService,
    WotrPlayerLocalService,
    WotrUiStore,
  ]
})
@UntilDestroy
export class WotrGameComponent implements OnInit, OnDestroy {

  protected store = inject (WotrGameStore);
  protected frontStore = inject (WotrFrontStore);
  protected regionStore = inject (WotrRegionStore);
  protected characterStore = inject (WotrCharacterStore);
  protected nationStore = inject (WotrNationStore);
  protected huntStore = inject (WotrHuntStore);
  protected fellowshipStore = inject (WotrFellowshipStore);
  protected logStore = inject (WotrLogStore);
  protected ui = inject (WotrUiStore);
  private remote = inject (WotrRemoteMockService);
  private route = inject (ActivatedRoute);
  private auth = inject (BgAuthService);
  private story = inject (WotrStoryService);
  private flow = inject (WotrGameFlowService);
  private cardEffects = inject (WotrCardEffectsService);

  constructor () {
    inject (WotrActionDieService).init ();
    inject (WotrCardService).init ();
    inject (WotrBattleService).init ();
    inject (WotrCharacterService).init ();
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
        players.map ((p) => this.playerDocToPlayer (p, user)),
        this.gameId,
        game.owner
      );
      // this.story.setStoryDocs (stories);
      this.story.setStoryDocs (exampleStories);
      await this.flow.game ();
      this.ui.updateUi ("End game", (s) => ({
        ...s,
        ...this.ui.resetUi (),
        canCancel: false,
      }));
    }
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

  onReplayNext (nStories: number) { this.story.nextReplay (nStories); }

  onReplayLast () { this.story.lastReplay (); }

}

