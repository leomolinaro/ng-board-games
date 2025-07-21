import { Injectable } from "@angular/core";
import { WotrEvent, WotrEventConsumer } from "./wotr-event-models";

@Injectable({ providedIn: "root" })
export class WotrEventService {
  private registrations: Record<string, WotrEventConsumer<WotrEvent>[]> = {};

  register<E extends WotrEvent>(eventType: E["type"], consumer: WotrEventConsumer<E>) {
    let eventConsumers = this.registrations[eventType];
    if (!eventConsumers) {
      eventConsumers = [];
      this.registrations[eventType] = eventConsumers;
    }
    eventConsumers.push(consumer as any);
  }

  deregister<E extends WotrEvent>(eventType: E["type"], consumer: WotrEventConsumer<E>) {
    const eventConsumers = this.registrations[eventType];
    const index = eventConsumers.findIndex(c => c === consumer);
    eventConsumers.splice(index, 1);
  }

  async publish(event: WotrEvent) {
    const eventConsumers = this.registrations[event.type];
    if (eventConsumers) {
      for (const consumer of eventConsumers) {
        await consumer(event);
      }
    }
  }
}
