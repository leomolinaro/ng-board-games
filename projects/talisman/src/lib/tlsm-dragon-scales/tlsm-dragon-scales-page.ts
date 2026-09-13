import { Component, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TuiButton,
  TuiDataList,
  TuiDialogService,
  TuiDropdown,
  TuiInput,
  TuiTitle,
} from '@taiga-ui/core';
import { TuiTabs } from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader, TuiNavigation } from '@taiga-ui/layout';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { firstValueFrom } from 'rxjs';
import {
  AskTokenResolver,
  CompleteTokenResolver,
} from './services/tlsm-draw.service';
import { TlsmMessageService } from './services/tlsm-message.service';
import { TlsmDragonCard } from './tlsm-dragon-card';
import { TlsmDragonScalesPool } from './tlsm-dragon-scales-pool';
import type { Settings } from './tlsm-settings-dialog';
import { TlsmSettingsDialog } from './tlsm-settings-dialog';
import type { TlsmDragonId } from './tlsm-store';
import { TlsmStore } from './tlsm-store';

@Component({
  selector: 'tlsm-dragon-scales',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TuiTitle,
    TuiButton,
    FormsModule,
    TuiButton,
    TuiDataList,
    TuiDropdown,
    TuiInput,
    TuiNavigation,
    TuiTabs,
    TuiTitle,
    TuiHeader,
    TuiCardLarge,
    TlsmDragonCard,
    TlsmDragonScalesPool,
  ],
  templateUrl: './tlsm-dragon-scales-page.html',
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      min-height: 0;
    }

    header[tuiNavigationHeader] {
      flex: 0 0 auto;
    }

    .new-round-button {
      position: fixed;
      bottom: 25px;
      right: 25px;
    }

    main.dashboard {
      flex: 1 1 auto;
      display: grid;
      grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
      grid-template-areas:
        'dragon dragon dragon'
        'pool pool logs';
      gap: 2vmin;
      padding: 2vmin;
      min-height: 0;
      overflow: hidden;
      box-sizing: border-box;
    }

    .dragon-card {
      grid-area: dragon;
      min-height: 0;
    }

    .logs {
      grid-area: logs;
      min-height: 0;
      main {
        display: flex;
        flex-direction: column;
        margin-block-start: 0 !important;
        div {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 1vmin;
        }
      }
      img {
        width: 5vmin;
        height: 5vmin;
      }
    }
    .pool {
      grid-area: pool;
      min-height: 0;
      main {
        margin-block-start: 0 !important;
      }
    }
  `,
  providers: [TlsmStore],
})
export class TlsmDragonScalesPage {
  protected readonly expanded = signal(false);

  private readonly dialogs = inject(TuiDialogService);

  protected switch = false;

  protected handleToggle(): void {
    this.expanded.update((e) => !e);
  }

  protected readonly store = inject(TlsmStore);

  constructor() {
    const messager = inject(TlsmMessageService);
    this.completeTokenResolver = new CompleteTokenResolver(
      this.store,
      messager,
    );
    this.askTokenResolver = new AskTokenResolver(this.store, messager);
  }

  private completeTokenResolver: CompleteTokenResolver;
  private askTokenResolver: AskTokenResolver;

  protected discardScale(dragonId: TlsmDragonId): void {
    this.store.discardScale(dragonId);
  }

  protected async openSettings(): Promise<void> {
    const result = await firstValueFrom(
      this.dialogs.open<Settings | null>(
        new PolymorpheusComponent(TlsmSettingsDialog),
        {
          label: 'Settings',
          size: 'l',
          data: {
            players: this.store.players(),
            scalesPerCrown: this.store.settings().scalesPerCrown,
          } satisfies Settings,
        },
      ),
    );
    if (!result) return;
    this.store.saveOpt(result.players, result.scalesPerCrown);
  }

  protected async newRound(): Promise<void> {
    this.store.clearLog();
    for (const player of this.store.players()) {
      await this.completeTokenResolver.drawToken(player);
    }
  }

  protected async drawToken(): Promise<void> {
    await this.askTokenResolver.drawToken('Player');
  }
}
