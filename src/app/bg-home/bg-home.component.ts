import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, Directive, EventEmitter, Input, OnDestroy, OnInit, Type, ViewChild, ViewContainerRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatExpansionPanel } from "@angular/material/expansion";
import { BgAuthService } from "@bg-services";
import { ChangeListener, ExhaustingEvent, Loading, UntilDestroy } from "@bg-utils";
import { BehaviorSubject, Observable, of } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { ABgArcheoGame, ABgProtoGame, BgBoardGame, BgProtoGameService } from "../bg-services/bg-proto-game.service";

export interface ABgRoomDialog {
} // ABgRoomDialog

export interface ABgRoomDialogInput {
  protoGame: ABgProtoGame;
} // ABgRoomDialogInput

export interface ABgRoomDialogOutput {
  gameId: string;
  startGame: boolean;
  deleteGame: boolean;
} // ABgRoomDialogOutput

export interface ABgArcheoGameForm {
  game: ABgArcheoGame;
  gameChange: EventEmitter<ABgArcheoGame>;
} // ANewGameForm

export interface BgHomeConfig {
  boardGame: BgBoardGame;
  boardGameName: string;
  archeoGameForm: Type<ABgArcheoGameForm>;
  roomDialog: Type<ABgRoomDialog>;
  isGameValid: (archeoGame: ABgArcheoGame) => boolean;
  getDefaultGame: () => ABgArcheoGame;
  startGame$: (gameId: string) => Observable<any>;
} // BgHomeConfig

@Directive ({
  selector: "[bgArcheoGameFormHost]"
})
export class BgArcheoGameFormHostDirective {

  constructor (
    public viewContainerRef: ViewContainerRef
  ) { }

} // BgNewGameHostDirective

@Component ({
  selector: "bg-home",
  templateUrl: "./bg-home.component.html",
  styleUrls: ["./bg-home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy
export class BgHomeComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor (
    private breakpointObserver: BreakpointObserver,
    private componentFactoryResolver: ComponentFactoryResolver,
    private protoGameService: BgProtoGameService,
    private authService: BgAuthService,
    private matDialog: MatDialog
  ) { }

  @Input () config!: BgHomeConfig;
  @ViewChild (BgArcheoGameFormHostDirective) archeoFormHost!: BgArcheoGameFormHostDirective;
  @ViewChild ("archeoFormPanel") archeoFormPanel!: MatExpansionPanel;

  @Loading () loading$!: Observable<boolean>;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe (Breakpoints.Handset)
  .pipe (map (result => result.matches));

  private archeoForm!: ABgArcheoGameForm;
  private archeoFormDetectorRef!: ChangeDetectorRef;

  private $archeoGameValid = new BehaviorSubject<boolean> (false);
  archeoGameValid$ = this.$archeoGameValid.asObservable ();

  protoGames$!: Observable<ABgProtoGame[]>;
  gameColumns = ["run", "name", "state", "owner", "delete"];

  ngOnInit (): void {
    this.protoGames$ = this.protoGameService.selectProtoGames$ (
      ref => ref.where ("boardGame", "==", this.config.boardGame)
    );
  } // ngOnInit

  ngAfterViewInit () {
    const viewContainerRef = this.archeoFormHost.viewContainerRef;
    viewContainerRef.clear ();
    const formFactory = this.componentFactoryResolver.resolveComponentFactory (this.config.archeoGameForm);
    const formComponentRef = viewContainerRef.createComponent (formFactory, 0);
    this.archeoForm = formComponentRef.instance;
    this.archeoFormDetectorRef = formComponentRef.injector.get (ChangeDetectorRef);
    const defaultGame = this.config.getDefaultGame ();
    this.setArcheoGame (defaultGame);
    this.listenToArcheoGameChange ();
  } // ngAfterViewInit

  ngOnDestroy () { }

  @ChangeListener ()
  private listenToArcheoGameChange () {
    return this.archeoForm.gameChange.pipe (
      tap (game => this.setArcheoGame (game))
    );
  } // listenToArcheoGameChange

  private setArcheoGame (game: ABgArcheoGame) {
    this.archeoForm.game = game;
    this.archeoFormDetectorRef.markForCheck ();
    const valid = this.config.isGameValid (game);
    this.$archeoGameValid.next (valid);
  } // setArcheoGame

  @ExhaustingEvent ()
  onCreateGame () {
    const archeoGame = this.archeoForm.game;
    if (archeoGame) {
      const user = this.authService.getUser ();
      const protoGame: Omit<ABgProtoGame, "id"> = {
        ...archeoGame,
        boardGame: this.config.boardGame,
        owner: user,
        state: "open"
      };
      this.archeoFormPanel.close ();
      const defaultGame = this.config.getDefaultGame ();
      this.setArcheoGame (defaultGame);
      return this.protoGameService.insertProtoGame$ (protoGame).pipe (
        switchMap (pg => this.playersRoom$ (pg))
      );
    } // if
    return of (void 0);
  } // onCreateGame

  @ExhaustingEvent ()
  onDeleteGame (game: ABgProtoGame) {
    return this.protoGameService.deleteProtoGame$ (game.id);
  } // onDeleteGame

  @ExhaustingEvent ()
  onEnterGame (game: ABgProtoGame) {
    if (game.state === "closed") {
      return this.config.startGame$ (game.id);
    } else {
      return this.playersRoom$ (game);
    } // if - else
  } // onEnterGame

  private playersRoom$ (game: ABgProtoGame) {
    const dialogRef = this.matDialog.open<ABgRoomDialog, ABgRoomDialogInput, ABgRoomDialogOutput> (
      this.config.roomDialog,
      {
        width: "1000px",
        data: { protoGame: game }
      }
    );
    return dialogRef.afterClosed ().pipe (
      switchMap (output => {
        if (output) {
          if (output.startGame) {
            return this.config.startGame$ (output.gameId);
          } else if (output.deleteGame) {
            return this.protoGameService.deleteProtoGame$ (game.id);
          } // if - else
        } // if
        return of (void 0);
      })
    );
  } // playersRoom$

} // BgHomeComponent
