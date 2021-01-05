import { Injectable } from "@angular/core";
import { BgProcessService } from "@bg-services";
import { BaronyContext, BaronyPlay, IBaronyProcessTask } from "../process";

@Injectable ({
  providedIn: "root"
})
export class BaronyPlayService {

  constructor (
    private bgProcessService: BgProcessService
  ) { }

  startGame (context: BaronyContext): IBaronyProcessTask[] {
    const baronyPlay = new BaronyPlay ();
    return this.bgProcessService.startProcess (baronyPlay, context) as IBaronyProcessTask[];
  } // startProcess

  resolveAction<A> (action: A, task: IBaronyProcessTask<A>, context: BaronyContext): IBaronyProcessTask[] {
    task.resolve (action);
    return this.bgProcessService.resolveTask (task, context) as IBaronyProcessTask[];
  } // resolveRequest

} // BaronyPlayService
