import { EMPTY, Observable, of, race } from 'rxjs';
import {
  expand,
  filter,
  first,
  last,
  map,
  mapTo,
  switchMap,
} from 'rxjs/operators';
import { BgAuthService, BgUser } from './bg-auth.service';

interface ABgPlayer {
  id: string;
  name: string;
} // ABaronyPlayer

export interface BgAiPlayer extends ABgPlayer {
  isAi: true;
  isRemote: false;
  isLocal: false;
} // BaronyAiPlayer

export interface BgRealPlayer extends ABgPlayer {
  isAi: false;
  isRemote: boolean;
  isLocal: boolean;
  controller: BgUser;
} // BaronyAiPlayer

type BgPlayer = BgAiPlayer | BgRealPlayer;

type BgStoryDoc<St> = St & { id: number };

export abstract class ABgGameService<Pl extends BgPlayer, St, PlSrv> {
  constructor() {}

  protected abstract authService: BgAuthService;
  protected abstract localService: PlSrv;
  protected abstract aiService: PlSrv;

  private lastStoryId: number = 0;
  protected abstract stories: BgStoryDoc<St>[] | null;

  protected abstract getGameId(): string;
  protected abstract getPlayer(playerId: string): Pl;
  protected abstract getGameOwner(): BgUser;
  protected abstract getCurrentPlayerId(): string | null;
  protected abstract setCurrentPlayer(playerId: string): void;
  protected abstract currentPlayerChange$(): Observable<string | null>;
  protected abstract cancelChange$(): Observable<void>;

  protected abstract startTemporaryState(): void;
  protected abstract endTemporaryState(): void;
  protected abstract resetUi(playerId: string): void;

  protected abstract insertStory$<S extends St>(
    story: S,
    storyId: number,
    gameId: string
  ): Observable<S>;
  protected abstract selectStory$(
    storyId: number,
    gameId: string
  ): Observable<St | undefined>;

  private isLocalPlayer(playerId: string) {
    const user = this.authService.getUser();
    const player = this.getPlayer(playerId);
    return player.isAi
      ? false
      : (player as BgRealPlayer).controller.id === user.id;
  } // isLocalPlayer

  private isOwnerUser() {
    const user = this.authService.getUser();
    const gameOwner = this.getGameOwner();
    return user.id === gameOwner.id;
  } // isOwnerUser

  private isCurrentPlayer(playerId: string) {
    const currentPlayerId = this.getCurrentPlayerId();
    return currentPlayerId === playerId;
  } // isCurrentPlayer

  private isAiPlayer(playerId: string) {
    const player = this.getPlayer(playerId);
    return player.isAi;
  } // isAiPlayer

  private autoRefreshCurrentPlayer(player: string) {
    if (this.isLocalPlayer(player)) {
      this.setCurrentPlayer(player);
    } // if - else
  } // autoRefreshCurrentPlayer

  private executeTaskOnFixedPlayer$<R extends St>(
    playerId: string,
    task$: (playerService: PlSrv) => Observable<R>
  ): Observable<R> {
    if (this.isLocalPlayer(playerId) && this.isCurrentPlayer(playerId)) {
      return task$(this.localService).pipe(
        switchMap((result) =>
          this.insertStory$(result, ++this.lastStoryId, this.getGameId())
        )
      );
    } else if (this.isAiPlayer(playerId) && this.isOwnerUser()) {
      return task$(this.aiService).pipe(
        switchMap((result) =>
          this.insertStory$(result, ++this.lastStoryId, this.getGameId())
        )
      );
    } else {
      this.resetUi(playerId);
      return this.selectStory$(++this.lastStoryId, this.getGameId()).pipe(
        filter((story) => !!story),
        map((story) => story as any as R),
        first<R>()
      );
    } // if - else
  } // executeTaskOnFixedPlayer$

  private executeTaskOnChangingPlayer$<R extends St>(
    playerId: string,
    task$: (playerService: PlSrv) => Observable<R>
  ): Observable<R | null> {
    return race(
      this.executeTaskOnFixedPlayer$(playerId, task$),
      this.currentPlayerChange$().pipe(mapTo(null)),
      this.cancelChange$().pipe(mapTo(null))
    );
  } // executeTaskOnChangingPlayer$

  protected executeTask$<R extends St>(
    playerId: string,
    task$: (playerService: PlSrv) => Observable<R>
  ): Observable<R> {
    if (this.stories && this.stories.length) {
      const nextStory = this.stories.shift()!;
      this.lastStoryId = nextStory.id;
      return of(nextStory as St as R);
    } else {
      this.autoRefreshCurrentPlayer(playerId);
      this.startTemporaryState();
      return this.executeTaskOnChangingPlayer$(playerId, task$).pipe(
        expand((result) => {
          this.endTemporaryState();
          if (result) {
            return EMPTY;
          } else {
            this.startTemporaryState();
            return this.executeTaskOnChangingPlayer$(playerId, task$);
          } // if - else
        }),
        last(),
        map((story) => story as any as R)
      );
    } // if - else
  } // executeTask$
} // ABgGameService
