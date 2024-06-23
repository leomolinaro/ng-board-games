import { Injectable } from "@angular/core";
import { WotrEvent, WotrEventConsumer } from "./wotr-event.models";

@Injectable ()
export class WotrEventService {

  private registrations: Record<string, WotrEventConsumer[]> = { };

  register (eventType: string, consumer: WotrEventConsumer) {
    let eventConsumers = this.registrations[eventType];
    if (!eventConsumers) {
      eventConsumers = [];
      this.registrations[eventType] = eventConsumers;
    }
    eventConsumers.push (consumer);
  }

  deregister (eventType: string, consumerId: string) {
    const eventConsumers = this.registrations[eventType];
    const index = eventConsumers.findIndex (c => c.id === consumerId);
    eventConsumers.splice (index, 1);
  }

  async publish (event: WotrEvent) {
    const eventConsumers = this.registrations[event.type];
    if (eventConsumers) {
      for (const consumer of eventConsumers) {
        await consumer.callback (event);
      }
    }

  }

}
