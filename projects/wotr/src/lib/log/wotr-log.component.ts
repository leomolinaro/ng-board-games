import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, Signal, computed, inject, input, isDevMode } from "@angular/core";
import { WotrActionDie, WotrActionToken } from "../action/wotr-action.models";
import { WotrAssetsService } from "../assets/wotr-assets.service";
import { cardToLabel, combatCardToLabel } from "../card/wotr-card.models";
import { WotrCharacterId } from "../character/wotr-character.models";
import { WotrCharacterStore } from "../character/wotr-character.store";
import { WotrFragmentCreator } from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrPhase } from "../game-turn/wotr-phase.models";
import { WotrHuntTileId } from "../hunt/wotr-hunt.models";
import { WotrNation, WotrNationId } from "../nation/wotr-nation.models";
import { WotrNationStore } from "../nation/wotr-nation.store";
import { WotrPlayerInfoStore } from "../player/wotr-player-info.store";
import { WotrRegion, WotrRegionId } from "../region/wotr-region.models";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrLog, WotrLogCardFragment, WotrLogFragment, WotrLogStringFragment } from "./wotr-log.models";

export interface WotrLogParsedStringFragment { type: "string"; label: string }
export interface WotrLogParsedCardFragment { type: "card"; label: string }
export interface WotrLogParsedPlayerFragment { type: "player"; label: string; front: WotrFrontId }
export interface WotrLogParsedRegionFragment { type: "region"; region: WotrRegion }
export interface WotrLogParsedNationFragment { type: "nation"; nation: WotrNation }
export interface WotrLogParsedDieFragment { type: "die"; dieImage: string }
export interface WotrLogParsedTokenFragment { type: "token"; tokenImage: string }
export interface WotrLogParsedHuntTileFragment { type: "hunt-tile"; tileImage: string }

export type WotrLogParsedFragment =
  | WotrLogParsedStringFragment
  | WotrLogParsedCardFragment
  | WotrLogParsedPlayerFragment
  | WotrLogParsedRegionFragment
  | WotrLogParsedNationFragment
  | WotrLogParsedDieFragment
  | WotrLogParsedTokenFragment
  | WotrLogParsedHuntTileFragment;

