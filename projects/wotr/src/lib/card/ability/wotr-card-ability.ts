import { WotrModifier } from "../../commons/wotr-modifier";

export abstract class WotrCardAbility<E = unknown> {
  constructor(private modifier: WotrModifier<E>) {}

  protected abstract handler: E;

  activate(): void {
    if (!this.modifier) console.error("Modifier is not defined for this ability", this);
    this.modifier.register(this.handler);
  }
  deactivate(): void {
    this.modifier.unregister(this.handler);
  }
}
