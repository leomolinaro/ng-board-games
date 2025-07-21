export interface WotrEvent {
  type: string;
}

export type WotrEventConsumer<E extends WotrEvent> = (event: E) => Promise<void>;
