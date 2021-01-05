import { BG_PROCESS_END_EVENT, IBgProcess, IBgProcessEndEvent, IBgProcessTask, IBgSubProcess } from "@bg-services";
import { BaronyContext } from "./barony-context";

export interface IBaronyProcess extends IBgProcess<BaronyContext> {
  start (context: BaronyContext): IBaronyProcessStep;
} // IBaronyProcess

export interface IBaronySubProcess extends IBgSubProcess<BaronyContext> {
  start (context: BaronyContext): IBaronyProcessStep;
  next (context: BaronyContext): IBaronyProcessStep;
  parent: IBaronySubProcess | IBaronyProcess;
} // IBaronySubProcess

export interface IBaronyProcessTask<A = any> extends IBgProcessTask<BaronyContext> {
  next (context: BaronyContext): IBaronyProcessStep;
  parent: IBaronySubProcess;
  resolve (action: A): void;
} // IBaronyProcessTask

export interface IBaronyProcessEndEvent extends IBgProcessEndEvent {
} // IBaronyProcessEndEvent

export type IBaronyProcessStep = IBaronySubProcess | IBaronyProcessTask | IBaronyProcessEndEvent;

export const BARONY_PROCESS_END_EVENT: IBaronyProcessEndEvent = BG_PROCESS_END_EVENT;
