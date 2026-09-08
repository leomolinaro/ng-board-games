import type { TlsmDragonId, TlsmStore } from '../tlsm-store';
import type { TlsmMessageService } from './tlsm-message.service';

abstract class TokenResolver {
  constructor(
    protected store: TlsmStore,
    protected messager: TlsmMessageService,
  ) {}

  abstract drawSlumber(player: string): void | Promise<void>;
  abstract drawRage(player: string): void | Promise<void>;
  abstract drawStrike(player: string): void | Promise<void>;
  abstract drawScale(dragonId: string, player: string): void | Promise<void>;

  async drawToken(player: string): Promise<void> {
    const pool = this.store.pool();
    const poolSize =
      pool.scales.varthrax +
      pool.scales.cadorus +
      pool.scales.grilipus +
      pool.rages +
      pool.slumbers +
      pool.strikes;
    const x = Math.floor(Math.random() * poolSize);
    let limit = pool.scales.varthrax;
    if (x < limit) {
      await this.drawScale('varthrax', player);
    } else {
      limit += pool.scales.cadorus;
      if (x < limit) {
        await this.drawScale('cadorus', player);
      } else {
        limit += pool.scales.grilipus;
        if (x < limit) {
          await this.drawScale('grilipus', player);
        } else {
          limit += pool.rages;
          if (x < limit) {
            await this.drawRage(player);
          } else {
            limit += pool.slumbers;
            if (x < limit) {
              await this.drawSlumber(player);
            } else {
              limit += pool.strikes;
              if (x < limit) {
                await this.drawStrike(player);
              }
            }
          }
        }
      }
    }
  }
}

export class CompleteTokenResolver extends TokenResolver {
  async drawSlumber(player: string): Promise<void> {
    this.store.drawSlumber();
    this.store.addLog(
      player + ' draws a slumber token',
      '../assets/talisman/slumber-token.png',
    );
    await this.messager.alert(
      player + ' draws a slumber token',
      '../assets/talisman/slumber-token.png',
    );
  }

  async drawRage(player: string): Promise<void> {
    this.store.drawRage();
    this.store.addLog(
      player + ' draws a rage token',
      '../assets/talisman/rage-token.png',
    );
    const king = this.store.king();
    if (king) {
      await this.messager.alert(
        player + ' suffers ' + king.name + "'s rage",
        '../assets/talisman/rage-token.png',
      );
    }
  }

  async drawStrike(player: string): Promise<void> {
    this.store.drawStrike();
    this.store.addLog(
      player + ' draws a strike token',
      '../assets/talisman/strike-token.png',
    );
    await this.drawToken(player);
    await this.drawToken(player);
  }

  async drawScale(dragonId: TlsmDragonId, player: string): Promise<void> {
    const dragon = this.store.dragon(dragonId);
    const settings = this.store.settings();
    this.store.drawScale(dragonId, true);
    this.store.addLog(
      player + ' draws a ' + dragon.name + ' scale',
      dragon.tokenSource,
    );
    if (dragon.nScales >= settings.scalesPerCrown) {
      this.store.resetScale(dragonId);
      const oldKing = this.store.king();
      if (oldKing) {
        this.store.crown(oldKing.id, false);
      }
      this.store.crown(dragonId, true);
      await this.messager.alert(
        player + ' generates a ' + dragon.name + "'s scale",
        dragon.tokenSource,
      );
    }
  }
}

export class AskTokenResolver extends TokenResolver {
  async drawSlumber(player: string): Promise<void> {
    this.store.drawSlumber();
    await this.messager.alert(
      player + ' draws a slumber token',
      '../assets/talisman/slumber-token.png',
    );
  }

  async drawRage(player: string): Promise<void> {
    this.store.drawRage();
    const king = this.store.king();
    if (king) {
      const confirm = await this.messager.confirm(
        player + ' draws a rage token',
        '../assets/talisman/rage-token.png',
        'Has the token to be resolved?',
      );
      if (confirm) {
        await this.messager.alert(
          player + ' suffers ' + king.name + "'s rage.",
          '../assets/talisman/rage-token.png',
        );
      }
    } else {
      await this.messager.alert(
        player + ' draws a rage token',
        '../assets/talisman/rage-token.png',
      );
    }
  }

  async drawStrike(player: string): Promise<void> {
    this.store.drawStrike();
    const confirm = await this.messager.confirm(
      player + ' draws a strike token',
      '../assets/talisman/strike-token.png',
      'Has the token to be resolved?',
    );
    if (confirm) {
      await this.drawToken(player);
      await this.drawToken(player);
    }
  }

  async drawScale(dragonId: TlsmDragonId, player: string): Promise<void> {
    const dragon = this.store.dragon(dragonId);
    const settings = this.store.settings();
    const confirm = await this.messager.confirm(
      player + ' draws a ' + dragon.name + ' token',
      dragon.tokenSource,
      'Has the token to be resolved?',
    );
    this.store.drawScale(dragonId, confirm);
    if (confirm && dragon.nScales >= settings.scalesPerCrown) {
        this.store.resetScale(dragonId);
        const oldKing = this.store.king();
        if (oldKing) this.store.crown(oldKing.id, false);
        this.store.crown(dragonId, true);
        await this.messager.alert(
          player + ' generates a ' + dragon.name + "'s scale",
          dragon.tokenSource,
        );
      }
  }
}
