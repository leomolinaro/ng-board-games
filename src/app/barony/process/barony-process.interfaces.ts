import { BG_PROCESS_END_EVENT, IBgProcess, IBgProcessEndEvent, IBgProcessTask, IBgSubProcess } from "@bg-services";
import { BaronyGameStore } from "../logic";

export interface IBaronyProcess extends IBgProcess<BaronyGameStore> {
  start (game: BaronyGameStore): IBaronyProcessStep;
} // IBaronyProcess

export interface IBaronySubProcess extends IBgSubProcess<BaronyGameStore> {
  start (game: BaronyGameStore): IBaronyProcessStep;
  next (game: BaronyGameStore): IBaronyProcessStep;
  readonly parent: IBaronySubProcess | IBaronyProcess;
} // IBaronySubProcess

export interface IBaronyProcessTask<D = any, R = any> extends IBgProcessTask<BaronyGameStore> {
  next (game: BaronyGameStore): IBaronyProcessStep;
  readonly data: D;
  readonly parent: IBaronyProcess | IBaronySubProcess;
  result: R | null;
  readonly taskName: string;
} // IBaronyProcessTask

export interface IBaronyProcessEndEvent extends IBgProcessEndEvent {
} // IBaronyProcessEndEvent

export type IBaronyProcessStep = IBaronySubProcess | IBaronyProcessTask | IBaronyProcessEndEvent;

export const BARONY_PROCESS_END_EVENT: IBaronyProcessEndEvent = BG_PROCESS_END_EVENT;
