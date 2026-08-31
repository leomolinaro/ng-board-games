import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, resource } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  TuiButton,
  TuiCheckbox,
  TuiExpand,
  TuiSlider,
  TuiTitle,
} from '@taiga-ui/core';
import { TuiAccordion, TuiProgress } from '@taiga-ui/kit';
import { TuiNavigation } from '@taiga-ui/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AgotData } from '../agot-services/agot-data';
import { AgotCard, AgotFactionCode, AgotPackCode } from '../agot.models';
import { AgotCardGrid } from './agot-card-grid';
import { AgotCheckboxList } from './agot-checkbox-list';
import {
  DEFAULT_FACTION_IDS,
  DEFAULT_PACK_IDS,
  DEFAULT_TYPE_IDS,
} from './agot-draft-defaults';
import { AgotDraftService } from './agot-draft.service';

@Component({
  selector: 'agot-draft',
  imports: [
    FormsModule,
    AgotCardGrid,
    AgotCheckboxList,
    TuiAccordion,
    TuiButton,
    TuiCheckbox,
    TuiExpand,
    TuiNavigation,
    TuiProgress,
    TuiSlider,
    TuiTitle,
  ],
  templateUrl: './agot-draft-page.html',
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }
    .page-content {
      flex: 1;
      display: flex;
      min-height: 0;
    }

    aside[tuiNavigationAside] {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      padding-top: 0;
      box-sizing: border-box;
    }

    .aside-scroll {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
    }
    .aside-header {
      position: sticky;
      top: 0;
      z-index: 1;
      display: flex;
      align-items: center;
      background: var(--tui-theme-color, #000);
      padding: 0.75rem 0 0.75rem;
      border-bottom: 1px solid var(--tui-border-normal);
      // margin-inline: -0.75rem;
      // padding-inline: 0.75rem;
    }
    .aside-footer {
      position: sticky;
      bottom: 0;
      z-index: 1;
      width: 100%;
      display: flex;
      justify-content: flex-end;
      padding: 0.75rem 0.75rem 0.5rem;
      background: var(--tui-theme-color, #000);
      border-top: 1px solid var(--tui-border-normal);
      box-sizing: border-box;
    }

    .accordion {
      border-radius: 0;
      [tuiAccordion] {
        background: transparent !important;
        justify-content: flex-start;
        box-shadow: none;
        border-block-start: 1px solid var(--tui-border-normal);
        background: transparent !important;
        mask-image: none;
      }
      tui-expand {
        padding-inline-start: 0;
        padding-inline-end: 0;
        box-shadow: none;
      }
    }

    .settings-section {
      display: grid;
      gap: 0.75rem;
      padding-block: 0.5rem 1rem;
    }

    .slider-field {
      display: grid;
      gap: 0.25rem;
    }

    .settings-checkbox {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    main[tuiNavigationMain] {
      border-block-start: 1.5rem solid transparent;
      height: 100%;
      overflow: auto;
    }
  `,
})
export class AgotDraftPage {
  private breakpointObserver = inject(BreakpointObserver);
  protected data = inject(AgotData);
  protected draft = inject(AgotDraftService);

  protected nCards = 30;
  protected duplicates = false;
  protected selectedTypeIds = DEFAULT_TYPE_IDS;
  protected selectedFactionIds = DEFAULT_FACTION_IDS;
  protected selectedPackIds = DEFAULT_PACK_IDS;
  protected types = this.data.types;
  protected factions = this.data.factions;
  protected packs = this.data.packs;

  protected draftCards: AgotCard[] | null = null;

  protected isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));

  private dataLoad = resource({
    loader: () => this.data.load(),
  });

  protected loading = this.dataLoad.isLoading;

  protected toggleType(code: string, checked: boolean): void {
    this.selectedTypeIds = checked
      ? [...new Set([...this.selectedTypeIds, code])]
      : this.selectedTypeIds.filter((value) => value !== code);
  }

  protected toggleFaction(code: AgotFactionCode, checked: boolean): void {
    this.selectedFactionIds = checked
      ? [...new Set([...this.selectedFactionIds, code])]
      : this.selectedFactionIds.filter((value) => value !== code);
  }

  protected togglePack(code: AgotPackCode, checked: boolean): void {
    this.selectedPackIds = checked
      ? [...new Set([...this.selectedPackIds, code])]
      : this.selectedPackIds.filter((value) => value !== code);
  }

  protected selectAllTypes(): void {
    this.selectedTypeIds = this.types().map((type) => type.code);
  }

  protected deselectAllTypes(): void {
    this.selectedTypeIds = [];
  }

  protected selectAllFactions(): void {
    this.selectedFactionIds = this.factions().map((faction) => faction.code);
  }

  protected deselectAllFactions(): void {
    this.selectedFactionIds = [];
  }

  protected selectAllPacks(): void {
    this.selectedPackIds = this.packs().map((pack) => pack.code);
  }

  protected deselectAllPacks(): void {
    this.selectedPackIds = [];
  }

  protected generate() {
    this.draftCards = this.draft.generateDraft(
      this.nCards,
      this.selectedTypeIds,
      this.selectedFactionIds,
      this.selectedPackIds,
      this.duplicates,
    );
  }
}
