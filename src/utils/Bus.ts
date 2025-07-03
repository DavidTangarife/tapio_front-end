import EventEmitter from "events";
const EventBus = new EventEmitter();

export default EventBus;

export class FlashManager extends EventEmitter {
  constructor() {
    super()
  }

  flash(message: string, type: string, duration: number) {
    this.emit('flash', message, type, duration)
    return
  }
}
