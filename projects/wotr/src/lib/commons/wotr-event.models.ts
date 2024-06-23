export interface WotrEvent {
  type: string;
}

export interface WotrEventConsumer {
  id: string;
  callback: (event: WotrEvent) => Promise<void>;
}
