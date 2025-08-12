export class WotrModifier<V> {
  private modifiers: V[] = [];
  register(modifier: V): void {
    this.modifiers.push(modifier);
  }
  unregister(modifier: V): void {
    this.modifiers = this.modifiers.filter(m => m !== modifier);
  }
  clear(): void {
    this.modifiers = [];
  }
  get(): V[] {
    return this.modifiers;
  }
}
