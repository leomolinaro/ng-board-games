import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";

export class NgLetContext {
  $implicit: any = null;
  ngLet: any = null;
} // NgLetContext

@Directive ({
  selector: "[ngLet]",
})
export class NgLetDirective implements OnInit {
  private _context = new NgLetContext ();

  @Input ()
  set ngLet (value: any) {
    this._context.$implicit = this._context.ngLet = value;
  } // ngLet

  constructor (
    private _vcr: ViewContainerRef,
    private _templateRef: TemplateRef<NgLetContext>
  ) { }

  ngOnInit () {
    this._vcr.createEmbeddedView (this._templateRef, this._context);
  } // ngOnInit

} // NgLetDirective

export function BooleanInput () {
  return (component: any, inputKey: string) => {
    Object.defineProperty (component, inputKey, {
      get: () => component["__" + inputKey],
      set: (value: any) => component["__" + inputKey] = value != null && `${value}` !== "false"
    });
  };
} // BooleanInput
