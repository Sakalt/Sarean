//

import {
  EventEmitter
} from "events";
import {
  Dictionary
} from "../dictionary";


export abstract class Loader extends EventEmitter {

  protected readonly path: string;
  private lastProgressDate: Date | null = null;

  public constructor(path: string) {
    super();
    this.path = path;
  }

  public on<E extends keyof LoaderEvent>(event: E, listener: (...args: LoaderEvent[E]) => void): this;
  public on(event: string | symbol, listener: (...args: any) => void): this {
    let result = super.on(event, listener);
    return result;
  }

  public emit<E extends keyof LoaderEvent>(event: E, ...args: LoaderEvent[E]): boolean;
  public emit(event: string | symbol, ...args: any): boolean {
    if (event === "progress") {
      let date = new Date();
      let lastDate = this.lastProgressDate;
      if (lastDate === null || date.getTime() - lastDate.getTime() >= 200) {
        let result = super.emit(event, ...args);
        this.lastProgressDate = date;
        return result;
      } else {
        return false;
      }
    } else {
      let result = super.emit(event, ...args);
      return result;
    }
  }

  public abstract start(): void;

}


export type LoaderEvent = {
  progress: [offset: number, size: number],
  end: [dictionary: Dictionary],
  error: [error: Error]
};