import { ChangeDetectorRef, Directive, EventEmitter, Host, HostBinding, HostListener, Input, OnChanges, OnDestroy, OnInit, Output } from "@angular/core";
import { MatRadioGroup } from "@angular/material/radio";
import { MatSelect } from "@angular/material/select";
import { ChangeListener, SimpleChanges, UntilDestroy } from "@bg-utils";
import { tap } from "rxjs/operators";

interface IBgFieldDirective<V, E> {
  setValue (value: V | null): void;
  field: keyof E;
} // ABgFieldDirective

@Directive ({
  selector: "[bgForm]"
})
export class BgFormDirective<E> implements OnChanges {

  constructor () { }

  @Input () bgForm: E | null = null;
  @Output () bgFormChange = new EventEmitter<E> ();

  private fields: IBgFieldDirective<any, E>[] = [];

  ngOnChanges (changes: SimpleChanges<BgFormDirective<E>>) {
    if (changes.bgForm) {
      this.setEntityValues (this.bgForm);
    } // if
  } // ngOnChanges

  private setEntityValues (entity: E | null) {
    if (entity) {
      this.fields.forEach (<V> (field: IBgFieldDirective<V, E>) => {
        const value = this.getFieldValue (entity, field);
        field.setValue (value);
      });
    } else {
      this.fields.forEach (field => field.setValue (null));
    } // if - else
  } // setEntityValues

  private setFieldValue<V> (entity: E | null, field: IBgFieldDirective<V, E>) {
    if (entity) {
      const value = this.getFieldValue (entity, field);
      field.setValue (value);
    } else {
      field.setValue (null);
    } // if - else
  } // setFieldValue

  private getFieldValue<V> (entity: E, field: IBgFieldDirective<V, E>): V {
    return entity[field.field] as any;
  } // getFieldValue

  onValueChange<V> (value: V, field: IBgFieldDirective<V, E>) {
    if (this.bgForm) {
      this.bgFormChange.next ({
        ...this.bgForm,
        [field.field]: value
      });
    } // if
  } // onEntityChange

  registerField<V> (field: IBgFieldDirective<V, E>) {
    this.fields.push (field);
    this.setFieldValue (this.bgForm, field);
  } // registerField

  unregisterField<V> (field: IBgFieldDirective<V, E>) {
    const index = this.fields.indexOf (field);
    if (index >= 0) { this.fields.splice (index, 1); }
  } // unregisterField

} // BgFormDirective

@Directive ({
  selector: "input[bgField]"
})
export class BgInputFieldDirective<V, E> implements OnInit, OnDestroy, IBgFieldDirective<V, E> {

  constructor (
    private form: BgFormDirective<E>,
    private cd: ChangeDetectorRef
  ) { }

  @Input ("bgField") field!: keyof E;

  @HostBinding ("value")
  viewValue: any = "";

  ngOnInit () {
    this.form.registerField (this);
  } // ngOnInit

  ngOnDestroy () {
    this.form.unregisterField (this);
  } // ngOnDestroy

  setValue (value: V | null) {
    if (value) {
      this.viewValue = value || "";
    } else {
      this.viewValue = "";
    } // if - else
    // N.B.: senza timeout non si vede la label se il campo è valorizzato all'inizio
    setTimeout (() => this.cd.markForCheck ());
  } // setEntityValue

  private onValueChange (value: V) {
    this.form.onValueChange (value, this);
  } // onValueChange

  @HostListener ("blur", ["$event"])
  onBlur (event: FocusEvent) {
    this.onValueChange ((event.target as any).value);
  } // onBlur
  
  @HostListener ("keyup.enter", ["$event"])
  onKeyupEnter (event: any) {
    this.onValueChange ((event.target as any).value);
  } // onBlur

} // BgInputFieldDirective

@Directive ({
  selector: "mat-select[bgField]"
})
@UntilDestroy
export class BgSelectFieldDirective<V, E> implements OnInit, OnDestroy, IBgFieldDirective<V, E> {

  constructor (
    private form: BgFormDirective<E>,
    @Host () private matSelect: MatSelect
  ) { }

  @Input ("bgField") field!: keyof E;

  @ChangeListener ()
  onSelectionChange () {
    return this.matSelect.selectionChange.pipe (
      tap (change => this.form.onValueChange (change.value, this))
    );
  } // onSelectionChange

  ngOnInit () {
    this.form.registerField (this);
  } // ngOnInit

  ngOnDestroy () {
    this.form.unregisterField (this);
  } // ngOnDestroy

  setValue (value: V | null) {
    this.matSelect.writeValue (value);
  } // setValue

} // BgSelectFieldDirective

@Directive ({
  selector: "mat-radio-group[bgField]"
})
@UntilDestroy
export class BgRadioFieldDirective<V, E> implements OnInit, OnDestroy, IBgFieldDirective<V, E> {

  constructor (
    private form: BgFormDirective<E>,
    @Host () private matRadioGroup: MatRadioGroup
  ) { }

  @Input ("bgField") field!: keyof E;

  @ChangeListener ()
  onSelectionChange () {
    return this.matRadioGroup.change.pipe (
      tap (change => this.form.onValueChange (change.value, this))
    );
  } // onSelectionChange

  ngOnInit () {
    this.form.registerField (this);
  } // ngOnInit

  ngOnDestroy () {
    this.form.unregisterField (this);
  } // ngOnDestroy

  setValue (value: V | null) {
    this.matRadioGroup.writeValue (value);
  } // setValue

} // BgRadioFieldDirective
