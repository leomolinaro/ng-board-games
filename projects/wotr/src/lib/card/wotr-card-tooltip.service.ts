import { inject, Injectable, signal } from "@angular/core";
import { WotrAssetsStore, WotrCardText } from "../assets/wotr-assets-store";
import { WotrCardId } from "./wotr-card-models";

@Injectable({ providedIn: "root" })
export class WotrCardTooltipService {
  private readonly assets = inject(WotrAssetsStore);
  private readonly hints = signal(new Map<WotrCardId, string>());
  private readonly loading = new Set<WotrCardId>();

  readonly appearance = "wotr-card-tooltip";

  hint(cardId: WotrCardId): string {
    return this.hints().get(cardId) ?? "Loading...";
  }

  preload(cardId: WotrCardId): void {
    if (this.hints().has(cardId) || this.loading.has(cardId)) return;
    this.loading.add(cardId);
    this.setHint(cardId, "Loading...");

    void this.assets
      .cardText(cardId)
      .then(cardText => {
        if (!cardText) {
          this.setHint(cardId, "Card text not found.");
          return;
        }
        this.setHint(cardId, this.formatHint(cardText));
      })
      .finally(() => {
        this.loading.delete(cardId);
      });
  }

  private setHint(cardId: WotrCardId, hint: string): void {
    this.hints.update(current => {
      const next = new Map(current);
      next.set(cardId, hint);
      return next;
    });
  }

  private formatHint(cardText: WotrCardText): string {
    const eventTitle = this.escapeHtml(cardText.eventTitle);
    const eventPreCondition = this.escapeHtml(cardText.eventPreCondition ?? "");
    const eventText = this.escapeHtml(cardText.eventText).replaceAll("\n", "<br />");
    const eventDiscardCondition = this.escapeHtml(cardText.eventDiscardCondition ?? "").replaceAll(
      "\n",
      "<br />"
    );
    const eventDiscardLine = eventDiscardCondition
      ? `<br /><span class="wotr-card-tooltip-discard">${eventDiscardCondition}</span>`
      : "";
    const eventPreConditionLine = eventPreCondition
      ? `<br /><span class="wotr-card-tooltip-precondition">${eventPreCondition}</span>`
      : "";

    const combatTitle = this.escapeHtml(cardText.combatTitle);
    const combatPreCondition = this.escapeHtml(cardText.combatPreCondition ?? "");
    const combatText = this.escapeHtml(cardText.combatText).replaceAll("\n", "<br />");
    const combatPreConditionLine = combatPreCondition
      ? `<br /><span class="wotr-card-tooltip-precondition">${combatPreCondition}</span>`
      : "";

    return [
      `<span class="wotr-card-tooltip-title">${eventTitle}</span>${eventPreConditionLine}<br />${eventText}${eventDiscardLine}`,
      `<span class="wotr-card-tooltip-divider"></span>`,
      `<span class="wotr-card-tooltip-title">${combatTitle}</span>${combatPreConditionLine}<br />${combatText}`
    ].join("");
  }

  private escapeHtml(value: string): string {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
}
