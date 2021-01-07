import { BaronyContext } from "./barony-context";
import { IBaronyProcessStep, IBaronyProcessTask, IBaronySubProcess } from "./barony-process.interfaces";

export type BaronyProcessTask = BaronySetupPlacement;

export interface IHasBaronySetupPlacement { afterPlacement (placement: BaronySetupPlacement, context: BaronyContext): IBaronyProcessStep; }

export class BaronySetupPlacement implements IBaronyProcessTask {

  constructor (
    private playerIndex: number,
    public readonly parent: IHasBaronySetupPlacement & IBaronySubProcess
  ) { }
  
  readonly type = "task";
  readonly taskName = "setupPlacement";
  next (context: BaronyContext): IBaronyProcessStep { return this.parent.afterPlacement (this, context); }
  
  resolve (action: any): void {
    throw new Error ("Method not implemented.");
  } // resolve

} // BaronySetupPlacement
