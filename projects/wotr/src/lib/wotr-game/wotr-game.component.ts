import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BgAuthService, BgUser } from "@leobg/commons";
import { ChangeListener, SingleEvent, UntilDestroy } from "@leobg/commons/utils";
import { forkJoin, tap } from "rxjs";
import { WotrBoardComponent } from "../wotr-board/wotr-board.component";
import { WotrGameStore } from "../wotr-elements/wotr-game.store";
import { AWotrPlayer, WotrPlayer } from "../wotr-elements/wotr-player.models";
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
      [regions]="store.regions ()"
      [freePeopleFront]="store.freePeopleFront ()"
      [freePeopleNations]="store.freePeopleNations ()"
      [nationById]="store.nationById ()"
      [companions]="store.companions ()"
      [companionById]="store.companionById ()"
      [shadowFront]="store.shadowFront ()"
      [shadowNations]="store.shadowNations ()"
      [minions]="store.minions ()"
      [minionById]="store.minionById ()"
      [logs]="store.logs$ | async"
      [message]="ui.message$ | async"
      (playerSelect)="ui.setCurrentPlayer ($event)"
      (testClick)="ui.testChange ()">
    </wotr-board>
  <!-- // // onBuildingSelect (building: BaronyBuilding) { this.ui.buildingChange (building); }
  // onRegionClick (regionId: WotrRegionId) { this.ui.regionChange (regionId); }
  // onUnitClick (unit: WotrRegionUnit) { this.ui.unitChange (unit); }
  // onSelectedUnitsChange (units: WotrRegionUnit[]) { this.ui.selectedUnitsChange (units); }
  // // onActionClick (action: BaronyAction) { this.ui.actionChange (action); }
  // onPassClick () { this.ui.passChange (); }
  // onConfirmClick () { this.ui.confirmChange (); }
  // // onKnightsConfirm (numberOfKnights: number) { this.ui.numberOfKnightsChange (numberOfKnights); }
  // // onResourceSelect (resource: BaronyResourceType) { this.ui.resourceChange (resource); } --> -->
    <!-- 
    [nationStates]="nationStates$ | async"
    [players]="players$ | async"
    
    [turnPlayer]="turnPlayer$ | async"
    [currentPlayer]="currentPlayer$ | async"
    [validRegions]="validRegions$ | async"
    [validUnits]="validUnits$ | async"
    [selectedUnits]="selectedUnits$ | async"
    [canPass]="canPass$ | async"
    [canConfirm]="canConfirm$ | async"
    [canCancel]="canCancel$ | async"
    (passClick)="onPassClick()"
    (confirmClick)="onConfirmClick()"
    (cancelClick)="onCancelClick()"
    (regionClick)="onRegionClick($event)"
    (unitClick)="onUnitClick($event)"
    (selectedUnitsChange)="onSelectedUnitsChange($event)"
    [validLands]="validLands$ | async"
    [validActions]="validActions$ | async"
    [validBuildings]="validBuildings$ | async"
    [validResources]="validResources$ | async"
    [maxNumberOfKnights]="maxNumberOfKnights$ | async"
    [endGame]="endGame$ | async"
    (playerSelect)="onPlayerSelect ($event)"
    (buildingSelect)="onBuildingSelect ($event)"
    (landTileClick)="onLandTileClick ($event)"
    (actionClick)="onActionClick ($event)"
    (knightsConfirm)="onKnightsConfirm ($event)"
    (resourceSelect)="onResourceSelect ($event)" -->
  `,
  styles: [""],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    WotrGameStore,
    WotrUiStore,
    WotrPlayerAiService,
    WotrPlayerLocalService,
    WotrStoryService,
    WotrFlowService
  ],
})
@UntilDestroy
export class WotrGameComponent implements OnInit, OnDestroy {

  protected store = inject (WotrGameStore);
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