@Component ({
  selector: "wotr-log",
  imports: [NgClass],
  template: `
    <div class="log"
      [ngClass]="{
        'log-h0': log ().type === 'setup' || log ().type === 'round' || log ().type === 'endGame',
        'log-h1': log ().type === 'phase',
        'battle-h2': log ().type === 'battle-resolution',
        'hunt-h2': log ().type === 'hunt-resolution',
        'battle-log': battleLog (),
        'hunt-log': huntLog (),
        'breakpoint': debugBreakpoint ()
      }"
      (click)="logClick.next ()">
      @for (fragment of fragments (); track $index) {
        @switch (fragment.type) {
          @case ("string") { <span>{{ fragment.label }}</span> }
          @case ("card") { <span><i>{{ fragment.label }}</i></span> }
          @case ("player") { <span [ngClass]="fragment.front === 'shadow' ? 'is-red' : 'is-blue'">{{ fragment.label }}</span> }
          @case ("region") { <span>{{ fragment.region.name }}</span> }
          @case ("nation") { <span>{{ fragment.nation.name }}</span> }
          @case ("die") { <img class="action-die" [src]="fragment.dieImage"/> }
          @case ("token") { <img class="action-token" [src]="fragment.tokenImage"/> }
          @case ("hunt-tile") { <img class="hunt-tile" [src]="fragment.tileImage"/> }
          <!-- @case ("hunt-tile") { <span>{{ fragment.label }}</span> } -->
        }
      }
    </div>
  `,
  styles: [`
    @import 'wotr-variables';

    .log {
      margin-left: 1.5vw;

      &.log-h0 { font-size: 130%; margin-left: 0; }
      &.log-h1 { font-size: 120%; margin-left: 0.5vw; }
      &.log-h2 { font-size: 110%; margin-left: 1vw; }
      &.battle-h2, &.hunt-h2 { font-size: 110%; }
      &.battle-log, &.hunt-log { margin-left: 2vw; }

      .is-red { color: $red; }
      .is-blue { color: $blue; }

      &.breakpoint::before {
        content: '';
        display: inline-block;
        width: 10px;
        height: 10px;
        background-color: red;
        border-radius: 50%;
        margin-right: 3px;
      }
    }
    .action-die, .action-token, .hunt-tile {
      vertical-align: top;
      height: 16px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrLogComponent implements OnInit, WotrFragmentCreator<WotrLogParsedFragment> {
  
  private actionService = inject (WotrActionService);
  private assets = inject (WotrAssetsService);
  private nationStore = inject (WotrNationStore);
  private regionStore = inject (WotrRegionStore);
  private characterStore = inject (WotrCharacterStore);
  private playerInfoStore = inject (WotrPlayerInfoStore);
  
  log = input.required<WotrLog> ();
  debugBreakpoint = input.required<boolean> ();
  @Output () logClick = new EventEmitter<void> ();

  protected battleLog = computed (() => {
    const log = this.log ();
    return "during" in log && log.during === "battle";
  });

  protected huntLog = computed (() => {
    const log = this.log ();
    return "during" in log && log.during === "hunt";
  });

  ngOnInit () {
    if (this.debugBreakpoint () && isDevMode ()) {
      // eslint-disable-next-line no-debugger
      debugger;
    }
  }

  protected fragments: Signal<WotrLogParsedFragment[]> = computed (() => {
    const l = this.log ();
    switch (l.type) {
      case "v2": {
        const parsed: WotrLogParsedFragment[] = [];
        for (const f of l.fragments) {
          if (typeof f === "string") { parsed.push (this.string (f)); }
          else { parsed.push (this.parseFragment (f)); }
        }
        return parsed;
      }
      case "setup": return [this.string ("Setup")];
      case "endGame": return [this.string ("End Game")];
      case "round": return [this.string (`Round ${l.roundNumber}`)];
      case "phase": return [this.string (this.getPhaseLabel (l.phase))];
      case "battle-resolution": return [this.string ("Battle Resolution")];
      case "hunt-resolution": return [this.string ("Hunt Resolution")];
      case "action": {
        const fragments = this.actionService.getActionLogFragments<WotrLogParsedFragment> (l.action, l.front, this);
        const parsed: WotrLogParsedFragment[] = [];
        for (const f of fragments) {
          if (typeof f === "string") { parsed.push (this.string (f)); }
          else { parsed.push (f); }
        }
        if ("card" in l.story) { parsed.push (this.string (", using "), this.card (cardToLabel (l.story.card))); }
        if ("character" in l.story && l.story.character) { parsed.push (this.string (", using "), this.character (l.story.character), this.string ("'s ability")); }
        if ("die" in l.story) { parsed.push (this.string (" "), this.die (l.story.die, l.front)); }
        if ("token" in l.story) { parsed.push (this.string (" "), this.token (l.story.token, l.front)); }
        return parsed;
      }
      case "story": {
        switch (l.story.type) {
          case "die-pass": return [this.player (l.front), this.string (" passes")];
          case "token-skip": return [this.player (l.front), this.string (" skips remaining tokens")];
          case "reaction-card-skip": return [this.player (l.front), this.string (" skip "), this.card (cardToLabel (l.story.card))];
          case "reaction-character-skip": return [this.player (l.front), this.string (" skip character reaction")/* , this.card (combatCardToLabel (l.story.character)) */];
          case "reaction-combat-card-skip": return [this.player (l.front), this.string (" skip "), this.card (combatCardToLabel (l.story.card))];
          default: throw new Error (`Unknown log type ${(l as any).type}`);
        }
      }
      case "effect": {
        const fragments = this.actionService.getEffectLogFragments<WotrLogParsedFragment> (l.effect, this);
        const parsed: WotrLogParsedFragment[] = [];
        for (const f of fragments) {
          if (typeof f === "string") { parsed.push (this.string (f)); }
          else { parsed.push (f); }
        }
        return parsed;
      }
      case "combat-card": return [this.player (l.front), this.string (" plays "), this.card (combatCardToLabel (l.card))];
      case "reveal-in-mordor": return [this.string ("The fellowship is revealed on the Mordor Track")];
      case "move-in-mordor": return [this.string ("The fellowship moves on the Mordor Track")];
      default: throw new Error (`Unknown log type ${(l as any).type}`);
    }
  });

  private parseFragment (f: WotrLogFragment): WotrLogParsedFragment {
    if (typeof f === "string") {
      return this.string (f);
    } else {
      switch (f.type) {
        case "card": return this.card (f.label);
        case "die": return this.die (f.die, f.front);
        case "hunt-tile": return this.huntTile (f.tile);
        case "nation": return this.nation (f.nation);
        case "player": return this.player (f.front);
        case "region": return this.region (f.region);
        case "string": return this.string (f.label);
        case "token": return this.token (f.token, f.front);
        default: throw new Error (`Unknown fragment type ${(f as any).type}`);
      }
    }
  }

  private string (label: string): WotrLogStringFragment {
    return { type: "string", label };
  }

  private card (label: string): WotrLogCardFragment {
    return { type: "card", label };
  }

  private getPhaseLabel (phase: WotrPhase): string {
    switch (phase) {
      case 1: return "Recover Action Dice and Draw Event Cards";
      case 2: return "Fellowship Phase";
      case 3: return "Hunt Allocation";
      case 4: return "Action Roll";
      case 5: return "Action Resolution";
      case 6: return "Victory Check";
    }
  }

  character (characterId: WotrCharacterId): WotrLogParsedStringFragment {
    const companion = this.characterStore.character (characterId);
    return { type: "string", label: companion.name };
  }

  player (front: WotrFrontId): WotrLogParsedPlayerFragment {
    const player = this.playerInfoStore.player (front);
    return { type: "player", label: player.name, front };
  }

  region (regionId: WotrRegionId): WotrLogParsedRegionFragment {
    const region = this.regionStore.region (regionId);
    return { type: "region", region };
  }

  nation (nationId: WotrNationId): WotrLogParsedNationFragment {
    const nation = this.nationStore.nation (nationId);
    return { type: "nation", nation };
  }

  die (die: WotrActionDie, frontId: WotrFrontId): WotrLogParsedDieFragment {
    return { type: "die", dieImage: this.assets.getActionDieImage (die, frontId) };
  }

  token (token: WotrActionToken, frontId: WotrFrontId): WotrLogParsedTokenFragment {
    return { type: "token", tokenImage: this.assets.getActionTokenImage (token, frontId) };
  }

  huntTile (tile: WotrHuntTileId): WotrLogParsedHuntTileFragment {
    return { type: "hunt-tile", tileImage: this.assets.getHuntTileImage (tile) };
  }

}
