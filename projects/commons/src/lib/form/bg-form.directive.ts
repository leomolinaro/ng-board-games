import {
  ChangeDetectorRef,
  Directive,
  EventEmitter,
  Host,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output
} from "@angular/core";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatRadioGroup } from "@angular/material/radio";
import { MatSelect } from "@angular/material/select";
import { ChangeListener, SimpleChanges, UntilDestroy } from "@leobg/commons/utils";
import { tap } from "rxjs/operators";

interface BgFieldDirective<V, E> {
  setValue(value: V | null): void;
  field: keyof E | "";
  config: BgFieldConfig<V, E> | null;
} // ABgFieldDirective

export interface BgFieldConfig<V, E> {
  valueGetter?: (entity: E) => V;
  valueSetter?: (value: V, entity: E) => Partial<E>;
} // BgFieldConfig

@Directive ({ selector: "[bgForm]" })
export class BgFormDirective<E> implements OnChanges {
  constructor () {}

  @Input () bgForm: E | null = null;
  @Output () bgFormChange = new EventEmitter<E> ();

  private fields: BgFieldDirective<any, E>[] = [];

  ngOnChanges (changes: SimpleChanges<BgFormDirective<E>>) {
    if (changes.bgForm) {
      this.setEntityValues (this.bgForm);
    } // if
  } // ngOnChanges

  private setEntityValues (entity: E | null) {
    if (entity) {
      this.fields.forEach (<V>(field: BgFieldDirective<V, E>) => {
        const value = this.getFieldValue (entity, field);
        field.setValue (value);
      });
    } else {
      this.fields.forEach ((field) => field.setValue (null));
    } // if - else
  } // setEntityValues

  private setFieldValue<V> (entity: E | null, field: BgFieldDirective<V, E>) {
    if (entity) {
      const value = this.getFieldValue (entity, field);
      field.setValue (value);
    } else {
      field.setValue (null);
    } // if - else
  } // setFieldValue

  private getFieldValue<V> (entity: E, field: BgFieldDirective<V, E>): V | null {
    if (field.config?.valueGetter) {
      return field.config.valueGetter (entity);
    } else if (field.field) {
      return entity[field.field] as any as V;
    } // if - else
    return null;
  } // getFieldValue

  onValueChange<V> (value: V, field: BgFieldDirective<V, E>) {
    if (this.bgForm) {
      if (field.config?.valueSetter) {
        const patch = field.config.valueSetter (value, this.bgForm);
        this.bgFormChange.next ({
          ...this.bgForm,
          ...patch,
        });
      } else if (field.field) {
        this.bgFormChange.next ({
          ...this.bgForm,
          [field.field]: value,
        });
      } // if - else
    } // if
  } // onEntityChange

  registerField<V> (field: BgFieldDirective<V, E>) {
    this.fields.push (field);
    this.setFieldValue (this.bgForm, field);
  } // registerField

  unregisterField<V> (field: BgFieldDirective<V, E>) {
    const index = this.fields.indexOf (field);
    if (index >= 0) {
      this.fields.splice (index, 1);
    }
  } // unregisterField
} // BgFormDirective

@Directive ({ selector: "input[bgField]" })
export class BgInputFieldDirective<V, E>
implements OnInit, OnDestroy, BgFieldDirective<V, E>
{
  constructor (
    private form: BgFormDirective<E>,
    private cd: ChangeDetectorRef
  ) {}

  @Input ("bgField") field: keyof E | "" = "";
  @Input ("bgFieldConfig") config: BgFieldConfig<V, E> | null = null;

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
    this.onValueChange ((event.target).value);
  } // onBlur
} // BgInputFieldDirective

@Directive ({ selector: "mat-select[bgField]" })
@UntilDestroy
export class BgSelectFieldDirective<V, E>
implements OnInit, OnDestroy, BgFieldDirective<V, E>
{
  constructor (
    private form: BgFormDirective<E>,
    @Host () private matSelect: MatSelect
  ) {}

  @Input ("bgField") field: keyof E | "" = "";
  @Input ("bgFieldConfig") config: BgFieldConfig<V, E> | null = null;

  @ChangeListener ()
  private listenToSelectionChange () {
    return this.matSelect.selectionChange.pipe (
      tap ((change) => this.form.onValueChange (change.value, this))
    );
  } // onSelectionChange

  ngOnInit () {
    this.form.registerField (this);
    this.listenToSelectionChange ();
  } // ngOnInit

  ngOnDestroy () {
    this.form.unregisterField (this);
  } // ngOnDestroy

  setValue (value: V | null) {
    this.matSelect.writeValue (value);
  } // setValue
} // BgSelectFieldDirective

@Directive ({ selector: "mat-radio-group[bgField]" })
@UntilDestroy
export class BgRadioFieldDirective<V, E>
implements OnInit, OnDestroy, BgFieldDirective<V, E>
{
  constructor (
    private form: BgFormDirective<E>,
    @Host () private matRadioGroup: MatRadioGroup
  ) {}

  @Input ("bgField") field: keyof E | "" = "";
  @Input ("bgFieldConfig") config: BgFieldConfig<V, E> | null = null;

  @ChangeListener ()
  private listenToSelectionChange () {
    return this.matRadioGroup.change.pipe (
      tap ((change) => this.form.onValueChange (change.value, this))
    );
  } // onSelectionChange

  ngOnInit () {
    this.form.registerField (this);
    this.listenToSelectionChange ();
  } // ngOnInit

  ngOnDestroy () {
    this.form.unregisterField (this);
  } // ngOnDestroy

  setValue (value: V | null) {
    this.matRadioGroup.writeValue (value);
  } // setValue
} // BgRadioFieldDirective

@Directive ({ selector: "mat-checkbox[bgField]" })
@UntilDestroy
export class BgCheckboxFieldDirective<E>
implements OnInit, OnDestroy, BgFieldDirective<boolean, E>
{
  constructor (
    private form: BgFormDirective<E>,
    @Host () private matCheckbox: MatCheckbox
  ) {}

  @Input ("bgField") field: keyof E | "" = "";
  @Input ("bgFieldConfig") config: BgFieldConfig<boolean, E> | null = null;

  @ChangeListener ()
  private listenToSelectionChange () {
    return this.matCheckbox.change.pipe (
      tap ((change) => this.form.onValueChange (change.checked, this))
    );
  } // onSelectionChange

  ngOnInit () {
    this.form.registerField (this);
    this.listenToSelectionChange ();
  } // ngOnInit

  ngOnDestroy () {
    this.form.unregisterField (this);
  } // ngOnDestroy

  setValue (value: boolean | null) {
    this.matCheckbox.writeValue (value);
  } // setValue
} // BgCheckboxFieldDirective
