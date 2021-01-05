import { Injectable } from "@angular/core";

export interface IBgProcess<C> {
  type: "process";
  start (context: C): IBgProcessStep<C>;
} // IBgProcess

export interface IBgSubProcess<C> {
  type: "sub-process";
  start (context: C): IBgProcessStep<C>;
  next (context: C): IBgProcessStep<C>;
  parent: IBgSubProcess<C> | IBgProcess<C>;
} // IBgSubProcess

export interface IBgProcessTask<C> {
  type: "task";
  next (context: C): IBgProcessStep<C>;
  parent: IBgSubProcess<C>;
} // IBgProcessTask

export interface IBgProcessParallelSplit<C> {
  type: "parallel-split";
  getSteps (): IBgProcessStep<C>[];
} // IBgGatewayParallelSplit

export interface IBgProcessParallelJoin {
  type: "parallel-join";
} // IBgProcessParallelJoin

export interface IBgProcessEndEvent {
  type: "end-event";
} // IBgProcessEndEvent

export type IBgProcessStep<C> = IBgSubProcess<C> | IBgProcessTask<C> | IBgProcessParallelSplit<C>| IBgProcessParallelJoin | IBgProcessEndEvent;

export const BG_PROCESS_END_EVENT: IBgProcessEndEvent = { type: "end-event" };
export const BG_PROCESS_PARALLEL_JOIN: IBgProcessParallelJoin = { type: "parallel-join" };

@Injectable ({
  providedIn: "root"
})
export class BgProcessService {

  constructor () { }

  startProcess<C> (flow: IBgProcess<C>, context: C): IBgProcessTask<C>[] {
    const flowStep = flow.start (context);
    return this.getTasks (flowStep, flow, context);
  } // startProcess

  resolveTask<C> (task: IBgProcessTask<C>, context: C): IBgProcessTask<C>[] {
    const nextStep = task.next (context);
    const parentStep = task.parent;
    const newTasks = this.getTasks (nextStep, parentStep, context);
    return newTasks;
  } // resolveTask

  private getTasks<C> (
    flowStep: IBgProcessStep<C>,
    parentStep: IBgSubProcess<C> | IBgProcess<C>,
    context: C
  ): IBgProcessTask<C>[] {
    const tasks: IBgProcessTask<C>[] = [];
    this.appendTasks (flowStep, parentStep, tasks, context);
    return tasks;
  } // getTasks

  private appendTasks<C> (
    step: IBgProcessStep<C>,
    parentStep: IBgSubProcess<C> | IBgProcess<C>,
    appendTasks: IBgProcessTask<C>[],
    context: C
  ): void {
    switch (step.type) {
      case "parallel-split": {
        const parallelSteps = step.getSteps ();
        parallelSteps.forEach (s => this.appendTasks (s, parentStep, appendTasks, context));
        break;
      } // case
      case "sub-process": {
        const startChildStep = step.start (context);
        this.appendTasks (startChildStep, step, appendTasks, context);
        break;
      } // case
      case "parallel-join": break;
      case "task": appendTasks.push (step); break;
      case "end-event": {
        switch (parentStep.type) {
          case "process": break;
          case "sub-process": {
            const nextFlowStep = parentStep.next (context);
            const grandParentStep = parentStep.parent;
            this.appendTasks (nextFlowStep, grandParentStep, appendTasks, context);
            break;
          } // case
        } // switch
      } // case
    } // switch
  } // appendTasks

} // BgProcessService
