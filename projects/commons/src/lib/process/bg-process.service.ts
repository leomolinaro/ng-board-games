import { Injectable } from "@angular/core";

export interface IBgProcess<C> {
  readonly type: "process";
  start(context: C): IBgProcessStep<C>;
}

export interface IBgSubProcess<C> {
  readonly type: "sub-process";
  start(context: C): IBgProcessStep<C>;
  next(context: C): IBgProcessStep<C>;
  readonly parent: IBgSubProcess<C> | IBgProcess<C>;
}

export interface IBgProcessTask<C> {
  readonly type: "task";
  next(context: C): IBgProcessStep<C>;
  readonly parent: IBgProcess<C> | IBgSubProcess<C>;
}

export interface IBgProcessParallelSplit<C> {
  readonly type: "parallel-split";
  getSteps(): IBgProcessStep<C>[];
}

export interface IBgProcessParallelJoin {
  readonly type: "parallel-join";
}

export interface IBgProcessEndEvent {
  readonly type: "end-event";
}

export type IBgProcessStep<C> =
  | IBgSubProcess<C>
  | IBgProcessTask<C>
  | IBgProcessParallelSplit<C>
  | IBgProcessParallelJoin
  | IBgProcessEndEvent;

export const BG_PROCESS_END_EVENT: IBgProcessEndEvent = { type: "end-event" };
export const BG_PROCESS_PARALLEL_JOIN: IBgProcessParallelJoin = {
  type: "parallel-join"
};

@Injectable({
  providedIn: "root"
})
/** @deprecated */
export class BgProcessService {
  constructor() {}

  startProcess<C>(flow: IBgProcess<C>, context: C): IBgProcessTask<C>[] {
    const flowStep = flow.start(context);
    return this.getTasks(flowStep, flow, context);
  }

  resolveTask<C>(task: IBgProcessTask<C>, context: C): IBgProcessTask<C>[] {
    const nextStep = task.next(context);
    const parentStep = task.parent;
    const newTasks = this.getTasks(nextStep, parentStep, context);
    return newTasks;
  }

  private getTasks<C>(
    flowStep: IBgProcessStep<C>,
    parentStep: IBgSubProcess<C> | IBgProcess<C>,
    context: C
  ): IBgProcessTask<C>[] {
    const tasks: IBgProcessTask<C>[] = [];
    this.appendTasks(flowStep, parentStep, tasks, context);
    return tasks;
  }

  private appendTasks<C>(
    step: IBgProcessStep<C>,
    parentStep: IBgSubProcess<C> | IBgProcess<C>,
    appendTasks: IBgProcessTask<C>[],
    context: C
  ): void {
    switch (step.type) {
      case "parallel-split": {
        const parallelSteps = step.getSteps();
        parallelSteps.forEach(s => this.appendTasks(s, parentStep, appendTasks, context));
        break;
      }
      case "sub-process": {
        const startChildStep = step.start(context);
        this.appendTasks(startChildStep, step, appendTasks, context);
        break;
      }
      case "parallel-join":
        break;
      case "task":
        appendTasks.push(step);
        break;
      case "end-event": {
        switch (parentStep.type) {
          case "process":
            break;
          case "sub-process": {
            const nextFlowStep = parentStep.next(context);
            const grandParentStep = parentStep.parent;
            this.appendTasks(nextFlowStep, grandParentStep, appendTasks, context);
            break;
          }
        }
      }
    }
  }
}
